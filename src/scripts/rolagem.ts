// Efeitos ligados à rolagem da página. Só age nos elementos marcados:
//
// [data-revelar]     aparece suavemente quando entra na tela (uma vez).
// [data-progresso]   recebe --p de 0 (entrando por baixo) a 1 (saindo por cima).
//                    O CSS usa --p para girar ou deslocar o elemento.
// [data-horizontal]  no computador, a seção fica presa e o [data-trilho] dentro
//                    dela anda para o lado conforme a rolagem.
//
// Com "reduzir movimento" ligado no aparelho, nada disso roda.

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const computador = window.matchMedia('(min-width: 60rem)');

const limitar = (valor: number) => Math.min(1, Math.max(0, valor));

function revelar() {
  const alvos = document.querySelectorAll<HTMLElement>('[data-revelar]');
  if (!('IntersectionObserver' in window)) {
    alvos.forEach((alvo) => alvo.classList.add('visivel'));
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );
  alvos.forEach((alvo) => observador.observe(alvo));
}

function rolagem() {
  const progressos = Array.from(document.querySelectorAll<HTMLElement>('[data-progresso]'));
  const horizontais = Array.from(document.querySelectorAll<HTMLElement>('[data-horizontal]'));
  if (!progressos.length && !horizontais.length) return;

  const visiveis = new Set<Element>();
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) visiveis.add(entrada.target);
        else visiveis.delete(entrada.target);
      }
      pedirQuadro();
    },
    { rootMargin: '25% 0px' },
  );
  progressos.forEach((elemento) => observador.observe(elemento));
  horizontais.forEach((elemento) => observador.observe(elemento));

  const deslocamentos = new Map<HTMLElement, number>();

  function medir() {
    for (const secao of horizontais) {
      const trilho = secao.querySelector<HTMLElement>('[data-trilho]');
      if (!trilho) continue;
      if (computador.matches) {
        secao.classList.add('horizontal-ativo');
        const janela = trilho.parentElement?.clientWidth ?? window.innerWidth;
        const deslocamento = Math.max(0, trilho.scrollWidth - janela);
        deslocamentos.set(secao, deslocamento);
        secao.style.height = `${window.innerHeight + deslocamento}px`;
      } else {
        secao.classList.remove('horizontal-ativo');
        secao.style.removeProperty('height');
        trilho.style.removeProperty('transform');
        deslocamentos.set(secao, 0);
      }
    }
    pedirQuadro();
  }

  function atualizar() {
    quadro = 0;
    const altura = window.innerHeight;
    for (const elemento of visiveis) {
      const caixa = elemento.getBoundingClientRect();
      const secao = elemento as HTMLElement;
      if (secao.hasAttribute('data-horizontal')) {
        const deslocamento = deslocamentos.get(secao) ?? 0;
        if (!deslocamento) continue;
        const p = limitar(-caixa.top / (caixa.height - altura));
        secao.style.setProperty('--p', p.toFixed(4));
        const trilho = secao.querySelector<HTMLElement>('[data-trilho]');
        if (trilho) trilho.style.transform = `translate3d(${(-p * deslocamento).toFixed(1)}px, 0, 0)`;
      } else {
        const p = limitar((altura - caixa.top) / (altura + caixa.height));
        secao.style.setProperty('--p', p.toFixed(4));
      }
    }
  }

  let quadro = 0;
  function pedirQuadro() {
    if (!quadro) quadro = requestAnimationFrame(atualizar);
  }

  window.addEventListener('scroll', pedirQuadro, { passive: true });
  window.addEventListener('resize', medir);
  window.addEventListener('load', medir);
  computador.addEventListener('change', medir);
  medir();
}

revelar();
if (!semMovimento) rolagem();

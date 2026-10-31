// Desenhos em canvas ligados ao tema do mar:
//
// [data-mar]    um mar feito de pontos, com ondas que andam devagar e respondem à rolagem.
// [data-globo]  um globo de pontos com a América do Sul em destaque e Praia Grande marcada.
//
// Só desenham enquanto estão na tela. Com "reduzir movimento", desenham um quadro parado.

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Desenho = {
  canvas: HTMLCanvasElement;
  desenhar: (tempo: number) => void;
  medir: () => void;
  visivel: boolean;
};

const desenhos: Desenho[] = [];

function corDe(elemento: HTMLElement, propriedade: string, padrao: string) {
  const valor = getComputedStyle(elemento).getPropertyValue(propriedade).trim();
  return valor || padrao;
}

function hexParaRgb(hex: string): [number, number, number] {
  const limpo = hex.replace('#', '');
  const cheio = limpo.length === 3 ? limpo.split('').map((c) => c + c).join('') : limpo;
  const n = parseInt(cheio, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function prepararCanvas(canvas: HTMLCanvasElement) {
  const contexto = canvas.getContext('2d');
  const escala = Math.min(window.devicePixelRatio || 1, 2);
  return { contexto, escala };
}

function progressoRolagem(elemento: HTMLElement) {
  const caixa = elemento.getBoundingClientRect();
  const altura = window.innerHeight;
  return Math.min(1, Math.max(0, (altura - caixa.top) / (altura + caixa.height)));
}

/* Mar de pontos ------------------------------------------------------------ */

function criarMar(canvas: HTMLCanvasElement): Desenho {
  const { contexto, escala } = prepararCanvas(canvas);
  let largura = 0;
  let altura = 0;
  let colunas = 0;
  const linhas = 26;
  const [r, g, b] = hexParaRgb(corDe(canvas, '--cor-pontos', '#244a6c'));

  function medir() {
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = Math.round(largura * escala);
    canvas.height = Math.round(altura * escala);
    colunas = largura < 700 ? 46 : 84;
  }

  function desenhar(tempo: number) {
    if (!contexto || !largura) return;
    const t = tempo / 1000;
    const rolagem = progressoRolagem(canvas) * 4;
    contexto.setTransform(escala, 0, 0, escala, 0, 0);
    contexto.clearRect(0, 0, largura, altura);

    const foco = altura * 1.1;
    const alturaCamera = 1.1;
    for (let j = 0; j < linhas; j++) {
      // j = 0 é a linha mais distante (no horizonte)
      const z = 1.2 + (linhas - 1 - j) * 0.55;
      const s = foco / z;
      const proximidade = j / (linhas - 1);
      for (let i = 0; i < colunas; i++) {
        const x = (i / (colunas - 1) - 0.5) * 2 * (largura / foco) * z * 0.6;
        const onda =
          0.22 * Math.sin(x * 1.6 + t * 0.9 + z * 0.55 + rolagem) +
          0.12 * Math.sin(x * 3.1 - t * 0.6 + z * 1.1) +
          0.08 * Math.cos(z * 2.2 + t * 0.7);
        const tx = largura / 2 + x * s;
        const ty = (alturaCamera - onda) * s;
        if (tx < -4 || tx > largura + 4 || ty < -4 || ty > altura + 4) continue;
        const tamanho = 0.7 + proximidade * 1.9 + onda * 1.2;
        const alfa = 0.12 + proximidade * 0.55 + onda * 0.4;
        contexto.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.05, Math.min(0.85, alfa))})`;
        contexto.fillRect(tx - tamanho / 2, ty - tamanho / 2, tamanho, tamanho);
      }
    }
  }

  return { canvas, desenhar, medir, visivel: false };
}

/* Globo de pontos ----------------------------------------------------------- */

// Contorno simplificado da América do Sul (latitude, longitude).
const americaDoSul: [number, number][] = [
  [12.4, -71.7], [10.6, -61.9], [8.5, -59.8], [4.5, -51.6], [-0.1, -49.9], [-2.5, -44.0],
  [-5.2, -35.3], [-8.0, -34.9], [-13.0, -38.5], [-23.0, -43.2], [-25.5, -48.4], [-33.7, -53.4],
  [-38.9, -62.0], [-41.1, -65.1], [-46.0, -67.5], [-52.4, -68.4], [-55.0, -66.5], [-54.9, -70.0],
  [-50.0, -75.3], [-41.5, -73.8], [-30.0, -71.4], [-18.3, -70.4], [-14.0, -76.3], [-5.0, -81.1],
  [-1.0, -80.4], [2.0, -78.7], [7.0, -77.8], [11.0, -74.2],
];

function dentro(lat: number, lon: number, poligono: [number, number][]) {
  let resultado = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [yi, xi] = poligono[i];
    const [yj, xj] = poligono[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) resultado = !resultado;
  }
  return resultado;
}

const PRAIA_GRANDE: [number, number] = [-24.0, -46.4];

function criarGlobo(canvas: HTMLCanvasElement): Desenho {
  const { contexto, escala } = prepararCanvas(canvas);
  let lado = 0;
  const [r, g, b] = hexParaRgb(corDe(canvas, '--cor-pontos', '#e9eef4'));
  const pontos: { lat: number; lon: number; terra: boolean }[] = [];
  const passo = 3.2;
  for (let lat = -88; lat <= 88; lat += passo) {
    const passoLon = passo / Math.max(0.15, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += passoLon) {
      pontos.push({ lat, lon, terra: dentro(lat, lon, americaDoSul) });
    }
  }
  const rad = Math.PI / 180;

  function medir() {
    lado = canvas.clientWidth;
    canvas.width = Math.round(lado * escala);
    canvas.height = Math.round(lado * escala);
  }

  function projetar(lat: number, lon: number, lat0: number, lon0: number) {
    const fi = lat * rad;
    const la = (lon - lon0) * rad;
    const fi0 = lat0 * rad;
    const x = Math.cos(fi) * Math.sin(la);
    const y = Math.cos(fi0) * Math.sin(fi) - Math.sin(fi0) * Math.cos(fi) * Math.cos(la);
    const z = Math.sin(fi0) * Math.sin(fi) + Math.cos(fi0) * Math.cos(fi) * Math.cos(la);
    return { x, y, z };
  }

  function desenhar(tempo: number) {
    if (!contexto || !lado) return;
    const t = tempo / 1000;
    const rolagem = progressoRolagem(canvas);
    const lon0 = -52 + Math.sin(t * 0.18) * 38 + (rolagem - 0.5) * 50;
    const lat0 = -14;
    const raio = lado * 0.46;
    const centro = lado / 2;
    contexto.setTransform(escala, 0, 0, escala, 0, 0);
    contexto.clearRect(0, 0, lado, lado);

    contexto.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.22)`;
    contexto.lineWidth = 1;
    contexto.beginPath();
    contexto.arc(centro, centro, raio, 0, Math.PI * 2);
    contexto.stroke();

    for (const ponto of pontos) {
      const p = projetar(ponto.lat, ponto.lon, lat0, lon0);
      if (p.z <= 0) continue;
      const px = centro + p.x * raio;
      const py = centro - p.y * raio;
      if (ponto.terra) {
        contexto.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.45 + p.z * 0.55})`;
        const tamanho = 1.4 + p.z * 1.4;
        contexto.fillRect(px - tamanho / 2, py - tamanho / 2, tamanho, tamanho);
      } else {
        contexto.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.06 + p.z * 0.16})`;
        const tamanho = 0.8 + p.z * 0.8;
        contexto.fillRect(px - tamanho / 2, py - tamanho / 2, tamanho, tamanho);
      }
    }

    const marco = projetar(PRAIA_GRANDE[0], PRAIA_GRANDE[1], lat0, lon0);
    if (marco.z > 0) {
      const mx = centro + marco.x * raio;
      const my = centro - marco.y * raio;
      const pulso = (t % 2.2) / 2.2;
      contexto.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.8 * (1 - pulso)})`;
      contexto.lineWidth = 1.5;
      contexto.beginPath();
      contexto.arc(mx, my, 4 + pulso * 16, 0, Math.PI * 2);
      contexto.stroke();
      contexto.fillStyle = `rgb(${r}, ${g}, ${b})`;
      contexto.beginPath();
      contexto.arc(mx, my, 4, 0, Math.PI * 2);
      contexto.fill();
    }
  }

  return { canvas, desenhar, medir, visivel: false };
}

/* Laço de animação ------------------------------------------------------------ */

document.querySelectorAll<HTMLCanvasElement>('canvas[data-mar]').forEach((c) => desenhos.push(criarMar(c)));
document.querySelectorAll<HTMLCanvasElement>('canvas[data-globo]').forEach((c) => desenhos.push(criarGlobo(c)));

if (desenhos.length) {
  const medirTudo = () => {
    desenhos.forEach((d) => d.medir());
    desenhos.forEach((d) => d.desenhar(performance.now()));
  };
  medirTudo();
  window.addEventListener('resize', medirTudo);

  if (semMovimento) {
    desenhos.forEach((d) => d.desenhar(8000));
  } else {
    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        const desenho = desenhos.find((d) => d.canvas === entrada.target);
        if (desenho) desenho.visivel = entrada.isIntersecting;
      }
    });
    desenhos.forEach((d) => observador.observe(d.canvas));

    const quadro = (tempo: number) => {
      for (const desenho of desenhos) if (desenho.visivel) desenho.desenhar(tempo);
      requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  }
}

// Dados de contato e do site. Troque aqui e o site inteiro se atualiza.
// TODO: preencher telefone, e-mail, Instagram e domínio reais antes de publicar.

export const contato = {
  // Só números, com 55 + DDD + número. Exemplo: 5513999998888
  whatsapp: '55DDDNUMERO',
  // Como o número aparece escrito no site. Exemplo: (13) 99999-8888
  telefoneExibicao: '(DDD) NÚMERO',
  email: 'contato@SEU-DOMINIO.com.br',
  instagram: 'https://www.instagram.com/SEU-USUARIO',
  instagramUsuario: '@SEU-USUARIO',
};

export const site = {
  nome: 'Orla Studio',
  // Endereço do site, sem barra no fim. Usado no sitemap e nos links de compartilhamento.
  // Enquanto o site estiver no GitHub Pages, fica assim. Com domínio próprio, troque por
  // 'https://www.seudominio.com.br' e deixe base: ''.
  dominio: 'https://opradopedro.github.io',
  base: '/orla-studio',
  cidade: 'Praia Grande',
  estado: 'SP',
};

// Mensagem que já vem escrita quando a pessoa abre o WhatsApp pelo site.
export const mensagemPadrao = 'Oi! Vim pelo site da Orla e queria conversar.';

// Monta um endereço interno do site respeitando a pasta do GitHub Pages.
// Exemplo: caminho('/sobre') vira '/orla-studio/sobre'.
export function caminho(endereco: string): string {
  return `${site.base}${endereco}`;
}

export function linkWhatsApp(mensagem: string = mensagemPadrao): string {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

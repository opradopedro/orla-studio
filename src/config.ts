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
  // Endereço final do site, sem barra no fim. Usado no sitemap e nos links de compartilhamento.
  dominio: 'https://www.SEU-DOMINIO.com.br',
  cidade: 'Praia Grande',
  estado: 'SP',
};

// Mensagem que já vem escrita quando a pessoa abre o WhatsApp pelo site.
export const mensagemPadrao = 'Oi! Vim pelo site da Orla e queria conversar.';

export function linkWhatsApp(mensagem: string = mensagemPadrao): string {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

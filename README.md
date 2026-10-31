# Orla Studio

Site da Orla Studio, feito com [Astro](https://astro.build).

**Site no ar:** https://opradopedro.github.io/orla-studio/

## Rodar no computador

```bash
npm install
npm run dev
```

O site abre em `http://localhost:4321/orla-studio/`.

## Trocar telefone, e-mail, Instagram e domínio

Tudo fica em `src/config.ts`. Quando tiver domínio próprio, troque `dominio` e deixe `base: ''`.

## Trocar textos

Cada página é um arquivo em `src/pages/`:

| Página | Arquivo |
|---|---|
| Início | `src/pages/index.astro` |
| Secretária IA | `src/pages/secretaria-ia.astro` |
| Reativação de clientes | `src/pages/reativacao-de-clientes.astro` |
| Sites e sistemas | `src/pages/sites-e-sistemas.astro` |
| Sobre | `src/pages/sobre.astro` |
| Contato | `src/pages/contato.astro` |

As conversas de WhatsApp, as perguntas frequentes e as listas ficam no topo de cada arquivo,
entre as linhas `---`. Procure por `TODO` para achar o que ainda falta preencher
(fotos, nomes, portfólio da Confeitaria Choco).

## Publicar

Cada mudança que entra na branch `main` é publicada sozinha no GitHub Pages
(arquivo `.github/workflows/deploy.yml`). Dá para acompanhar na aba **Actions** do repositório.

Na primeira vez, em **Settings > Pages**, o campo **Source** precisa estar em **GitHub Actions**.

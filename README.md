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

Tudo fica em `src/config.ts`.

## Publicar

Cada mudança que entra na branch `main` é publicada sozinha no GitHub Pages
(arquivo `.github/workflows/deploy.yml`). Dá para acompanhar na aba **Actions** do repositório.

Na primeira vez, em **Settings > Pages**, o campo **Source** precisa estar em **GitHub Actions**.

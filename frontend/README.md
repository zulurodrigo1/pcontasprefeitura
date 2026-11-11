# Front — Tabler + Vite

Estrutura inicial de front-end baseada no template Tabler da pasta `../base`, com Vite, TypeScript e npm.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Comandos

- `npm run dev` inicia o servidor local com recarga automática.
- `npm run build` verifica os tipos TypeScript e gera a versão de produção em `dist/`.
- `npm run preview` serve localmente a versão gerada; execute depois de `npm run build`.

## Organização

- `src/main.ts`: markup e comportamento inicial da aplicação.
- `src/app.css`: estilos específicos do projeto.
- `public/tabler/`: CSS, JavaScript e recursos estáticos copiados do template `../base`.
- `../base/`: páginas e arquivos de referência originais do Tabler.

As dependências de UI do Tabler já estão servidas localmente; o build inclui os arquivos de `public/` automaticamente.

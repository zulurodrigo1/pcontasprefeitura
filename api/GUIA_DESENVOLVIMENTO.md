# Guia de desenvolvimento

Referência resumida para iniciar e manter sistemas com a stack e as práticas adotadas pela equipe. Adapte as escolhas às necessidades do produto; não adicione tecnologia ou abstração sem um motivo concreto.

## Stack de referência

- **Backend:** PHP 8.3+ e Laravel 13.
- **Banco de dados:** PostgreSQL é a preferência podendo ser utilizado tambem mysql. SQLite pode ser usado nos testes quando compatível com o comportamento necessário.
- **Frontend:** escolha a opção mais adequada ao projeto:
  - Blade com Bootstrap 5 e Tabler.
  - Livewire com Tailwind CSS.
- **Infraestrutura:** produção utiliza Nginx Proxy Manager. Configure o Laravel para confiar nos proxies corretos (`TrustProxies`) e encaminhar os cabeçalhos necessários, respeitando a configuração do ambiente.
- **Dependências PHP:** Composer.
- **Dependências JavaScript:** npm, mantendo o arquivo de lock versionado.

## Pacotes de referência

Use apenas o que o sistema realmente precisar. Pacotes úteis como referência:

- `spatie/laravel-permission`: papéis e permissões.
- `spatie/laravel-medialibrary`: gerenciamento de arquivos e mídias.
- `league/flysystem-aws-s3-v3`: armazenamento compatível com S3, como MinIO.
- `laravel/socialite` e `socialiteproviders/govbr`: autenticação por provedores externos.
- `laravel/horizon`: monitoramento de filas.
- `opcodesio/log-viewer`: consulta de logs da aplicação em ambiente autorizado.
- `sentry/sentry-laravel`: monitoramento e registro de erros.
- `pestphp/pest` e `pestphp/pest-plugin-laravel`: testes automatizados.
- `laravel/dusk`: testes de integração de interface em navegador.
- `laravel/pint`: formatação de código PHP.
- `bootstrap` e `@tabler/core`, ou `tailwindcss` com Livewire: opções para a interface.
- `tinymce` ou `tiptap`: editores de texto rico; escolha um conforme as necessidades do produto.

Confirme compatibilidade e manutenção antes de adotar um pacote. Prefira recursos nativos do Laravel ou da stack existente quando forem suficientes.

## Práticas de desenvolvimento

- **KISS (Keep It Simple, Stupid):** prefira a solução mais simples que resolva o problema com clareza. Evite abstrações, dependências e configurações prematuras.
- Como Laravel integra naturalmente o backend com interfaces Blade e Livewire, priorize essa integração para reduzir complexidade e facilitar a manutenção. Crie endpoints de API apenas quando forem necessários para integrações ou outros consumidores independentes.
- Sempre que possível e adequado ao ambiente, ofereça autenticação integrada com LDAP e Google Workspace. Isso complementa, mas não substitui, o login local da aplicação.
- Siga as convenções do Laravel e mantenha responsabilidades claras entre rotas, controllers, validação, modelos e serviços.
- Organize rotas por contexto funcional e aplique autenticação e autorização no servidor; não confie apenas em controles da interface.
- Evolua o banco com migrations e mantenha seeders úteis para desenvolvimento e testes. Nunca use comandos destrutivos em bancos com dados importantes.
- Valide entradas e trate erros explicitamente. Não inclua credenciais ou dados sensíveis no código; use variáveis de ambiente e mantenha `.env` fora do Git.
- Escreva testes focados para regras e fluxos relevantes. Antes de concluir uma alteração, rode os testes relacionados e a compilação do frontend quando aplicável.
- Use os componentes e padrões visuais já adotados. Introduza uma nova biblioteca somente quando houver necessidade clara.

## Fluxo Git resumido

O histórico do projeto usa `dev` como branch de integração e branches de trabalho para alterações, incluindo `feature/...` e `fix/...`.

1. Atualize `dev` e crie uma branch específica para a tarefa.
2. Faça alterações pequenas e relacionadas; registre commits com mensagens claras.
3. Execute as verificações pertinentes e abra um merge request para `dev`.
4. Integre após revisão e validação, sem enviar alterações diretamente à branch de integração.

Este resumo não substitui o documento completo de Git da equipe: consulte-o para convenções detalhadas de branches, commits, revisão e publicação.

Não compartilhe nem versione arquivos de ambiente com credenciais ou dados sensíveis.

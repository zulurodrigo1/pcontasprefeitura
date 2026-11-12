# Ambiente local com Docker

Esta configuração sobe o frontend Vite, a API Laravel com PHP 8.4-FPM e Nginx, e PostgreSQL. O PHP 8.4 é necessário para as versões atualmente registradas em `composer.lock` e está dentro do requisito PHP 8.3+ do guia do cliente. Esta configuração é voltada ao desenvolvimento local; não use as credenciais padrão em produção.

## Requisitos

- Docker Desktop com Docker Compose v2.

## Iniciar

Na raiz do repositório:

```powershell
docker compose -f docker/compose.yaml up --build
```

Na primeira inicialização, o container da API instala as dependências do Composer e cria `api/.env` com uma chave de aplicação, se esses arquivos ainda não existirem. O frontend instala dependências com `npm ci`.

- Frontend: <http://localhost:5173>
- API Laravel: <http://localhost:8000>
- Health check Laravel: <http://localhost:8000/up>
- PostgreSQL acessível pelo host: `localhost:5433`

O banco fica em um volume nomeado e persiste após parar os containers.

## Preparar o banco e usuário de demonstração

Em outro terminal, na raiz do repositório:

```powershell
docker compose -f docker/compose.yaml exec app php artisan migrate
docker compose -f docker/compose.yaml exec app php artisan db:seed --class=UserSeeder
```

O usuário local de demonstração criado pelo seeder é `demo@prefeitura.gov.br` / `Demo@123`. Não utilize essas credenciais fora do ambiente local.

## Parar

```powershell
docker compose -f docker/compose.yaml down
```

Para apagar também os dados persistidos do banco e as dependências armazenadas nos volumes, use `docker compose -f docker/compose.yaml down --volumes`. Isso remove os dados locais desses volumes.

## Configuração

As portas e credenciais locais podem ser sobrescritas por variáveis de ambiente antes de iniciar o Compose:

- `API_PORT` (padrão `8000`)
- `FRONTEND_PORT` (padrão `5173`)
- `DB_FORWARD_PORT` (padrão `5433`)
- `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD`

O Laravel se conecta ao PostgreSQL pelo hostname interno `database`; não use `localhost` na configuração do banco dentro dos containers. Para produção, configure credenciais fortes e a rede do Nginx Proxy Manager, mantenha o banco privado e valide os proxies confiáveis e os cabeçalhos encaminhados pelo proxy.

## Estrutura

- `compose.yaml`: serviços, redes, portas e volumes.
- `php/Dockerfile`: PHP 8.4-FPM, extensões PostgreSQL e Composer.
- `php/entrypoint.sh`: prepara dependências e chave de aplicação para desenvolvimento.
- `nginx/default.conf`: encaminha requisições HTTP ao PHP-FPM.

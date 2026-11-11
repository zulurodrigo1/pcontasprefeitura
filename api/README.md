# Guia de Desenvolvimento — PHP e Laravel

> **Objetivo:** padronizar a organização dos arquivos, a implementação das funcionalidades e a separação de responsabilidades em projetos PHP com Laravel.
>
> **Arquitetura de referência:** `Route → Form Request → Controller → Service → Repository → Model → Database`.
>
> Este guia é uma convenção de projeto baseada em camadas. Nem todas as pastas ou classes são criadas obrigatoriamente em todo projeto. Adapte a estrutura à versão do Laravel e às necessidades da aplicação.

---

## 1. Princípios da arquitetura

A aplicação deve manter responsabilidades bem definidas:

- **Route:** declara os endpoints e associa cada rota a uma ação.
- **Request (Form Request):** valida e autoriza os dados de entrada.
- **Controller:** coordena a requisição HTTP, chama o Service e devolve a resposta.
- **Service:** concentra regras e processos de negócio.
- **Repository:** encapsula consultas e operações de persistência.
- **Model:** representa entidades e relacionamentos do Eloquent.
- **Resource:** padroniza a representação dos dados na resposta da API.
- **Migration / Seeder / Factory:** versiona a estrutura do banco e auxilia na carga e geração de dados.

### Regras gerais

1. Mantenha controllers pequenos; não concentre regras de negócio neles.
2. Não coloque consultas complexas ou regras de persistência diretamente no controller.
3. Evite regras de negócio em Models. Use-os principalmente para representar dados, relacionamentos, casts e comportamentos próprios da entidade.
4. Centralize regras de negócio no Service.
5. Centralize consultas e persistência no Repository quando o projeto adotar esse padrão.
6. Valide dados de entrada com Form Requests.
7. Retorne respostas consistentes, preferencialmente com API Resources.
8. Use transações quando uma operação envolver gravações relacionadas que devam ser confirmadas ou revertidas em conjunto.
9. Não duplique lógica: reutilize métodos e componentes quando houver responsabilidade comum.
10. Siga os padrões já adotados no projeto antes de introduzir uma nova convenção.

---

## 2. Estrutura de diretórios sugerida

Exemplo para uma API Laravel:

```text
projeto/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── UsuarioController.php
│   │   ├── Requests/
│   │   │   └── Usuario/
│   │   │       ├── StoreUsuarioRequest.php
│   │   │       └── UpdateUsuarioRequest.php
│   │   └── Resources/
│   │       └── UsuarioResource.php
│   │
│   ├── Models/
│   │   └── Usuario.php
│   │
│   ├── Services/
│   │   └── UsuarioService.php
│   │
│   ├── Repositories/
│   │   └── UsuarioRepository.php
│   │
│   └── Providers/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── routes/
│   ├── api.php
│   └── web.php
│
├── resources/
│   └── views/                 # Somente se houver telas Blade
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── .env.example
├── composer.json
└── README.md
```

### Organização por domínio

Quando o projeto crescer, pode-se agrupar Requests, Resources, Services e Repositories por domínio ou módulo. O importante é manter consistência: não misture diferentes critérios de organização sem necessidade.

Exemplo:

```text
app/
├── Http/
│   ├── Controllers/Api/UsuarioController.php
│   ├── Requests/Usuario/
│   └── Resources/UsuarioResource.php
├── Models/Usuario.php
├── Services/UsuarioService.php
└── Repositories/UsuarioRepository.php
```

> **Observação:** `Repositories` e `Services` não são diretórios obrigatórios do Laravel; são convenções arquiteturais adotadas pelo projeto. `resources/views` só é necessário quando o Laravel renderiza views, por exemplo com Blade. Em uma API consumida por Vue.js, as telas normalmente ficam no frontend.

---

## 3. Responsabilidade de cada camada

| Camada | Responsabilidade | Evitar |
|---|---|---|
| Route | Definir endpoint, verbo HTTP e middleware | Regras de negócio |
| Request | Validar e autorizar entrada | Consultas e processamento de negócio |
| Controller | Coordenar HTTP e resposta | SQL, regras complexas e lógica extensa |
| Service | Executar regras e processos de negócio | Conhecer detalhes da resposta HTTP |
| Repository | Consultar e persistir dados | Decidir regras de negócio |
| Model | Representar entidade, relações e casts | Tornar-se um service genérico |
| Resource | Transformar dados em JSON | Executar gravações ou regras de negócio |

### 3.1 Routes

As rotas devem ser objetivas e utilizar os verbos HTTP adequados:

- `GET`: consultar/listar.
- `GET /{id}`: consultar um registro.
- `POST`: criar.
- `PUT` ou `PATCH`: atualizar.
- `DELETE`: excluir.

Exemplo em `routes/api.php`:

```php
use App\Http\Controllers\Api\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::apiResource('usuarios', UsuarioController::class);
```

Proteja rotas conforme a necessidade, utilizando os middlewares de autenticação e autorização configurados no projeto.

### 3.2 Form Requests

Cada operação com regras próprias deve ter seu Request. Use nomes claros, como `StoreUsuarioRequest` e `UpdateUsuarioRequest`.

Exemplo de `StoreUsuarioRequest.php`:

```php
namespace App\Http\Requests\Usuario;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Substituir pela autorização adequada ao projeto.
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255', 'unique:usuarios,email'],
        ];
    }
}
```

- Não considere `authorize(): true` adequado para todo endpoint: implemente a autorização necessária.
- Para atualização, ajuste a regra `unique` para ignorar o próprio registro, usando o identificador validado e confiável.
- Regras condicionais ou validações que dependam do estado do negócio devem ser tratadas na camada apropriada, sem transformar o Request em Service.

### 3.3 Controller

O controller recebe o Request validado, chama o Service e retorna o status e o conteúdo HTTP.

Exemplo de `UsuarioController.php`:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usuario\StoreUsuarioRequest;
use App\Http\Requests\Usuario\UpdateUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    public function __construct(
        private UsuarioService $usuarioService
    ) {}

    public function index()
    {
        $usuarios = $this->usuarioService->listar();

        return UsuarioResource::collection($usuarios);
    }

    public function store(StoreUsuarioRequest $request): JsonResponse
    {
        $usuario = $this->usuarioService->criar($request->validated());

        return (new UsuarioResource($usuario))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Usuario $usuario): UsuarioResource
    {
        return new UsuarioResource($usuario);
    }

    public function update(
        UpdateUsuarioRequest $request,
        Usuario $usuario
    ): UsuarioResource {
        $usuarioAtualizado = $this->usuarioService->atualizar(
            $usuario,
            $request->validated()
        );

        return new UsuarioResource($usuarioAtualizado);
    }

    public function destroy(Usuario $usuario): JsonResponse
    {
        $this->usuarioService->excluir($usuario);

        return response()->json(null, 204);
    }
}
```

O exemplo utiliza route model binding para `show`, `update` e `destroy`. A política de autorização deve ser aplicada conforme o projeto, por exemplo com Policies ou `$this->authorize()`.

### 3.4 Service

O Service concentra a lógica de negócio e coordena as operações necessárias.

Exemplo de `UsuarioService.php`:

```php
namespace App\Services;

use App\Models\Usuario;
use App\Repositories\UsuarioRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UsuarioService
{
    public function __construct(
        private UsuarioRepository $usuarioRepository
    ) {}

    public function listar(): LengthAwarePaginator
    {
        return $this->usuarioRepository->listar();
    }

    public function criar(array $dados): Usuario
    {
        // Aplicar aqui regras de negócio necessárias.
        return $this->usuarioRepository->criar($dados);
    }

    public function atualizar(Usuario $usuario, array $dados): Usuario
    {
        // Aplicar aqui regras de negócio necessárias.
        return $this->usuarioRepository->atualizar($usuario, $dados);
    }

    public function excluir(Usuario $usuario): void
    {
        // Verificar regras de negócio antes de excluir.
        $this->usuarioRepository->excluir($usuario);
    }
}
```

Exemplos de responsabilidades do Service:

- Verificar se uma operação é permitida pelas regras do negócio.
- Coordenar operações em mais de um Repository.
- Aplicar cálculos e transformações de negócio.
- Abrir transações quando várias gravações precisarem ser atômicas.
- Disparar eventos ou integrar serviços externos quando apropriado.

Não crie métodos ou camadas sem necessidade real. O Service deve agregar comportamento, não apenas repetir chamadas sem acrescentar valor em aplicações muito simples.

### 3.5 Repository

O Repository encapsula o acesso aos dados e evita espalhar consultas pela aplicação.

Exemplo de `UsuarioRepository.php`:

```php
namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UsuarioRepository
{
    public function listar(): LengthAwarePaginator
    {
        return Usuario::query()
            ->orderBy('nome')
            ->paginate(15);
    }

    public function criar(array $dados): Usuario
    {
        return Usuario::create($dados);
    }

    public function atualizar(Usuario $usuario, array $dados): Usuario
    {
        $usuario->update($dados);

        return $usuario->refresh();
    }

    public function excluir(Usuario $usuario): void
    {
        $usuario->delete();
    }
}
```

- Utilize Eloquent ou Query Builder para consultas.
- Evite retornar estruturas diferentes para a mesma operação sem motivo.
- Não coloque regras de negócio no Repository.
- Evite abstrações genéricas que dificultem a leitura sem trazer benefício.
- Se optar por interfaces, mantenha contratos e implementações organizados e registre as dependências no container do Laravel.

### 3.6 Model

Exemplo de `Usuario.php`:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $fillable = [
        'nome',
        'email',
    ];
}
```

Defina corretamente `$fillable` ou `$guarded`, casts e relacionamentos. Não permita atribuição em massa de campos que não deveriam ser controlados pela entrada do usuário.

### 3.7 API Resource

Exemplo de `UsuarioResource.php`:

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
        ];
    }
}
```

Resources ajudam a controlar quais campos são expostos pela API e a manter o formato de resposta estável. Não exponha senhas, tokens, dados internos ou campos sensíveis.

---

## 4. Fluxo padrão para desenvolver uma funcionalidade

Ao implementar um novo recurso, siga esta sequência:

1. **Entender a regra de negócio:** identificar entradas, saídas, permissões, estados e exceções.
2. **Planejar o banco:** criar ou ajustar migrations e relacionamentos.
3. **Criar/ajustar o Model:** definir tabela, casts, atributos e relacionamentos.
4. **Criar o Repository:** implementar consultas e persistência necessárias.
5. **Criar o Service:** implementar e coordenar as regras de negócio.
6. **Criar os Form Requests:** definir validação e autorização da entrada.
7. **Criar o Resource:** padronizar os dados de saída, se a API utilizar Resources.
8. **Criar o Controller:** conectar Request, Service e resposta HTTP.
9. **Registrar as rotas:** definir endpoints e middlewares.
10. **Criar testes:** cobrir sucesso, validação, autorização e erros relevantes.
11. **Documentar e revisar:** atualizar documentação e verificar convenções do projeto.

### Fluxo de uma requisição

```text
Cliente (Vue.js, aplicativo ou outro consumidor)
                |
                v
          routes/api.php
                |
                v
       Middleware / Autorização
                |
                v
          Form Request
       (validação da entrada)
                |
                v
           Controller
                |
                v
             Service
        (regra de negócio)
                |
                v
           Repository
        (acesso aos dados)
                |
                v
          Model / Eloquent
                |
                v
             Banco
```

A resposta percorre o caminho de retorno: o Controller utiliza o Resource, quando aplicável, para devolver o JSON e o status HTTP adequado.

---

## 5. Transações e operações envolvendo várias tabelas

Quando uma funcionalidade grava dados em mais de uma tabela e todas as gravações precisam ter sucesso em conjunto, utilize uma transação.

Exemplo no Service:

```php
use Illuminate\Support\Facades\DB;

public function criarComDetalhes(array $dados): Usuario
{
    return DB::transaction(function () use ($dados) {
        $usuario = $this->usuarioRepository->criar(
            $dados['usuario']
        );

        // Criar registros relacionados pelos respectivos Repositories.
        // Se uma etapa lançar exceção, a transação será revertida.

        return $usuario;
    });
}
```

A transação deve envolver a unidade de trabalho completa. Evite iniciar transações em várias camadas sem uma estratégia clara.

---

## 6. Tratamento de erros e respostas HTTP

Use exceções apropriadas e o mecanismo de tratamento de exceções do Laravel. Não retorne `200 OK` para operações que falharam.

Referência geral:

| Situação | Status HTTP |
|---|---:|
| Consulta ou operação realizada | `200` |
| Registro criado | `201` |
| Operação concluída sem corpo de resposta | `204` |
| Dados inválidos | `422` |
| Não autenticado | `401` |
| Sem permissão | `403` |
| Registro inexistente | `404` |
| Conflito de estado ou duplicidade | `409`, quando aplicável |
| Erro inesperado | `500` |

Boas práticas:

- Não exponha stack traces, SQL, credenciais ou detalhes internos em produção.
- Registre informações úteis para diagnóstico sem incluir segredos ou dados sensíveis.
- Padronize o formato de erro da API.
- Utilize validação nativa do Laravel para erros de entrada.
- Não capture exceções apenas para escondê-las; trate-as quando houver uma ação adequada e preserve o contexto do erro.

---

## 7. Convenções de nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Classes | PascalCase | `UsuarioService` |
| Métodos | camelCase | `buscarPorId()` |
| Variáveis | camelCase | `$usuarioAtual` |
| Tabelas | snake_case, conforme padrão do projeto | `usuarios` |
| Colunas | snake_case | `data_criacao` |
| Migrations | padrão do Artisan | `create_usuarios_table` |
| Form Requests | ação + entidade + Request | `StoreUsuarioRequest` |
| Resources | entidade + Resource | `UsuarioResource` |
| Controllers | entidade + Controller | `UsuarioController` |

Prefira nomes que expressem a intenção. Mantenha o idioma escolhido pelo projeto de forma consistente, sem misturar português e inglês arbitrariamente.

---

## 8. Migrations, Seeders e Factories

- **Migration:** define e versiona alterações na estrutura do banco.
- **Seeder:** insere dados iniciais ou necessários ao ambiente.
- **Factory:** gera registros para testes e desenvolvimento.

Comandos úteis:

```bash
php artisan make:model Usuario -m
php artisan make:controller Api/UsuarioController --api
php artisan make:request Usuario/StoreUsuarioRequest
php artisan make:request Usuario/UpdateUsuarioRequest
php artisan make:resource UsuarioResource
php artisan make:migration create_usuarios_table
php artisan make:seeder UsuarioSeeder
php artisan migrate
php artisan db:seed
```

Crie Services e Repositories manualmente ou utilize os geradores disponíveis no projeto. Revise migrations antes de executá-las em ambientes compartilhados ou de produção.

---

## 9. Testes

Utilize testes Feature para validar o comportamento da API e testes Unit para regras isoladas quando fizer sentido.

Cobertura recomendada para um CRUD:

- Listagem e paginação.
- Consulta de registro existente e inexistente.
- Cadastro válido.
- Falhas de validação.
- Atualização válida e atualização de registro inexistente.
- Exclusão e regras que impeçam a exclusão.
- Autenticação e autorização.
- Efeitos colaterais e transações, quando relevantes.

Execute os testes com:

```bash
php artisan test
```

Use banco e dados de teste isolados. Não execute testes destrutivos contra dados reais.

---

## 10. Segurança e qualidade

- Nunca versione o arquivo `.env`; mantenha um `.env.example` sem segredos.
- Valide e autorize toda operação recebida pela API.
- Utilize Policies/Gates ou a estratégia de autorização adotada pelo projeto.
- Proteja atribuição em massa com `$fillable` ou `$guarded`.
- Utilize consultas parametrizadas e evite concatenar entrada do usuário em SQL.
- Controle acesso a arquivos, uploads e downloads.
- Não retorne dados sensíveis nos Resources.
- Utilize HTTPS nos ambientes publicados.
- Mantenha dependências atualizadas e revise alterações antes de atualizar versões.
- Utilize logs sem registrar senhas, tokens ou informações confidenciais.

---

## 11. Checklist antes de concluir uma funcionalidade

- [ ] A regra de negócio foi compreendida e implementada no Service?
- [ ] A entrada possui validação adequada?
- [ ] A autorização foi implementada?
- [ ] O Controller está enxuto?
- [ ] O acesso aos dados está no Repository, conforme o padrão do projeto?
- [ ] O Model possui relacionamentos e proteção de atributos adequados?
- [ ] A resposta da API está padronizada?
- [ ] As operações relacionadas usam transação quando necessário?
- [ ] Foram tratados registros inexistentes e erros esperados?
- [ ] Foram criados ou atualizados testes?
- [ ] As migrations e seeders foram revisados?
- [ ] Não foram adicionados segredos ou dados sensíveis ao repositório?

---

## 12. Decisões que devem ser padronizadas por projeto

Antes de iniciar o desenvolvimento, registre no README específico da aplicação:

- Versão do PHP e do Laravel.
- Banco de dados e convenções de nomes.
- Estratégia de autenticação e autorização.
- Formato padrão de respostas e erros da API.
- Política de paginação, filtros e ordenação.
- Organização por domínio ou por camada.
- Uso ou não de interfaces nos Repositories.
- Estratégia de testes e cobertura esperada.
- Ferramentas de formatação, análise estática e qualidade de código.

## 13. Integração com o frontend existente

Este projeto possui um frontend Vite + TypeScript em `frontend/` e uma interface de login de demonstração em `frontend/src/main.ts`. A API Laravel deve ser desenvolvida pensando no consumo direto por esse frontend e não apenas por clientes genéricos.

### 13.1 Contrato de autenticação

O login do frontend atualmente espera um fluxo simples de autenticação por e-mail e senha. O backend deve expor:

```http
POST /api/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "usuario@exemplo.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "message": "Login realizado com sucesso."
}
```

Em caso de falha, retorne status e payload padronizados:

```json
{
  "success": false,
  "message": "Credenciais inválidas.",
  "errors": {
    "email": ["As credenciais informadas não conferem."]
  }
}
```

- `POST /api/login` deve usar `422` para erro de validação, `401` para credenciais inválidas e `429` para excesso de tentativas.
- O frontend pode armazenar o token em `localStorage` ou `sessionStorage`; o importante é usar o mesmo contrato em toda a aplicação.
- Rotas protegidas devem exigir autenticação via middleware e cabeçalho `Authorization: Bearer <token>`.

### 13.2 CORS e ambiente

Como o frontend roda em `http://localhost:5173` em desenvolvimento, o backend Laravel deve permitir essa origem:

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization'],
'supports_credentials' => true,
```

Se o projeto usar Laravel Sanctum ou JWT, descreva isso no README do projeto e documente as variáveis de ambiente:

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### 13.3 Padrão de resposta da API

Para facilitar integração com o frontend, padronize o retorno no formato abaixo:

```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "Operação concluída com sucesso.",
  "meta": {
    "page": 1,
    "per_page": 15,
    "total": 42
  }
}
```

E para erros:

```json
{
  "success": false,
  "message": "Não foi possível realizar a operação.",
  "errors": {
    "campo": ["Mensagem de validação."]
  }
}
```

Evite responder apenas com arrays ou com chaves inconsistentes entre endpoints. O frontend precisa consumir respostas previsíveis para renderizar mensagens, loading e estado de erro.

### 13.4 Endpoints esperados pelo frontend

No mínimo, a API deve expor contratos claros para os módulos que o frontend utilizará:

- `POST /api/login` para autenticação.
- `POST /api/logout` para encerrar sessão.
- `GET /api/me` para retornar o usuário autenticado.
- `GET /api/usuarios` para consulta/listagem.
- `POST /api/usuarios` para criação.
- `GET /api/usuarios/{id}` para registro único.
- `PUT|PATCH /api/usuarios/{id}` para atualização.
- `DELETE /api/usuarios/{id}` para exclusão.

Para cada endpoint, documente: verbos HTTP, payload de entrada, payload de saída, permissões e status esperados.

### 13.5 Recomendação prática para o frontend atual

Hoje a aplicação front-end possui autenticação simulada (`demoCredentials`) e um dashboard estático. O passo ideal para o backend real é:

1. substituir a validação local no `submit` do login por `fetch(`${import.meta.env.VITE_API_URL}/api/login`, ...)`;
2. salvar o token retornado e enviar no cabeçalho `Authorization` nas requisições seguintes;
3. manter o mesmo form de login e os mesmos textos de feedback no UI;
4. não misturar lógica de autenticação com renderização de componentes;
5. centralizar as chamadas em um cliente HTTP (por exemplo, `src/api/client.ts`).

Exemplo de cliente do frontend:

```ts
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function login(email: string, password: string) {
  const response = await fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message ?? 'Erro ao autenticar.')
  }

  return payload
}
```

### 13.6 Checklist de integração

- [ ] O frontend e a API usam a mesma base URL e protocolo.
- [ ] O backend aceita CORS do frontend local.
- [ ] O login do frontend consome o endpoint real da API.
- [ ] A resposta de autenticação possui `success`, `data` e `message` consistentes.
- [ ] As rotas autenticadas exigem Bearer token.
- [ ] Os erros de validação e autorização seguem o padrão correto.
- [ ] As respostas de listagem usam paginação e meta quando necessário.

## 14. Regra principal

**Cada camada deve ter uma responsabilidade clara.**

O Controller não deve concentrar regras de negócio; o Service não deve montar respostas HTTP; o Repository não deve decidir regras de negócio; e o Model não deve substituir todas as outras camadas.

O objetivo dessa organização é facilitar manutenção, testes, reutilização, leitura do código e evolução do sistema, sem criar abstrações desnecessárias.

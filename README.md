# CAP Start

> Aplicação full stack desenvolvida para estudo de conceitos básicos com **SAP CAP**, **CDS**, **SQLite**, **TypeScript**, **UI5 / Fiori Elements**, **Jest** e **OPA5**.

## Principais funcionalidades

- cadastro e gerenciamento de tarefas
- fluxo de **draft** com criação, edição e ativação
- listagem pública de tarefas salvas
- edição permitida apenas para o usuário criador
- exclusão de tarefas permitida apenas para admin
- controle de acesso com usuários mockados
- transições de status por ações customizadas
- interface gerada com **Fiori Elements**
- validações no backend com **CAP service handlers**
- testes de backend com **Jest**
- testes de interface com **OPA5**

## Tecnologias

- Node.js
- SAP CAP
- CDS
- SQLite
- TypeScript
- SAP Fiori Elements
- SAPUI5
- Jest
- OPA5
- QUnit

## Funcionalidades de negócio

### Tasks

- criar rascunho de tarefa
- editar rascunho
- ativar rascunho
- listar tarefas ativas
- listar rascunhos do usuário autenticado
- editar tarefa salva a partir de rascunho
- excluir tarefa salva com perfil admin
- avançar status de **Aberta** para **Fazendo**
- avançar status de **Fazendo** para **Concluida**

### Controle de acesso

- usuário autenticado pode criar tarefas
- usuário autenticado pode editar apenas tarefas criadas por ele
- admin pode excluir tarefas
- ações de avanço de status podem ser executadas pelo criador da tarefa ou por admin
- leitura liberada para qualquer usuário nas tarefas ativas
- leitura da configuração de UI disponível para todos

## Modelagem da entidade principal

A entidade `Tasks` possui os seguintes campos principais:

- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `isArchived`
- campos de auditoria herdados de `managed`, como:
  - `createdBy`
  - `createdAt`
  - `modifiedBy`
  - `modifiedAt`

### Status disponíveis

- Aberta
- Fazendo
- Concluida

### Prioridades disponíveis

- Baixa
- Média
- Alta

## Serviços expostos

### TaskService

Base path:

```txt
/task

Principais operações:

GET /task/Tasks
POST /task/Tasks
PATCH /task/Tasks(ID=<ID>,IsActiveEntity=false)
POST /task/Tasks(ID=<ID>,IsActiveEntity=false)/draftActivate
POST /task/Tasks(ID=<ID>,IsActiveEntity=true)/draftEdit
DELETE /task/Tasks(ID=<ID>,IsActiveEntity=true)
POST /task/Tasks(ID=<ID>,IsActiveEntity=true)/TaskService.advanceToInProgress
POST /task/Tasks(ID=<ID>,IsActiveEntity=true)/TaskService.advanceToDone
GET /task/UIConfiguration
```

### AdminService

Base path:

```txt
/admin
```
Permite acesso administrativo às tarefas, protegido pela role:
```txt
CapStartAdmin
```

### Validações implementadas

No backend, foram aplicadas validações antes de criação e atualização de tarefas:

- título obrigatório
- descrição obrigatória

Além disso:

- ```status``` aceita apenas valores definidos no enum
- ```priority``` aceita apenas valores definidos no enum
  
### Testes implementados
#### Backend com Jest

Os testes cobrem cenários como:

- exibição de drafts do usuário autenticado
- listagem de tarefas salvas sem autenticação
- criação de draft com usuário logado
- criação de draft com título vazio
- edição de draft pelo usuário correto
- ativação de draft válido
- bloqueio de ativação de draft inválido
- edição de tarefa salva
- bloqueio de exclusão indevida
- exclusão de tarefa por admin
- avanço de status para Fazendo
- avanço de status para Concluida

#### Frontend com OPA5

A estrutura do projeto também inclui testes de interface com:

- OPA5
- QUnit
  
### Como executar
1. Clonar o repositório
```txt
git clone <url-do-repositorio>
cd <nome-do-projeto>
```
2. Instalar as dependências
```txt
npm install
```
3. Executar a aplicação
```txt
cds watch
```
Ou, para subir apenas o CAP:
```txt
npm run start
```

### Como executar os testes
#### Testes de backend
```txt
cds test
```
ou
```txt
npm run test:backend
```
#### Testes em modo watch
```txt
npm run test:watch
```
### Usuários mockados para testes
#### Usuário comum
```txt
usuário: Axel
senha: 123
```
Roles:
- authenticated-user
- User

#### Usuário admin
```txt
usuário: Admin
senha: admin123
```
Roles:
- authenticated-user
- CapStartAdmin

### Interface

A interface foi construída com Fiori Elements, utilizando anotações CDS para definir:

- títulos dos campos
- lista de colunas
- ações em linha
- ações na identificação
- header info
- facets
- field groups

Também existe uma entidade singleton chamada UIConfiguration, utilizada para informar à interface se o usuário atual possui perfil de admin.

## Estrutura do projeto
```txt
CAP-START/
├── app/
│   └── cap-start/
│       ├── webapp/
│       │   ├── i18n/
│       │   │   └── i18n.properties              # Textos da aplicação
│       │   ├── test/
│       │   │   ├── integration/
│       │   │   │   └── pages/
│       │   │   │       ├── JourneyRunner.js     # Runner dos testes OPA5
│       │   │   │       ├── TasksList.js         # Página de lista para testes
│       │   │   │       └── TasksObjectPage.js   # Página de objeto para testes
│       │   │   ├── FirstJourney.js              # Jornada de teste OPA5
│       │   │   ├── opaTests.qunit.html          # Runner HTML do OPA5
│       │   │   ├── opaTests.qunit.js            # Bootstrap dos testes OPA5
│       │   │   ├── testsuite.qunit.html         # Suite HTML de testes UI
│       │   │   └── testsuite.qunit.js           # Suite JS de testes UI
│       │   ├── Component.ts                     # Componente principal UI5
│       │   ├── index.html                       # Entrada da aplicação
│       │   ├── manifest.json                    # Configuração da app Fiori Elements
│       │   └── annotations.cds                  # Anotações de UI
│       ├── eslint.config.mjs                    # Configuração de lint do app
│       ├── package.json                         # Dependências do app
│       ├── README.md                            # README do app frontend
│       ├── tsconfig.json                        # Configuração TypeScript do app
│       └── ui5.yaml                             # Configuração UI5
│
├── db/
│   ├── data/
│   │   └── cap.start-Tasks.csv                  # Massa inicial de dados
│   └── schema.cds                               # Modelo de domínio
│
├── srv/
│   ├── admin-service.cds                        # Serviço administrativo
│   ├── task-service.cds                         # Serviço principal de tarefas
│   └── task-service.ts                          # Regras e validações do backend
│
├── test/
│   ├── setup.ts                                 # Setup dos testes
│   ├── tasks.test.ts                            # Testes de backend com Jest
│   └── test.http                                # Requisições para teste manual
│
├── package.json                                 # Manifesto principal do projeto
├── tsconfig.json                                # Configuração TypeScript raiz
├── package-lock.json                            # Lock de dependências
└── README.md                                    # Visão geral do projeto
```

## Conceitos praticados no projeto
- desenvolvimento full stack com backend e frontend no mesmo projeto
- modelagem com CDS
- geração de interface com Fiori Elements
- persistência local com SQLite
- uso de TypeScript no backend
- controle de autorização por roles
- uso de draft no OData
- ações customizadas em entidades
- validações no service layer
- testes automatizados de backend e frontend

## Observações
- o banco utilizado no projeto é o SQLite
- a autenticação foi configurada com usuários mockados no CAP
- a interface utiliza Fiori Elements com anotações CDS
- o projeto contém testes de API com Jest e testes de interface com OPA5
- o fluxo principal da aplicação gira em torno do ciclo de vida de tarefas com draft, ativação, edição e transição de status

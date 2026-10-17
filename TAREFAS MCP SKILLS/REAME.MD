=======================Criação da Estrutura =================================================================

@architect Atue como um Engenheiro DevOps especializado no Antigravity IDE. 
Nosso projeto atual é um "Gerenciador de Tarefas (To-Do List)". O sistema roda em Node.js (v18+) e possui um banco de dados local SQLite.

Por favor, execute as seguintes ações no meu workspace:

1. Crie a seguinte estrutura de diretórios na raiz do projeto:
/.antigravity
  /skills
  /mcp-servers
/src
  /middleware
  /utils
/tests

2. Dentro da pasta "/.antigravity", crie o arquivo "config.json" contendo o ecossistema base. O JSON deve possuir rigorosamente a estrutura abaixo:
- "version": "1.0"
- "name": "TaskMaster IA"
- "description": "Configuração de MCP e Skills para o Gerenciador de Tarefas"
- "securityPolicies": Crie as políticas de segurança ativando "readOnly" para databases e filesystem. Em "forbiddenPatterns", adicione "password", "secret" e "JWT_KEY". Habilite o "humanInTheLoop" (true) exigindo confirmação para "database_write" e "git_commit".

Gere a estrutura e o arquivo.


=========================Criação das MCP Server ==================================================================


@architect Continue a configuração do arquivo ".antigravity/config.json". 
Adicione a chave "mcpServers" no JSON com as seguintes integrações focadas no nosso aplicativo de Lista de Tarefas:

1. Servidor "database_tarefas":
- Comando: npx
- Argumentos: "-y", "@modelcontextprotocol/server-sqlite", "./database.sqlite"
- Descrição: "Acesso ao banco de dados de tarefas. Contém as tabelas de usuários e tasks."
- Configurações: enabled: true, timeout: 30000, retryAttempts: 3.

2. Servidor "codigo_fonte_tarefas":
- Comando: npx
- Argumentos: "-y", "@modelcontextprotocol/server-filesystem", "./src"
- Descrição: "Leitura do código fonte da regra de negócios e interface da To-Do List."
- Configurações: enabled: true, readOnly: true, allowedPaths: ["./src", "./tests"].

Reescreva o arquivo "config.json" incorporando este bloco.


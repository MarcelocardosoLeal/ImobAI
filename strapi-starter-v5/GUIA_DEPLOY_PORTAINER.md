# Guia de Deploy da Aplicação Strapi v5 no Portainer

Este guia detalha o processo de deploy da aplicação Strapi v5, que utiliza uma estrutura monorepo com Next.js, em um ambiente Portainer. 

## Arquivos Gerados

Para viabilizar o deploy, os seguintes arquivos foram analisados e criados:

1.  **`apps/strapi/Dockerfile`**: 
    *   **O que é**: Um arquivo de instruções para construir a imagem Docker da aplicação Strapi.
    *   **Análise**: O `Dockerfile` existente no repositório é um arquivo de múltiplos estágios otimizado para produção. Ele constrói a aplicação de forma eficiente, resultando em uma imagem Docker leve e segura. Nenhuma alteração foi necessária.

2.  **`docker-compose.yml` (na raiz)**:
    *   **O que é**: O arquivo principal que define como os serviços (a aplicação Strapi e o banco de dados) devem ser executados juntos.
    *   **Criação**: Um novo `docker-compose.yml` foi criado na raiz do projeto para orquestrar a aplicação e o banco de dados PostgreSQL em um ambiente de produção. Ele está configurado para:
        *   Construir a imagem do Strapi usando o `Dockerfile` localizado em `apps/strapi`.
        *   Conectar a aplicação a um serviço de banco de dados PostgreSQL (`db`).
        *   Persistir os dados do banco de dados e os uploads de mídia usando volumes Docker.
        *   Carregar as variáveis de ambiente de um arquivo `.env`.

3.  **`.env.example`**:
    *   **O que é**: Um arquivo de exemplo que lista todas as variáveis de ambiente necessárias para a aplicação.
    *   **Segurança**: Este arquivo **não contém segredos** e deve ser enviado ao seu repositório Git. Ele serve como um guia para você configurar as variáveis de ambiente manualmente no Portainer.

## Passos para o Deploy no Portainer

Siga estes passos para fazer o deploy da sua aplicação no Portainer.

### Passo 1: Preparar o Repositório Git

1.  **Fork o Repositório**: Se você ainda não o fez, crie um fork do repositório original para a sua conta do GitHub.

2.  **Clone o Fork Localmente**: Clone o seu fork para a sua máquina.

3.  **Adicione os Arquivos**: Adicione o `docker-compose.yml` e o `.env.example` que foram criados na raiz do projeto ao seu repositório local.

4.  **Commit e Push**:
    ```bash
    git add docker-compose.yml .env.example
    git commit -m "Adiciona configuração de deploy para Portainer"
    git push origin main
    ```

### Passo 2: Configurar o Stack no Portainer

1.  **Acesse o Portainer**: Faça login na sua instância do Portainer.

2.  **Vá para "Stacks"**: No menu à esquerda, clique em "Stacks".

3.  **Adicione um Novo Stack**: Clique no botão "+ Add stack".

4.  **Preencha os Detalhes do Stack**:
    *   **Name**: Dê um nome ao seu stack (ex: `imobai-strapi-v5`).
    *   **Build method**: Selecione **"Repository"**.
    *   **Repository URL**: Cole a URL **pública** do seu fork do GitHub (ex: `https://github.com/seu-usuario/strapi-starter-v5.git`).
    *   **Compose path**: Deixe o valor padrão `docker-compose.yml`.

### Passo 3: Adicionar Variáveis de Ambiente

**NÃO ENVIE SEU ARQUIVO `.env` PARA O GITHUB.**

Em vez disso, adicione as variáveis de ambiente manualmente na interface do Portainer:

1.  **Role para Baixo**: Na mesma página "Add stack", encontre a seção **"Environment variables"**.

2.  **Adicione as Variáveis**: Clique em "+ Add environment variable" para cada variável listada no seu arquivo `.env.example`. Copie o nome da variável e cole o valor correspondente. 

    **Gere seus próprios segredos para as seguintes variáveis:**
    *   `APP_KEYS`
    *   `ADMIN_JWT_SECRET`
    *   `JWT_SECRET`
    *   `API_TOKEN_SALT`

    Você pode usar um gerador de senhas online ou o comando `openssl rand -base64 32` no seu terminal para criar valores seguros.

### Passo 4: Fazer o Deploy

1.  **Clique em "Deploy the stack"**: Após preencher todos os campos e adicionar as variáveis de ambiente, clique no botão para iniciar o deploy.

2.  **Aguarde a Conclusão**: O Portainer irá clonar seu repositório, construir a imagem Docker (o que pode levar alguns minutos) e iniciar os contêineres. 

3.  **Acesse sua Aplicação**: Após a conclusão, sua aplicação Strapi estará disponível no endereço do seu servidor, na porta `1337` (ou na porta que você especificou).
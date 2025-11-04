# Lembrete para o Assistente sobre o Projeto `strapi-starter-v5`

Este arquivo serve como um resumo rápido para futuras interações sobre este projeto.

## Detalhes Chave

- **Origem do Projeto**: Este diretório é um clone do repositório `notum-cz/strapi-next-monorepo-starter`.

- **Versão do Strapi**: A versão do Strapi utilizada é a `^5.29.0`. A dependência `@strapi/strapi` pode ser encontrada no arquivo `apps/strapi/package.json`.

- **Estrutura do Projeto**:
  - É um **monorepo** gerenciado com **Turborepo**.
  - A aplicação backend **Strapi** está localizada em `apps/strapi`.
  - A aplicação frontend **Next.js** está em `apps/ui`.

- **Configuração de Deploy para Portainer**:
  - O arquivo `docker-compose.yml` localizado na **raiz do projeto** foi criado especificamente para o deploy em produção. Ele orquestra tanto o serviço do Strapi quanto o do banco de dados PostgreSQL.
  - O `Dockerfile` utilizado para construir a imagem do Strapi está em `apps/strapi/Dockerfile`. Ele já estava no projeto original e é otimizado para produção.
  - Um arquivo `.env.example` foi criado na raiz para servir de modelo para as variáveis de ambiente.
  - Um guia completo, `GUIA_DEPLOY_PORTAINER.md`, foi criado na raiz com o passo a passo para o deploy no Portainer.

## Objetivo Principal da Configuração

O projeto foi preparado para ser facilmente implantado como um "Stack" no Portainer, utilizando o método de repositório Git e apontando para o `docker-compose.yml` na raiz. As variáveis de ambiente devem ser configuradas manualmente no Portainer por segurança.
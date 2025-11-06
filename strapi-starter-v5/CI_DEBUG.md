# CI Debug — Build and Push Strapi v5

Este documento explica como nosso GitHub Actions publica a imagem do Strapi e como diagnosticar falhas rapidamente.

## Workflow

- Arquivo: `.github/workflows/docker-publish-strapi.yml`
- Disparo:
  - `workflow_dispatch` (manual na aba Actions)
  - `push` que toque em `strapi-starter-v5/**`, `packages/**`, `package.json`, `turbo.json`, `yarn.lock`
- Imagem publicada:
  - `docker.io/marcelolealhub/imobai-strapi-v5:5.30`
  - `docker.io/marcelolealhub/imobai-strapi-v5:latest`

## Segredos obrigatórios

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

> Obs.: Nunca comitar segredos no repositório. Configure-os em Settings > Secrets and variables > Actions.

## Contexto de build

- `context: strapi-starter-v5`
- `file: strapi-starter-v5/apps/strapi/Dockerfile`
- O Dockerfile foi escrito para monorepo, copiando arquivos via turbo prune e build.

## Passos de debug adicionados

1. `Debug paths and files`
   - Lista diretórios e valida se o Dockerfile existe no caminho correto.
2. `Validate Docker Hub secrets presence`
   - Checa a presença dos segredos (sem imprimir valores). Se faltar, o job falha explicitamente.

## Como reexecutar

- Abra a aba Actions > "Build and Push Strapi v5 image" > Run workflow.
- Ou faça um commit em `strapi-starter-v5/**` para disparar automaticamente.

## Erros comuns e correções

- `unauthorized: incorrect username or password`
  - Verifique `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` em Secrets.
- `lstat apps: no such file or directory`
  - Confirme que o contexto está em `strapi-starter-v5` e o arquivo em `strapi-starter-v5/apps/strapi/Dockerfile`.
- Falha ao compilar `sharp`
  - Nosso Dockerfile instala dependências (`vips-dev`, `build-base`, etc). Manter `node:22-alpine` e pacotes conforme definido.

## Pós-publicação

- Validar no Docker Hub as tags `5.30` e `latest`.
- Testar pull: `docker pull docker.io/marcelolealhub/imobai-strapi-v5:5.30`.

## Próximos passos do deploy

- Ajustar `strapi-v5.yml` com `IMPORT_SECRET` e `TRANSFER_TOKEN_SALT` reais (não comitar segredos).
- `docker stack deploy -c strapi-v5.yml imobai`.
# Deploy Checklist - ImobAI Strapi v5

Objetivo: colocar a aplicação online com segurança e previsibilidade.

1) Status do repositório
- main atualizada com a feature de import/export, auto-atribuição e restrição por agente.
- Tag v0.1.0 criada para baseline.

2) CI/CD (GitHub Actions)
- Workflow: .github/workflows/docker-publish-strapi.yml
- Disparo: push em strapi-starter-v5/**, packages/**, package.json, turbo.json, yarn.lock; ou workflow_dispatch manual.
- Segredos necessários no repositório:
  - DOCKERHUB_USERNAME
  - DOCKERHUB_TOKEN

3) Imagem Docker
- Publicada em docker.io/marcelolealhub/imobai-strapi-v5 (tags: 5.30 e latest).

4) Variáveis de ambiente (produção)
- Obrigatórias: APP_KEYS, ADMIN_JWT_SECRET, JWT_SECRET, API_TOKEN_SALT, TRANSFER_TOKEN_SALT.
- Banco: DATABASE_CLIENT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_SSL=false.
- Integração: IMPORT_SECRET (usado em X-Import-Secret).
- Flags operacionais (início seguro): AGENTS_RESTRICT_LEADS=false, AGENT_AUTO_ASSIGN=false.
- S3 (opcional): AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET, AWS_S3_ENDPOINT, AWS_S3_FORCE_PATH_STYLE.

5) Deploy (Swarm/Traefik)
- Rede overlay: network_public.
- Volume externo: strapi_imob_uploads.
- Compose: strapi-v5.yml (ajustar CHANGE_ME).
- Comando: docker stack deploy -c strapi-v5.yml imobai.

6) Pós-deploy
- Admin: /admin acessível.
- Criar Role “Agente” (escopo mínimo) e usuários corretores.
- Importar Config Sync nas Settings (garante permissões públicas de Imóvel).

7) Smoke tests
- Import: POST /api/import/imovels e /api/import/leads com X-Import-Secret.
- Export: GET /api/export/imovels (JSON e XML com ?format=xml).
- Público/Privado: Imóveis públicos; Leads/Agentes não públicos.

8) Ativações futuras
- AGENTS_RESTRICT_LEADS=true + admin_user_id em Agente para restrição por corretor.
- AGENT_AUTO_ASSIGN=true para auto-atribuição de leads.

Observação: exemplos de .env em strapi-starter-v5/.env.example e .env.portainer.example.
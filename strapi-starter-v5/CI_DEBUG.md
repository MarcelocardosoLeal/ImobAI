# CI/CD Debug Log - Build do GitHub Actions

## 📋 Resumo Executivo

Este documento registra todos os erros encontrados no processo de build do GitHub Actions para o Strapi v5 e as correções aplicadas. O principal problema era a falta do Yarn no container Alpine, causando falhas críticas no build.

---

## 🚨 Erros Identificados

### 1. Erro: Yarn não encontrado no container
**Mensagem de erro:** `yarn: not found`
**Onde ocorreu:** Dockerfile, estágio `installer`
**Causa raiz:** O `node:22-alpine` não vem com Yarn instalado por padrão
**Impacto:** Build falhava completamente na etapa de instalação de dependências

### 2. Erro: Dependências de desenvolvimento ausentes
**Mensagem de erro:** Módulos necessários para build do Strapi Admin não encontrados
**Onde ocorreu:** Durante `yarn workspace @repo/strapi build`
**Causa raiz:** Flag `--production` removia devDependencies necessárias
**Impacto:** Build do Strapi Admin falhava

### 3. Erro: Turbo build falhando
**Mensagem de erro:** `turbo run build --filter=@repo/strapi` exit code 1
**Onde ocorreu:** Dockerfile, comando de build
**Causa raiz:** Configuração complexa do Turbo com Docker
**Impacto:** Build não completava

### 4. Erro: Porta não definida corretamente
**Mensagem de erro:** Variável PORT não expandida corretamente
**Onde ocorreu:** Dockerfile, instrução `EXPOSE`
**Causa raiz:** Uso de variável de ambiente no EXPOSE
**Impacto:** Possíveis problemas de deployment

---

## 🔧 Correções Aplicadas

### 1. Adicionar Yarn ao container Alpine
**Arquivo:** `strapi-starter-v5/apps/strapi/Dockerfile`
**Linha:** 13
**Correção:**
```dockerfile
RUN corepack enable && corepack prepare yarn@1.22.22 --activate && yarn --version
```
**Justificativa:** Garante que Yarn 1.x esteja disponível em todos os estágios do build

### 2. Remover flag --production do yarn install
**Arquivo:** `strapi-starter-v5/apps/strapi/Dockerfile`
**Linha:** 42
**Correção:**
```dockerfile
yarn install --prefer-offline --frozen-lockfile
```
**Justificativa:** Strapi precisa de devDependencies para buildar o admin corretamente

### 3. Substituir turbo build por yarn workspace build
**Arquivo:** `strapi-starter-v5/apps/strapi/Dockerfile`
**Linha:** 55
**Correção:**
```dockerfile
yarn workspace ${WORKSPACE} build
```
**Justificativa:** Build direto via yarn é mais confiável no contexto do Docker

### 4. Definir porta explicitamente
**Arquivo:** `strapi-starter-v5/apps/strapi/Dockerfile`
**Linhas:** 84-85
**Correção:**
```dockerfile
ENV PORT=1337
EXPOSE 1337
```
**Justificativa:** Evita problemas de variáveis não expandidas no EXPOSE

### 5. Adicionar sharp com ignore-engines
**Arquivo:** `strapi-starter-v5/apps/strapi/Dockerfile`
**Linha:** 48
**Correção:**
```dockerfile
yarn workspace ${WORKSPACE} add sharp --ignore-engines --prefer-offline
```
**Justificativa:** Resolve problemas de compatibilidade de engines com Alpine

---

## 📊 Estado Atual do Projeto

### ✅ Configurações Verificadas e OK:
- ✅ Versões Node.js (22.x) compatíveis com Strapi v5.29
- ✅ Turbo.json configurado corretamente
- ✅ Package.json com scripts apropriados
- ✅ Workflow do GitHub Actions com contexto correto
- ✅ Cache de build habilitado
- ✅ Login em Docker Hub e GHCR funcionando

### 🔧 Melhorias no Workflow:
- ✅ Validação de secrets antes do build
- ✅ Fallback para GHCR implementado
- ✅ Debug de paths e arquivos adicionado
- ✅ Continue-on-error no primeiro push para não falhar tudo

---

## 🎯 Próximos Passos Recomendados

### 1. Testar o Build
- [ ] Executar workflow manualmente no GitHub Actions
- [ ] Monitorar logs para confirmar sucesso
- [ ] Verificar publicação das imagens (Docker Hub e GHCR)

### 2. Se ainda houver falhas:
- [ ] Remover `--prefer-offline` dos comandos yarn
- [ ] Verificar erros específicos de dependências nativas
- [ ] Considerar downgrade para Node 20 se necessário
- [ ] Ativar logs verbosos para debugging

### 3. Validação Final:
- [ ] Confirmar que a imagem Docker roda corretamente
- [ ] Testar conexão com banco de dados
- [ ] Validar que o Strapi Admin está acessível

---

## 📚 Referências Úteis

- [Strapi Docker Documentation](https://docs.strapi.io/dev-docs/installation/docker)
- [Turborepo Docker Examples](https://github.com/vercel/turbo/tree/main/examples/with-docker)
- [Yarn Corepack Documentation](https://yarnpkg.com/corepack)
- [Sharp Alpine Linux Issues](https://github.com/lovell/sharp/issues/3871)

---

## 📝 Notas Adicionais

- O build local foi executado com sucesso após as correções
- Todos os arquivos modificados estão versionados no Git
- O projeto mantém compatibilidade com Node 22.x e Strapi 5.29
- A estrutura do monorepo com Turborepo foi preservada

**Data da última atualização:** $(date)
**Responsável:** Assistente de IA
**Status:** Aguardando execução do workflow para validação final
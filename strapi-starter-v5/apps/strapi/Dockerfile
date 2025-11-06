# This is PRODUCTION Dockerfile for Strapi in Turborepo.
# It's assumed that this Dockerfile is run from the root of the monorepo.

# Created according to following examples:
# - https://docs.strapi.io/dev-docs/installation/docker#production-dockerfile
# - https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/api/Dockerfile
# - https://dev.to/moofoo/creating-a-development-dockerfile-and-docker-composeyml-for-yarn-122-monorepos-using-turborepo-896

# Customize APP (name of folder in /apps) and WORKSPACE (name from package.json) to match this app
ARG APP=strapi
ARG WORKSPACE=@repo/strapi

# -------------------------- stage builder (npm + debian slim) ---------------------------------
FROM node:20-slim AS builder

# Instalar toolchain necessária para módulos nativos (node-gyp) e git
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ git \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development
WORKDIR /app

# Copiamos todo o monorepo para simplificar a instalação via npm workspaces
COPY . .

# Instala todas as dependências do monorepo (inclui devDependencies)
# Usamos npm ao invés de yarn para máxima compatibilidade em produção
RUN npm install --no-audit --no-fund

# Build do Strapi via npm workspaces
RUN npm run build --workspace=${WORKSPACE}

# -------------------------- stage runner ---------------------------------
FROM node:20-slim AS runner
ARG APP
ARG WORKSPACE
ENV NODE_ENV=production

# Criar usuário não-root
RUN groupadd -g 1001 strapi && useradd -m -u 1001 -g strapi strapi

WORKDIR /app
COPY --from=builder /app .

ENV PATH /app/apps/${APP}/node_modules/.bin:$PATH

WORKDIR /app/apps/${APP}
ENV PORT=1337
EXPOSE 1337

# Iniciar Strapi
USER strapi
CMD ["npm", "run", "start"]

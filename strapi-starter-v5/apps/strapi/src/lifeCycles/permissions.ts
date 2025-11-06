import type { Core } from "@strapi/strapi"

type StrapiAny = any

const PUBLIC_ACTIONS_ALLOW = [
  "api::imovel.imovel.find",
  "api::imovel.imovel.findOne",
]

const PUBLIC_ACTIONS_DENY = [
  // Garantir que Lead não está exposto publicamente
  "api::lead.lead.find",
  "api::lead.lead.findOne",
  "api::lead.lead.create",
  "api::lead.lead.update",
  "api::lead.lead.delete",
]

const N8N_TOKEN_NAME = "n8n-agent"
const N8N_TOKEN_PERMISSIONS = [
  "api::lead.lead.find",
  "api::lead.lead.findOne",
  "api::lead.lead.create",
  "api::lead.lead.update",
  "api::imovel.imovel.find",
]

export async function registerPermissionsAndToken({
  strapi,
}: {
  strapi: Core.Strapi
}) {
  try {
    await ensurePublicRolePermissions(strapi)
  } catch (err) {
    console.warn("[setup] Falha ao garantir permissões do papel Public:", err)
  }

  try {
    await ensureN8nApiToken(strapi)
  } catch (err) {
    console.warn("[setup] Falha ao garantir API token n8n-agent:", err)
  }
}

async function ensurePublicRolePermissions(strapi: Core.Strapi) {
  // Encontrar role público
  const publicRole = await strapi.documents(
    "plugin::users-permissions.role"
  ).findFirst({
    filters: { type: { $eq: "public" } },
  })

  if (!publicRole) {
    console.warn(
      "[setup] Papel 'Public' não encontrado. Pulei configuração de permissões públicas."
    )
    return
  }

  const roleId = publicRole.documentId

  // Permitir ações definidas
  for (const action of PUBLIC_ACTIONS_ALLOW) {
    const existing = await strapi
      .documents("plugin::users-permissions.permission")
      .findFirst({
        filters: {
          action: { $eq: action },
          role: { documentId: { $eq: roleId } },
        },
      })

    if (!existing) {
      await strapi
        .documents("plugin::users-permissions.permission")
        .create({
          data: {
            action,
            role: { documentId: roleId },
          },
        })
      console.info(`[setup] Public: ação permitida '${action}' criada.`)
    }
  }

  // Revogar quaisquer permissões de Lead no público
  const leadPerms = await strapi
    .documents("plugin::users-permissions.permission")
    .findMany({
      filters: {
        role: { documentId: { $eq: roleId } },
        action: { $in: PUBLIC_ACTIONS_DENY },
      },
      pageSize: 100,
    })

  for (const perm of leadPerms) {
    await strapi
      .documents("plugin::users-permissions.permission")
      .delete({ documentId: perm.documentId })
    console.info(`[setup] Public: ação revogada '${perm.action}'.`)
  }
}

async function ensureN8nApiToken(strapi: Core.Strapi) {
  // Verificar se já existe um token com o nome desejado
  const existingToken = await strapi
    .documents("admin::api-token")
    .findFirst({
      filters: { name: { $eq: N8N_TOKEN_NAME } },
    })

  if (existingToken) {
    await ensureApiTokenPermissions(strapi, existingToken.documentId)
    console.info(
      `[setup] API token '${N8N_TOKEN_NAME}' já existe. Garantindo permissões.`
    )
    return
  }

  // Tentar criar via serviço interno do admin, se disponível
  const adminServices: StrapiAny = (strapi as StrapiAny).admin?.services
  const tokenService: StrapiAny =
    adminServices?.["api-token"] || adminServices?.apiToken

  if (tokenService?.create) {
    try {
      const created = await tokenService.create({
        name: N8N_TOKEN_NAME,
        description: "Token para integrações n8n com escopo mínimo",
        type: "full-access",
      })

      // Rebuscar o documento para obter o documentId
      const tokenDoc = await strapi
        .documents("admin::api-token")
        .findFirst({ filters: { name: { $eq: N8N_TOKEN_NAME } } })

      if (tokenDoc) {
        await ensureApiTokenPermissions(strapi, tokenDoc.documentId)
        console.info(
          `\n[setup] API token '${N8N_TOKEN_NAME}' criado. Copie este valor para seu n8n/ambiente (STRAPI_REST_CUSTOM_API_KEY):\n`,
          created?.accessKey || "<acesso não retornado>"
        )
      } else {
        console.warn(
          "[setup] Token criado via serviço, mas não consegui localizar o documento para vincular permissões."
        )
      }
      return
    } catch (err) {
      console.warn("[setup] Falha ao criar token via serviço:", err)
      try {
        const valid = (strapi as any)?.contentAPI?.permissions?.providers?.action?.keys?.() || []
        console.info("[setup] Actions de conteúdo válidas nesta instância:", valid)
      } catch {}
    }
  }

  // Se não for possível criar automaticamente, orientar criação manual
  console.info(
    `\n[setup] Criação automática do API token não suportada neste ambiente.\n` +
      `Por favor crie manualmente em Settings > API Tokens > Create new token:\n` +
      `Nome: ${N8N_TOKEN_NAME}\nTipo: full-access\n`
  )
}

async function ensureApiTokenPermissions(
  strapi: Core.Strapi,
  tokenDocumentId: string
) {
  for (const action of N8N_TOKEN_PERMISSIONS) {
    const existing = await strapi
      .documents("admin::api-token-permission")
      .findFirst({
        filters: {
          action: { $eq: action },
          token: { documentId: { $eq: tokenDocumentId } },
        },
      })

    if (!existing) {
      await strapi.documents("admin::api-token-permission").create({
        data: {
          action,
          token: { documentId: tokenDocumentId },
        },
      })
      console.info(`[setup] Token '${N8N_TOKEN_NAME}': ação '${action}' criada.`)
    }
  }
}
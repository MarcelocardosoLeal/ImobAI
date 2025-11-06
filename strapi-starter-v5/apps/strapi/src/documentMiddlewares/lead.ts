const leadTypes = ["api::lead.lead"]
const leadActions = ["findMany", "findOne", "update", "delete"]

function isAgentsRestrictionEnabled() {
  return String(process.env.AGENTS_RESTRICT_LEADS || "false").toLowerCase() === "true"
}

function isAgentRole(user: any) {
  const roles = Array.isArray(user?.roles) ? user.roles : []
  return roles.some((r: any) => {
    const name = String(r?.name || r?.code || "").toLowerCase()
    return name.includes("agent") || name.includes("agente")
  })
}

export const registerLeadRestrictionMiddleware = ({ strapi }) => {
  strapi.documents.use(async (context, next) => {
    try {
      if (
        leadTypes.includes(context.uid) &&
        leadActions.includes(context.action) &&
        isAgentsRestrictionEnabled()
      ) {
        const user = (context as any)?.state?.user
        if (!user) {
          return next()
        }

        // Apply only for admin users with Agent role
        if (!isAgentRole(user)) {
          return next()
        }

        // Find mapped agent for the current admin user
        const agent = await strapi
          .documents("api::agente.agente")
          .findFirst({ filters: { admin_user_id: user.id } })

        if (!agent?.documentId) {
          // no mapping: allow default behavior
          return next()
        }

        // Restrict queries to leads assigned to this agent
        const assignedFilter = { assigned_agent: agent.documentId }

        if (context.action === "findMany") {
          context.params.filters = {
            ...(context.params.filters || {}),
            ...assignedFilter,
          }
        } else if (
          context.action === "findOne" ||
          context.action === "update" ||
          context.action === "delete"
        ) {
          context.params.filters = {
            ...(context.params.filters || {}),
            ...assignedFilter,
          }
        }
      }
    } catch (e) {
      strapi.log.warn(
        `[lead-middleware] Failed to apply agent restriction: ${e?.message}`
      )
    }

    return next()
  })
}
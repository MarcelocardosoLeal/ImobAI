export default {
  async beforeCreate(event) {
    try {
      const enable = String(process.env.AGENT_AUTO_ASSIGN || "false").toLowerCase() === "true"
      const data = event?.params?.data || {}
      if (!enable) return
      if (data.assigned_agent) return // já está atribuído

      // Buscar um agente ativo preferindo o menos recente em last_assigned_at
      const candidates = await strapi.documents("api::agente.agente").findMany({
        filters: { ativo: true },
        sort: [{ last_assigned_at: "asc" }],
        pageSize: 1,
      })
      const agent = Array.isArray(candidates) ? candidates[0] : undefined
      if (!agent?.documentId) return

      // Atribui agente ao lead em criação
      event.params.data.assigned_agent = agent.documentId

      // Atualiza métricas do agente
      await strapi.documents("api::agente.agente").update({
        documentId: agent.documentId,
        data: {
          last_assigned_at: new Date().toISOString(),
          contador_associado: (agent.contador_associado || 0) + 1,
        },
      })
    } catch (e) {
      strapi.log.warn(`[lead] auto-assign skipped: ${e?.message}`)
    }
  },
}
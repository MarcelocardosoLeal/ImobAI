import type { UID } from "@strapi/strapi"

type ImportItem = {
  data: Record<string, any>
}

function assertSecret(ctx: any) {
  const required = process.env.IMPORT_SECRET
  if (!required) {
    // If no secret configured, allow in development only
    const isDev = process.env.NODE_ENV !== "production"
    if (!isDev) {
      ctx.throw(403, "IMPORT_SECRET is not configured")
    }
    return
  }
  const provided = ctx.request.headers["x-import-secret"] || ctx.query?.secret
  if (provided !== required) {
    ctx.throw(403, "Invalid import secret")
  }
}

async function upsertMany(
  uid: UID.ContentType,
  items: ImportItem[],
  options?: { status?: "draft" | "published"; dedupeField?: string }
) {
  const status = options?.status ?? "published"
  const dedupeField = options?.dedupeField ?? "externalSourceId"

  const results: any[] = []
  for (const item of items) {
    const data = item?.data ?? {}

    // Try to dedupe by externalSourceId (or provided field)
    const dedupeValue = data?.[dedupeField]
    let existing: any | null = null
    if (dedupeValue) {
      existing = await strapi.documents(uid).findFirst({
        filters: { [dedupeField]: dedupeValue },
      })
    }

    if (existing?.documentId) {
      const updated = await strapi.documents(uid).update({
        documentId: existing.documentId,
        data,
        status,
      })
      results.push({ action: "updated", documentId: updated.documentId })
    } else {
      const created = await strapi.documents(uid).create({
        data,
        status,
      })
      results.push({ action: "created", documentId: created.documentId })
    }
  }

  return { count: results.length, results }
}

export default {
  async importImovels(ctx: any) {
    assertSecret(ctx)

    const body = ctx.request.body
    const items: ImportItem[] = Array.isArray(body) ? body : [body]

    const res = await upsertMany("api::imovel.imovel", items, {
      status: ctx.query?.status === "draft" ? "draft" : "published",
      dedupeField: (ctx.query?.dedupeField as string) || "externalSourceId",
    })

    ctx.send({ ok: true, ...res })
  },

  async importLeads(ctx: any) {
    assertSecret(ctx)

    const body = ctx.request.body
    const items: ImportItem[] = Array.isArray(body) ? body : [body]

    const res = await upsertMany("api::lead.lead", items, {
      status: ctx.query?.status === "draft" ? "draft" : "published",
      dedupeField: (ctx.query?.dedupeField as string) || "externalSourceId",
    })

    ctx.send({ ok: true, ...res })
  },

  async exportImovels(ctx: any) {
    assertSecret(ctx)

    const page = Number(ctx.query?.page ?? 1)
    const pageSize = Math.min(Number(ctx.query?.pageSize ?? 50), 250)
    const status = ctx.query?.status === "draft" ? "draft" : "published"

    const filters = ctx.query?.filters ? JSON.parse(String(ctx.query.filters)) : {}

    const result = await strapi.documents("api::imovel.imovel").findMany({
      page,
      pageSize,
      status,
      filters,
    })

    const format = String(ctx.query?.format || "json").toLowerCase()
    if (format === "xml") {
      ctx.set("Content-Type", "application/xml")
      // Minimal XML conversion (flat fields only)
      const xmlItems = (result?.results ?? []).map((item: any) => {
        const fields = Object.entries(item).filter(([k]) => k !== "documentId")
        const inner = fields
          .map(([k, v]) => `<${k}>${String(typeof v === "object" ? JSON.stringify(v) : v ?? "")}</${k}>`)
          .join("")
        return `<imovel documentId="${item.documentId}">${inner}</imovel>`
      })
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<imovels>${xmlItems.join("")}</imovels>`
      ctx.body = xml
      return
    }

    ctx.send({ ok: true, ...result })
  },
}
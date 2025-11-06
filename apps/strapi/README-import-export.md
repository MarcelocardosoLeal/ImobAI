# Importação/Exportação (sem n8n) – Endpoints customizados

Fornecemos endpoints prontos para importar e exportar dados diretamente em produção, sem necessidade do n8n. Eles estão protegidos por um segredo no cabeçalho e podem ser usados tanto em dev quanto em produção.

## Segurança

Defina `IMPORT_SECRET` nas variáveis de ambiente e envie-o no cabeçalho `X-Import-Secret` em cada requisição. Em produção, o segredo é obrigatório.

## Endpoints

- `POST /api/import/imovels` – importa imóveis (JSON)
- `POST /api/import/leads` – importa leads (JSON)
- `GET /api/export/imovels` – exporta imóveis (JSON por padrão; XML simples com `?format=xml`)

## Formato de import (JSON)

Envie um objeto ou array de objetos no corpo, em que cada item segue o formato:

```json
{
  "data": {
    "externalSourceId": "crm-123", // recomendado para deduplicação
    // demais campos que existem no Content Type Imovel ou Lead
  }
}
```

### Observações importantes

- Apenas campos existentes no Content Type devem ser enviados dentro de `data`.
- A deduplicação é feita por `externalSourceId` (padrão) ou por outro campo passado via query (`?dedupeField=meu_campo`).
- Status padrão de criação/atualização é `published`; pode alterar para `draft` com `?status=draft`.

## Exemplos curl (substitua URL e segredo)

### Importar imóveis

```bash
curl -X POST "http://localhost:1337/api/import/imovels?status=published" \
  -H "Content-Type: application/json" \
  -H "X-Import-Secret: <SEU_SEGREDO>" \
  -d '{
    "data": {
      "externalSourceId": "crm-123",
      "titulo": "Apartamento com vista",
      "preco": 750000
    }
  }'
```

### Importar leads

```bash
curl -X POST "http://localhost:1337/api/import/leads?status=draft" \
  -H "Content-Type: application/json" \
  -H "X-Import-Secret: <SEU_SEGREDO>" \
  -d '{
    "data": {
      "externalSourceId": "lead-abc",
      "nome": "João",
      "telefone": "+55 11 99999-0000"
    }
  }'
```

### Exportar imóveis (JSON)

```bash
curl -X GET "http://localhost:1337/api/export/imovels?page=1&pageSize=50&status=published" \
  -H "X-Import-Secret: <SEU_SEGREDO>"
```

### Exportar imóveis (XML simples)

```bash
curl -X GET "http://localhost:1337/api/export/imovels?format=xml" \
  -H "X-Import-Secret: <SEU_SEGREDO>"
```

## Fotos/Imagens

- Este pacote não baixa fotos automaticamente. Em produção, recomendamos importar imagens primeiro (upload) e então referenciá-las nos registros, ou usar um ETL (n8n) para fazer o download e upload automatizado.
- Caso queira adicionar upload programático aqui, podemos incluir uma função que baixa via `fetch` e usa o plugin upload para criar o arquivo. Solicite se desejar que eu adicione.

## Variáveis de ambiente

- `IMPORT_SECRET`: segredo obrigatório em produção para os endpoints de import/export.

## Boas práticas

- Use `externalSourceId` para garantir idempotência (não criar duplicatas).
- Restrinja IPs que podem chamar esses endpoints na camada de proxy/ingress.
- Não exponha esses endpoints no frontend público; mantenha-os para integrações seguras (CRM, ETL, etc.).
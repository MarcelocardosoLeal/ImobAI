# Documentação Técnica - Estrutura API Strapi Imóveis

## Endpoint Principal
**URL:** `https://bloco.advancedbot.com.br/imoveis`
**Método:** GET
**Retorno:** Array de objetos (imóveis)

## Estrutura dos Dados dos Imóveis

### Campos Principais Identificados

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | Number | Identificador único do imóvel | `1` |
| `title` | String | Título/nome do imóvel | `"Apartamento à Venda 1 Quarto Vazado 59 m²"` |
| `description` | String | Descrição detalhada do imóvel | `"Apartamento à Venda: 1 Quarto Vazado - 59 m²..."` |
| `price` | Number | Preço do imóvel em reais | `350000` |
| `tipo_contrato` | String | Tipo de contrato | `"venda"` |
| `tipo_imovel` | String | Tipo do imóvel | `"apartamento"` |
| `active` | Boolean | Status ativo/inativo | `true` |
| `bairro` | String | Bairro do imóvel | `"Cruzeiro Novo"` |
| `cidade` | String | Cidade do imóvel | `"Brasília"` |
| `estado` | String | Estado do imóvel | `"Distrito Federal"` |
| `tipologia` | String | Tipologia completa | `"Apartamento à Venda 1 Quarto Vazado 59 m2 Primeiro Andar"` |
| `images` | Array | Array de objetos de imagem | `[{url: "/uploads/...", ...}]` |

### Campos de Data/Timestamp

| Campo | Tipo | Descrição | Formato |
|-------|------|-----------|---------|
| `published_at` | String | Data de publicação | `"2025-07-27T22:33:02.649Z"` |
| `created_at` | String | Data de criação | `"2025-07-27T22:29:12.850Z"` |
| `updated_at` | String | Data de última atualização | `"2025-09-19T00:38:52.828Z"` |

### Estrutura das Imagens

As imagens são retornadas como um array de objetos. Cada imagem contém:

```json
{
  "url": "/uploads/Whats_App_Image_2025_07_22_at_4_55_02_PM_3_3bb8f708a1.jpeg"
}
```

**URLs Completas das Imagens:**
- Base URL: `https://bloco.advancedbot.com.br`
- URL Completa: `https://bloco.advancedbot.com.br/uploads/[nome_arquivo]`

### Exemplo de Imagens Encontradas
```
- /uploads/Whats_App_Image_2025_07_22_at_4_55_02_PM_3_3bb8f708a1.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_02_PM_1_a6e5cc1075.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_02_PM_3_Copia_42f9f5b3c5.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_00_PM_1_f9fa0f2b91.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_01_PM_2_b56900fb36.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_00_PM_b54214b3e2.jpeg
- /uploads/Whats_App_Image_2025_07_22_at_4_55_01_PM_e4f842948b.jpeg
```

## Informações Técnicas

### Quantidade de Dados
- **Total de imóveis atualmente:** 4
- **Estrutura de resposta:** Array direto (não encapsulado em objeto)

### Formato de Resposta
```json
[
  {
    "id": 1,
    "title": "Apartamento à Venda 1 Quarto Vazado 59 m²",
    "published_at": "2025-07-27T22:33:02.649Z",
    "created_at": "2025-07-27T22:29:12.850Z",
    "updated_at": "2025-09-19T00:38:52.828Z",
    "description": "Apartamento à Venda: 1 Quarto Vazado...",
    "price": 350000,
    "tipo_contrato": "venda",
    "tipo_imovel": "apartamento",
    "active": true,
    "bairro": "Cruzeiro Novo",
    "cidade": "Brasília",
    "estado": "Distrito Federal",
    "tipologia": "Apartamento à Venda 1 Quarto Vazado 59 m2 Primeiro Andar",
    "images": [
      {
        "url": "/uploads/Whats_App_Image_2025_07_22_at_4_55_02_PM_3_3bb8f708a1.jpeg"
      }
    ]
  }
]
```

## Possíveis Pontos de Atenção para Análise dos Fluxos

### 1. **Estrutura de Imagens**
- As imagens são referenciadas apenas por URL relativa
- Necessário concatenar com base URL para acesso completo
- Nomes de arquivo seguem padrão específico (WhatsApp exports)

### 2. **Campos de Data**
- Três timestamps diferentes: criação, publicação e atualização
- Formato ISO 8601 com timezone UTC

### 3. **Campos de Localização**
- Separados em: bairro, cidade, estado
- Não há campo de endereço completo unificado
- Não há coordenadas geográficas (lat/lng)

### 4. **Campos de Preço**
- Apenas valor numérico, sem formatação
- Não há campo de moeda (assumido BRL)

### 5. **Status do Imóvel**
- Campo `active` para controle de visibilidade
- Campo `tipo_contrato` para venda/aluguel

## Recomendações para Análise dos Fluxos

1. **Verificar se os fluxos estão tratando corretamente:**
   - URLs das imagens (concatenação com base URL)
   - Formatação de preços
   - Validação de campos obrigatórios

2. **Pontos críticos a verificar:**
   - Tratamento de imóveis inativos (`active: false`)
   - Processamento correto das datas
   - Validação de dados de localização

3. **Possíveis melhorias:**
   - Adicionar coordenadas geográficas
   - Padronizar formato de endereço
   - Incluir mais metadados das imagens
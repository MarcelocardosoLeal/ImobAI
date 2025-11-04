# Mapeamento de Campos - Strapi API
*Baseado nas Collections reais criadas no Strapi*

## 🏠 **COLLECTION: `Imóveis` (11 campos)**

### ✅ **Campos Criados na Collection:**
```
1. title               - Texto        - Título do imóvel
2. description         - Rich text    - Descrição detalhada  
3. images              - Mídia        - Imagens do imóvel
4. price               - Number       - Preço
5. tipo_contrato       - Enumeração   - Tipo de contrato
6. tipo_imovel         - Enumeração   - Tipo do imóvel
7. active              - Boolean      - Status ativo/inativo
8. bairro              - Texto        - Bairro
9. cidade              - Texto        - Cidade
10. estado             - Texto        - Estado
11. tipologia          - Texto        - Tipologia completa
```

### 📅 **Campos Automáticos do Strapi:**
```
id                  - Number  - Identificador único (auto)
published_at        - String  - Data publicação (auto)
created_at          - String  - Data criação (auto)
updated_at          - String  - Data atualização (auto)
```

---

## 👥 **COLLECTION: `Leads` (8 campos)**

### ✅ **Campos Criados na Collection:**
```
1. name                    - Texto        - Nome do cliente ⚠️ (VAZIO)
2. phone                   - Texto        - Telefone ✅ (FUNCIONANDO)
3. cliente_intencao        - Texto        - Intenção do cliente ⚠️ (NULL)
4. imovel_pretendido       - Texto        - Imóvel pretendido ⚠️ (NULL)
5. email                   - Email        - Email do cliente ⚠️ (NULL)
6. nivel_interesse         - Enumeração   - Nível de interesse ⚠️ (NULL)
7. retornar_em            - Data         - Data para retorno ⚠️ (NULL)
8. localizacao_preferida  - Texto        - Localização preferida ⚠️ (NULL)
```

### 📅 **Campos Automáticos do Strapi:**
```
id                  - Number  - Identificador único (auto)
published_at        - String  - Data publicação (auto)
created_at          - String  - Data criação (auto)
updated_at          - String  - Data atualização (auto)
```

### 🚨 **STATUS ATUAL DOS DADOS:**
- ✅ **phone** - Capturando corretamente
- ❌ **name** - String vazia
- ❌ **email** - NULL
- ❌ **cliente_intencao** - NULL
- ❌ **imovel_pretendido** - NULL
- ❌ **nivel_interesse** - NULL (Enumeração)
- ❌ **retornar_em** - NULL (Data)
- ❌ **localizacao_preferida** - NULL

---

## 🔍 **CHECKLIST PARA ANÁLISE DOS FLUXOS**

### **🏠 Fluxos de Imóveis - Verificar se utilizam (GET apenas):**
- [ ] `title` - Título do imóvel (Texto)
- [ ] `description` - Descrição completa (Rich text)
- [ ] `price` - Preço (Number)
- [ ] `tipo_contrato` - Venda ou aluguel (Enumeração)
- [ ] `tipo_imovel` - Tipo do imóvel (Enumeração)
- [ ] `active` - Status ativo (Boolean)
- [ ] `bairro` - Bairro (Texto)
- [ ] `cidade` - Cidade (Texto)
- [ ] `estado` - Estado (Texto)
- [ ] `tipologia` - Tipologia completa (Texto)
- [ ] `images` - Imagens (Mídia)

### **👥 Fluxos de Leads - Verificar se capturam (POST/PUT):**
- [ ] `name` - Nome do cliente (Texto) ⚠️ **VAZIO**
- [ ] `phone` - Telefone (Texto) ✅ **FUNCIONANDO**
- [ ] `cliente_intencao` - Intenção (Texto) ⚠️ **NULL**
- [ ] `imovel_pretendido` - Imóvel pretendido (Texto) ⚠️ **NULL**
- [ ] `email` - Email (Email) ⚠️ **NULL**
- [ ] `nivel_interesse` - Nível interesse (Enumeração) ⚠️ **NULL**
- [ ] `retornar_em` - Data retorno (Data) ⚠️ **NULL**
- [ ] `localizacao_preferida` - Localização (Texto) ⚠️ **NULL**

---

## 🚨 **PROBLEMAS IDENTIFICADOS PARA INVESTIGAR**

### **🏠 Imóveis Collection (11 campos criados)**
✅ **Aparentemente funcionando bem** - dados completos nos registros existentes
- Chatbot deve fazer apenas **GET** para consultar e apresentar imóveis
- Administrador cria imóveis diretamente no Strapi

### **👥 Leads Collection (8 campos criados)**
❌ **PROBLEMA CRÍTICO - 7 de 8 campos não funcionam:**
- ✅ `phone` (Texto) - ÚNICO campo funcionando
- ❌ `name` (Texto) - String vazia
- ❌ `email` (Email) - NULL
- ❌ `cliente_intencao` (Texto) - NULL
- ❌ `imovel_pretendido` (Texto) - NULL
- ❌ `nivel_interesse` (Enumeração) - NULL
- ❌ `retornar_em` (Data) - NULL
- ❌ `localizacao_preferida` (Texto) - NULL

## 🚨 **DESCOBERTA IMPORTANTE - ESTRUTURA JSON STRAPI**

### **📋 Estrutura Correta para POST Requests**
Baseado na documentação oficial do Strapi 5, descobri informações cruciais:

#### **✅ Formato JSON Correto:**
```json
{
  "data": {
    "name": "João Silva",
    "phone": "+5511999999999",
    "email": "joao@email.com",
    "cliente_intencao": "comprar",
    "imovel_pretendido": "apartamento",
    "nivel_interesse": "alto",
    "retornar_em": "2024-01-15",
    "localizacao_preferida": "Centro"
  }
}
```

#### **🔑 Pontos Críticos:**
1. **WRAPPER "data"**: Todos os campos devem estar dentro de um objeto "data"
2. **Strapi 5**: Resposta "achatada" - atributos diretamente acessíveis em `data.campo`
3. **Content-Type**: Deve ser `application/json`
4. **Método**: POST para `/api/leads`

#### **❌ Possível Problema no n8n:**
- **Hipótese**: n8n pode estar enviando campos diretamente sem o wrapper "data"
- **Formato Incorreto**:
```json
{
  "name": "João Silva",
  "phone": "+5511999999999"
  // SEM o wrapper "data"
}
```

#### **🔍 O que Verificar nos Flows:**
1. **Body Structure**: Se está usando wrapper "data"
2. **Headers**: Se Content-Type está correto
3. **Endpoint**: Se está usando `/api/leads` corretamente
4. **Method**: Se está usando POST

---

## 📋 **ROTEIRO PARA ANÁLISE DOS FLUXOS**

### **1. Fluxos de Captura de Imóveis**
```
Verificar se o fluxo está:
✓ Capturando todos os 14 campos mapeados
✓ Formatando dados corretamente (price como number)
✓ Processando imagens (URLs completas)
✓ Definindo status active corretamente
✓ Preenchendo localização completa
```

### **2. Fluxos de Captura de Leads**
```
Verificar se o fluxo está:
❌ Capturando apenas phone (PROBLEMA IDENTIFICADO)
❌ Perdendo name, email e todos campos de qualificação
❌ Não integrando com formulários web
❌ Não capturando dados do WhatsApp adequadamente
```

### **3. Prioridades de Investigação**
```
🔥 URGENTE: Por que leads só capturam telefone?
🔥 URGENTE: Onde estão os dados de qualificação?
⚠️  IMPORTANTE: Validar se imóveis capturam todos os campos
⚠️  IMPORTANTE: Verificar processamento de imagens
```

---

## 💡 **DICAS PARA ANÁLISE**

### **Ao analisar cada fluxo, perguntar:**
1. **Quais campos este fluxo deveria capturar?** (usar lista acima)
2. **Quais campos estão realmente sendo capturados?**
3. **Há transformação/formatação dos dados?**
4. **Há validação dos campos obrigatórios?**
5. **Há tratamento de erro para dados faltantes?**

### **Sinais de problema nos fluxos:**
- Campos sempre NULL ou vazios
- Dados não formatados (ex: preço como string)
- URLs de imagem incompletas
- Falta de validação de campos obrigatórios
- Ausência de tratamento de erro
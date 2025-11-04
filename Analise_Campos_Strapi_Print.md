# 📋 ANÁLISE COMPLETA DOS CAMPOS DO STRAPI
*Baseado no print da interface administrativa*

## 🎯 **RESUMO EXECUTIVO**

### **STATUS GERAL:**
- ✅ **2 campos funcionando:** Phone, Retornar_em
- ❌ **6 campos com problemas:** Name, Cliente_intencao, Imovel_pretendido, Email, Nivel_interesse, Localizacao_preferida

---

## 📊 **ANÁLISE DETALHADA POR CAMPO**

### **1. NAME (Nome)**
- **Tipo:** `String/Text`
- **Status:** ❌ Campo vazio (deveria estar preenchido)
- **Configuração:** Campo de texto livre
- **Validação:** Obrigatório para identificação do lead
- **Problema:** Não está sendo capturado pelos workflows

### **2. PHONE (Telefone)**
- **Tipo:** `String/Text` (numérico)
- **Status:** ✅ Funcionando (`5586981612934`)
- **Configuração:** Aceita formato numérico longo (13 dígitos)
- **Validação:** Campo principal funcionando corretamente
- **Formato:** Código país + DDD + número (55 86 981612934)

### **3. CLIENTE_INTENCAO (Intenção do Cliente)**
- **Tipo:** `Enumeration/Select`
- **Status:** ❌ Campo vazio (dropdown não selecionado)
- **Configuração:** Campo de seleção com opções predefinidas
- **Opções esperadas:** "comprar", "alugar", "trocar", "indeciso"
- **Problema:** Workflow não está enviando valor selecionado

### **4. IMOVEL_PRETENDIDO (Imóvel Pretendido)**
- **Tipo:** `Enumeration/Select`
- **Status:** ❌ Campo vazio (dropdown não selecionado)
- **Configuração:** Campo de seleção com opções predefinidas
- **Opções esperadas:** "casa", "apartamento", "específico"
- **Problema:** Workflow não está enviando valor selecionado

### **5. EMAIL**
- **Tipo:** `Email` (com validação automática)
- **Status:** ❌ Campo vazio (placeholder "@" visível)
- **Configuração:** Campo específico para email
- **Validação:** Formato de email obrigatório quando preenchido
- **Observação:** Campo opcional, mas deveria capturar quando fornecido

### **6. NIVEL_INTERESSE (Nível de Interesse)**
- **Tipo:** `Enumeration/Select`
- **Status:** ❌ "Escolha aqui" (valor padrão não selecionado)
- **Configuração:** Dropdown ativo com opções predefinidas
- **Opções esperadas:** "alto", "médio", "baixo"
- **Problema:** Workflow não está enviando valor calculado

### **7. RETORNAR_EM (Data de Retorno)**
- **Tipo:** `Date`
- **Status:** ✅ Funcionando (`October 16, 2025`)
- **Configuração:** Campo de data com seletor de calendário
- **Formato:** Data completa em inglês (Month DD, YYYY)
- **Validação:** Aceita datas futuras corretamente

### **8. LOCALIZACAO_PREFERIDA (Localização Preferida)**
- **Tipo:** `String/Text`
- **Status:** ❌ Campo vazio
- **Configuração:** Campo de texto livre para bairro/região
- **Problema:** Workflow não está enviando dados de localização

---

## 🔍 **TIPOS DE DADOS IDENTIFICADOS**

### **CAMPOS DE TEXTO LIVRE:**
```
Name: String/Text - Texto livre
Phone: String/Text - Numérico (13 dígitos)
Email: Email - Validação automática
Localizacao_preferida: String/Text - Texto livre
```

### **CAMPOS DE SELEÇÃO (DROPDOWN):**
```
Cliente_intencao: Enumeration/Select - Opções predefinidas
Imovel_pretendido: Enumeration/Select - Opções predefinidas
Nivel_interesse: Enumeration/Select - Opções predefinidas
```

### **CAMPOS DE DATA:**
```
Retornar_em: Date - Formato completo (Month DD, YYYY)
```

---

## ⚙️ **CONFIGURAÇÕES ESPECÍFICAS OBSERVADAS**

### **VALIDAÇÕES ATIVAS:**
- **Email:** Placeholder "@" indica validação de formato ativa
- **Date:** Aceita formato "October 16, 2025" (inglês)
- **Phone:** Aceita formato numérico longo (5586981612934)

### **DROPDOWNS CONFIGURADOS:**
- **Nivel_interesse:** Mostra "Escolha aqui" como placeholder
- **Cliente_intencao:** Campo vazio aguardando seleção
- **Imovel_pretendido:** Campo vazio aguardando seleção

### **CAMPOS FUNCIONAIS:**
- **Phone:** ✅ Captura e exibe corretamente
- **Retornar_em:** ✅ Captura e formata corretamente

---

## 🚨 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

### **CAMPOS NÃO FUNCIONANDO (6 de 8):**
1. **Name** - String vazia
2. **Cliente_intencao** - NULL
3. **Imovel_pretendido** - NULL  
4. **Email** - NULL
5. **Nivel_interesse** - NULL
6. **Localizacao_preferida** - NULL

### **CAMPOS FUNCIONANDO (2 de 8):**
1. **Phone** - ✅ Capturando corretamente
2. **Retornar_em** - ✅ Capturando corretamente

---

## 🎯 **RECOMENDAÇÕES BASEADAS NA ANÁLISE**

### **PRIORIDADE ALTA:**
1. **Corrigir captura do campo Name** - Essencial para identificação
2. **Implementar envio dos campos de seleção** - Cliente_intencao, Imovel_pretendido, Nivel_interesse
3. **Verificar mapeamento de campos nos workflows**

### **PRIORIDADE MÉDIA:**
1. **Implementar captura de Email** quando fornecido
2. **Implementar captura de Localizacao_preferida**

### **OBSERVAÇÕES TÉCNICAS:**
- **Formato de data:** Sistema aceita formato inglês (October 16, 2025)
- **Formato de telefone:** Sistema aceita formato brasileiro com código país
- **Campos de seleção:** Necessitam valores exatos das opções configuradas no Strapi

---

## 📝 **CONCLUSÃO**

O print revela que **apenas 25% dos campos (2 de 8) estão funcionando corretamente**. Os campos Phone e Retornar_em demonstram que a integração básica funciona, mas há problemas específicos na captura e envio dos demais campos pelos workflows.

**Próximos passos:** Verificar e corrigir os workflows para garantir que todos os campos sejam capturados e enviados corretamente para o Strapi.
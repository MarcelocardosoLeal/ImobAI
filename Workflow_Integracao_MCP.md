# 🔄 WORKFLOW DE INTEGRAÇÃO MCP - AGENTE SDR

## 🎯 FLUXO AUTOMATIZADO COM FERRAMENTAS MCP

### 📊 **SEQUÊNCIA OPERACIONAL**

```
CLIENTE INICIA CONVERSA
         ↓
🔍 TRIAGEM INICIAL
   ├── Análise socioeconômica (A/B/C)
   ├── Tipo de imóvel (residencial/comercial)
   └── Finalidade (compra/aluguel/investimento)
         ↓
🏠 BUSCA DE IMÓVEIS
   └── [MCP: search_properties] → Filtrar por perfil
         ↓
🎯 APRESENTAÇÃO PERSUASIVA
   ├── Mostrar 3-5 opções alinhadas
   ├── Destacar imóvel âncora
   └── Classificar interesse (alto/médio/baixo)
         ↓
📅 PROCESSO DE AGENDAMENTO
   ├── Oferecer múltiplas datas
   ├── Confirmar telefone
   └── Coletar email
         ↓
🔍 VERIFICAÇÃO NO CMS
   └── [MCP: find_customer] → Buscar cliente existente
         ↓
💾 REGISTRO/ATUALIZAÇÃO
   └── [MCP: update_customer] → Salvar dados qualificados
         ↓
✅ LEAD QUALIFICADO PARA CORRETOR
```

---

## 🛠️ **INTEGRAÇÃO COM FERRAMENTAS MCP**

### 1️⃣ **BUSCA DE IMÓVEIS**
```javascript
// Após classificação socioeconômica
if (classeCliente === 'A') {
    search_properties({
        priceRange: 'premium',
        location: 'nobre',
        features: 'luxo'
    });
} else if (classeCliente === 'B') {
    search_properties({
        priceRange: 'medio-alto',
        location: 'boa',
        features: 'completo'
    });
} else {
    search_properties({
        priceRange: 'acessivel',
        programs: 'minha-casa-minha-vida',
        features: 'basico'
    });
}
```

### 2️⃣ **VERIFICAÇÃO DE CLIENTE**
```javascript
// Antes de criar novo lead
const clienteExistente = await find_customer({
    phone: telefoneConfirmado
});

if (clienteExistente) {
    // Atualizar dados existentes
    await update_customer({
        id: clienteExistente.id,
        ...dadosAtualizados
    });
} else {
    // Criar novo cliente
    await update_customer({
        ...dadosCompletos
    });
}
```

### 3️⃣ **REGISTRO QUALIFICADO**
```javascript
// Dados obrigatórios para update_customer
const leadQualificado = {
    name: nomeCompleto,
    phone: telefoneConfirmado,
    email: emailValido,
    retornar_em: dataEspecifica, // "2024-01-15"
    
    // Classificações do agente
    cliente_intencao: "comprar|alugar|investir",
    imovel_pretendido: "apartamento|casa|comercial",
    nivel_interesse: "alto|medio|baixo",
    localizacao_preferida: bairroRegiao,
    classe_socioeconomica: "A|B|C",
    
    // Observações para corretor
    observacoes: templateObservacoes
};
```

---

## 📋 **CHECKLIST DE QUALIFICAÇÃO**

### ✅ **DADOS COLETADOS**
- [ ] Nome completo confirmado
- [ ] Telefone validado
- [ ] Email fornecido
- [ ] Data de retorno específica
- [ ] Classe socioeconômica identificada
- [ ] Tipo de imóvel definido
- [ ] Finalidade clarificada
- [ ] Nível de interesse classificado
- [ ] Localização preferida mapeada

### ✅ **AÇÕES EXECUTADAS**
- [ ] Imóveis apresentados conforme perfil
- [ ] Técnicas persuasivas aplicadas
- [ ] Agendamento confirmado
- [ ] Cliente verificado no CMS (find_customer)
- [ ] Dados registrados/atualizados (update_customer)
- [ ] Observações documentadas para corretor

---

## 🎯 **TEMPLATES DE CLASSIFICAÇÃO**

### 📊 **CLASSE SOCIOECONÔMICA**

#### **CLASSE A - PREMIUM**
```
Características:
- Orçamento: R$ 1M+
- Localização: Bairros nobres
- Urgência: Exclusividade
- Linguagem: Sofisticada

Abordagem:
- Focar em diferenciais únicos
- Destacar exclusividade
- Mencionar valorização premium
```

#### **CLASSE B - MÉDIO-ALTO**
```
Características:
- Orçamento: R$ 300K - R$ 1M
- Localização: Boa infraestrutura
- Urgência: Custo-benefício
- Linguagem: Técnica

Abordagem:
- Destacar potencial de valorização
- Comparar opções
- Enfatizar qualidade de vida
```

#### **CLASSE C - ACESSÍVEL**
```
Características:
- Orçamento: Até R$ 300K
- Localização: Emergente
- Urgência: Condições de pagamento
- Linguagem: Direta

Abordagem:
- Facilidades de financiamento
- Programas habitacionais
- Foco na necessidade
```

---

## 🔄 **FLUXO DE DECISÃO AUTOMATIZADO**

### 🎯 **ALGORITMO DE CLASSIFICAÇÃO**
```
SE cliente menciona valores > R$ 1M
   ENTÃO classe = "A"
   E mostrar imóveis premium

SE cliente fala sobre financiamento E orçamento R$ 300K-1M
   ENTÃO classe = "B"
   E destacar custo-benefício

SE cliente menciona programas habitacionais
   ENTÃO classe = "C"
   E focar em facilidades

SE cliente pergunta sobre valores rapidamente
   ENTÃO interesse = "alto"
   E acelerar agendamento

SE cliente compara muitas opções
   ENTÃO interesse = "médio"
   E nutrir com informações

SE cliente responde superficialmente
   ENTÃO interesse = "baixo"
   E capturar para nutrição futura
```

---

## 📈 **MÉTRICAS DE PERFORMANCE**

### 🎯 **INDICADORES PRINCIPAIS**
- **Precisão da Classificação:** % de acerto na classe socioeconômica
- **Qualidade do Lead:** % de leads com interesse alto/médio
- **Taxa de Conversão:** Visitantes → Leads qualificados
- **Eficiência do Agendamento:** % de visitas confirmadas

### 📊 **DASHBOARD DE ACOMPANHAMENTO**
```
HOJE:
├── Conversas iniciadas: X
├── Leads qualificados: Y
├── Agendamentos confirmados: Z
└── Taxa de conversão: Y/X%

CLASSIFICAÇÕES:
├── Classe A: X leads
├── Classe B: Y leads
├── Classe C: Z leads
└── Interesse alto: W leads
```

---

## ⚡ **AUTOMAÇÕES FUTURAS**

### 🤖 **INTEGRAÇÕES POSSÍVEIS**
- **WhatsApp Business API:** Envio automático de detalhes
- **Google Calendar:** Agendamento automático
- **Email Marketing:** Nutrição de leads baixo interesse
- **CRM Analytics:** Relatórios de performance
- **Notificações:** Alertas para corretor sobre leads quentes

Este workflow garante que **cada lead seja maximamente qualificado** antes de chegar ao corretor, aumentando significativamente as chances de conversão! 🚀
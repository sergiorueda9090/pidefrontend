import { createSlice } from "@reduxjs/toolkit";

const mockAgents = [
  {
    id: 1,
    name: "Agente Ventas",
    slug: "agente-ventas",
    description: "Asistente para ventas y conversión en el e-commerce.",
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.4,
    maxTokens: 800,
    systemPrompt:
      "Eres un asistente de e-commerce. Responde claro, breve y orientado a conversión.",
    is_active: true,
    tools: {
      webSearch: false,
      retrieveDocs: true,
      useProductsDb: true,
      useOrdersDb: false,
    },
    baseUrl: "",
    extraHeaders: "",
    created_at: "2025-12-01T10:30:00Z",
    updated_at: "2025-12-10T18:00:00Z",
  },
  {
    id: 2,
    name: "Agente Soporte",
    slug: "agente-soporte",
    description: "Resuelve dudas, devoluciones y tracking de pedidos.",
    provider: "anthropic",
    model: "claude-3-5-sonnet",
    temperature: 0.2,
    maxTokens: 900,
    systemPrompt:
      "Eres un agente de soporte. Prioriza precisión, empatía y pasos claros.",
    is_active: true,
    tools: {
      webSearch: false,
      retrieveDocs: true,
      useProductsDb: false,
      useOrdersDb: true,
    },
    baseUrl: "",
    extraHeaders: "",
    created_at: "2025-12-02T14:10:00Z",
    updated_at: "2025-12-11T09:15:00Z",
  },
  {
    id: 3,
    name: "Agente Contenidos",
    slug: "agente-contenidos",
    description: "Genera copies, descripciones de producto y FAQs.",
    provider: "google",
    model: "gemini-1.5-flash",
    temperature: 0.9,
    maxTokens: 1200,
    systemPrompt:
      "Eres un copywriter experto en e-commerce. Escribe persuasivo y claro.",
    is_active: false,
    tools: {
      webSearch: false,
      retrieveDocs: false,
      useProductsDb: true,
      useOrdersDb: false,
    },
    baseUrl: "",
    extraHeaders: "",
    created_at: "2025-12-03T08:00:00Z",
    updated_at: "2025-12-12T12:00:00Z",
  },
];

export const agentStore = createSlice({
  name: "agentStore",
  initialState: {
    // ✅ Formulario de agente (CRUD)
    id: null,
    name: "",
    slug: "",
    description: "",
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.4,
    maxTokens: 800,
    systemPrompt: "",
    is_active: true,

    baseUrl: "",
    extraHeaders: "",
    // Nota: apiKey NO deberías guardarla en redux si vas server-side.
    // apiKey: "",

    tools: {
      webSearch: false,
      retrieveDocs: true,
      useProductsDb: true,
      useOrdersDb: false,
    },

    // ✅ Lista de agentes (para tabla)
    agents: mockAgents, // <- agentes de prueba

    paginado_info: {
      count: mockAgents.length,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 1,
      total_pages: 1,
    },

    filters: {
      search: "",
      status: "",
      startDate: "",
      endDate: "",
    },
  },

  reducers: {
    // ✅ Actualizar campo del formulario
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // ✅ Cargar datos desde thunks (list endpoint)
    // Espera: { agents, paginado_info }
    handleDataStore: (state, action) => {
      state.agents = action.payload.agents;
      state.paginado_info = action.payload.paginado_info;
    },

    // ✅ Resetear formulario
    resetFormStore: (state) => {
      state.id = null;
      state.name = "";
      state.slug = "";
      state.description = "";
      state.provider = "openai";
      state.model = "gpt-4o-mini";
      state.temperature = 0.4;
      state.maxTokens = 800;
      state.systemPrompt = "";
      state.is_active = true;

      state.baseUrl = "";
      state.extraHeaders = "";

      state.tools = {
        webSearch: false,
        retrieveDocs: true,
        useProductsDb: true,
        useOrdersDb: false,
      };

      // ✅ NO vaciamos la tabla, dejamos los mock por defecto
      state.agents = mockAgents;

      state.paginado_info = {
        count: mockAgents.length,
        next: null,
        previous: null,
        page_size: 10,
        current_page: 1,
        total_pages: 1,
      };

      state.filters = {
        search: "",
        status: "",
        startDate: "",
        endDate: "",
      };
    },

    // ✅ Cargar agente para edición (showThunk)
    loadForEditStore: (state, action) => {
      const agent = action.payload;

      state.id = agent.id ?? null;
      state.name = agent.name ?? "";
      state.slug = agent.slug ?? "";
      state.description = agent.description ?? "";

      state.provider = agent.provider ?? "openai";
      state.model = agent.model ?? "gpt-4o-mini";
      state.temperature = agent.temperature ?? 0.4;
      state.maxTokens = agent.maxTokens ?? agent.max_tokens ?? 800;

      state.systemPrompt = agent.systemPrompt ?? agent.system_prompt ?? "";
      state.is_active = agent.isActive ?? agent.is_active ?? true;

      state.baseUrl = agent.baseUrl ?? agent.base_url ?? "";
      state.extraHeaders = agent.extraHeaders ?? agent.extra_headers ?? "";

      state.tools =
        agent.tools ?? {
          webSearch: false,
          retrieveDocs: true,
          useProductsDb: true,
          useOrdersDb: false,
        };
    },

    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },

    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.paginado_info.current_page = 1;
    },

    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        search: "",
        status: "",
        startDate: "",
        endDate: "",
      };
      state.paginado_info.current_page = 1;
    },
  },
});

export const {
  handleFormStore,
  resetFormStore,
  loadForEditStore,
  handleDataStore,
  setPaginationPage,
  setPaginationPageSize,
  setFilters,
  setFilterField,
  clearFilters,
} = agentStore.actions;

export default agentStore.reducer;

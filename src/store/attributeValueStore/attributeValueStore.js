import { createSlice } from '@reduxjs/toolkit'

export const attributeValueStore = createSlice({
  name: 'attributeValueStore',
  initialState: {
    // Formulario de valor de atributo (CRUD)
    id: null,
    atributo_id: null,
    valor: '',
    valor_extra: '',
    orden: 0,
    activo: true,

    // Lista de valores de atributos
    attributeValues: [],

    // Información de paginación
    paginado_info: {
      count: 0,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 0,
      total_pages: 0,
    },

    // Filtros de búsqueda
    filters: {
      search: '',
      atributo: '',  // Filtrar por atributo padre
      activo: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de valor de atributo
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // Manejar datos de valores de atributos y paginación
    handleDataStore: (state, action) => {
      state.attributeValues = action.payload.attributeValues;
      state.paginado_info = action.payload.paginado_info;
    },

    // Resetear formulario de valor de atributo
    resetFormStore: (state) => {
      state.id = null;
      state.atributo_id = null;
      state.valor = '';
      state.valor_extra = '';
      state.orden = 0;
      state.activo = true;
    },

    // Cargar valor de atributo para edición
    loadForEditStore: (state, action) => {
      const attributeValue = action.payload;
      state.id = attributeValue.id;
      state.atributo_id = attributeValue.atributo_id || attributeValue.atributoId;
      state.valor = attributeValue.valor || '';
      state.valor_extra = attributeValue.valor_extra || attributeValue.valorExtra || '';
      state.orden = attributeValue.orden || 0;
      state.activo = attributeValue.activo ?? true;
    },

    // Paginación
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },

    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1; // Resetear a página 1
    },

    // Filtros
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.paginado_info.current_page = 1; // Resetear a página 1 al filtrar
    },

    setFilterField: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        search: '',
        atributo: '',
        activo: '',
        startDate: '',
        endDate: '',
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
} = attributeValueStore.actions;

export default attributeValueStore.reducer;

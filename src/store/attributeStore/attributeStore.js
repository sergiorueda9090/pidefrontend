import { createSlice } from '@reduxjs/toolkit'

export const attributeStore = createSlice({
  name: 'attributeStore',
  initialState: {
    // Formulario de atributo (CRUD)
    id: null,
    name: '',
    slug: '',
    tipo_input: 'text', // text, number, select, color, checkbox, radio
    tipo_dato: 'string', // string, integer, float, boolean
    es_variable: true,
    es_filtrable: true,
    orden: 0,
    descripcion: '',
    attributes: [],
    paginado_info: {
      count: 0,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 0,
      total_pages: 0,
    },
    filters: {
      search: '',
      tipo_input: '',
      es_variable: '',
      es_filtrable: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de atributo
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.attributes = action.payload.attributes;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de atributo
    resetFormStore: (state) => {
      state.id = null;
      state.name = '';
      state.slug = '';
      state.tipo_input = 'text';
      state.tipo_dato = 'string';
      state.es_variable = true;
      state.es_filtrable = true;
      state.orden = 0;
      state.descripcion = '';
      state.attributes = [];
      state.paginado_info = {
        count: 0,
        next: null,
        previous: null,
        page_size: 10,
        current_page: 0,
        total_pages: 0,
      };
      state.filters = {
        search: '',
        tipo_input: '',
        es_variable: '',
        es_filtrable: '',
        startDate: '',
        endDate: '',
      };
    },
    // Cargar atributo para edición
    loadForEditStore: (state, action) => {
      const attribute = action.payload;
      state.id = attribute.id;
      state.name = attribute.name || '';
      state.slug = attribute.slug || '';
      state.tipo_input = attribute.tipo_input || 'text';
      state.tipo_dato = attribute.tipo_dato || 'string';
      state.es_variable = attribute.es_variable ?? true;
      state.es_filtrable = attribute.es_filtrable ?? true;
      state.orden = attribute.orden || 0;
      state.descripcion = attribute.descripcion || '';
    },
    setPaginationPage: (state, action) => {
      state.paginado_info.current_page = action.payload;
    },
    setPaginationPageSize: (state, action) => {
      state.paginado_info.page_size = action.payload;
      state.paginado_info.current_page = 1; // Resetear a página 1
    },
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
        tipo_input: '',
        es_variable: '',
        es_filtrable: '',
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
} = attributeStore.actions;

export default attributeStore.reducer;

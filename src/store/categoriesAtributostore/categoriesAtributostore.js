import { createSlice } from '@reduxjs/toolkit'

export const categoriesAtributoStore = createSlice({
  name: 'categoriesAtributoStore',
  initialState: {
    // Formulario de relación categoría-atributo (CRUD)
    id: null,
    categoriaId: null,
    atributoId: null,
    obligatorio: false,
    orden: 0,

    // Lista de relaciones categoría-atributo
    categoriaAtributos: [],

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
      categoria: '',      // Filtrar por categoría
      atributo: '',       // Filtrar por atributo
      obligatorio: '',    // Filtrar por obligatorio (true/false)
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de relación categoría-atributo
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // Manejar datos de relaciones categoría-atributo y paginación
    handleDataStore: (state, action) => {
      state.categoriaAtributos = action.payload.categoriaAtributos;
      state.paginado_info = action.payload.paginado_info;
    },

    // Resetear formulario de relación categoría-atributo
    resetFormStore: (state) => {
      state.id = null;
      state.categoriaId = null;
      state.atributoId = null;
      state.obligatorio = false;
      state.orden = 0;
    },

    // Cargar relación categoría-atributo para edición
    loadForEditStore: (state, action) => {
      const relacion = action.payload;
      state.id = relacion.id;
      state.categoriaId = relacion.categoriaId;
      state.atributoId = relacion.atributoId;
      state.obligatorio = relacion.obligatorio ?? false;
      state.orden = relacion.orden || 0;
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
        categoria: '',
        atributo: '',
        obligatorio: '',
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
} = categoriesAtributoStore.actions;

export default categoriesAtributoStore.reducer;

import { createSlice } from '@reduxjs/toolkit'

export const categoryStore = createSlice({
  name: 'categoryStore',
  initialState: {
    // Formulario de categoría (CRUD)
    id: null,
    name: '',
    slug: '',
    description: '',
    icon: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    image: null,
    is_active: true,
    categories: [],
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
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de categoría
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.categories = action.payload.categories;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de categoría
    resetFormStore: (state) => {
      state.id = null;
      state.name = '';
      state.slug = '';
      state.description = '';
      state.icon = '';
      state.seoTitle = '';
      state.seoDescription = '';
      state.seoKeywords = '';
      state.image = null;
      state.is_active = true;
      state.categories = [];
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
        status: '',
        startDate: '',
        endDate: '',
      };
    },
    // Cargar categoría para edición
    loadForEditStore: (state, action) => {
      const category = action.payload;
      state.id = category.id;
      state.name = category.name || '';
      state.slug = category.slug || '';
      state.description = category.description || '';
      state.icon = category.icon || '';
      state.seoTitle = category.seoTitle || '';
      state.seoDescription = category.seoDescription || '';
      state.seoKeywords = category.seoKeywords || '';
      state.image = category.image || null;
      state.is_active = category.is_active ?? true;
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
        status: '',
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
} = categoryStore.actions;

export default categoryStore.reducer;

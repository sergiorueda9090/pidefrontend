import { createSlice } from '@reduxjs/toolkit'

export const brandStore = createSlice({
  name: 'brandStore',
  initialState: {
    // Formulario de marca (CRUD)
    id: null,
    name: '',
    slug: '',
    description: '',
    logo: null,
    website: '',
    is_active: true,
    is_featured: false,
    brands: [],
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
      featured: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de marca
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    handleDataStore: (state, action) => {
      state.brands = action.payload.brands;
      state.paginado_info = action.payload.paginado_info;
    },
    // Resetear formulario de marca
    resetFormStore: (state) => {
      state.id = null;
      state.name = '';
      state.slug = '';
      state.description = '';
      state.logo = null;
      state.website = '';
      state.is_active = true;
      state.is_featured = false;
      state.brands = [];
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
        featured: '',
        startDate: '',
        endDate: '',
      };
    },
    // Cargar marca para edición
    loadForEditStore: (state, action) => {
      const brand = action.payload;
      state.id = brand.id;
      state.name = brand.name || '';
      state.slug = brand.slug || '';
      state.description = brand.description || '';
      state.logo = brand.logo || null;
      state.website = brand.website || '';
      state.is_active = brand.is_active ?? true;
      state.is_featured = brand.is_featured ?? false;
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
        featured: '',
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
} = brandStore.actions;

export default brandStore.reducer;

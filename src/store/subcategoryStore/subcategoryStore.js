import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Campos del formulario para crear/editar subcategoría
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

    // Nuevo: ID de la categoría padre (obligatorio para subcategorías)
    category_id: null,

    // Lista de subcategorías
    subcategories: [],

    // Información de paginación
    paginado_info: {
        count: 0,
        next: null,
        previous: null,
        page_size: 10,
        current_page: 0,
        total_pages: 0
    },

    // Filtros de búsqueda
    filters: {
        search: '',
        status: '',
        category: '',  // Filtrar por categoría padre
        startDate: '',
        endDate: ''
    },

    // Estado de carga
    loading: false,
    error: null
};

export const subcategoryStore = createSlice({
    name: "subcategoryStore",
    initialState,
    reducers: {
        // Manejar cambios en el formulario
        handleFormStore: (state, action) => {
            const { name, value } = action.payload;
            state[name] = value;
        },

        // Resetear formulario
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
            state.category_id = null;
        },

        // Cargar datos para editar
        loadForEditStore: (state, action) => {
            const {
                id,
                name,
                slug,
                description,
                icon,
                seoTitle,
                seoDescription,
                seoKeywords,
                image,
                is_active,
                category_id
            } = action.payload;

            state.id = id;
            state.name = name;
            state.slug = slug;
            state.description = description;
            state.icon = icon;
            state.seoTitle = seoTitle;
            state.seoDescription = seoDescription;
            state.seoKeywords = seoKeywords;
            state.image = image;
            state.is_active = is_active;
            state.category_id = category_id;
        },

        // Manejar lista de subcategorías y paginación
        handleDataStore: (state, action) => {
            const { subcategories, paginado_info } = action.payload;
            state.subcategories = subcategories;
            state.paginado_info = paginado_info;
        },

        // Paginación
        setPaginationPage: (state, action) => {
            state.paginado_info.current_page = action.payload;
        },

        setPaginationPageSize: (state, action) => {
            state.paginado_info.page_size = action.payload;
            state.paginado_info.current_page = 1;
        },

        // Filtros
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        setFilterField: (state, action) => {
            const { field, value } = action.payload;
            state.filters[field] = value;
        },

        clearFilters: (state) => {
            state.filters = {
                search: '',
                status: '',
                category: '',
                startDate: '',
                endDate: ''
            };
        },

        // Estados de carga
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        }
    }
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
    setLoading,
    setError
} = subcategoryStore.actions;

export default subcategoryStore.reducer;

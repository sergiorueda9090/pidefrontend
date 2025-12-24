import { createSlice } from '@reduxjs/toolkit'

export const productosStore = createSlice({
  name: 'productosStore',
  initialState: {
    // Formulario de producto (CRUD)
    id: null,

    // Información básica
    nombre: '',
    slug: '',
    skuBase: '',
    descripcionCorta: '',
    descripcionLarga: '',
    categoriaId: null,
    marcaId: null,

    // Control de variantes
    tieneVariantes: false,
    tipoProducto: 'simple', // 'simple', 'variable', 'digital'

    // Precios base (si no tiene variantes)
    precioBase: '',
    precioCosto: '',
    precioDescuento: '',
    porcentajeDescuento: '',
    moneda: 'COP',

    // Inventario base (si no tiene variantes)
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: 'unidad',
    peso: '', // gramos
    largo: '', // cm
    ancho: '', // cm
    alto: '', // cm

    // SEO
    metaTitle: '',
    metaDescription: '',
    keywords: '',

    // Estados
    activo: true,
    publicado: false,
    destacado: false,
    esNuevo: false,
    fechaPublicacion: null,
    fechaNuevoHasta: null,

    // Métricas (read-only, no se envían al backend en create/update)
    vistas: 0,
    ventasTotales: 0,
    ratingPromedio: 0.00,
    totalReviews: 0,

    // Imágenes (array de archivos o URLs)
    images: [],

    // Lista de productos y paginación
    products: [],
    paginado_info: {
      count: 0,
      next: null,
      previous: null,
      page_size: 10,
      current_page: 0,
      total_pages: 0,
    },

    // Filtros
    filters: {
      search: '',
      categoria: '',
      marca: '',
      tipoProducto: '',
      publicado: '',
      destacado: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    // Actualizar campo del formulario de producto
    handleFormStore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // Actualizar lista de productos y paginación
    handleDataStore: (state, action) => {
      state.products = action.payload.products;
      state.paginado_info = action.payload.paginado_info;
    },

    // Resetear formulario de producto
    resetFormStore: (state) => {
      state.id = null;
      state.nombre = '';
      state.slug = '';
      state.skuBase = '';
      state.descripcionCorta = '';
      state.descripcionLarga = '';
      state.categoriaId = null;
      state.marcaId = null;
      state.tieneVariantes = false;
      state.tipoProducto = 'simple';
      state.precioBase = '';
      state.precioCosto = '';
      state.precioDescuento = '';
      state.porcentajeDescuento = '';
      state.moneda = 'COP';
      state.stockActual = 0;
      state.stockMinimo = 0;
      state.unidadMedida = 'unidad';
      state.peso = '';
      state.largo = '';
      state.ancho = '';
      state.alto = '';
      state.metaTitle = '';
      state.metaDescription = '';
      state.keywords = '';
      state.activo = true;
      state.publicado = false;
      state.destacado = false;
      state.esNuevo = false;
      state.fechaPublicacion = null;
      state.fechaNuevoHasta = null;
      state.vistas = 0;
      state.ventasTotales = 0;
      state.ratingPromedio = 0.00;
      state.totalReviews = 0;
      state.images = [];
    },

    // Cargar producto para edición
    loadForEditStore: (state, action) => {
      const product = action.payload;
      state.id = product.id;
      state.nombre = product.nombre || '';
      state.slug = product.slug || '';
      state.skuBase = product.skuBase || '';
      state.descripcionCorta = product.descripcionCorta || '';
      state.descripcionLarga = product.descripcionLarga || '';
      state.categoriaId = product.categoriaId || null;
      state.marcaId = product.marcaId || null;
      state.tieneVariantes = product.tieneVariantes ?? false;
      state.tipoProducto = product.tipoProducto || 'simple';
      state.precioBase = product.precioBase || '';
      state.precioCosto = product.precioCosto || '';
      state.precioDescuento = product.precioDescuento || '';
      state.porcentajeDescuento = product.porcentajeDescuento || '';
      state.moneda = product.moneda || 'COP';
      state.stockActual = product.stockActual ?? 0;
      state.stockMinimo = product.stockMinimo ?? 0;
      state.unidadMedida = product.unidadMedida || 'unidad';
      state.peso = product.peso || '';
      state.largo = product.largo || '';
      state.ancho = product.ancho || '';
      state.alto = product.alto || '';
      state.metaTitle = product.metaTitle || '';
      state.metaDescription = product.metaDescription || '';
      state.keywords = product.keywords || '';
      state.activo = product.activo ?? true;
      state.publicado = product.publicado ?? false;
      state.destacado = product.destacado ?? false;
      state.esNuevo = product.esNuevo ?? false;
      state.fechaPublicacion = product.fechaPublicacion || null;
      state.fechaNuevoHasta = product.fechaNuevoHasta || null;
      state.vistas = product.vistas ?? 0;
      state.ventasTotales = product.ventasTotales ?? 0;
      state.ratingPromedio = product.ratingPromedio ?? 0.00;
      state.totalReviews = product.totalReviews ?? 0;
      state.images = product.images || [];
    },

    // Agregar imagen al array
    addImage: (state, action) => {
      state.images.push(action.payload);
    },

    // Eliminar imagen del array por índice
    removeImage: (state, action) => {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },

    // Actualizar array completo de imágenes
    setImages: (state, action) => {
      state.images = action.payload;
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
        marca: '',
        tipoProducto: '',
        publicado: '',
        destacado: '',
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
  addImage,
  removeImage,
  setImages,
  setPaginationPage,
  setPaginationPageSize,
  setFilters,
  setFilterField,
  clearFilters,
} = productosStore.actions;

export default productosStore.reducer;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  IconButton,
  Card,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  Paper,
  Stack,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Delete,
  ShoppingCart,
  Description,
  AttachMoney,
  Inventory,
  Search,
  Visibility,
  Image as ImageIcon,
  Category as CategoryIcon,
  LocalOffer,
  Straighten,
  MonetizationOn,
  Info,
  CheckCircle,
  Warning,
  InfoOutlined,
  LightbulbOutlined,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStore, addImage, removeImage, resetFormStore } from '../../store/productosStore/productosStore';
import { getAllThunks as getCategoriesThunks } from '../../store/categoryStore/categoryThunks';
import { closeModalShared } from '../../store/globalStore/globalStore';
import RichTextEditor from './RichTextEditor';

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

/**
 * Sección del formulario con título e icono
 */
const FormSection = ({ title, icon, children, noDivider, subtitle }) => (
  <Box>
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 5.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {children}
    {!noDivider && <Divider sx={{ mt: 4, mb: 1 }} />}
  </Box>
);

/**
 * Card para switches/toggles con diseño mejorado
 */
const ToggleCard = ({ checked, onChange, title, subtitle, icon, color = 'primary' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      border: '2px solid',
      borderColor: checked ? `${color}.main` : 'divider',
      borderRadius: 2,
      bgcolor: checked ? alpha(color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : '#0288d1', 0.04) : 'background.paper',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        borderColor: `${color}.main`,
        bgcolor: checked ? alpha(color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : '#0288d1', 0.08) : alpha(color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : '#0288d1', 0.02),
      }
    }}
    onClick={onChange}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          minWidth: 40,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        color={color}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: `${color}.main`,
          },
        }}
      />
    </Box>
  </Paper>
);

/**
 * Alert con información/ayuda mejorado
 */
const InfoBox = ({ children, severity = "info", icon }) => (
  <Alert
    severity={severity}
    icon={icon || undefined}
    sx={{
      borderRadius: 2,
      '& .MuiAlert-icon': {
        fontSize: 24,
      },
      '& .MuiAlert-message': {
        width: '100%',
      }
    }}
  >
    {children}
  </Alert>
);

/**
 * Campo de entrada mejorado con diseño consistente
 */
const StyledTextField = ({ bgcolor = 'white', ...props }) => (
  <TextField
    {...props}
    sx={{
      '& .MuiOutlinedInput-root': {
        bgcolor: bgcolor,
        borderRadius: 1.5,
        ...props.sx?.['& .MuiOutlinedInput-root'],
      },
      ...props.sx,
    }}
  />
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Estado del producto desde Redux
  const productState = useSelector(state => state.productosStore);
  const {
    id,
    nombre,
    slug,
    skuBase,
    descripcionCorta,
    descripcionLarga,
    categoriaId,
    marcaId,
    tieneVariantes,
    tipoProducto,
    precioBase,
    precioCosto,
    precioDescuento,
    porcentajeDescuento,
    moneda,
    stockActual,
    stockMinimo,
    unidadMedida,
    peso,
    largo,
    ancho,
    alto,
    metaTitle,
    metaDescription,
    keywords,
    activo,
    publicado,
    destacado,
    esNuevo,
    fechaPublicacion,
    fechaNuevoHasta,
    images,
  } = productState;

  const { categories } = useSelector(state => state.categoryStore);
  const isEditing = !!id;

  // Estados locales
  const [tabIndex, setTabIndex] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [keywordsArray, setKeywordsArray] = useState([]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (open) {
      dispatch(getCategoriesThunks({ page: 1, page_size: 1000 }));
    }
  }, [open, dispatch]);

  // Generar slug automáticamente desde el nombre
  useEffect(() => {
    if (nombre && !isEditing) {
      const generatedSlug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      dispatch(handleFormStore({ name: 'slug', value: generatedSlug }));
    }
  }, [nombre, isEditing, dispatch]);

  // Parsear keywords
  useEffect(() => {
    if (keywords) {
      const keywordsList = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      setKeywordsArray(keywordsList);
    } else {
      setKeywordsArray([]);
    }
  }, [keywords, open]);

  // Manejar previews de imágenes
  useEffect(() => {
    if (images && images.length > 0) {
      const previews = images.map(img => {
        if (typeof img === 'string') {
          return img;
        } else if (img instanceof File) {
          return URL.createObjectURL(img);
        }
        return null;
      }).filter(p => p !== null);
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }

    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch(handleFormStore({ name: field, value }));
  };

  const handleRichTextChange = (content) => {
    dispatch(handleFormStore({ name: 'descripcionLarga', value: content }));
  };

  const handleSwitchChange = (field) => (event) => {
    const value = event.target.checked;
    dispatch(handleFormStore({ name: field, value }));
  };

  const handleNumberChange = (field) => (event) => {
    const value = event.target.value;
    if (value === '' || !isNaN(value)) {
      dispatch(handleFormStore({ name: field, value }));
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      dispatch(addImage(file));
    });
  };

  const handleRemoveImage = (index) => {
    dispatch(removeImage(index));
  };

  const handleKeywordsChange = (event) => {
    const value = event.target.value;
    if (value.endsWith(',')) {
      const newKeyword = value.slice(0, -1).trim();
      if (newKeyword && !keywordsArray.includes(newKeyword)) {
        const updatedKeywords = [...keywordsArray, newKeyword];
        setKeywordsArray(updatedKeywords);
        dispatch(handleFormStore({
          name: 'keywords',
          value: updatedKeywords.join(', ')
        }));
      }
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    const updatedKeywords = keywordsArray.filter(k => k !== keywordToDelete);
    setKeywordsArray(updatedKeywords);
    dispatch(handleFormStore({
      name: 'keywords',
      value: updatedKeywords.join(', ')
    }));
  };

  const handleKeywordsKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.target.value;
      const newKeyword = value.trim();
      if (newKeyword && !keywordsArray.includes(newKeyword)) {
        const updatedKeywords = [...keywordsArray, newKeyword];
        setKeywordsArray(updatedKeywords);
        dispatch(handleFormStore({
          name: 'keywords',
          value: updatedKeywords.join(', ')
        }));
      }
    }
  };

  const handleSave = () => {
    console.log('Guardar producto:', productState);
    // TODO: Implementar createThunks/updateThunks
  };

  const handleClose = () => {
    dispatch(resetFormStore());
    setImagePreviews([]);
    setKeywordsArray([]);
    setTabIndex(0);
    dispatch(closeModalShared());
    if (onClose) onClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // ============================================================================
  // VALIDACIONES
  // ============================================================================

  const isFormValid = nombre.trim() && categoriaId;
  const hasLowStock = stockActual <= stockMinimo && stockMinimo > 0;
  const hasDiscount = precioBase && precioDescuento && precioDescuento < precioBase;
  const volumeInLiters = largo && ancho && alto ? ((largo * ancho * alto) / 1000).toFixed(2) : null;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '92vh',
          borderRadius: 3,
          boxShadow: 24,
        }
      }}
    >
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2.5,
          pt: 3,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ShoppingCart sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5 }}>
            {isEditing ? 'Actualiza la información del producto existente' : 'Completa los datos para agregar un nuevo producto al catálogo'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
              transform: 'rotate(90deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* ============================================================ */}
      {/* TABS NAVEGACIÓN */}
      {/* ============================================================ */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              py: 2,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <Tab icon={<Description />} label="Información General" iconPosition="start" />
          <Tab icon={<AttachMoney />} label="Precios" iconPosition="start" />
          <Tab icon={<Inventory />} label="Inventario" iconPosition="start" />
          <Tab icon={<Search />} label="SEO" iconPosition="start" />
          <Tab icon={<ImageIcon />} label="Imágenes" iconPosition="start" />
          <Tab icon={<Visibility />} label="Publicación" iconPosition="start" />
        </Tabs>
      </Box>

      {/* ============================================================ */}
      {/* CONTENIDO DE TABS */}
      {/* ============================================================ */}
      <DialogContent sx={{ pt: 4, px: 4, pb: 2, bgcolor: '#f8f9fa' }}>

        {/* TAB 0: INFORMACIÓN GENERAL */}
        {tabIndex === 0 && (
          <Stack spacing={4}>

            {/* Datos Básicos */}
            <FormSection
              title="Datos Básicos"
              subtitle="Información principal del producto"
              icon={<InfoOutlined />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Nombre del Producto"
                    value={nombre}
                    onChange={handleChange('nombre')}
                    required
                    placeholder="Ej: Laptop HP Pavilion 15 - Core i7, 16GB RAM"
                    helperText="Nombre completo y descriptivo del producto"
                    error={!nombre.trim() && nombre.length > 0}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <StyledTextField
                    fullWidth
                    label="Slug (URL amigable)"
                    value={slug}
                    onChange={handleChange('slug')}
                    required
                    helperText={isEditing ? "URL del producto - editable" : "Se genera automáticamente al escribir el nombre"}
                    bgcolor={isEditing ? 'white' : 'grey.100'}
                    InputProps={{
                      readOnly: !isEditing,
                      sx: {
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    label="SKU"
                    value={skuBase}
                    onChange={handleChange('skuBase')}
                    placeholder="LP-HP-001"
                    helperText="Código único del producto"
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Categorización */}
            <FormSection
              title="Categorización"
              subtitle="Organiza tu producto en el catálogo"
              icon={<CategoryIcon />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={categoriaId || ''}
                      onChange={handleChange('categoriaId')}
                      label="Categoría"
                      sx={{ bgcolor: 'white', borderRadius: 1.5 }}
                    >
                      <MenuItem value="">
                        <em>Seleccionar categoría...</em>
                      </MenuItem>
                      {categories && categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marca (Opcional)</InputLabel>
                    <Select
                      value={marcaId || ''}
                      onChange={handleChange('marcaId')}
                      label="Marca (Opcional)"
                      sx={{ bgcolor: 'white', borderRadius: 1.5 }}
                    >
                      <MenuItem value="">
                        <em>Sin marca</em>
                      </MenuItem>
                      {/* TODO: Agregar marcas cuando exista el backend */}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Producto</InputLabel>
                    <Select
                      value={tipoProducto}
                      onChange={handleChange('tipoProducto')}
                      label="Tipo de Producto"
                      sx={{ bgcolor: 'white', borderRadius: 1.5 }}
                    >
                      <MenuItem value="simple">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                          <CheckCircle fontSize="small" color="success" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Simple</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Producto único sin variantes de color, talla, etc.
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="variable">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                          <Warning fontSize="small" color="warning" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Variable</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Producto con variantes (tallas, colores, capacidades, etc.)
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value="digital">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                          <Info fontSize="small" color="info" />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Digital</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Producto descargable (software, ebooks, cursos)
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {tipoProducto === 'variable' && (
                  <Grid item xs={12}>
                    <Alert
                      severity="warning"
                      icon={<Warning />}
                      sx={{ borderRadius: 2 }}
                      action={
                        <Switch
                          checked={tieneVariantes}
                          onChange={handleSwitchChange('tieneVariantes')}
                          color="warning"
                        />
                      }
                    >
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Sistema de Variantes
                      </Typography>
                      <Typography variant="caption">
                        {tieneVariantes
                          ? 'Las variantes están activadas. Los precios e inventario se configurarán por variante.'
                          : 'Activa el switch para gestionar precios e inventario por cada variante del producto.'}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </FormSection>

            {/* Descripciones */}
            <FormSection
              title="Descripciones"
              subtitle="Describe tu producto para atraer a más clientes"
              icon={<Description />}
              noDivider
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      Descripción Corta
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Resumen breve que aparecerá en listados y vistas previas
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    value={descripcionCorta}
                    onChange={handleChange('descripcionCorta')}
                    multiline
                    rows={3}
                    placeholder="Escribe un resumen atractivo del producto en 1-2 oraciones..."
                    helperText={`${descripcionCorta.length}/300 caracteres`}
                    inputProps={{ maxLength: 300 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      Descripción Detallada
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Información completa: características, beneficios, especificaciones técnicas
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      '& .ql-container': {
                        borderRadius: '0 0 12px 12px',
                        bgcolor: 'white',
                      },
                      '& .ql-toolbar': {
                        borderRadius: '12px 12px 0 0',
                        bgcolor: 'grey.50',
                      }
                    }}
                  >
                    <RichTextEditor
                      value={descripcionLarga}
                      onChange={handleRichTextChange}
                      placeholder="Escribe una descripción completa y detallada del producto..."
                      minHeight="280px"
                    />
                  </Box>
                </Grid>
              </Grid>
            </FormSection>

          </Stack>
        )}

        {/* TAB 1: PRECIOS */}
        {tabIndex === 1 && (
          <Stack spacing={4}>
            {!tieneVariantes ? (
              <>
                <FormSection
                  title="Configuración de Precios"
                  subtitle="Define los precios de venta y costo"
                  icon={<MonetizationOn />}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <StyledTextField
                        fullWidth
                        label="Precio de Venta"
                        value={precioBase}
                        onChange={handleNumberChange('precioBase')}
                        type="number"
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Precio al público (IVA incluido)"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <StyledTextField
                        fullWidth
                        label="Precio de Costo"
                        value={precioCosto}
                        onChange={handleNumberChange('precioCosto')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Costo de adquisición (interno)"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Moneda</InputLabel>
                        <Select
                          value={moneda}
                          onChange={handleChange('moneda')}
                          label="Moneda"
                          sx={{ bgcolor: 'white', borderRadius: 1.5 }}
                        >
                          <MenuItem value="COP">🇨🇴 COP - Peso Colombiano</MenuItem>
                          <MenuItem value="USD">🇺🇸 USD - Dólar Americano</MenuItem>
                          <MenuItem value="EUR">🇪🇺 EUR - Euro</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {precioBase && precioCosto && (
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            bgcolor: precioBase > precioCosto ? 'success.lighter' : 'error.lighter',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: precioBase > precioCosto ? 'success.light' : 'error.light',
                          }}
                        >
                          <Typography variant="body2" fontWeight={700} color={precioBase > precioCosto ? 'success.dark' : 'error.dark'}>
                            {precioBase > precioCosto
                              ? `✓ Margen de ganancia: $${(precioBase - precioCosto).toLocaleString()} ${moneda} (${(((precioBase - precioCosto) / precioCosto) * 100).toFixed(1)}%)`
                              : `⚠ Advertencia: El precio de venta es menor al costo`
                            }
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </FormSection>

                <FormSection
                  title="Descuentos y Ofertas"
                  subtitle="Configura precios promocionales (opcional)"
                  icon={<LocalOffer />}
                  noDivider
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <StyledTextField
                        fullWidth
                        label="Precio con Descuento"
                        value={precioDescuento}
                        onChange={handleNumberChange('precioDescuento')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Precio rebajado (debe ser menor al precio de venta)"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <StyledTextField
                        fullWidth
                        label="Porcentaje de Descuento"
                        value={porcentajeDescuento}
                        onChange={handleNumberChange('porcentajeDescuento')}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        helperText="% de descuento aplicado"
                      />
                    </Grid>

                    {hasDiscount && (
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            bgcolor: 'warning.lighter',
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: 'warning.main',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <LocalOffer color="warning" />
                            <Typography variant="h6" fontWeight={700} color="warning.dark">
                              Oferta Activa
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            Ahorro para el cliente: ${(precioBase - precioDescuento).toLocaleString()} {moneda}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Descuento del {((1 - precioDescuento / precioBase) * 100).toFixed(1)}% sobre el precio original
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </FormSection>
              </>
            ) : (
              <InfoBox severity="warning" icon={<Warning />}>
                <Typography variant="body2" fontWeight={700} gutterBottom>
                  Producto con Variantes Activado
                </Typography>
                <Typography variant="body2">
                  Los precios se configurarán individualmente para cada variante del producto (color, talla, capacidad, etc.).
                  Si deseas gestionar un único precio, desactiva el sistema de variantes en la pestaña "Información General".
                </Typography>
              </InfoBox>
            )}
          </Stack>
        )}

        {/* TAB 2: INVENTARIO */}
        {tabIndex === 2 && (
          <Stack spacing={4}>
            {!tieneVariantes ? (
              <>
                <FormSection
                  title="Control de Stock"
                  subtitle="Gestiona el inventario y disponibilidad"
                  icon={<Inventory />}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <StyledTextField
                        fullWidth
                        label="Stock Actual"
                        value={stockActual}
                        onChange={handleNumberChange('stockActual')}
                        type="number"
                        required
                        inputProps={{ min: 0 }}
                        helperText="Cantidad disponible en inventario"
                        error={hasLowStock}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <StyledTextField
                        fullWidth
                        label="Stock Mínimo"
                        value={stockMinimo}
                        onChange={handleNumberChange('stockMinimo')}
                        type="number"
                        inputProps={{ min: 0 }}
                        helperText="Alerta cuando llegue a este nivel"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Unidad de Medida</InputLabel>
                        <Select
                          value={unidadMedida}
                          onChange={handleChange('unidadMedida')}
                          label="Unidad de Medida"
                          sx={{ bgcolor: 'white', borderRadius: 1.5 }}
                        >
                          <MenuItem value="unidad">📦 Unidad</MenuItem>
                          <MenuItem value="kg">⚖️ Kilogramo (kg)</MenuItem>
                          <MenuItem value="g">⚖️ Gramo (g)</MenuItem>
                          <MenuItem value="l">🧪 Litro (l)</MenuItem>
                          <MenuItem value="ml">🧪 Mililitro (ml)</MenuItem>
                          <MenuItem value="m">📏 Metro (m)</MenuItem>
                          <MenuItem value="cm">📏 Centímetro (cm)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {hasLowStock && (
                      <Grid item xs={12}>
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={700} gutterBottom>
                            ⚠️ Stock Crítico
                          </Typography>
                          <Typography variant="body2">
                            El stock actual ({stockActual} {unidadMedida}) está por debajo del mínimo establecido ({stockMinimo} {unidadMedida}).
                            Se recomienda reabastecer este producto lo antes posible.
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </FormSection>

                <FormSection
                  title="Dimensiones y Peso"
                  subtitle="Para cálculo de envíos y logística"
                  icon={<Straighten />}
                  noDivider
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <StyledTextField
                        fullWidth
                        label="Peso del Producto"
                        value={peso}
                        onChange={handleNumberChange('peso')}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">gramos</InputAdornment>,
                        }}
                        helperText="Peso para cálculo de envío"
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <StyledTextField
                        fullWidth
                        label="Largo"
                        value={largo}
                        onChange={handleNumberChange('largo')}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <StyledTextField
                        fullWidth
                        label="Ancho"
                        value={ancho}
                        onChange={handleNumberChange('ancho')}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <StyledTextField
                        fullWidth
                        label="Alto"
                        value={alto}
                        onChange={handleNumberChange('alto')}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                      />
                    </Grid>

                    {volumeInLiters && (
                      <Grid item xs={12}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            bgcolor: 'info.lighter',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: 'info.main',
                              color: 'white',
                              fontSize: 24,
                            }}
                          >
                            📦
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="info.dark">
                              Volumen calculado: {volumeInLiters} litros
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Dimensiones: {largo} × {ancho} × {alto} cm
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </FormSection>
              </>
            ) : (
              <InfoBox severity="warning" icon={<Warning />}>
                <Typography variant="body2" fontWeight={700} gutterBottom>
                  Producto con Variantes Activado
                </Typography>
                <Typography variant="body2">
                  El inventario se gestionará individualmente para cada variante del producto.
                  Cada combinación (color, talla, etc.) tendrá su propio stock independiente.
                </Typography>
              </InfoBox>
            )}
          </Stack>
        )}

        {/* TAB 3: SEO */}
        {tabIndex === 3 && (
          <Stack spacing={4}>
            <FormSection
              title="Optimización para Motores de Búsqueda"
              subtitle="Mejora el posicionamiento de tu producto en Google"
              icon={<Search />}
              noDivider
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InfoBox icon={<LightbulbOutlined />}>
                    <Typography variant="body2" fontWeight={700} gutterBottom>
                      💡 Tips para mejorar tu SEO:
                    </Typography>
                    <Typography variant="caption" component="div">
                      • Incluye el nombre del producto y sus beneficios principales en el título<br/>
                      • Usa palabras clave de forma natural en la descripción<br/>
                      • Agrega términos que tus clientes potenciales buscarían<br/>
                      • Mantén el título bajo 60 caracteres para que se vea completo en Google
                    </Typography>
                  </InfoBox>
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Título SEO (Meta Title)"
                    value={metaTitle}
                    onChange={handleChange('metaTitle')}
                    placeholder="Ej: Laptop HP Pavilion 15 - Core i7, 16GB RAM | Envío Gratis"
                    helperText={`${metaTitle.length}/160 caracteres - Este es el título que aparecerá en los resultados de Google`}
                    inputProps={{ maxLength: 160 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Descripción SEO (Meta Description)"
                    value={metaDescription}
                    onChange={handleChange('metaDescription')}
                    multiline
                    rows={4}
                    placeholder="Escribe una descripción atractiva que anime a los usuarios a hacer clic en tu producto desde los resultados de búsqueda..."
                    helperText={`${metaDescription.length}/320 caracteres - Descripción que se muestra en los resultados de búsqueda`}
                    inputProps={{ maxLength: 320 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      Palabras Clave (Keywords)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Presiona coma (,) o Enter después de cada palabra clave
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    defaultValue=""
                    key={keywordsArray.length}
                    onKeyUp={handleKeywordsChange}
                    onKeyPress={handleKeywordsKeyPress}
                    placeholder="laptop, hp, core i7, 16gb ram, gaming..."
                  />

                  {keywordsArray.length > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mt: 2.5,
                        p: 3,
                        bgcolor: alpha('#1976d2', 0.05),
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'primary.light',
                      }}
                    >
                      {keywordsArray.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => handleDeleteKeyword(keyword)}
                          color="primary"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            height: 36,
                          }}
                        />
                      ))}
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        )}

        {/* TAB 4: IMÁGENES */}
        {tabIndex === 4 && (
          <Stack spacing={4}>
            <FormSection
              title="Galería de Imágenes"
              subtitle="Agrega fotos de alta calidad de tu producto"
              icon={<ImageIcon />}
              noDivider
            >
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload sx={{ fontSize: 32 }} />}
                sx={{
                  height: 140,
                  borderStyle: 'dashed',
                  borderWidth: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  borderColor: 'primary.light',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 3,
                    bgcolor: alpha('#1976d2', 0.05),
                    borderColor: 'primary.main',
                    transform: 'scale(1.01)',
                  }
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
                    Seleccionar Imágenes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    JPG, PNG o GIF • Máximo 5MB por imagen
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreviews.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Imágenes Cargadas
                    </Typography>
                    <Chip
                      label={`${imagePreviews.length} ${imagePreviews.length === 1 ? 'imagen' : 'imágenes'}`}
                      color="primary"
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                          elevation={4}
                          sx={{
                            position: 'relative',
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: index === 0 ? '3px solid' : '2px solid',
                            borderColor: index === 0 ? 'primary.main' : 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: 8,
                            }
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={preview}
                            alt={`Producto ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          {index === 0 && (
                            <Chip
                              label="Principal"
                              size="small"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                fontWeight: 700,
                                boxShadow: 2,
                              }}
                            />
                          )}
                          <Tooltip title="Eliminar imagen">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: 'error.main',
                                color: 'white',
                                boxShadow: 2,
                                '&:hover': {
                                  bgcolor: 'error.dark',
                                  transform: 'scale(1.1)',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'rgba(0,0,0,0.75)',
                              backdropFilter: 'blur(4px)',
                              color: 'white',
                              py: 1,
                              px: 1.5,
                            }}
                          >
                            <Typography variant="caption" fontWeight={700}>
                              Imagen {index + 1} de {imagePreviews.length}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <InfoBox severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      La primera imagen será la <strong>imagen principal</strong> que se mostrará en los listados de productos.
                      Arrastra las imágenes para reordenarlas (próximamente).
                    </Typography>
                  </InfoBox>
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    mt: 2,
                    textAlign: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                    No hay imágenes cargadas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Las imágenes de alta calidad ayudan a vender más.<br/>
                    Agrega al menos una imagen de tu producto.
                  </Typography>
                </Paper>
              )}
            </FormSection>
          </Stack>
        )}

        {/* TAB 5: PUBLICACIÓN */}
        {tabIndex === 5 && (
          <Stack spacing={4}>
            <FormSection
              title="Estados de Publicación"
              subtitle="Controla cómo y cuándo se mostrará tu producto"
              icon={<Visibility />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ToggleCard
                    checked={activo}
                    onChange={handleSwitchChange('activo')}
                    title="Producto Activo"
                    subtitle="Disponible en el sistema para gestión"
                    icon="🟢"
                    color="primary"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ToggleCard
                    checked={publicado}
                    onChange={handleSwitchChange('publicado')}
                    title="Publicado en Tienda"
                    subtitle="Visible para los clientes en la web"
                    icon="🌐"
                    color="success"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ToggleCard
                    checked={destacado}
                    onChange={handleSwitchChange('destacado')}
                    title="Producto Destacado"
                    subtitle="Aparece en secciones especiales y slider principal"
                    icon="⭐"
                    color="warning"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <ToggleCard
                    checked={esNuevo}
                    onChange={handleSwitchChange('esNuevo')}
                    title="Producto Nuevo"
                    subtitle="Muestra la etiqueta 'Nuevo' en el producto"
                    icon="🆕"
                    color="info"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Programación de Fechas"
              subtitle="Programa cuándo mostrar el producto (opcional)"
              icon={<Info />}
              noDivider
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Fecha de Publicación"
                    type="datetime-local"
                    value={fechaPublicacion || ''}
                    onChange={handleChange('fechaPublicacion')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Programa cuándo se publicará automáticamente"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Etiqueta 'Nuevo' Hasta"
                    type="datetime-local"
                    value={fechaNuevoHasta || ''}
                    onChange={handleChange('fechaNuevoHasta')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Cuándo se dejará de mostrar como 'Nuevo'"
                    disabled={!esNuevo}
                    bgcolor={esNuevo ? 'white' : 'grey.100'}
                  />
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        )}

      </DialogContent>

      {/* ============================================================ */}
      {/* FOOTER / ACCIONES */}
      {/* ============================================================ */}
      <DialogActions
        sx={{
          px: 4,
          py: 3,
          gap: 2,
          borderTop: '2px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Button
          onClick={handleClose}
          size="large"
          variant="outlined"
          sx={{
            minWidth: 140,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          Cancelar
        </Button>

        <Tooltip title={!isFormValid ? "Completa el nombre y la categoría" : ""}>
          <span>
            <Button
              variant="contained"
              onClick={handleSave}
              size="large"
              disabled={!isFormValid}
              sx={{
                minWidth: 200,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isEditing ? '💾 Guardar Cambios' : '✨ Crear Producto'}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

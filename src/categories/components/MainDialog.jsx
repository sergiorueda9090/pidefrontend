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
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Delete,
  Smartphone,
  Computer,
  Headphones,
  Watch,
  Camera,
  Print,
  Restaurant,
  LocalCafe,
  ShoppingBag,
  DirectionsCar,
  Home,
  Toys,
  Book,
  SportsEsports,
  Checkroom,
  LocalFlorist,
  Pets,
  FitnessCenter,
  ChildCare,
  MusicNote,
  Brush,
  Build,
  Category,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/categoryStore/categoryThunks';
import { resetFormStore } from '../../store/categoryStore/categoryStore';
import { closeModalShared } from '../../store/globalStore/globalStore';

// Array de iconos disponibles
const AVAILABLE_ICONS = [
  { name: 'Smartphone', component: Smartphone, label: 'Smartphone' },
  { name: 'Computer', component: Computer, label: 'Computadora' },
  { name: 'Headphones', component: Headphones, label: 'Audífonos' },
  { name: 'Watch', component: Watch, label: 'Reloj' },
  { name: 'Camera', component: Camera, label: 'Cámara' },
  { name: 'Print', component: Print, label: 'Impresora' },
  { name: 'Restaurant', component: Restaurant, label: 'Restaurante' },
  { name: 'LocalCafe', component: LocalCafe, label: 'Café' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Compras' },
  { name: 'DirectionsCar', component: DirectionsCar, label: 'Auto' },
  { name: 'Home', component: Home, label: 'Hogar' },
  { name: 'Toys', component: Toys, label: 'Juguetes' },
  { name: 'Book', component: Book, label: 'Libros' },
  { name: 'SportsEsports', component: SportsEsports, label: 'Videojuegos' },
  { name: 'Checkroom', component: Checkroom, label: 'Ropa' },
  { name: 'LocalFlorist', component: LocalFlorist, label: 'Flores' },
  { name: 'Pets', component: Pets, label: 'Mascotas' },
  { name: 'FitnessCenter', component: FitnessCenter, label: 'Fitness' },
  { name: 'ChildCare', component: ChildCare, label: 'Bebés' },
  { name: 'MusicNote', component: MusicNote, label: 'Música' },
  { name: 'Brush', component: Brush, label: 'Arte' },
  { name: 'Build', component: Build, label: 'Herramientas' },
  { name: 'Category', component: Category, label: 'General' },
];

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { id, name, slug, description, icon, seoTitle, seoDescription, seoKeywords, image, is_active } = useSelector(state => state.categoryStore);

  const isEditing = !!id;

  // Estado local para preview de imagen
  const [imagePreview, setImagePreview] = useState(null);

  // Estado local para keywords como array
  const [keywordsArray, setKeywordsArray] = useState([]);

  // Efecto para generar el slug automáticamente desde el nombre
  useEffect(() => {
    if (name && !isEditing) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
        .trim()
        .replace(/\s+/g, '-') // Reemplazar espacios por guiones
        .replace(/-+/g, '-'); // Eliminar guiones duplicados

      dispatch(handleFormStoreThunk({ name: 'slug', value: generatedSlug }));
    }
  }, [name, isEditing, dispatch]);

  // Efecto para parsear keywords al abrir el modal
  useEffect(() => {
    if (seoKeywords) {
      const keywords = seoKeywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      setKeywordsArray(keywords);
    } else {
      setKeywordsArray([]);
    }
  }, [seoKeywords, open]);

  // Efecto para manejar preview de imagen
  useEffect(() => {
    if (image) {
      if (typeof image === 'string') {
        // Es una URL de imagen existente
        setImagePreview(image);
      } else if (image instanceof File) {
        // Es un archivo nuevo
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(image);
      }
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSwitchChange = (field) => (event) => {
    const value = event.target.checked;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSave = () => {
    // Verificar si hay una imagen nueva (archivo) para decidir el formato de envío
    const hasNewImage = image && typeof image !== 'string';

    if (hasNewImage) {
      // Si hay imagen, usar FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('icon', icon);
      formData.append('seoTitle', seoTitle);
      formData.append('seoDescription', seoDescription);
      formData.append('seoKeywords', seoKeywords);
      formData.append('is_active', is_active ? 1 : 0);
      formData.append('image', image);

      if (isEditing) {
        dispatch(updateThunks(id, formData));
      } else {
        dispatch(createThunks(formData));
      }
    } else {
      // Sin imagen nueva, usar JSON
      const jsonData = {
        name,
        slug,
        description,
        icon,
        seoTitle,
        seoDescription,
        seoKeywords,
        is_active,
      };

      if (isEditing) {
        dispatch(updateThunks(id, jsonData));
      } else {
        dispatch(createThunks(jsonData));
      }
    }
  };

  // Manejar selección de icono
  const handleIconSelect = (iconName) => {
    dispatch(handleFormStoreThunk({ name: 'icon', value: iconName }));
  };

  const handleClose = () => {
    dispatch(resetFormStore());
    dispatch(closeModalShared());
    if (onClose) onClose();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(handleFormStoreThunk({ name: 'image', value: file }));
    }
  };

  const handleRemoveImage = () => {
    dispatch(handleFormStoreThunk({ name: 'image', value: null }));
    setImagePreview(null);
  };

  // Manejar cambio en keywords con detección de coma
  const handleKeywordsChange = (event) => {
    const value = event.target.value;

    // Si se presionó coma, agregar la keyword
    if (value.endsWith(',')) {
      const newKeyword = value.slice(0, -1).trim();
      if (newKeyword && !keywordsArray.includes(newKeyword)) {
        const updatedKeywords = [...keywordsArray, newKeyword];
        setKeywordsArray(updatedKeywords);
        // Actualizar Redux con el array completo
        dispatch(handleFormStoreThunk({
          name: 'seoKeywords',
          value: updatedKeywords.join(', ')
        }));
      }
    }
    // No actualizamos Redux mientras se escribe, solo cuando se agrega con coma o Enter
  };

  // Eliminar una keyword
  const handleDeleteKeyword = (keywordToDelete) => {
    const updatedKeywords = keywordsArray.filter(k => k !== keywordToDelete);
    setKeywordsArray(updatedKeywords);
    // Actualizar Redux
    dispatch(handleFormStoreThunk({
      name: 'seoKeywords',
      value: updatedKeywords.join(', ')
    }));
  };

  // Manejar Enter para agregar keyword
  const handleKeywordsKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = event.target.value;
      const newKeyword = value.trim();
      if (newKeyword && !keywordsArray.includes(newKeyword)) {
        const updatedKeywords = [...keywordsArray, newKeyword];
        setKeywordsArray(updatedKeywords);
        // Actualizar Redux con el array completo
        dispatch(handleFormStoreThunk({
          name: 'seoKeywords',
          value: updatedKeywords.join(', ')
        }));
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Información Básica */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Información Básica
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                size='medium'
                fullWidth
                label="Nombre de la Categoría"
                value={name}
                onChange={handleChange('name')}
                required
                helperText="Ej: Electrónica, Software, Ropa y Accesorios"
              />

              <TextField
                size='medium'
                fullWidth
                label="Slug (URL amigable)"
                value={slug}
                onChange={handleChange('slug')}
                required
                helperText="Se genera automáticamente desde el nombre"
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    fontFamily: 'monospace',
                    color: 'primary.main',
                    backgroundColor: isEditing ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                  }
                }}
              />

              <TextField
                size='medium'
                fullWidth
                label="Descripción"
                value={description}
                onChange={handleChange('description')}
                multiline
                rows={3}
                helperText="Descripción breve de la categoría para los clientes"
              />

              {/* Selector de Iconos */}
              <Box>
                <Typography variant="body2" fontWeight={600} mb={1.5} color="text.primary">
                  Icono de la Categoría
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                    gap: 1.5,
                    p: 2,
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'rgba(102, 126, 234, 0.2)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {AVAILABLE_ICONS.map((iconItem) => {
                    const IconComponent = iconItem.component;
                    const isSelected = icon === iconItem.name;
                    return (
                      <Box
                        key={iconItem.name}
                        onClick={() => handleIconSelect(iconItem.name)}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'transparent',
                          backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.1)' : 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(102, 126, 234, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                          }
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 28,
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            transition: 'color 0.2s ease',
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            fontSize: '0.65rem',
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            textAlign: 'center',
                            lineHeight: 1.2,
                          }}
                        >
                          {iconItem.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                {icon && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Icono seleccionado: <strong>{AVAILABLE_ICONS.find(i => i.name === icon)?.label || icon}</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* SEO */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              SEO (Optimización para Motores de Búsqueda)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                size='medium'
                fullWidth
                label="Título SEO"
                value={seoTitle}
                onChange={handleChange('seoTitle')}
                helperText={`Título optimizado para buscadores (${seoTitle.length}/60 caracteres)`}
                inputProps={{ maxLength: 60 }}
              />

              <TextField
                size='medium'
                fullWidth
                label="Descripción SEO"
                value={seoDescription}
                onChange={handleChange('seoDescription')}
                multiline
                rows={2}
                helperText={`Descripción meta para resultados de búsqueda (${seoDescription.length}/160 caracteres)`}
                inputProps={{ maxLength: 160 }}
              />

              {/* Keywords con chips */}
              <Box>
                <TextField
                  size='medium'
                  fullWidth
                  label="Palabras Clave (Keywords)"
                  defaultValue=""
                  key={keywordsArray.length}
                  onKeyUp={handleKeywordsChange}
                  onKeyPress={handleKeywordsKeyPress}
                  helperText="Escribe una palabra y presiona coma (,) o Enter para agregarla"
                  placeholder={keywordsArray.length === 0 ? "Ej: electrónica, tecnología, gadgets" : "Agregar más keywords..."}
                />

                {/* Mostrar chips de keywords */}
                {keywordsArray.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 2,
                      p: 2,
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'primary.main',
                    }}
                  >
                    {keywordsArray.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => handleDeleteKeyword(keyword)}
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: 'primary.main',
                            '&:hover': {
                              color: 'error.main',
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Imagen */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Imagen de la Categoría
            </Typography>

            {imagePreview ? (
              <Card
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: 'flex',
                    gap: 1,
                    p: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderBottomLeftRadius: 8,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <Button
                    component="label"
                    size="small"
                    variant="contained"
                    startIcon={<CloudUpload />}
                    sx={{
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Cambiar
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>
                {image && typeof image !== 'string' && (
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      borderTop: '1px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      📎 {image.name}
                    </Typography>
                  </Box>
                )}
              </Card>
            ) : (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  height: 120,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  }
                }}
              >
                <Box textAlign="center">
                  <Typography variant="body2" fontWeight={600}>
                    Seleccionar Imagen
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG o GIF (máx. 5MB)
                  </Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            )}
          </Box>

          {/* Estado */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={is_active}
                  onChange={handleSwitchChange('is_active')}
                  color="primary"
                />
              }
              label="Categoría Activa"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          className="action-button"
          disabled={!name.trim()}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

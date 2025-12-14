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
  IconButton,
  Card,
  CardMedia,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Store,
  Language,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/brandStore/brandThunks';
import { resetFormStore } from '../../store/brandStore/brandStore';
import { closeModalShared } from '../../store/globalStore/globalStore';

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const {
    id,
    name,
    slug,
    description,
    logo,
    website,
    is_active,
    is_featured
  } = useSelector(state => state.brandStore);

  const isEditing = !!id;

  // Estado local para preview del logo
  const [logoPreview, setLogoPreview] = useState(null);

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

  // Efecto para manejar preview del logo
  useEffect(() => {
    if (logo) {
      if (typeof logo === 'string') {
        // Es una URL de logo existente
        setLogoPreview(logo);
      } else if (logo instanceof File) {
        // Es un archivo nuevo
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(logo);
      }
    } else {
      setLogoPreview(null);
    }
  }, [logo]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSwitchChange = (field) => (event) => {
    const value = event.target.checked;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSave = () => {
    // Verificar si hay un logo nuevo (archivo) para decidir el formato de envío
    const hasNewLogo = logo && typeof logo !== 'string';

    if (isEditing) {
      // Modo edición
      if (hasNewLogo) {
        // Usar FormData si hay logo nuevo
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('website', website);
        formData.append('is_active', is_active ? 1 : 0);
        formData.append('is_featured', is_featured ? 1 : 0);
        formData.append('logo', logo);

        dispatch(updateThunks(id, formData));
      } else {
        // Usar JSON si no hay logo nuevo
        const jsonData = {
          name,
          slug,
          description,
          website,
          is_active,
          is_featured,
        };

        dispatch(updateThunks(id, jsonData));
      }
    } else {
      // Modo creación
      if (hasNewLogo) {
        // Usar FormData si hay logo
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('website', website);
        formData.append('is_active', is_active ? 1 : 0);
        formData.append('is_featured', is_featured ? 1 : 0);
        formData.append('logo', logo);

        dispatch(createThunks(formData));
      } else {
        // Usar JSON si no hay logo
        const jsonData = {
          name,
          slug,
          description,
          website,
          is_active,
          is_featured,
        };

        dispatch(createThunks(jsonData));
      }
    }
  };

  const handleClose = () => {
    dispatch(resetFormStore());
    dispatch(closeModalShared());
    if (onClose) onClose();
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(handleFormStoreThunk({ name: 'logo', value: file }));
    }
  };

  const handleRemoveLogo = () => {
    dispatch(handleFormStoreThunk({ name: 'logo', value: null }));
    setLogoPreview(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Store sx={{ color: 'primary.main' }} />
        {isEditing ? 'Editar Marca' : 'Nueva Marca'}
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
                label="Nombre de la Marca"
                value={name}
                onChange={handleChange('name')}
                required
                helperText="Ej: Nike, Apple, Samsung, Coca-Cola"
                InputProps={{
                  startAdornment: <Store sx={{ mr: 1, color: 'text.secondary' }} />
                }}
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
                helperText="Descripción breve de la marca"
              />

              <TextField
                size='medium'
                fullWidth
                label="Sitio Web"
                value={website}
                onChange={handleChange('website')}
                type="url"
                helperText="URL del sitio web oficial (Ej: https://www.marca.com)"
                placeholder="https://www.ejemplo.com"
                InputProps={{
                  startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Logo */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Logo de la Marca
            </Typography>

            {logoPreview ? (
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
                  image={logoPreview}
                  alt="Logo Preview"
                  sx={{
                    objectFit: 'contain',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    p: 2
                  }}
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
                    onClick={handleRemoveLogo}
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
                      onChange={handleLogoChange}
                    />
                  </Button>
                </Box>
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
                    Seleccionar Logo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG o SVG (preferible con fondo transparente)
                  </Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
            )}
          </Box>

          <Divider />

          {/* Estado */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Opciones de Visualización
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={is_active}
                    onChange={handleSwitchChange('is_active')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Marca Activa
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      La marca aparecerá visible en el catálogo
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={is_featured}
                    onChange={handleSwitchChange('is_featured')}
                    color="warning"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Marca Destacada
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      La marca se mostrará en la sección destacada de la página principal
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          className="action-button"
          disabled={!name.trim()}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Marca'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

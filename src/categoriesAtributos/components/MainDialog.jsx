import React, { useEffect } from 'react';
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
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import {
  Category,
  Label,
  SwapVert,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/categoriesAtributostore/categoriesAtributoThunks';
import { getAllThunks as getCategoriesThunks } from '../../store/categoryStore/categoryThunks';
import { getAllThunks as getAttributesThunks } from '../../store/attributeStore/attributeThunks';
import { resetFormStore } from '../../store/categoriesAtributostore/categoriesAtributostore';
import { closeModalShared } from '../../store/globalStore/globalStore';

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Obtener datos del formulario desde categoriesAtributoStore
  const {
    id,
    categoriaId,
    atributoId,
    obligatorio,
    orden
  } = useSelector(state => state.categoriesAtributoStore);

  // Obtener listas de categorías y atributos disponibles
  const { categories } = useSelector(state => state.categoryStore);
  const { attributes } = useSelector(state => state.attributeStore);

  const isEditing = !!id;

  // Cargar categorías y atributos al abrir el modal
  useEffect(() => {
    if (open) {
      dispatch(getCategoriesThunks({ page: 1, page_size: 1000 }));
      dispatch(getAttributesThunks({ page: 1, page_size: 1000 }));
    }
  }, [open, dispatch]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleCheckboxChange = (field) => (event) => {
    const value = event.target.checked;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSave = () => {
    const jsonData = {
      categoriaId: categoriaId,
      atributoId: atributoId,
      obligatorio: obligatorio !== undefined ? obligatorio : false,
      orden: parseInt(orden, 10) || 0,
    };

    if (isEditing) {
      dispatch(updateThunks(id, jsonData));
    } else {
      dispatch(createThunks(jsonData));
    }
  };

  const handleClose = () => {
    dispatch(resetFormStore());
    dispatch(closeModalShared());
    if (onClose) onClose();
  };

  // Obtener nombres seleccionados para mostrar info
  const selectedCategory = categories?.find(cat => cat.id === categoriaId);
  const selectedAttribute = attributes?.find(attr => attr.id === atributoId);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkIcon sx={{ color: 'primary.main' }} />
        {isEditing ? 'Editar Relación Categoría-Atributo' : 'Nueva Relación Categoría-Atributo'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Selección de Categoría */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Categoría
            </Typography>

            <FormControl fullWidth required>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoriaId || ''}
                onChange={handleChange('categoriaId')}
                label="Categoría"
                startAdornment={<Category sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="">
                  <em>Seleccionar categoría...</em>
                </MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Selecciona la categoría a la que se asociará el atributo
              </FormHelperText>
            </FormControl>
          </Box>

          <Divider />

          {/* Selección de Atributo */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Atributo
            </Typography>

            <FormControl fullWidth required>
              <InputLabel>Atributo</InputLabel>
              <Select
                value={atributoId || ''}
                onChange={handleChange('atributoId')}
                label="Atributo"
                startAdornment={<Label sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="">
                  <em>Seleccionar atributo...</em>
                </MenuItem>
                {attributes?.map((attr) => (
                  <MenuItem key={attr.id} value={attr.id}>
                    {attr.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Selecciona el atributo que estará disponible para esta categoría
              </FormHelperText>
            </FormControl>
          </Box>

          <Divider />

          {/* Configuración */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Configuración
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Checkbox Obligatorio */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={obligatorio || false}
                    onChange={handleCheckboxChange('obligatorio')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Atributo Obligatorio
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Si está marcado, este atributo será obligatorio para todos los productos de esta categoría
                    </Typography>
                  </Box>
                }
              />

              {/* Orden */}
              <TextField
                size='medium'
                fullWidth
                label="Orden de Visualización"
                value={orden || 0}
                onChange={handleChange('orden')}
                type="number"
                helperText="Menor número aparece primero (0 por defecto)"
                InputProps={{
                  inputProps: { min: 0, max: 999 },
                  startAdornment: <SwapVert sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          </Box>

          {/* Vista previa de la relación */}
          {selectedCategory && selectedAttribute && (
            <>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                  VISTA PREVIA DE LA RELACIÓN
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedCategory.name} → {selectedAttribute.name}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {obligatorio && (
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: 'error.light',
                        color: 'error.contrastText',
                        borderRadius: 1,
                        fontWeight: 600,
                      }}
                    >
                      OBLIGATORIO
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 1,
                    }}
                  >
                    Orden: {orden || 0}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
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
          disabled={!categoriaId || !atributoId}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Relación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

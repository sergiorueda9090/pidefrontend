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
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Label,
  Category,
  Palette,
  SwapVert,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/attributeValueStore/attributeValueThunks';
import { getAllThunks as getAttributesThunks } from '../../store/attributeStore/attributeThunks';
import { resetFormStore } from '../../store/attributeValueStore/attributeValueStore';
import { closeModalShared } from '../../store/globalStore/globalStore';

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Obtener datos del formulario desde attributeValueStore
  const {
    id,
    atributo_id,
    valor,
    valor_extra,
    orden,
    activo
  } = useSelector(state => state.attributeValueStore);

  // Obtener lista de atributos disponibles
  const { attributes } = useSelector(state => state.attributeStore);

  const isEditing = !!id;

  // Estado local para preview de color cuando valor_extra es un código de color
  const [isColorValue, setIsColorValue] = useState(false);

  // Cargar atributos al abrir el modal
  useEffect(() => {
    if (open) {
      dispatch(getAttributesThunks({ page: 1, page_size: 1000 }));
    }
  }, [open, dispatch]);

  // Detectar si valor_extra es un código de color hexadecimal
  useEffect(() => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    setIsColorValue(hexColorRegex.test(valor_extra || ''));
  }, [valor_extra]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSwitchChange = (field) => (event) => {
    const value = event.target.checked;
    dispatch(handleFormStoreThunk({ name: field, value }));
  };

  const handleSave = () => {
    const jsonData = {
      atributo_id,
      valor,
      valor_extra: valor_extra || null,
      orden: parseInt(orden, 10) || 0,
      activo: activo !== undefined ? activo : true,
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

  // Obtener el nombre del atributo seleccionado
  const selectedAttribute = attributes?.find(attr => attr.id === atributo_id);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Label sx={{ color: 'primary.main' }} />
        {isEditing ? 'Editar Valor de Atributo' : 'Nuevo Valor de Atributo'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Selección de Atributo Padre */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Atributo Padre
            </Typography>

            <FormControl fullWidth required>
              <InputLabel>Atributo</InputLabel>
              <Select
                value={atributo_id || ''}
                onChange={handleChange('atributo_id')}
                label="Atributo"
                startAdornment={<Category sx={{ mr: 1, color: 'text.secondary' }} />}
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
              <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                Selecciona el atributo al que pertenece este valor
              </Typography>
            </FormControl>
          </Box>

          <Divider />

          {/* Información del Valor */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Información del Valor
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                size='medium'
                fullWidth
                label="Valor"
                value={valor || ''}
                onChange={handleChange('valor')}
                required
                helperText="Ej: Rojo, XL, 128GB, Algodón"
                inputProps={{ maxLength: 100 }}
                InputProps={{
                  startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <Box>
                <TextField
                  size='medium'
                  fullWidth
                  label="Valor Extra (Opcional)"
                  value={valor_extra || ''}
                  onChange={handleChange('valor_extra')}
                  helperText={
                    selectedAttribute?.name?.toLowerCase().includes('color')
                      ? "Código de color hexadecimal. Ej: #FF0000, #0000FF"
                      : "Información adicional del valor (opcional)"
                  }
                  inputProps={{ maxLength: 100 }}
                  InputProps={{
                    startAdornment: <Palette sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                {/* Preview de color si valor_extra es un código hexadecimal */}
                {isColorValue && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="Vista Previa"
                      icon={
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: valor_extra,
                            border: '2px solid',
                            borderColor: 'divider',
                            ml: 1,
                          }}
                        />
                      }
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                )}
              </Box>

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

          <Divider />

          {/* Estado */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Estado
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={activo !== undefined ? activo : true}
                  onChange={handleSwitchChange('activo')}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Valor Activo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Los valores inactivos no se mostrarán en los formularios de productos
                  </Typography>
                </Box>
              }
            />
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
          disabled={!valor?.trim() || !atributo_id}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Valor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

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
} from '@mui/material';
import {
  Tune,
  TextFields,
  Functions,
  SwapVert,
  FilterList,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { handleFormStoreThunk, createThunks, updateThunks } from '../../store/attributeStore/attributeThunks';
import { resetFormStore } from '../../store/attributeStore/attributeStore';
import { closeModalShared } from '../../store/globalStore/globalStore';

const MainDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const {
    id,
    name,
    slug,
    tipo_input,
    tipo_dato,
    es_variable,
    es_filtrable,
    orden,
    descripcion
  } = useSelector(state => state.attributeStore);

  const isEditing = !!id;

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
      name,
      slug,
      tipo_input,
      tipo_dato,
      es_variable,
      es_filtrable,
      orden: parseInt(orden, 10) || 0,
      descripcion,
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tune sx={{ color: 'primary.main' }} />
        {isEditing ? 'Editar Atributo' : 'Nuevo Atributo'}
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
                label="Nombre del Atributo"
                value={name}
                onChange={handleChange('name')}
                required
                helperText="Ej: Color, Talla, Capacidad, Material"
                InputProps={{
                  startAdornment: <TextFields sx={{ mr: 1, color: 'text.secondary' }} />
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
                value={descripcion}
                onChange={handleChange('descripcion')}
                multiline
                rows={3}
                helperText="Descripción opcional del atributo"
              />
            </Box>
          </Box>

          <Divider />

          {/* Configuración del Tipo */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Configuración del Tipo
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size='medium'>
                <InputLabel>Tipo de Input</InputLabel>
                <Select
                  value={tipo_input}
                  onChange={handleChange('tipo_input')}
                  label="Tipo de Input"
                >
                  <MenuItem value="text">Texto</MenuItem>
                  <MenuItem value="number">Número</MenuItem>
                  <MenuItem value="select">Selección</MenuItem>
                  <MenuItem value="color">Color</MenuItem>
                  <MenuItem value="checkbox">Casilla de verificación</MenuItem>
                  <MenuItem value="radio">Opción única</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                  Define cómo se mostrará el atributo en el formulario
                </Typography>
              </FormControl>

              <FormControl fullWidth size='medium'>
                <InputLabel>Tipo de Dato</InputLabel>
                <Select
                  value={tipo_dato}
                  onChange={handleChange('tipo_dato')}
                  label="Tipo de Dato"
                  startAdornment={<Functions sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  <MenuItem value="string">Texto (String)</MenuItem>
                  <MenuItem value="integer">Entero (Integer)</MenuItem>
                  <MenuItem value="float">Decimal (Float)</MenuItem>
                  <MenuItem value="boolean">Booleano (Boolean)</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
                  Tipo de dato que almacenará el atributo
                </Typography>
              </FormControl>

              <TextField
                size='medium'
                fullWidth
                label="Orden de Visualización"
                value={orden}
                onChange={handleChange('orden')}
                type="number"
                helperText="Menor número = mayor prioridad (0 por defecto)"
                InputProps={{
                  inputProps: { min: 0, max: 999 }
                }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Opciones Avanzadas */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              Opciones Avanzadas
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={es_variable}
                    onChange={handleSwitchChange('es_variable')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SwapVert sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Es Variable
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Este atributo afecta precio y/o stock de los productos
                      </Typography>
                    </Box>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={es_filtrable}
                    onChange={handleSwitchChange('es_filtrable')}
                    color="warning"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Es Filtrable
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Aparece en los filtros de búsqueda del catálogo
                      </Typography>
                    </Box>
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
          {isEditing ? 'Guardar Cambios' : 'Crear Atributo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MainDialog;

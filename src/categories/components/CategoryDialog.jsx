import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';

const CategoryDialog = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSave, 
  isEditing
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                fullWidth
                label="Nombre de la Categoría"
                value={formData.name}
                onChange={onChange('name')}
                required
                helperText="Ej: Electrónica, Software, Ropa y Accesorios"
              />

              <TextField
                fullWidth
                label="Slug (URL amigable)"
                value={formData.slug}
                onChange={onChange('slug')}
                required
                helperText="Se genera automáticamente. Ej: electronica, software, ropa-accesorios"
              />

              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={onChange('description')}
                multiline
                rows={3}
                helperText="Descripción breve de la categoría para los clientes"
              />
            </Box>
          </Box>

          {/* SEO */}
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight={600} mb={2}>
              SEO (Optimización para Motores de Búsqueda)
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Título SEO"
                value={formData.seoTitle}
                onChange={onChange('seoTitle')}
                helperText="Título optimizado para buscadores (50-60 caracteres)"
                inputProps={{ maxLength: 60 }}
              />

              <TextField
                fullWidth
                label="Descripción SEO"
                value={formData.seoDescription}
                onChange={onChange('seoDescription')}
                multiline
                rows={2}
                helperText="Descripción meta para resultados de búsqueda (150-160 caracteres)"
                inputProps={{ maxLength: 160 }}
              />

              <TextField
                fullWidth
                label="Palabras Clave (Keywords)"
                value={formData.seoKeywords}
                onChange={onChange('seoKeywords')}
                helperText="Separadas por comas. Ej: electrónica, tecnología, gadgets"
                placeholder="palabra1, palabra2, palabra3"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={onSave}
          className="action-button"
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
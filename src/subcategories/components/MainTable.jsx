import React, { useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
  Alert,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Image as ImageIcon,
  Category,
  Smartphone,
  Computer,
  Watch,
  Headphones,
  Tv,
  Camera,
  Laptop,
  PhoneAndroid,
  Tablet,
  Speaker,
  Videocam,
  Print,
  Mouse,
  Keyboard,
  Router,
  Memory,
  Storage,
  Usb,
  Power,
  Cable,
  Lightbulb,
  SportsEsports,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk, updateThunks } from '../../store/subcategoryStore/subcategoryThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import Pagination from './Pagination';

// Mapeo de iconos disponibles
const ICON_MAP = {
  Smartphone,
  Computer,
  Watch,
  Headphones,
  Tv,
  Camera,
  Laptop,
  PhoneAndroid,
  Tablet,
  Speaker,
  Videocam,
  Print,
  Mouse,
  Keyboard,
  Router,
  Memory,
  Storage,
  Usb,
  Power,
  Cable,
  Lightbulb,
  SportsEsports,
  Category,
};

const MainTable = () => {
  const dispatch = useDispatch();
  const { subcategories, error } = useSelector(state => state.subcategoryStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (subcategory) => {
    const newActiveState = !subcategory.is_active;

    dispatch(showAlert({
      type: "warning",
      title: subcategory.is_active ? "⚠️ Desactivar Subcategoría" : "✅ Activar Subcategoría",
      text: subcategory.is_active
        ? `¿Está seguro que desea desactivar la subcategoría "${subcategory.name}"? No será visible en el catálogo.`
        : `¿Está seguro que desea activar la subcategoría "${subcategory.name}"? Será visible en el catálogo inmediatamente.`,
      confirmText: subcategory.is_active ? "Sí, desactivar" : "Sí, activar",
      cancelText: "Cancelar",
      action: () => {
        // Enviar solo el campo is_active como JSON (más eficiente)
        const jsonData = { is_active: newActiveState };
        dispatch(updateThunks(subcategory.id, jsonData));
      }
    }));
  };

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (subcategory) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar la subcategoría "${subcategory.name}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar subcategoría",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(subcategory.id));
      }
    }));
  };

  // Mostrar error
  if (error) {
    return (
      <Paper className="page-paper">
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  // Validar si subcategories es un array
  if (!Array.isArray(subcategories)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de subcategorías no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay subcategorías
  if (subcategories.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="text.secondary">
            No hay subcategorías registradas
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Función para obtener el icono
  const getIconComponent = (iconName) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent fontSize="small" /> : <Category fontSize="small" />;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Paper className="page-paper">
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60 }}><strong>ID</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Categoría Padre</strong></TableCell>
                <TableCell sx={{ minWidth: 100 }}><strong>Imagen</strong></TableCell>
                <TableCell sx={{ minWidth: 80 }}><strong>Icono</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Nombre</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>Slug</strong></TableCell>
                <TableCell sx={{ minWidth: 250 }}><strong>Descripción</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>SEO Title</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>SEO Description</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>SEO Keywords</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 80 }}><strong>Orden</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}><strong>Estado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}><strong>Productos</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Creado</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Actualizado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 150 }}><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subcategories.map((subcategory) => (
                <TableRow
                  key={subcategory.id}
                  className="table-row"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    opacity: subcategory.isDeleted ? 0.6 : 1
                  }}
                >
                  {/* ID */}
                  <TableCell>
                    <Chip
                      label={subcategory.id}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Categoría Padre */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }}
                      >
                        <Category fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {subcategory.categoryName || 'Sin categoría'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {subcategory.category_id || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Imagen */}
                  <TableCell>
                    {subcategory.image ? (
                      <Avatar
                        src={`http://127.0.0.1:8000${subcategory.image}`}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        <ImageIcon />
                      </Avatar>
                    ) : (
                      <Avatar variant="rounded" sx={{ width: 60, height: 60, bgcolor: 'action.disabledBackground' }}>
                        <ImageIcon />
                      </Avatar>
                    )}
                  </TableCell>

                  {/* Icono */}
                  <TableCell>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'secondary.light',
                        color: 'secondary.main'
                      }}
                    >
                      {subcategory.icon ? getIconComponent(subcategory.icon) : <Category fontSize="small" />}
                    </Box>
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {subcategory.name}
                    </Typography>
                  </TableCell>

                  {/* Slug */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                    >
                      {subcategory.slug}
                    </Typography>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    <Tooltip title={subcategory.description || 'Sin descripción'}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 250,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {subcategory.description || 'Sin descripción'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* SEO Title */}
                  <TableCell>
                    <Tooltip title={subcategory.seoTitle || 'Sin SEO Title'}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {subcategory.seoTitle || '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* SEO Description */}
                  <TableCell>
                    <Tooltip title={subcategory.seoDescription || 'Sin SEO Description'}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {subcategory.seoDescription || '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* SEO Keywords */}
                  <TableCell>
                    {subcategory.seoKeywords ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {subcategory.seoKeywords.split(',').slice(0, 2).map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword.trim()}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                        {subcategory.seoKeywords.split(',').length > 2 && (
                          <Tooltip title={subcategory.seoKeywords}>
                            <Chip
                              label={`+${subcategory.seoKeywords.split(',').length - 2}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.disabled">-</Typography>
                    )}
                  </TableCell>

                  {/* Orden */}
                  <TableCell align="center">
                    <Chip
                      label={subcategory.order || 0}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  {/* Estado */}
                  <TableCell align="center">
                    <Chip
                      label={subcategory.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      color={subcategory.is_active ? 'success' : 'default'}
                      icon={subcategory.is_active ? <Visibility /> : <VisibilityOff />}
                    />
                  </TableCell>

                  {/* Productos Count */}
                  <TableCell align="center">
                    <Chip
                      label={subcategory.productsCount || 0}
                      size="small"
                      color={subcategory.productsCount > 0 ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(subcategory.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(subcategory.updated_at)}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowRecord(subcategory.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={subcategory.is_active ? 'Desactivar' : 'Activar'}>
                        <IconButton
                          size="small"
                          color={subcategory.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleActive(subcategory)}
                        >
                          {subcategory.is_active ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(subcategory)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Paginación */}
      <Pagination />
    </>
  );
};

export default MainTable;

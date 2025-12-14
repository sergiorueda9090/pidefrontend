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
  Link,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Image as ImageIcon,
  Language,
  Star,
  StarBorder,
  Store,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk, updateThunks } from '../../store/brandStore/brandThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { brands, error } = useSelector(state => state.brandStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleToggleActive = (brand) => {
    const newActiveState = !brand.is_active;

    dispatch(showAlert({
      type: "warning",
      title: brand.is_active ? "⚠️ Desactivar Marca" : "✅ Activar Marca",
      text: brand.is_active
        ? `¿Está seguro que desea desactivar la marca "${brand.name}"? No será visible en el catálogo.`
        : `¿Está seguro que desea activar la marca "${brand.name}"? Será visible en el catálogo inmediatamente.`,
      confirmText: brand.is_active ? "Sí, desactivar" : "Sí, activar",
      cancelText: "Cancelar",
      action: () => {
        const jsonData = { is_active: newActiveState };
        dispatch(updateThunks(brand.id, jsonData));
      }
    }));
  };

  const handleToggleFeatured = (brand) => {
    const newFeaturedState = !brand.is_featured;

    dispatch(showAlert({
      type: "info",
      title: brand.is_featured ? "⭐ Quitar de Destacadas" : "⭐ Marcar como Destacada",
      text: brand.is_featured
        ? `¿Desea quitar la marca "${brand.name}" de la sección destacada?`
        : `¿Desea destacar la marca "${brand.name}" en la página principal?`,
      confirmText: brand.is_featured ? "Sí, quitar" : "Sí, destacar",
      cancelText: "Cancelar",
      action: () => {
        const jsonData = { is_featured: newFeaturedState };
        dispatch(updateThunks(brand.id, jsonData));
      }
    }));
  };

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (brand) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar la marca "${brand.name}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar marca",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(brand.id));
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

  // Validar si brands es un array
  if (!Array.isArray(brands)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de marcas no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay marcas
  if (brands.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400} gap={2}>
          <Store sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No hay marcas registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando tu primera marca al catálogo
          </Typography>
        </Box>
      </Paper>
    );
  }

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
                <TableCell sx={{ minWidth: 100 }}><strong>Logo</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Nombre</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>Slug</strong></TableCell>
                <TableCell sx={{ minWidth: 250 }}><strong>Descripción</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Sitio Web</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}><strong>Estado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}><strong>Destacada</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Creado</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Actualizado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 180 }}><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <TableRow
                  key={brand.id}
                  className="table-row"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {/* ID */}
                  <TableCell>
                    <Chip
                      label={brand.id}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Logo */}
                  <TableCell>
                    {brand.logo ? (
                      <Avatar
                        src={`http://127.0.0.1:8000${brand.logo}`}
                        variant="rounded"
                        sx={{
                          width: 70,
                          height: 70,
                          backgroundColor: 'white',
                          border: '1px solid',
                          borderColor: 'divider',
                          p: 0.5
                        }}
                      >
                        <Store />
                      </Avatar>
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: 'action.disabledBackground'
                        }}
                      >
                        <Store />
                      </Avatar>
                    )}
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Store sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {brand.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Slug */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                    >
                      {brand.slug}
                    </Typography>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    <Tooltip title={brand.description || 'Sin descripción'}>
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
                        {brand.description || 'Sin descripción'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Sitio Web */}
                  <TableCell>
                    {brand.website ? (
                      <Tooltip title={`Visitar ${brand.website}`}>
                        <Link
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            textDecoration: 'none',
                            color: 'primary.main',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          <Language fontSize="small" />
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {brand.website.replace(/^https?:\/\//, '')}
                          </Typography>
                        </Link>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        Sin sitio web
                      </Typography>
                    )}
                  </TableCell>

                  {/* Estado */}
                  <TableCell align="center">
                    <Chip
                      label={brand.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      color={brand.is_active ? 'success' : 'default'}
                      icon={brand.is_active ? <Visibility /> : <VisibilityOff />}
                    />
                  </TableCell>

                  {/* Destacada */}
                  <TableCell align="center">
                    <Chip
                      label={brand.is_featured ? 'Destacada' : 'Normal'}
                      size="small"
                      color={brand.is_featured ? 'warning' : 'default'}
                      icon={brand.is_featured ? <Star /> : <StarBorder />}
                      sx={{
                        fontWeight: brand.is_featured ? 600 : 400
                      }}
                    />
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(brand.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(brand.updated_at)}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowRecord(brand.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={brand.is_active ? 'Desactivar' : 'Activar'}>
                        <IconButton
                          size="small"
                          color={brand.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleActive(brand)}
                        >
                          {brand.is_active ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={brand.is_featured ? 'Quitar destacada' : 'Marcar destacada'}>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleToggleFeatured(brand)}
                        >
                          {brand.is_featured ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(brand)}
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

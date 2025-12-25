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
} from '@mui/material';
import {
  Edit,
  Delete,
  Category,
  Label,
  CheckCircle,
  Cancel,
  Link as LinkIcon,
  SwapVert,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk } from '../../store/categoriesAtributostore/categoriesAtributoThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { categoriaAtributos, error } = useSelector(state => state.categoriesAtributoStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (relacion) => {
    const categoriaNombre = relacion.categoriaNombre || 'esta categoría';
    const atributoNombre = relacion.atributoNombre || 'este atributo';

    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar la relación entre "${categoriaNombre}" y "${atributoNombre}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar relación",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(relacion.id));
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

  // Validar si categoriaAtributos es un array
  if (!Array.isArray(categoriaAtributos)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de relaciones categoría-atributo no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay relaciones
  if (categoriaAtributos.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400} gap={2}>
          <LinkIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No hay relaciones categoría-atributo registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza asociando atributos a tus categorías
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
                <TableCell sx={{ minWidth: 200 }}><strong>Categoría</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Atributo</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 140 }}><strong>Obligatorio</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}><strong>Orden</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Creado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 150 }}><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriaAtributos.map((relacion) => (
                <TableRow
                  key={relacion.id}
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
                      label={relacion.id}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Categoría */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Category sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {relacion.categoriaNombre || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Atributo */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Label sx={{ color: 'success.main', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {relacion.atributoNombre || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Obligatorio */}
                  <TableCell align="center">
                    {relacion.obligatorio ? (
                      <Chip
                        label="Obligatorio"
                        size="small"
                        color="error"
                        icon={<CheckCircle fontSize="small" />}
                        sx={{
                          minWidth: 120,
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Opcional"
                        size="small"
                        color="default"
                        icon={<Cancel fontSize="small" />}
                        sx={{
                          minWidth: 120,
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Orden */}
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      <SwapVert sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Chip
                        label={relacion.orden ?? 0}
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 700,
                          minWidth: 50,
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(relacion.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar relación">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowRecord(relacion.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar relación">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(relacion)}
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

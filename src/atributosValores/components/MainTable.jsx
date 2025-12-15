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
  Label,
  Category,
  CheckCircle,
  Cancel,
  Palette,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk } from '../../store/attributeValueStore/attributeValueThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { attributeValues, error } = useSelector(state => state.attributeValueStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (attributeValue) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el valor "${attributeValue.valor}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar valor",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(attributeValue.id));
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

  // Validar si attributeValues es un array
  if (!Array.isArray(attributeValues)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de valores de atributos no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay valores de atributos
  if (attributeValues.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400} gap={2}>
          <Label sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No hay valores de atributos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando valores para tus atributos (Rojo, XL, 128GB, etc.)
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

  // Verificar si es un color hexadecimal
  const isHexColor = (str) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
  };

  return (
    <>
      <Paper className="page-paper">
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60 }}><strong>ID</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Atributo</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Valor</strong></TableCell>
                <TableCell sx={{ minWidth: 250 }}><strong>Valor Extra</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 80 }}><strong>Orden</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}><strong>Estado</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Creado</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Actualizado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 150 }}><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributeValues.map((attributeValue) => (
                <TableRow
                  key={attributeValue.id}
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
                      label={attributeValue.id}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Atributo */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Category sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {attributeValue.atributoNombre || attributeValue.atributo_nombre || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Valor */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Label sx={{ color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {attributeValue.valor}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Valor Extra */}
                  <TableCell>
                    {attributeValue.valorExtra || attributeValue.valor_extra ? (
                      <Box display="flex" alignItems="center" gap={1.5}>
                        {isHexColor(attributeValue.valorExtra || attributeValue.valor_extra) ? (
                          <>
                            <Palette sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: attributeValue.valorExtra || attributeValue.valor_extra,
                                border: '2px solid',
                                borderColor: 'divider',
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                color: 'text.secondary',
                                fontWeight: 600,
                              }}
                            >
                              {attributeValue.valorExtra || attributeValue.valor_extra}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {attributeValue.valorExtra || attributeValue.valor_extra}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.disabled" fontStyle="italic">
                        Sin valor extra
                      </Typography>
                    )}
                  </TableCell>

                  {/* Orden */}
                  <TableCell align="center">
                    <Chip
                      label={attributeValue.orden ?? 0}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 700,
                        minWidth: 50,
                      }}
                    />
                  </TableCell>

                  {/* Estado Activo */}
                  <TableCell align="center">
                    {attributeValue.activo ? (
                      <Chip
                        label="Activo"
                        size="small"
                        color="success"
                        icon={<CheckCircle fontSize="small" />}
                        sx={{ minWidth: 100 }}
                      />
                    ) : (
                      <Chip
                        label="Inactivo"
                        size="small"
                        color="error"
                        icon={<Cancel fontSize="small" />}
                        sx={{ minWidth: 100 }}
                      />
                    )}
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(attributeValue.createdAt || attributeValue.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(attributeValue.updatedAt || attributeValue.updated_at)}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowRecord(attributeValue.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(attributeValue)}
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

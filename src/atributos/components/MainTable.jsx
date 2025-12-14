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
  Tune,
  SwapVert,
  FilterList,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getAllThunks, showThunk, deleteThunk } from '../../store/attributeStore/attributeThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import Pagination from './Pagination';

const MainTable = () => {
  const dispatch = useDispatch();
  const { attributes, error } = useSelector(state => state.attributeStore);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleShowRecord = (id = null) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (attribute) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Confirmación de Eliminación",
      text: `¿Está seguro que desea eliminar el atributo "${attribute.name}"? Esta acción es permanente y no se podrá deshacer.`,
      confirmText: "Sí, eliminar atributo",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(attribute.id));
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

  // Validar si attributes es un array
  if (!Array.isArray(attributes)) {
    return (
      <Paper className="page-paper">
        <Alert severity="warning">
          Los datos de atributos no tienen el formato correcto.
        </Alert>
      </Paper>
    );
  }

  // Validar si hay atributos
  if (attributes.length === 0) {
    return (
      <Paper className="page-paper">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={400} gap={2}>
          <Tune sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No hay atributos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando tu primer atributo (Color, Talla, etc.)
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

  // Obtener label de tipo de input
  const getTipoInputLabel = (tipo) => {
    const tipos = {
      text: '📝 Texto',
      number: '🔢 Número',
      select: '📋 Selección',
      color: '🎨 Color',
      checkbox: '☑️ Checkbox',
      radio: '🔘 Radio',
    };
    return tipos[tipo] || tipo;
  };

  // Obtener label de tipo de dato
  const getTipoDatoLabel = (tipo) => {
    const tipos = {
      string: 'String',
      integer: 'Integer',
      float: 'Float',
      boolean: 'Boolean',
    };
    return tipos[tipo] || tipo;
  };

  return (
    <>
      <Paper className="page-paper">
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60 }}><strong>ID</strong></TableCell>
                <TableCell sx={{ minWidth: 200 }}><strong>Nombre</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>Slug</strong></TableCell>
                <TableCell sx={{ minWidth: 150 }}><strong>Tipo Input</strong></TableCell>
                <TableCell sx={{ minWidth: 120 }}><strong>Tipo Dato</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}><strong>Variable</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}><strong>Filtrable</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 80 }}><strong>Orden</strong></TableCell>
                <TableCell sx={{ minWidth: 250 }}><strong>Descripción</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Creado</strong></TableCell>
                <TableCell sx={{ minWidth: 180 }}><strong>Actualizado</strong></TableCell>
                <TableCell align="center" sx={{ minWidth: 150 }}><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attribute) => (
                <TableRow
                  key={attribute.id}
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
                      label={attribute.id}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tune sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {attribute.name}
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
                      {attribute.slug}
                    </Typography>
                  </TableCell>

                  {/* Tipo Input */}
                  <TableCell>
                    <Chip
                      label={getTipoInputLabel(attribute.tipoInput || attribute.tipo_input)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Tipo Dato */}
                  <TableCell>
                    <Chip
                      label={getTipoDatoLabel(attribute.tipoDato || attribute.tipo_dato)}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        color: 'primary.main',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* Es Variable */}
                  <TableCell align="center">
                    {(attribute.esVariable ?? attribute.es_variable) ? (
                      <Chip
                        label="Sí"
                        size="small"
                        color="success"
                        icon={<SwapVert fontSize="small" />}
                        sx={{ minWidth: 80 }}
                      />
                    ) : (
                      <Chip
                        label="No"
                        size="small"
                        color="default"
                        icon={<Cancel fontSize="small" />}
                        sx={{ minWidth: 80 }}
                      />
                    )}
                  </TableCell>

                  {/* Es Filtrable */}
                  <TableCell align="center">
                    {(attribute.esFiltrable ?? attribute.es_filtrable) ? (
                      <Chip
                        label="Sí"
                        size="small"
                        color="warning"
                        icon={<FilterList fontSize="small" />}
                        sx={{ minWidth: 80 }}
                      />
                    ) : (
                      <Chip
                        label="No"
                        size="small"
                        color="default"
                        icon={<Cancel fontSize="small" />}
                        sx={{ minWidth: 80 }}
                      />
                    )}
                  </TableCell>

                  {/* Orden */}
                  <TableCell align="center">
                    <Chip
                      label={attribute.orden ?? 0}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontWeight: 700,
                        minWidth: 50,
                      }}
                    />
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    <Tooltip title={attribute.descripcion || 'Sin descripción'}>
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
                        {attribute.descripcion || 'Sin descripción'}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(attribute.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Updated At */}
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(attribute.updated_at)}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowRecord(attribute.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(attribute)}
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

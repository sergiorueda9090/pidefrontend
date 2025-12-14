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
  SmartToy,
  CheckCircle,
  Cancel,
  Build,
  Psychology,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import {
  getAllThunks,
  showThunk,
  deleteThunk,
} from '../store/agentStore/agentThunks';

import { showAlert } from '../store/globalStore/globalStore';
//import Pagination from './Pagination';

const AgentsTable = () => {
  const dispatch = useDispatch();
  const { agents, error } = useSelector(state => state.agentStore);

  useEffect(() => {
    //dispatch(getAllThunks());
  }, [dispatch]);

  const handleEdit = (id) => {
    //dispatch(showThunk(id));
  };

  const handleDelete = (agent) => {
    dispatch(showAlert({
      type: "warning",
      title: "⚠️ Eliminar Agente",
      text: `¿Desea eliminar el agente "${agent.name}"?`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      action: () => {
        dispatch(deleteThunk(agent.id));
      }
    }));
  };

  if (error) {
    return (
      <Paper className="page-paper">
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (!Array.isArray(agents) || agents.length === 0) {
    return (
      <Paper className="page-paper">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={400}
          gap={2}
        >
          <SmartToy sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No hay agentes creados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea tu primer agente inteligente
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper className="page-paper">
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Agente</strong></TableCell>
                <TableCell><strong>Proveedor</strong></TableCell>
                <TableCell><strong>Modelo</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Temp</strong></TableCell>
                <TableCell align="center"><strong>Tokens</strong></TableCell>
                <TableCell><strong>Herramientas</strong></TableCell>
                <TableCell><strong>Creado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {agents.map(agent => (
                <TableRow key={agent.id} hover>
                  {/* ID */}
                  <TableCell>
                    <Chip label={agent.id} size="small" variant="outlined" />
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SmartToy color="primary" />
                      <Box>
                        <Typography fontWeight={600}>{agent.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {agent.description || 'Sin descripción'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Proveedor */}
                  <TableCell>
                    <Chip
                      label={agent.provider}
                      size="small"
                      icon={<Psychology fontSize="small" />}
                    />
                  </TableCell>

                  {/* Modelo */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {agent.model}
                    </Typography>
                  </TableCell>

                  {/* Estado */}
                  <TableCell align="center">
                    {agent.isActive ? (
                      <Chip
                        label="Activo"
                        size="small"
                        color="success"
                        icon={<CheckCircle />}
                      />
                    ) : (
                      <Chip
                        label="Inactivo"
                        size="small"
                        icon={<Cancel />}
                      />
                    )}
                  </TableCell>

                  {/* Temperatura */}
                  <TableCell align="center">
                    <Chip
                      label={agent.temperature}
                      size="small"
                      color="warning"
                    />
                  </TableCell>

                  {/* Tokens */}
                  <TableCell align="center">
                    <Chip
                      label={agent.maxTokens}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>

                  {/* Herramientas */}
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {agent.tools?.retrieveDocs && (
                        <Chip size="small" label="RAG" icon={<Build />} />
                      )}
                      {agent.tools?.useProductsDb && (
                        <Chip size="small" label="Productos" />
                      )}
                      {agent.tools?.useOrdersDb && (
                        <Chip size="small" label="Pedidos" />
                      )}
                    </Box>
                  </TableCell>

                  {/* Creado */}
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(agent.created_at).toLocaleString()}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(agent.id)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(agent)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/*<Pagination />*/}
    </>
  );
};

export default AgentsTable;

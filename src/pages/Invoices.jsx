import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Download,
  Print,
  Visibility,
  Search,
  Email,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Invoices = () => {
  const invoices = [
    {
      id: 'INV-2024-001',
      customer: 'Juan Pérez',
      date: '10 Dic 2024',
      dueDate: '25 Dic 2024',
      amount: '$45.50',
      status: 'paid',
    },
    {
      id: 'INV-2024-002',
      customer: 'María García',
      date: '9 Dic 2024',
      dueDate: '24 Dic 2024',
      amount: '$28.99',
      status: 'pending',
    },
    {
      id: 'INV-2024-003',
      customer: 'Carlos López',
      date: '8 Dic 2024',
      dueDate: '23 Dic 2024',
      amount: '$67.80',
      status: 'paid',
    },
    {
      id: 'INV-2024-004',
      customer: 'Ana Martínez',
      date: '7 Dic 2024',
      dueDate: '22 Dic 2024',
      amount: '$15.00',
      status: 'overdue',
    },
    {
      id: 'INV-2024-005',
      customer: 'Pedro Sánchez',
      date: '6 Dic 2024',
      dueDate: '21 Dic 2024',
      amount: '$52.30',
      status: 'pending',
    },
    {
      id: 'INV-2024-006',
      customer: 'Laura Torres',
      date: '5 Dic 2024',
      dueDate: '20 Dic 2024',
      amount: '$89.99',
      status: 'paid',
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      paid: { label: 'Pagada', color: 'success' },
      pending: { label: 'Pendiente', color: 'warning' },
      overdue: { label: 'Vencida', color: 'error' },
      cancelled: { label: 'Cancelada', color: 'default' },
    };
    return configs[status] || configs.pending;
  };

  return (
    <Box className="page-container">
      <Box className="page-header-actions">
        <Box>
          <Typography variant="h4" className="page-title">
            Facturas
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Gestiona la facturación de tu negocio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Download />}
          className="action-button"
        >
          Exportar Todo
        </Button>
      </Box>

      <Paper className="page-paper">
        <Box className="table-toolbar">
          <TextField
            placeholder="Buscar facturas..."
            variant="outlined"
            size="small"
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N° Factura</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Fecha Emisión</TableCell>
                <TableCell>Fecha Vencimiento</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const statusConfig = getStatusConfig(invoice.status);
                return (
                  <TableRow key={invoice.id} className="table-row">
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {invoice.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.customer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.85rem">
                        {invoice.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontSize="0.85rem"
                        color={
                          invoice.status === 'overdue'
                            ? 'error'
                            : 'text.primary'
                        }
                      >
                        {invoice.dueDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {invoice.amount}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box className="action-buttons">
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Download fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Print fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Email fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Invoices;
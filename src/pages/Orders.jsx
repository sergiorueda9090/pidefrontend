import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Visibility,
  Print,
  CheckCircle,
  Cancel,
  AccessTime,
  LocalShipping,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Orders = () => {
  const [tabValue, setTabValue] = useState(0);

  const orders = [
    {
      id: '#ORD-001',
      customer: 'Juan Pérez',
      items: 3,
      total: '$45.50',
      status: 'pending',
      date: '10 Dic, 2024',
      time: '10:30 AM',
    },
    {
      id: '#ORD-002',
      customer: 'María García',
      items: 2,
      total: '$28.99',
      status: 'processing',
      date: '10 Dic, 2024',
      time: '11:15 AM',
    },
    {
      id: '#ORD-003',
      customer: 'Carlos López',
      items: 5,
      total: '$67.80',
      status: 'completed',
      date: '9 Dic, 2024',
      time: '3:45 PM',
    },
    {
      id: '#ORD-004',
      customer: 'Ana Martínez',
      items: 1,
      total: '$15.00',
      status: 'cancelled',
      date: '9 Dic, 2024',
      time: '2:20 PM',
    },
    {
      id: '#ORD-005',
      customer: 'Pedro Sánchez',
      items: 4,
      total: '$52.30',
      status: 'delivered',
      date: '8 Dic, 2024',
      time: '1:10 PM',
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pendiente',
        color: 'warning',
        icon: <AccessTime />,
      },
      processing: {
        label: 'Procesando',
        color: 'info',
        icon: <LocalShipping />,
      },
      completed: {
        label: 'Completado',
        color: 'success',
        icon: <CheckCircle />,
      },
      cancelled: {
        label: 'Cancelado',
        color: 'error',
        icon: <Cancel />,
      },
      delivered: {
        label: 'Entregado',
        color: 'success',
        icon: <CheckCircle />,
      },
    };
    return configs[status] || configs.pending;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="page-container">
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Pedidos
        </Typography>
        <Typography variant="body2" className="page-subtitle">
          Gestiona y procesa los pedidos de clientes
        </Typography>
      </Box>

      <Paper className="page-paper">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="page-tabs"
        >
          <Tab label="Todos" />
          <Tab label="Pendientes" />
          <Tab label="Procesando" />
          <Tab label="Completados" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pedido</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="center">Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <TableRow key={order.id} className="table-row">
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="customer-cell">
                        <Avatar className="customer-avatar">
                          {order.customer.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {order.customer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${order.items} items`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {order.total}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.85rem">
                        {order.date}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {order.time}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box className="action-buttons">
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Print fontSize="small" />
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

export default Orders;
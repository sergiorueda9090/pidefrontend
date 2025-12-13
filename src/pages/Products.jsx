import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  const products = [
    {
      id: 1,
      name: 'Hamburguesa Clásica',
      category: 'Hamburguesas',
      price: '$8.99',
      stock: 45,
      status: 'active',
      image: '🍔',
    },
    {
      id: 2,
      name: 'Pizza Margarita',
      category: 'Pizzas',
      price: '$12.99',
      stock: 23,
      status: 'active',
      image: '🍕',
    },
    {
      id: 3,
      name: 'Ensalada César',
      category: 'Ensaladas',
      price: '$6.99',
      stock: 0,
      status: 'out_of_stock',
      image: '🥗',
    },
    {
      id: 4,
      name: 'Taco al Pastor',
      category: 'Tacos',
      price: '$4.99',
      stock: 67,
      status: 'active',
      image: '🌮',
    },
    {
      id: 5,
      name: 'Sushi Roll',
      category: 'Sushi',
      price: '$15.99',
      stock: 12,
      status: 'low_stock',
      image: '🍣',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'out_of_stock':
        return 'error';
      case 'low_stock':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'out_of_stock':
        return 'Agotado';
      case 'low_stock':
        return 'Stock Bajo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Box className="page-container">
      <Box className="page-header-actions">
        <Box>
          <Typography variant="h4" className="page-title">
            Productos
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Gestiona tu catálogo de productos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="action-button"
        >
          Agregar Producto
        </Button>
      </Box>

      <Paper className="page-paper">
        <Box className="table-toolbar">
          <TextField
            placeholder="Buscar productos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="table-row">
                  <TableCell>
                    <Box className="product-cell">
                      <Avatar className="product-avatar">
                        {product.image}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {product.price}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.stock}
                      size="small"
                      className={`stock-chip ${
                        product.stock === 0
                          ? 'stock-zero'
                          : product.stock < 20
                          ? 'stock-low'
                          : 'stock-good'
                      }`}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getStatusLabel(product.status)}
                      color={getStatusColor(product.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Products;
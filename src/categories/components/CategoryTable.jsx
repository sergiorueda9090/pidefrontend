import React from 'react';
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
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const CategoryTable = ({ categories, onEdit, onDelete, onToggleActive }) => {
  return (
    <Paper className="page-paper">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Slug</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell align="center"><strong>Productos</strong></TableCell>
              <TableCell align="center"><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="table-row">
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {category.name}
                    </Typography>
                    {category.seoTitle && (
                      <Typography variant="caption" color="text.secondary">
                        SEO: {category.seoTitle}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      color: 'primary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    /{category.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={category.productsCount} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={category.isActive ? 'Activa' : 'Inactiva'}
                    size="small"
                    color={category.isActive ? 'success' : 'default'}
                    icon={category.isActive ? <Visibility /> : <VisibilityOff />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => onEdit(category)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={category.isActive ? 'Desactivar' : 'Activar'}>
                      <IconButton 
                        size="small" 
                        color={category.isActive ? 'warning' : 'success'}
                        onClick={() => onToggleActive(category)}
                      >
                        {category.isActive ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onDelete(category)}
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
  );
};

export default CategoryTable;
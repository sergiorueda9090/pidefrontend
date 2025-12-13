import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Image,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Categories = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    icon: '',
    image: '',
    displayOrder: 0,
    isActive: true,
    showInMenu: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  // Datos de ejemplo
  const categories = [
    {
      id: 1,
      name: 'Hamburguesas',
      slug: 'hamburguesas',
      description: 'Deliciosas hamburguesas gourmet',
      icon: '🍔',
      image: '/images/categories/hamburguesas.jpg',
      productsCount: 24,
      displayOrder: 1,
      isActive: true,
      showInMenu: true,
      parentCategory: null,
      color: '#667eea',
      seoTitle: 'Hamburguesas Gourmet',
      seoDescription: 'Descubre nuestras hamburguesas artesanales',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-10',
    },
    {
      id: 2,
      name: 'Pizzas',
      slug: 'pizzas',
      description: 'Pizzas artesanales con ingredientes frescos',
      icon: '🍕',
      image: '/images/categories/pizzas.jpg',
      productsCount: 18,
      displayOrder: 2,
      isActive: true,
      showInMenu: true,
      parentCategory: null,
      color: '#764ba2',
      seoTitle: 'Pizzas Artesanales',
      seoDescription: 'Las mejores pizzas con masa artesanal',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-10',
    },
    {
      id: 3,
      name: 'Postres',
      slug: 'postres',
      description: 'Dulces tentaciones',
      icon: '🍰',
      image: '/images/categories/postres.jpg',
      productsCount: 15,
      displayOrder: 3,
      isActive: true,
      showInMenu: true,
      parentCategory: null,
      color: '#f093fb',
      seoTitle: 'Postres Caseros',
      seoDescription: 'Postres frescos hechos diariamente',
      createdAt: '2024-01-20',
      updatedAt: '2024-12-09',
    },
    {
      id: 4,
      name: 'Bebidas',
      slug: 'bebidas',
      description: 'Bebidas refrescantes',
      icon: '☕',
      image: '/images/categories/bebidas.jpg',
      productsCount: 32,
      displayOrder: 4,
      isActive: true,
      showInMenu: true,
      parentCategory: null,
      color: '#4facfe',
      seoTitle: 'Bebidas Refrescantes',
      seoDescription: 'Amplia variedad de bebidas',
      createdAt: '2024-01-25',
      updatedAt: '2024-12-08',
    },
    {
      id: 5,
      name: 'Ensaladas',
      slug: 'ensaladas',
      description: 'Opciones saludables',
      icon: '🥗',
      image: '/images/categories/ensaladas.jpg',
      productsCount: 12,
      displayOrder: 5,
      isActive: false,
      showInMenu: true,
      parentCategory: null,
      color: '#43e97b',
      seoTitle: 'Ensaladas Frescas',
      seoDescription: 'Ensaladas con ingredientes frescos',
      createdAt: '2024-02-01',
      updatedAt: '2024-12-05',
    },
    {
      id: 6,
      name: 'Helados',
      slug: 'helados',
      description: 'Helados artesanales',
      icon: '🍦',
      image: '/images/categories/helados.jpg',
      productsCount: 8,
      displayOrder: 6,
      isActive: true,
      showInMenu: false,
      parentCategory: 3,
      color: '#fa709a',
      seoTitle: 'Helados Artesanales',
      seoDescription: 'Helados hechos en casa',
      createdAt: '2024-02-15',
      updatedAt: '2024-12-01',
    },
  ];

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentCategory: category.parentCategory || '',
        icon: category.icon,
        image: category.image,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
        showInMenu: category.showInMenu,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        seoKeywords: '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        parentCategory: '',
        icon: '',
        image: '',
        displayOrder: categories.length + 1,
        isActive: true,
        showInMenu: true,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({ ...formData, [field]: value });
    
    // Auto-generar slug
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = () => {
    console.log('Guardando categoría:', formData);
    handleCloseDialog();
  };

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDelete = (category) => {
    console.log('Eliminando:', category);
    handleMenuClose();
  };

  return (
    <Box className="page-container">
      <Box className="page-header-actions">
        <Box>
          <Typography variant="h4" className="page-title">
            Categorías
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Organiza tus productos por categorías
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="action-button"
          onClick={() => handleOpenDialog()}
        >
          Nueva Categoría
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card className="category-card">
              <CardContent>
                <Box className="category-header">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      className="category-avatar"
                      sx={{ backgroundColor: `${category.color}20` }}
                    >
                      <Typography variant="h4">{category.icon}</Typography>
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" className="category-name">
                          {category.name}
                        </Typography>
                        {category.parentCategory && (
                          <Chip label="Sub" size="small" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        /{category.slug}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleMenuOpen(e, category)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, mt: 1 }}
                >
                  {category.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${category.productsCount} productos`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={category.isActive ? <Visibility /> : <VisibilityOff />}
                    label={category.isActive ? 'Activa' : 'Inactiva'}
                    size="small"
                    color={category.isActive ? 'success' : 'default'}
                  />
                  {category.showInMenu && (
                    <Chip
                      label="En menú"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box className="category-meta">
                  <Typography variant="caption" color="text.secondary">
                    Orden: {category.displayOrder}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Act: {new Date(category.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions className="category-footer">
                <Button size="small" color="primary">
                  Ver Productos
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Edit />}
                  onClick={() => handleOpenDialog(category)}
                >
                  Editar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menú */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedCategory)}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedCategory)} sx={{ color: 'error.main' }}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" color="primary" fontWeight={600}>
              Información Básica
            </Typography>
            
            <TextField
              fullWidth label="Nombre" value={formData.name}
              onChange={handleChange('name')} required
              helperText="Nombre visible para clientes"
            />

            <TextField
              fullWidth label="Slug (URL)" value={formData.slug}
              onChange={handleChange('slug')} required
              helperText="Se genera automáticamente"
            />

            <TextField
              fullWidth label="Descripción" value={formData.description}
              onChange={handleChange('description')} multiline rows={3}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Icono/Emoji" value={formData.icon}
                  onChange={handleChange('icon')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Orden" type="number" value={formData.displayOrder}
                  onChange={handleChange('displayOrder')}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth label="URL Imagen" value={formData.image}
              onChange={handleChange('image')}
              InputProps={{
                endAdornment: <IconButton><Image /></IconButton>,
              }}
            />

            <Typography variant="subtitle2" color="primary" fontWeight={600} mt={2}>
              Jerarquía
            </Typography>

            <TextField
              fullWidth select label="Categoría Padre" value={formData.parentCategory}
              onChange={handleChange('parentCategory')}
            >
              <MenuItem value="">Ninguna</MenuItem>
              {categories.filter(c => !c.parentCategory).map(c => (
                <MenuItem key={c.id} value={c.id}>{c.icon} {c.name}</MenuItem>
              ))}
            </TextField>

            <Typography variant="subtitle2" color="primary" fontWeight={600} mt={2}>
              Visualización
            </Typography>

            <FormControlLabel
              control={<Switch checked={formData.isActive} onChange={handleChange('isActive')} />}
              label="Categoría activa"
            />
            <FormControlLabel
              control={<Switch checked={formData.showInMenu} onChange={handleChange('showInMenu')} />}
              label="Mostrar en menú"
            />

            <Typography variant="subtitle2" color="primary" fontWeight={600} mt={2}>
              SEO
            </Typography>

            <TextField
              fullWidth label="Título SEO" value={formData.seoTitle}
              onChange={handleChange('seoTitle')}
              inputProps={{ maxLength: 60 }}
            />

            <TextField
              fullWidth label="Descripción SEO" value={formData.seoDescription}
              onChange={handleChange('seoDescription')} multiline rows={2}
              inputProps={{ maxLength: 160 }}
            />

            <TextField
              fullWidth label="Keywords" value={formData.seoKeywords}
              onChange={handleChange('seoKeywords')}
              helperText="Separadas por comas"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} className="action-button">
            {editingCategory ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
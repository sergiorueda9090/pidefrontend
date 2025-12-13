import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  Download,
  Print,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Reports = () => {
  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$45,280',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#667eea',
    },
    {
      title: 'Pedidos Totales',
      value: '1,256',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingCart />,
      color: '#764ba2',
    },
    {
      title: 'Nuevos Clientes',
      value: '89',
      change: '-3.1%',
      trend: 'down',
      icon: <People />,
      color: '#f093fb',
    },
    {
      title: 'Productos Vendidos',
      value: '3,421',
      change: '+15.7%',
      trend: 'up',
      icon: <Inventory />,
      color: '#4facfe',
    },
  ];

  const topProducts = [
    { name: 'Hamburguesa Clásica', sales: 234, revenue: '$2,106' },
    { name: 'Pizza Margarita', sales: 189, revenue: '$2,453' },
    { name: 'Taco al Pastor', sales: 156, revenue: '$779' },
    { name: 'Sushi Roll', sales: 134, revenue: '$2,143' },
    { name: 'Ensalada César', sales: 98, revenue: '$685' },
  ];

  const recentActivity = [
    { action: 'Nueva venta', description: 'Pedido #ORD-456', time: 'Hace 5 min' },
    { action: 'Producto agotado', description: 'Pizza Hawaiana', time: 'Hace 15 min' },
    { action: 'Nuevo cliente', description: 'María González', time: 'Hace 1 hora' },
    { action: 'Reseña recibida', description: '⭐⭐⭐⭐⭐ 5 estrellas', time: 'Hace 2 horas' },
  ];

  return (
    <Box className="page-container">
      <Box className="page-header-actions">
        <Box>
          <Typography variant="h4" className="page-title">
            Reportes
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Analiza el rendimiento de tu negocio
          </Typography>
        </Box>
        <Box className="action-buttons-group">
          <Button
            variant="outlined"
            startIcon={<Print />}
            className="action-button-outlined"
          >
            Imprimir
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            className="action-button"
          >
            Descargar PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="stats-card">
              <CardContent>
                <Box className="stats-card-content">
                  <Box>
                    <Typography variant="body2" className="stats-card-title">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" className="stats-card-value">
                      {stat.value}
                    </Typography>
                    <Box className="stats-card-change-container">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="trend-icon trend-up" />
                      ) : (
                        <TrendingDown className="trend-icon trend-down" />
                      )}
                      <Typography
                        variant="caption"
                        className={`stats-card-change ${
                          stat.trend === 'up' ? 'positive' : 'negative'
                        }`}
                      >
                        {stat.change} vs mes anterior
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    className="stats-card-icon"
                    sx={{ backgroundColor: `${stat.color}20` }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { color: stat.color, fontSize: 32 },
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper className="page-paper">
            <Typography variant="h6" className="paper-title">
              Productos Más Vendidos
            </Typography>
            <Box className="top-products-list">
              {topProducts.map((product, index) => (
                <Box key={index} className="top-product-item">
                  <Box className="top-product-info">
                    <Typography variant="body2" fontWeight={500}>
                      {index + 1}. {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sales} ventas
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {product.revenue}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="page-paper">
            <Typography variant="h6" className="paper-title">
              Actividad Reciente
            </Typography>
            <Box className="activity-list">
              {recentActivity.map((activity, index) => (
                <Box key={index}>
                  <Box className="activity-item">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                  {index < recentActivity.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
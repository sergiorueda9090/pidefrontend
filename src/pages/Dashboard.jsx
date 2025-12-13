import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Dashboard = () => {
  const stats = [
    {
      title: 'Ventas Totales',
      value: '$45,280',
      change: '+12.5%',
      icon: <AttachMoney />,
      color: '#667eea',
    },
    {
      title: 'Pedidos',
      value: '1,256',
      change: '+8.2%',
      icon: <ShoppingCart />,
      color: '#764ba2',
    },
    {
      title: 'Clientes',
      value: '892',
      change: '+15.3%',
      icon: <People />,
      color: '#f093fb',
    },
    {
      title: 'Tasa de Conversión',
      value: '3.24%',
      change: '+2.1%',
      icon: <TrendingUp />,
      color: '#4facfe',
    },
  ];

  return (
    <Box className="page-container">
      <Box className="page-header">
        <Typography variant="h4" className="page-title">
          Dashboard
        </Typography>
        <Typography variant="body2" className="page-subtitle">
          Bienvenido de nuevo, Admin
        </Typography>
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
                    <Typography variant="caption" className="stats-card-change positive">
                      {stat.change} vs último mes
                    </Typography>
                  </Box>
                  <Box 
                    className="stats-card-icon"
                    sx={{ backgroundColor: `${stat.color}20` }}
                  >
                    {React.cloneElement(stat.icon, { 
                      sx: { color: stat.color, fontSize: 32 } 
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper className="page-paper">
            <Typography variant="h6" className="paper-title">
              Ventas Recientes
            </Typography>
            <Box className="empty-state">
              <Typography variant="body2" color="text.secondary">
                Gráfico de ventas aquí
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="page-paper">
            <Typography variant="h6" className="paper-title">
              Productos Populares
            </Typography>
            <Box className="empty-state">
              <Typography variant="body2" color="text.secondary">
                Lista de productos aquí
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
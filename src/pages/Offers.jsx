import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalOffer,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import '../styles/Pages.css';

const Offers = () => {
  const offers = [
    {
      id: 1,
      title: '2x1 en Hamburguesas',
      description: 'Compra una hamburguesa y lleva otra gratis',
      discount: '50%',
      code: 'BURGER2X1',
      used: 145,
      total: 200,
      startDate: '1 Dic 2024',
      endDate: '31 Dic 2024',
      status: 'active',
    },
    {
      id: 2,
      title: 'Pizza Familiar -30%',
      description: 'Descuento en pizzas familiares',
      discount: '30%',
      code: 'PIZZA30',
      used: 89,
      total: 150,
      startDate: '15 Dic 2024',
      endDate: '25 Dic 2024',
      status: 'active',
    },
    {
      id: 3,
      title: 'Menú del Día $9.99',
      description: 'Menú completo por solo $9.99',
      discount: '$5.00',
      code: 'MENU999',
      used: 234,
      total: 300,
      startDate: '1 Dic 2024',
      endDate: '15 Dic 2024',
      status: 'active',
    },
    {
      id: 4,
      title: 'Black Friday -40%',
      description: 'Descuento especial en todo',
      discount: '40%',
      code: 'BLACK40',
      used: 500,
      total: 500,
      startDate: '29 Nov 2024',
      endDate: '29 Nov 2024',
      status: 'expired',
    },
  ];

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Activa' : 'Expirada';
  };

  const calculateProgress = (used, total) => {
    return (used / total) * 100;
  };

  return (
    <Box className="page-container">
      <Box className="page-header-actions">
        <Box>
          <Typography variant="h4" className="page-title">
            Ofertas
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Crea y gestiona ofertas especiales
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="action-button"
        >
          Nueva Oferta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} md={6} key={offer.id}>
            <Card className="offer-card">
              <CardContent>
                <Box className="offer-header">
                  <Box className="offer-badge">
                    <LocalOffer />
                    <Typography variant="h6" className="offer-discount">
                      {offer.discount}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusLabel(offer.status)}
                    color={getStatusColor(offer.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="h6" className="offer-title">
                  {offer.title}
                </Typography>
                <Typography variant="body2" className="offer-description">
                  {offer.description}
                </Typography>

                <Box className="offer-code">
                  <Typography variant="caption" color="text.secondary">
                    Código:
                  </Typography>
                  <Chip
                    label={offer.code}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>

                <Box className="offer-stats">
                  <Box className="offer-stat">
                    <Timer fontSize="small" />
                    <Typography variant="caption">
                      {offer.startDate} - {offer.endDate}
                    </Typography>
                  </Box>
                  <Box className="offer-stat">
                    <TrendingUp fontSize="small" />
                    <Typography variant="caption">
                      {offer.used} / {offer.total} usos
                    </Typography>
                  </Box>
                </Box>

                <Box className="offer-progress">
                  <Box className="progress-header">
                    <Typography variant="caption" color="text.secondary">
                      Progreso
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {calculateProgress(offer.used, offer.total).toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(offer.used, offer.total)}
                    className="offer-progress-bar"
                  />
                </Box>
              </CardContent>

              <CardActions className="offer-actions">
                <Button size="small" color="primary" startIcon={<Edit />}>
                  Editar
                </Button>
                <IconButton size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Offers;
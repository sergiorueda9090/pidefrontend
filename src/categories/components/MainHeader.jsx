import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const MainHeader = ({ onAddNew }) => {
  return (
    <Box className="page-header-actions">
      <Box>
        <Typography variant="h4" className="page-title">
          Categorías
        </Typography>
        <Typography variant="body2" className="page-subtitle">
          Organiza tus productos por categorías y subcategorías
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        className="action-button"
        onClick={onAddNew}
      >
        Nueva Categoría
      </Button>
    </Box>
  );
};

export default MainHeader;
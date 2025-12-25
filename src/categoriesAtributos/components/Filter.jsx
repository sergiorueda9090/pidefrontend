import React, { useEffect } from 'react';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  CalendarToday,
  Label,
  Category,
  CheckCircle,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { filterFieldThunk, applyFilters, handleClearFilters } from '../../store/categoriesAtributostore/categoriesAtributoThunks';
import { getAllThunks as getCategoriesThunks } from '../../store/categoryStore/categoryThunks';
import { getAllThunks as getAttributesThunks } from '../../store/attributeStore/attributeThunks';
import '../../styles/Filter.css';

const Filter = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.categoriesAtributoStore);
  const { categories } = useSelector(state => state.categoryStore);
  const { attributes } = useSelector(state => state.attributeStore);

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // Cargar categorías y atributos al montar el componente
  useEffect(() => {
    dispatch(getCategoriesThunks({ page: 1, page_size: 1000 }));
    dispatch(getAttributesThunks({ page: 1, page_size: 1000 }));
  }, [dispatch]);

  const handleChange = (field, value) => {
    dispatch(filterFieldThunk({ field, value }));
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters(filters));
  };

  const handleClear = () => {
    dispatch(handleClearFilters());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <Paper className="filter-paper">
      <Box className="filter-header">
        <Box display="flex" alignItems="center" gap={1}>
          <FilterList color="inherit" />
          <span className="filter-title">Filtros de Búsqueda</span>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>

      <Box className="filter-content">
        <Grid container spacing={2.5}>
          {/* Búsqueda Principal */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Buscar Relación"
              placeholder="Buscar por nombre de categoría o atributo..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleChange('search', '')}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  }
                }
              }}
            />
          </Grid>

          {/* Filtros Secundarios */}
          <Grid item xs={12}>
            <Box className="secondary-filters-label">
              <FilterList fontSize="small" sx={{ mr: 0.5 }} />
              Filtros Adicionales
            </Box>
          </Grid>

          {/* Filtro por Categoría */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Categoría"
              value={filters.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              InputProps={{
                startAdornment: filters.categoria && (
                  <InputAdornment position="start">
                    <Category sx={{ color: 'primary.main', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todas las categorías</em>
              </MenuItem>
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Filtro por Atributo */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Atributo"
              value={filters.atributo}
              onChange={(e) => handleChange('atributo', e.target.value)}
              InputProps={{
                startAdornment: filters.atributo && (
                  <InputAdornment position="start">
                    <Label sx={{ color: 'success.main', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todos los atributos</em>
              </MenuItem>
              {attributes?.map((attr) => (
                <MenuItem key={attr.id} value={attr.id}>
                  {attr.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Filtro por Obligatorio */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Tipo"
              value={filters.obligatorio}
              onChange={(e) => handleChange('obligatorio', e.target.value)}
              InputProps={{
                startAdornment: filters.obligatorio !== '' && (
                  <InputAdornment position="start">
                    <CheckCircle sx={{ color: filters.obligatorio === 'true' ? 'error.main' : 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Todos los tipos</em>
              </MenuItem>
              <MenuItem value="true">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle sx={{ color: 'error.main', fontSize: 18 }} />
                  Obligatorios
                </Box>
              </MenuItem>
              <MenuItem value="false">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle sx={{ color: 'text.disabled', fontSize: 18 }} />
                  Opcionales
                </Box>
              </MenuItem>
            </TextField>
          </Grid>

          {/* Fecha inicio */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha Desde"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Fecha fin */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Fecha Hasta"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: filters.startDate || undefined
              }}
            />
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12} sm={6} md={6}>
            <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClear}
                startIcon={<Clear />}
                disabled={activeFiltersCount === 0}
                sx={{ minWidth: 150 }}
              >
                Limpiar Filtros
              </Button>

              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
                startIcon={<Search />}
                sx={{
                  minWidth: 150,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                  }
                }}
              >
                Buscar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Filter;

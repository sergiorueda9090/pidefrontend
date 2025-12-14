import React from 'react';
import { Box } from '@mui/material';
import MainHeader from './components/MainHeader';
import MainTable from './components/MainTable';
import MainDialog from './components/MainDialog';
import Filter from './components/Filter';
import { SimpleBackdrop } from '../components/Backdrop/BackDrop';
import '../styles/Pages.css';

import { useSelector, useDispatch } from 'react-redux';
import { openModalShared, closeModalShared } from '../store/globalStore/globalStore';
import { resetFormStore } from '../store/brandStore/brandStore';

const Main = () => {
  const dispatch = useDispatch();

  const { openModalStore } = useSelector(state => state.globalStore);

  // Handlers del Dialog
  const handleOpenDialog = () => {
    dispatch(resetFormStore());
    dispatch(openModalShared());
  };

  const handleCloseDialog = () => {
    dispatch(closeModalShared());
  };

  return (
    <Box className="page-container">
      {/* Header con botón de nueva marca */}
      <MainHeader onAddNew={handleOpenDialog} />

      {/* Filtros */}
      <Filter />

      {/* Tabla de marcas */}
      <MainTable />

      {/* Dialog de crear/editar */}
      <MainDialog open={openModalStore} onClose={handleCloseDialog} />

      {/* Backdrop de carga */}
      <SimpleBackdrop />
    </Box>
  );
};

export default Main;

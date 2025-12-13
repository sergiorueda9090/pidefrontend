import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import './SimpleBackdrop.css';

export const SimpleBackdrop = () => {
  
  const { openBackDropStore } = useSelector(state => state.globalStore);

  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1000000000,
        background: 'rgba(0, 0, 0, 0.8)'
      }}
      open={openBackDropStore}
    >
      <Box className="loading-container">
        <ShoppingCartIcon className="cart-icon" />
        <Box className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </Box>
        <Box className="loading-text">Cargando...</Box>
      </Box>
    </Backdrop>
  );
}
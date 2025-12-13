import React, { useState } from 'react';
import { Box } from '@mui/material';
import CategoryHeader from './components/CategoryHeader';
import CategoryTable from './components/CategoryTable';
import CategoryDialog from './components/CategoryDialog';
import { useCategoryForm } from './hooks/useCategoryForm';
import { mockCategories } from './data/mockData';
import '../styles/Pages.css';

import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../store/slices/counter/counterSlice';

const Categories = () => {
  // Estados
  const dispatch = useDispatch();
  const { counter } = useSelector(state => state.counter);
  
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Hook personalizado para el formulario
  const { formData, resetForm, loadCategory, handleChange } = useCategoryForm(categories);

  // Handler de búsqueda
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(value.toLowerCase()) ||
        category.slug.toLowerCase().includes(value.toLowerCase()) ||
        category.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  // Handlers del Dialog
  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      loadCategory(category);
    } else {
      setEditingCategory(null);
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleSave = () => {
    if (editingCategory) {
      // Aquí iría: PUT /api/categories/:id
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
          : cat
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    } else {
      // Crear nueva categoría
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        productsCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('Creando nueva categoría:', newCategory);
      // Aquí iría: POST /api/categories
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
    handleCloseDialog();
  };

  // Handler de eliminar
  const handleDelete = (category) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      console.log('Eliminando categoría:', category);
      // Aquí iría: DELETE /api/categories/:id
      const updatedCategories = categories.filter(cat => cat.id !== category.id);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
  };

  // Handler de cambiar estado
  const handleToggleActive = (category) => {
    console.log('Cambiando estado de categoría:', category);
    // Aquí iría: PATCH /api/categories/:id/toggle-active
    const updatedCategories = categories.map(cat =>
      cat.id === category.id 
        ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
        : cat
    );
    setCategories(updatedCategories);
    setFilteredCategories(updatedCategories);
  };
  
  const handleOne = (numero) => {
    console.log("llega");
    dispatch(increment(numero))
  }

  return (
    <Box className="page-container">
      {/* Header con búsqueda y botón de nueva categoría */}
      <button onClick={() => handleOne(1)}>
        sumar
      </button>
      <CategoryHeader 
        onAddNew={() => handleOpenDialog()}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Tabla de categorías */}
      <CategoryTable
        categories={filteredCategories}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Dialog de crear/editar */}
      <CategoryDialog
        open={openDialog}
        onClose={handleCloseDialog}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        isEditing={!!editingCategory}
      />
    </Box>
  );
};

export default Categories;
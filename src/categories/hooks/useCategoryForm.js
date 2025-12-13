import { useState } from 'react';

export const useCategoryForm = (categories) => {
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

  const resetForm = () => {
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
  };

  const loadCategory = (category) => {
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
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setFormData({ ...formData, [field]: value });
    
    // Auto-generar slug desde el nombre
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

  return {
    formData,
    resetForm,
    loadCategory,
    handleChange,
  };
};
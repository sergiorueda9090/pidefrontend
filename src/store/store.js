import { configureStore } from '@reduxjs/toolkit'
import { authStore }         from './authStore/authStore';
import { counterSlice }      from './slices/counter/counterSlice';
import { globalStore }       from './globalStore/globalStore';
import { userStore }         from './userStore/userStore';
import { categoryStore }     from './categoryStore/categoryStore';
import { subcategoryStore }  from './subcategoryStore/subcategoryStore';
import { brandStore }        from './brandStore/brandStore';
import { attributeStore }    from './attributeStore/attributeStore';
import { attributeValueStore } from './attributeValueStore/attributeValueStore';
import { agentStore }        from './agentStore/agentStore';
import { productosStore }    from './productosStore/productosStore';
import { categoriesAtributoStore } from './categoriesAtributostore/categoriesAtributostore';

export const store = configureStore({
  reducer: {
    counter         : counterSlice.reducer,
    authStore       : authStore.reducer,
    globalStore     : globalStore.reducer,
    userStore       : userStore.reducer,
    categoryStore   : categoryStore.reducer,
    subcategoryStore: subcategoryStore.reducer,
    brandStore      : brandStore.reducer,
    attributeStore  : attributeStore.reducer,
    attributeValueStore: attributeValueStore.reducer,
    agentStore      : agentStore.reducer,
    productosStore  : productosStore.reducer,
    categoriesAtributoStore: categoriesAtributoStore.reducer,
  }
})

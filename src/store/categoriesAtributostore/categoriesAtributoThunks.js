import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField } from "./categoriesAtributostore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/categoria-atributo/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  categoria = "",
  atributo = "",
  obligatorio = "",
  start_date = "",
  end_date = "",
} = {}) => {

  return async (dispatch, getState) => {

    await dispatch(showBackDropStore());

    const { authStore } = getState();
    const token = authStore.token;

    // Construir los parámetros dinámicamente
    let params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", page_size);

    if (search) params.append("search", search);
    if (categoria) params.append("categoria", categoria);
    if (atributo) params.append("atributo", atributo);
    if (obligatorio !== "") params.append("obligatorio", obligatorio);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);

    const options = {
      method: "GET",
      url: `${URL}${namespace_api}${endpoint}?${params.toString()}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        const categoriaAtributos = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ categoriaAtributos, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener relaciones categoría-atributo:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
      // Mostrar datos vacíos si hay error
      const categoriaAtributos = [];
      const paginado_info = {
        count: 0,
        next: null,
        previous: null,
        current_page: page,
        total_pages: 0,
        page_size: page_size,
      };
      await dispatch(handleDataStore({ categoriaAtributos, paginado_info }));
    } finally {
      await dispatch(hideBackDropStore());
    }
  };
};

export const showThunk = (id = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${id}/`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 200){

                await dispatch(loadForEditStore(
                                            { id             : response.data.id ?? null,
                                              categoriaId    : response.data.categoriaId ?? null,
                                              atributoId     : response.data.atributoId ?? null,
                                              obligatorio    : response.data.obligatorio ?? false,
                                              orden          : response.data.orden ?? 0,
                                            }
                                        )
                                );

                await dispatch(openModalShared());

                await dispatch( hideBackDropStore() );

            }else{

                await dispatch( hideBackDropStore() );

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar relación",
                        text: "Ocurrió un error al mostrar la relación categoría-atributo.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar relación",
                    text: "Ocurrió un error al mostrar la relación categoría-atributo.",
                })
            );

        }

    }

}

export const createThunks = (data) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();

        const token = authStore.token;

        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${endpoint_create}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: data,
        };

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if (response.status == 201) {

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Relación creada",
                        text: "La relación categoría-atributo ha sido creada exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear relación",
                        text: "Ocurrió un error al crear la relación categoría-atributo.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            }
        } catch (error) {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear relación",
                        text: error.response?.data?.detail || "Ocurrió un error al crear la relación.",
                    })
                );

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

        }
    };
};

export const updateThunks = (id, data) => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'PATCH',
            url: `${URL}${namespace_api}${id}/${endpoint_update}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data:data
        }

        try {
            // Hacer la solicitud
            const response = await axios.request(options);

            if(response.status == 201 || response.status == 200){

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Relación actualizada",
                        text: "La relación categoría-atributo se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar relación",
                        text: "Ocurrió un error al actualizar la relación categoría-atributo.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );

            }


        } catch (error) {

            await dispatch( closeModalShared() );

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar relación",
                    text: error.response?.data?.detail || "Ocurrió un error al actualizar la relación.",
                })
            );
            // Manejar errores
            console.error(error);

        }

    }

}

export const deleteThunk = (idCategoriaAtributo = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idCategoriaAtributo}${endpoint_delete}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            await dispatch( hideBackDropStore() );

            // Despachar la acción setAuthenticated con la respuesta de la solicitud
            // Nota: CategoriaAtributo usa hard delete, retorna 200, no 204
            if(response.status == 200){

                await dispatch( getAllThunks() );

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Relación eliminada",
                        text: "La relación categoría-atributo ha sido eliminada exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar la relación. Inténtalo nuevamente.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar la relación. Inténtalo nuevamente.",
                })
            );

        }

    }

}

// No hay restoreThunk porque CategoriaAtributo no tiene soft delete

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data;
      dispatch(handleFormStore({ name, value }));
    };
};

/* Paginación */
export const handlePageChange = (newPage) => {
  return async (dispatch, getState) => {
    const { categoriesAtributoStore } = getState();
    const { paginado_info, filters } = categoriesAtributoStore;

    // Actualizar la página en Redux
    await dispatch(setPaginationPage(newPage));

    // Llamar al endpoint con la nueva página
    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      categoria: filters.categoria,
      atributo: filters.atributo,
      obligatorio: filters.obligatorio,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { categoriesAtributoStore } = getState();
    const { filters } = categoriesAtributoStore;

    // Actualizar el page_size en Redux
    await dispatch(setPaginationPageSize(newPageSize));

    // Llamar al endpoint con el nuevo tamaño (página 1)
    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      categoria: filters.categoria,
      atributo: filters.atributo,
      obligatorio: filters.obligatorio,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

/* filtros */
export const filterFieldThunk = (data) => {
    return async (dispatch) => {
        dispatch(setFilterField({ field: data.field, value: data.value }));
    };
};

export const applyFilters = (filterData) => {
  return async (dispatch, getState) => {
    // Actualizar los filtros en Redux
    await dispatch(setFilters(filterData));

    const { categoriesAtributoStore } = getState();
    const { paginado_info } = categoriesAtributoStore;

    // Llamar al endpoint con los nuevos filtros
    await dispatch(getAllThunks({
      page: 1, // Volver a la primera página
      page_size: paginado_info.page_size,
      search: filterData.search,
      categoria: filterData.categoria,
      atributo: filterData.atributo,
      obligatorio: filterData.obligatorio,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    // Limpiar filtros en Redux
    await dispatch(clearFilters());

    const { categoriesAtributoStore } = getState();
    const { paginado_info } = categoriesAtributoStore;

    // Llamar al endpoint sin filtros
    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};

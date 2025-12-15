import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField } from "./attributeValueStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/attribute-value/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";
const endpoint_restore   = "/restore/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  atributo = "",
  activo = "",
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
    if (atributo) params.append("atributo", atributo);
    if (activo !== "") params.append("activo", activo);
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
        const attributeValues = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ attributeValues, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener valores de atributos:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
      // Mostrar datos de prueba si no hay backend
      const attributeValues = [];
      const paginado_info = {
        count: 0,
        next: null,
        previous: null,
        current_page: page,
        total_pages: 0,
        page_size: page_size,
      };
      await dispatch(handleDataStore({ attributeValues, paginado_info }));
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
                                              atributo_id    : response.data.atributoId ?? response.data.atributo_id ?? null,
                                              valor          : response.data.valor ?? '',
                                              valor_extra    : response.data.valorExtra ?? response.data.valor_extra ?? '',
                                              orden          : response.data.orden ?? 0,
                                              activo         : response.data.activo ?? true,
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
                        title: "Error al mostrar valor",
                        text: "Ocurrió un error al mostrar el valor de atributo.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar valor",
                    text: "Ocurrió un error al mostrar el valor de atributo.",
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
                        title: "Valor creado",
                        text: "El valor de atributo ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear valor",
                        text: "Ocurrió un error al crear el valor de atributo.",
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
                        title: "Error al crear valor",
                        text: "Backend no disponible. Por favor, implementa primero el endpoint /api/attribute-value/",
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
                        title: "Valor actualizado",
                        text: "El valor de atributo se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar valor",
                        text: "Ocurrió un error al actualizar el valor de atributo.",
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
                    title: "Error al actualizar valor",
                    text: "Ocurrió un error al actualizar el valor de atributo.",
                })
            );
            // Manejar errores
            console.error(error);

        }

    }

}

export const deleteThunk = (idAttributeValue = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idAttributeValue}${endpoint_delete}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            await dispatch( hideBackDropStore() );

            // Despachar la acción setAuthenticated con la respuesta de la solicitud
            if(response.status == 204){

                await dispatch( getAllThunks() );

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Valor eliminado",
                        text: "El valor de atributo ha sido eliminado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el valor de atributo. Inténtalo nuevamente.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar el valor de atributo. Inténtalo nuevamente.",
                })
            );

        }

    }

}

export const restoreThunk = (idAttributeValue = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${idAttributeValue}${endpoint_restore}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          };

          try {
            // Hacer la solicitud
            const response = await axios.request(options);

            await dispatch( hideBackDropStore() );

            if(response.status == 200){

                await dispatch( getAllThunks() );

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Valor restaurado",
                        text: "El valor de atributo ha sido restaurado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al restaurar",
                        text:  "Ocurrió un error al intentar restaurar el valor de atributo.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al restaurar",
                    text:  "Ocurrió un error al intentar restaurar el valor de atributo.",
                })
            );

        }

    }

}

export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
      const { name, value } = data;
      dispatch(handleFormStore({ name, value }));
    };
};

/* Paginación */
export const handlePageChange = (newPage) => {
  return async (dispatch, getState) => {
    const { attributeValueStore } = getState();
    const { paginado_info, filters } = attributeValueStore;

    // Actualizar la página en Redux
    await dispatch(setPaginationPage(newPage));

    // Llamar al endpoint con la nueva página
    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      atributo: filters.atributo,
      activo: filters.activo,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { attributeValueStore } = getState();
    const { filters } = attributeValueStore;

    // Actualizar el page_size en Redux
    await dispatch(setPaginationPageSize(newPageSize));

    // Llamar al endpoint con el nuevo tamaño (página 1)
    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      atributo: filters.atributo,
      activo: filters.activo,
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

    const { attributeValueStore } = getState();
    const { paginado_info } = attributeValueStore;

    // Llamar al endpoint con los nuevos filtros
    await dispatch(getAllThunks({
      page: 1, // Volver a la primera página
      page_size: paginado_info.page_size,
      search: filterData.search,
      atributo: filterData.atributo,
      activo: filterData.activo,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    // Limpiar filtros en Redux
    await dispatch(clearFilters());

    const { attributeValueStore } = getState();
    const { paginado_info } = attributeValueStore;

    // Llamar al endpoint sin filtros
    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};

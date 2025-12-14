import axios from "axios";
import { handleFormStore, resetFormStore, loadForEditStore,
        handleDataStore, setPaginationPage, setPaginationPageSize,
        setFilters, clearFilters, setFilterField } from "./attributeStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend http://127.0.0.1:8000
import { URL } from "../../constants/constantGlogal.js";
const namespace_api      = "/api/attribute/";
const endpoint           = "list/";
const endpoint_delete    = "/delete/";
const endpoint_create    = "create/";
const endpoint_update    = "update/";
const endpoint_restore   = "/restore/";


export const getAllThunks = ({
  page = 1,
  page_size = 10,
  search = "",
  tipo_input = "",
  es_variable = "",
  es_filtrable = "",
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
    if (tipo_input) params.append("tipo_input", tipo_input);
    if (es_variable !== "") params.append("es_variable", es_variable);
    if (es_filtrable !== "") params.append("es_filtrable", es_filtrable);
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
        const attributes = response.data.results;

        const paginado_info = {
          count         : response.data.count,
          next          : response.data.next,
          previous      : response.data.previous,
          current_page  : page,
          total_pages   : Math.ceil(response.data.count / page_size),
          page_size     : page_size,
        };

        await dispatch(handleDataStore({ attributes, paginado_info }));

      } else {
        console.error("⚠️ Error al obtener atributos:", response);
      }
    } catch (error) {
      console.error("❌ Error en el servidor:", error);
      // Mostrar datos de prueba si no hay backend
      const attributes = [];
      const paginado_info = {
        count: 0,
        next: null,
        previous: null,
        current_page: page,
        total_pages: 0,
        page_size: page_size,
      };
      await dispatch(handleDataStore({ attributes, paginado_info }));
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
                                              name           : response.data.name ?? '',
                                              slug           : response.data.slug ?? '',
                                              tipo_input     : response.data.tipoInput ?? response.data.tipo_input ?? 'text',
                                              tipo_dato      : response.data.tipoDato ?? response.data.tipo_dato ?? 'string',
                                              es_variable    : response.data.esVariable ?? response.data.es_variable ?? true,
                                              es_filtrable   : response.data.esFiltrable ?? response.data.es_filtrable ?? true,
                                              orden          : response.data.orden ?? 0,
                                              descripcion    : response.data.descripcion ?? '',
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
                        title: "Error al mostrar atributo",
                        text: "Ocurrió un error al mostrar el atributo.",
                    })
                );

            }


        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar atributo",
                    text: "Ocurrió un error al mostrar el atributo.",
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
                        title: "Atributo creado",
                        text: "El atributo ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear atributo",
                        text: "Ocurrió un error al crear el atributo.",
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
                        title: "Error al crear atributo",
                        text: "Backend no disponible. Por favor, implementa primero el endpoint /api/attribute/",
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
                        title: "Atributo actualizado",
                        text: "El atributo se ha actualizado correctamente.",
                    })
                );

                await dispatch( getAllThunks() );

                await dispatch( closeModalShared() );

                await dispatch( hideBackDropStore() );
            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar atributo",
                        text: "Ocurrió un error al actualizar el atributo.",
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
                    title: "Error al actualizar atributo",
                    text: "Ocurrió un error al actualizar el atributo.",
                })
            );
            // Manejar errores
            console.error(error);

        }

    }

}

export const deleteThunk = (idAttribute = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idAttribute}${endpoint_delete}`,
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
                        title: "Atributo eliminado",
                        text: "El atributo ha sido eliminado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text:  "Ocurrió un error al intentar eliminar el atributo. Inténtalo nuevamente.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text:  "Ocurrió un error al intentar eliminar el atributo. Inténtalo nuevamente.",
                })
            );

        }

    }

}

export const restoreThunk = (idAttribute = "") => {

    return async (dispatch, getState) => {

        const {authStore} = getState();
        const token       = authStore.token

        await dispatch(showBackDropStore());

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${idAttribute}${endpoint_restore}`,
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
                        title: "Atributo restaurado",
                        text: "El atributo ha sido restaurado exitosamente.",
                    })
                );

            }else{

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al restaurar",
                        text:  "Ocurrió un error al intentar restaurar el atributo.",
                    })
                );

            }

        } catch (error) {

            await dispatch( hideBackDropStore() );

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al restaurar",
                    text:  "Ocurrió un error al intentar restaurar el atributo.",
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
    const { attributeStore } = getState();
    const { paginado_info, filters } = attributeStore;

    // Actualizar la página en Redux
    await dispatch(setPaginationPage(newPage));

    // Llamar al endpoint con la nueva página
    await dispatch(getAllThunks({
      page: newPage,
      page_size: paginado_info.page_size,
      search: filters.search,
      tipo_input: filters.tipo_input,
      es_variable: filters.es_variable,
      es_filtrable: filters.es_filtrable,
      start_date: filters.startDate,
      end_date: filters.endDate,
    }));
  };
};

export const handlePageSizeChange = (newPageSize) => {
  return async (dispatch, getState) => {
    const { attributeStore } = getState();
    const { filters } = attributeStore;

    // Actualizar el page_size en Redux
    await dispatch(setPaginationPageSize(newPageSize));

    // Llamar al endpoint con el nuevo tamaño (página 1)
    await dispatch(getAllThunks({
      page: 1,
      page_size: newPageSize,
      search: filters.search,
      tipo_input: filters.tipo_input,
      es_variable: filters.es_variable,
      es_filtrable: filters.es_filtrable,
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

    const { attributeStore } = getState();
    const { paginado_info } = attributeStore;

    // Llamar al endpoint con los nuevos filtros
    await dispatch(getAllThunks({
      page: 1, // Volver a la primera página
      page_size: paginado_info.page_size,
      search: filterData.search,
      tipo_input: filterData.tipo_input,
      es_variable: filterData.es_variable,
      es_filtrable: filterData.es_filtrable,
      start_date: filterData.startDate,
      end_date: filterData.endDate,
    }));
  };
};

export const handleClearFilters = () => {
  return async (dispatch, getState) => {
    // Limpiar filtros en Redux
    await dispatch(clearFilters());

    const { attributeStore } = getState();
    const { paginado_info } = attributeStore;

    // Llamar al endpoint sin filtros
    await dispatch(getAllThunks({
      page: 1,
      page_size: paginado_info.page_size,
    }));
  };
};

import axios from "axios";
import {
    handleFormStore,
    resetFormStore,
    loadForEditStore,
    handleDataStore,
    setPaginationPage,
    setPaginationPageSize,
    setFilters,
    clearFilters,
    setFilterField
} from "./subcategoryStore.js";
import { showBackDropStore, hideBackDropStore, showAlert } from "../globalStore/globalStore.js";
import { openModalShared, closeModalShared } from "../globalStore/globalStore.js";

// URL de la API backend
import { URL } from "../../constants/constantGlogal.js";

const namespace_api = "/api/subcategory/";
const endpoint = "list/";
const endpoint_delete = "/delete/";
const endpoint_create = "create/";
const endpoint_update = "update/";

// Obtener todas las subcategorías con filtros y paginación
export const getAllThunks = ({
    page = 1,
    page_size = 10,
    search = "",
    status = "",
    category = "",
    start_date = "",
    end_date = "",
} = {}) => {

    return async (dispatch, getState) => {

        await dispatch(showBackDropStore());

        const { authStore } = getState();
        const token = authStore.token;

        // Construir parámetros dinámicamente
        let params = new URLSearchParams();

        params.append("page", page);
        params.append("page_size", page_size);

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (category) params.append("category", category);
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
                const subcategories = response.data.results;

                const paginado_info = {
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous,
                    current_page: page,
                    total_pages: Math.ceil(response.data.count / page_size),
                    page_size: page_size,
                };

                await dispatch(handleDataStore({ subcategories, paginado_info }));

            } else {
                console.error("⚠️ Error al obtener subcategorías:", response);
            }
        } catch (error) {
            console.error("❌ Error en el servidor:", error);
        } finally {
            await dispatch(hideBackDropStore());
        }
    };
};

// Mostrar una subcategoría para editar
export const showThunk = (id = "") => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        const options = {
            method: 'GET',
            url: `${URL}${namespace_api}${id}/`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const response = await axios.request(options);

            if (response.status == 200) {

                await dispatch(loadForEditStore({
                    id: response.data.id ?? '',
                    name: response.data.name ?? '',
                    slug: response.data.slug ?? '',
                    description: response.data.description ?? '',
                    icon: response.data.icon ?? '',
                    seoTitle: response.data.seoTitle ?? '',
                    seoDescription: response.data.seoDescription ?? '',
                    seoKeywords: response.data.seoKeywords ?? '',
                    image: response.data.image ?? null,
                    is_active: response.data.is_active ?? true,
                    category_id: response.data.categoryId ?? null,
                }));

                await dispatch(openModalShared());
                await dispatch(hideBackDropStore());

            } else {

                await dispatch(hideBackDropStore());

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al mostrar subcategoría",
                        text: "Ocurrió un error al mostrar la subcategoría.",
                    })
                );

            }

        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al mostrar subcategoría",
                    text: "Ocurrió un error al mostrar la subcategoría.",
                })
            );

        }

    }

}

// Crear nueva subcategoría
export const createThunks = (data) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        // Determinar si es FormData o JSON
        const isFormData = data instanceof FormData;

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}${endpoint_create}`,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
            },
            data: data,
        };

        try {
            const response = await axios.request(options);

            if (response.status == 201) {

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Subcategoría creada",
                        text: "El registro ha sido creado exitosamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al crear subcategoría",
                        text: "Ocurrió un error al crear el registro.",
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
                    title: "Error al crear subcategoría",
                    text: "Ocurrió un error al crear el registro.",
                })
            );

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

        }
    };
};

// Crear múltiples subcategorías (bulk creation)
export const createBulkThunks = (subcategoriesList) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        // Preparar el array de subcategorías
        const data = subcategoriesList.map(subcategoryData => ({
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            description: subcategoryData.description,
            icon: subcategoryData.icon,
            seoTitle: subcategoryData.seoTitle,
            seoDescription: subcategoryData.seoDescription,
            seoKeywords: subcategoryData.seoKeywords,
            is_active: subcategoryData.is_active,
            category_id: subcategoryData.category_id,
            order: subcategoryData.order || 0,
        }));

        const options = {
            method: 'POST',
            url: `${URL}${namespace_api}bulk-create/`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: data,
        };

        try {
            const response = await axios.request(options);

            if (response.status === 201 || response.status === 200) {
                const successCount = response.data.success_count || 0;
                const errorCount = response.data.error_count || 0;

                // Mostrar alerta con resumen
                if (successCount > 0 && errorCount === 0) {
                    await dispatch(
                        showAlert({
                            type: "success",
                            title: "✅ Subcategorías creadas",
                            text: `Se crearon ${successCount} subcategoría${successCount > 1 ? 's' : ''} exitosamente.`,
                        })
                    );
                } else if (successCount > 0 && errorCount > 0) {
                    await dispatch(
                        showAlert({
                            type: "warning",
                            title: "⚠️ Creación parcial",
                            text: `Se crearon ${successCount} subcategoría${successCount > 1 ? 's' : ''}, pero ${errorCount} ${errorCount > 1 ? 'fallaron' : 'falló'}.`,
                        })
                    );
                } else {
                    await dispatch(
                        showAlert({
                            type: "error",
                            title: "❌ Error al crear subcategorías",
                            text: "No se pudo crear ninguna subcategoría.",
                        })
                    );
                }

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

                return { successCount, errorCount };
            }
        } catch (error) {
            console.error("Error al crear subcategorías:", error);

            await dispatch(
                showAlert({
                    type: "error",
                    title: "❌ Error al crear subcategorías",
                    text: error.response?.data?.message || "Ocurrió un error en el servidor.",
                })
            );

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

            return { successCount: 0, errorCount: subcategoriesList.length };
        }
    };
};

// Actualizar subcategoría
export const updateThunks = (id, data) => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        // Determinar si es FormData o JSON
        const isFormData = data instanceof FormData;

        const options = {
            method: 'PATCH',
            url: `${URL}${namespace_api}${id}/${endpoint_update}`,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
            },
            data: data
        }

        try {
            const response = await axios.request(options);

            if (response.status == 201 || response.status == 200) {

                await dispatch(resetFormStore());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Subcategoría actualizada",
                        text: "La subcategoría se ha actualizado correctamente.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());
            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al actualizar subcategoría",
                        text: "Ocurrió un error al actualizar la subcategoría.",
                    })
                );

                await dispatch(getAllThunks());
                await dispatch(closeModalShared());
                await dispatch(hideBackDropStore());

            }

        } catch (error) {

            await dispatch(closeModalShared());
            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al actualizar subcategoría",
                    text: "Ocurrió un error al actualizar la subcategoría.",
                })
            );

            console.error(error);

        }

    }

}

// Eliminar subcategoría
export const deleteThunk = (idSubcategory = "") => {

    return async (dispatch, getState) => {

        const { authStore } = getState();
        const token = authStore.token;

        await dispatch(showBackDropStore());

        const options = {
            method: 'DELETE',
            url: `${URL}${namespace_api}${idSubcategory}${endpoint_delete}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const response = await axios.request(options);

            await dispatch(hideBackDropStore());

            if (response.status == 200 || response.status == 204) {

                await dispatch(getAllThunks());

                await dispatch(
                    showAlert({
                        type: "success",
                        title: "Subcategoría eliminada",
                        text: "El registro ha sido eliminado exitosamente.",
                    })
                );

            } else {

                await dispatch(
                    showAlert({
                        type: "error",
                        title: "Error al eliminar",
                        text: "Ocurrió un error al intentar eliminar el registro.",
                    })
                );

            }

        } catch (error) {

            await dispatch(hideBackDropStore());

            await dispatch(
                showAlert({
                    type: "error",
                    title: "Error al eliminar",
                    text: "Servidor: Ocurrió un error al intentar eliminar el registro.",
                })
            );

        }

    }

}

// Manejar cambios en el formulario
export const handleFormStoreThunk = (data) => {
    return async (dispatch) => {
        const { name, value } = data;
        dispatch(handleFormStore({ name, value }));
    };
};

/* Paginación */
export const handlePageChange = (newPage) => {
    return async (dispatch, getState) => {
        const { subcategoryStore } = getState();
        const { paginado_info, filters } = subcategoryStore;

        await dispatch(setPaginationPage(newPage));

        await dispatch(getAllThunks({
            page: newPage,
            page_size: paginado_info.page_size,
            search: filters.search,
            status: filters.status,
            category: filters.category,
            start_date: filters.startDate,
            end_date: filters.endDate,
        }));
    };
};

export const handlePageSizeChange = (newPageSize) => {
    return async (dispatch, getState) => {
        const { subcategoryStore } = getState();
        const { filters } = subcategoryStore;

        await dispatch(setPaginationPageSize(newPageSize));

        await dispatch(getAllThunks({
            page: 1,
            page_size: newPageSize,
            search: filters.search,
            status: filters.status,
            category: filters.category,
            start_date: filters.startDate,
            end_date: filters.endDate,
        }));
    };
};

/* Filtros */
export const filterFieldThunk = (data) => {
    return async (dispatch) => {
        dispatch(setFilterField({ field: data.field, value: data.value }));
    };
};

export const applyFilters = (filterData) => {
    return async (dispatch, getState) => {
        await dispatch(setFilters(filterData));

        const { subcategoryStore } = getState();
        const { paginado_info } = subcategoryStore;

        await dispatch(getAllThunks({
            page: 1,
            page_size: paginado_info.page_size,
            search: filterData.search,
            status: filterData.status,
            category: filterData.category,
            start_date: filterData.startDate,
            end_date: filterData.endDate,
        }));
    };
};

export const handleClearFilters = () => {
    return async (dispatch, getState) => {
        await dispatch(clearFilters());

        const { subcategoryStore } = getState();
        const { paginado_info } = subcategoryStore;

        await dispatch(getAllThunks({
            page: 1,
            page_size: paginado_info.page_size,
        }));
    };
};

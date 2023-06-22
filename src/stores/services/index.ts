import { CAConnectionInstance } from "@pages/api/hello";
import { createApi } from "@reduxjs/toolkit/query/react";
import { store } from "@stores";
import { commonActions } from "@stores/slices/common";

const axiosBaseQuery = () => async (axiosConfigs) => {
  const { body, ...configs } = axiosConfigs;

  try {
    const result = await CAConnectionInstance.request({
      ...configs,
      data: body,
    });

    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as any;

    if (err.response?.status === 401) {
      store.dispatch(
        commonActions.showAlertMessage({
          type: "error",
          message: "Not found!",
        })
      );
    }
    if (err.response?.status === 409) {
      store.dispatch(
        commonActions.showAlertMessage({
          type: "error",
          message: "Already exist!",
        })
      );
    }
    if (err.response?.status === 500) {
      store.dispatch(
        commonActions.showAlertMessage({
          type: "error",
          message: "Something went wrong, please try again!",
        })
      );
    }

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

const baseRtkApi = createApi({
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: 15,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: ["conversation", "message", "user", "image"],
});

export default baseRtkApi;

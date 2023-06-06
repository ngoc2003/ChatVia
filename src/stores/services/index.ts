import { CAConnectionInstance } from "@pages/api/hello";
import { createApi } from "@reduxjs/toolkit/query/react";

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
  tagTypes: ["conversation", "message", "user"],
});

export default baseRtkApi;

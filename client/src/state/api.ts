import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import {
  type AuthSession,
  type AuthUser,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { FiltersState } from ".";
import { toast } from "sonner";

type ApiQrv<T> = QueryReturnValue<
  ResponseAPI<T>,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, _api) => {
      const session: AuthSession = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken.toString()}`);
      }
      return headers;
    },
    timeout: 60000,
  }),
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants", "Properties", "PropertyDetails"],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session: AuthSession = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user: AuthUser = await getCurrentUser();
          // în Cognito, custom attributes definite pentru un utilizator apar doar în ID Token, nu în Access Token.
          const userRole = idToken?.payload["custom:role"] as
            | "manager"
            | "tenant";

          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          if (userRole === "manager") {
            let res = (await fetchWithBQ(endpoint)) as ApiQrv<IManager>;
            if (res.error?.status === 404) {
              res = (await createNewUserInDatabase(
                user,
                idToken,
                userRole,
                fetchWithBQ,
              )) as ApiQrv<IManager>;
            }
            if (res.error || !res.data)
              return { error: res.error ?? { status: 500, data: "No data" } };

            return {
              data: {
                userRole: "manager",
                cognitoInfo: user,
                userInfo: res.data, // ResponseAPI<IManagerResponse>
              },
              meta: res.meta,
            };
          } else {
            let res = (await fetchWithBQ(endpoint)) as ApiQrv<ITenant>;
            if (res.error?.status === 404) {
              res = (await createNewUserInDatabase(
                user,
                idToken,
                userRole,
                fetchWithBQ,
              )) as ApiQrv<ITenant>;
            }
            if (res.error || !res.data)
              return { error: res.error ?? { status: 500, data: "No data" } };

            return {
              data: {
                userRole: "tenant",
                cognitoInfo: user,
                userInfo: res.data, // ResponseAPI<ITenantResponse>
              },
              meta: res.meta,
            };
          }
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    updateManagerSettings: build.mutation<
      IManager,
      { cognitoId: string } & Partial<IManager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [
        { type: "Managers", id: result?.cognitoId },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    // property related endpoints
    getProperties: build.query<
      ResponseAPI<IProperty[]>,
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          // availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id: id }) => ({
                type: "Properties" as const,
                id,
              })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to load properties",
        });
      },
    }),
    getProperty: build.query<IProperty, number>({
      query: (id) => `properties/${id}`,
      transformResponse: (resp: ResponseAPI<IProperty>) => resp.data,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to load property details.",
        });
      },
    }),
    // tenant related endpoints
    getTenant: build.query<ITenant, string>({
      query: (cognitoId) => `tenants/${cognitoId}`,
      transformResponse: (resp: ResponseAPI<ITenant>) => resp.data,
      providesTags: (result) => [{ type: "Tenants", id: result?._id }],
      async onQueryStarted(_, { queryFulfilled }) {},
    }),

    updateTenantSettings: build.mutation<
      ITenant,
      { cognitoId: string } & Partial<ITenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.cognitoId }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    addFavoriteProperty: build.mutation<
      ITenant,
      { cognitoId: string; propertyId: string }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      transformResponse: (resp: ResponseAPI<ITenant>) => resp.data,
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?._id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Adding to your favorites…",
          success: () => `Property added to your favorites!`,
          error: "Couldn't add to favorites. Please try again.",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<
      ITenant,
      { cognitoId: string; propertyId: string }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      transformResponse: (resp: ResponseAPI<ITenant>) => resp.data,
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?._id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Removing from your favorites…",
          success: () => `Property removed from your favorites!`,
          error: "Couldn't remove from favorites. Please try again.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetTenantQuery,
} = api;

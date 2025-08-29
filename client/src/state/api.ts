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
  tagTypes: [
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Applications",
    "Leases",
    "Payments",
  ],
  endpoints: (build) => ({
    // AUTH
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
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
    getProperty: build.query<IProperty, string>({
      query: (id) => `properties/${id}`,
      transformResponse: (resp: ResponseAPI<IProperty>) => resp.data,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to load property details.",
        });
      },
    }),
    createProperty: build.mutation<IProperty, FormData>({
      query: (newProperty) => ({
        url: `properties`,
        method: "POST",
        body: newProperty,
      }),
      transformResponse: (resp: ResponseAPI<IProperty>) => resp.data,
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.managerCognitoId },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Register your new property...",
          success: "Property created successfully!",
          error: "Failed to create property.",
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
    getCurrentResidences: build.query<IProperty[], string>({
      query: (cognitoId) => `tenants/${cognitoId}/current-residences`,
      transformResponse: (resp: ResponseAPI<IProperty[]>) => resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id: id }) => ({
                type: "Properties" as const,
                id,
              })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to fetch current residences.",
        });
      },
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
        toast.promise(queryFulfilled, {
          loading: "Updating your settings!",
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
        // { type: "Properties", id: "LIST" },
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
        // { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Removing from your favorites…",
          success: () => `Property removed from your favorites!`,
          error: "Couldn't remove from favorites. Please try again.",
        });
      },
    }),

    // manager related endpoints
    getManagerProperties: build.query<IProperty[], string>({
      query: (cognitoId) => `managers/${cognitoId}/properties`,
      transformResponse: (resp: ResponseAPI<IProperty[]>) => resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id: id }) => ({
                type: "Properties" as const,
                id,
              })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to load manager profile.",
        });
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
        toast.promise(queryFulfilled, {
          loading: "Updating your settings!",
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    // application related endpoints
    createApplication: build.mutation<IApplication, CreateIApplication>({
      query: (body) => ({
        url: `applications`,
        method: "POST",
        body: body,
      }),
      transformResponse: (resp: ResponseAPI<IApplication>) => resp.data,
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Requesting your application!",
          success: () => `Application created successfully!`,
          error: "Failed to create applications.",
        });
      },
    }),
    getApplications: build.query<
      IApplication[],
      { userId?: string; userType?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.userId) {
          queryParams.append("userId", params.userId.toString());
        }
        if (params.userType) {
          queryParams.append("userType", params.userType);
        }

        return `applications?${queryParams.toString()}`;
      },
      transformResponse: (resp: ResponseAPI<IApplication[]>) => resp.data,
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          error: "Failed to fetch applications.",
        });
      },
    }),

    updateApplicationStatus: build.mutation<
      IApplication,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (resp: ResponseAPI<IApplication>) => resp.data,
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Updating application status!",
          success: "Application status updated successfully!",
          error: "Failed to update application settings.",
        });
      },
    }),
    // lease related enpoints
    getLeases: build.query<ILease[], string>({
      query: () => "leases",
      providesTags: ["Leases"],
      transformResponse: (resp: ResponseAPI<ILease[]>) => resp.data,
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch leases.",
        });
      },
    }),

    getPropertyLeases: build.query<ILease[], string>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      transformResponse: (resp: ResponseAPI<ILease[]>) => resp.data,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases.",
        });
      },
    }),

    getPayments: build.query<IPayment[], string>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      transformResponse: (resp: ResponseAPI<IPayment[]>) => resp.data,
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useCreatePropertyMutation,
  useGetManagerPropertiesQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetTenantQuery,
  useGetCurrentResidencesQuery,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = api;

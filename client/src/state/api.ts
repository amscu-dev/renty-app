import { createNewUserInDatabase, withToast } from "@/lib/utils";
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

type ApiQrv<T> = QueryReturnValue<
  ResponseAPI<T>,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session: AuthSession = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken.toString()}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Managers", "Tenants"],
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
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
} = api;

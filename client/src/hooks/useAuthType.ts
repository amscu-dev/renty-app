import { useGetAuthUserQuery } from "@/state/api";

type TenantHookResult = Omit<ReturnType<typeof useGetAuthUserQuery>, "data"> & {
  data: TenantUser | undefined;
};

type ManagerHookResult = Omit<
  ReturnType<typeof useGetAuthUserQuery>,
  "data"
> & { data: ManagerUser | undefined };

export function useAuthTenant(): TenantHookResult {
  const q = useGetAuthUserQuery();
  return {
    ...q,
    data: q.data?.userRole === "tenant" ? q.data : undefined,
  };
}

export function useAuthManager(): ManagerHookResult {
  const q = useGetAuthUserQuery();
  return {
    ...q,
    data: q.data?.userRole === "manager" ? q.data : undefined,
  };
}

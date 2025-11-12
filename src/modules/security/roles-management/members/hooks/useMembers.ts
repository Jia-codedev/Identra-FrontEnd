"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import securityRolesApi, {
  SecUserRole,
} from "@/services/security/securityRoles";
import secUserRolesApi from "@/services/security/secUserRoles";
import securitySessionsApi from "@/services/security/securitySessions";
import { toast } from "sonner";

interface MembersState {
  selected: number[];
  search: string;
  organizationFilter: number | null;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const useMembers = (roleId: number) => {
  const queryClient = useQueryClient();

  const [state, setState] = useState<MembersState>({
    selected: [],
    search: "",
    organizationFilter: null,
    page: 1,
    pageSize: PAGE_SIZE,
  });

  // Fetch role members (users who HAVE the current role)
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: [
      "role-members",
      roleId,
      state.page,
      state.pageSize,
      state.organizationFilter,
    ],
    queryFn: async () => {
      const response = await secUserRolesApi.getUserRoles({
        role_id: roleId,
        offset: state.page,
        limit: state.pageSize,
        organization_id: state.organizationFilter,
      });
      return response.data;
    },
    enabled: !!roleId,
  });

  // Fetch ALL users (to get all users in the system for role assignment)
  const {
    data: allUsersData,
    isLoading: isLoadingAllUsers,
    refetch: refetchAllUsers,
  } = useQuery({
    queryKey: [
      "all-users-for-role-assignment",
      state.search,
      state.organizationFilter,
      state.page,
      state.pageSize,
    ],
    queryFn: async () => {
      const response = await securitySessionsApi.getUsers({
        offset: state.page,
        limit: 1000, // Fetch more users for search
        search: state.search,
      });
      return response.data;
    },
  });

  // Process members data - these are users who HAVE the current role
  const members = useMemo(() => {
    return membersData?.data || [];
  }, [membersData]);

  const memberUserIds = useMemo(() => {
    return new Set(members.map((m: any) => m.user_id));
  }, [members]);

  // Process available employees - users who DON'T have the current role
  const availableEmployees = useMemo(() => {
    const allUsers = allUsersData?.data || [];

    // Filter out users who already have the current role
    return allUsers.filter((user: any) => !memberUserIds.has(user.user_id));
  }, [allUsersData, memberUserIds]);

  const pageCount = useMemo(() => {
    const total = membersData?.total || 0;
    return Math.ceil(total / state.pageSize);
  }, [membersData?.total, state.pageSize]);

  const allIds = useMemo(() => {
    return members.map((m: SecUserRole) => m.user_role_id);
  }, [members]);

  const allChecked = useMemo(() => {
    if (allIds.length === 0) return false;
    return allIds.every((id: number) => state.selected.includes(id));
  }, [allIds, state.selected]);

  // Mutations
  const addMembersMutation = useMutation({
    mutationFn: async (userIds: number[]) => {
      // Use patch API for bulk role assignment
      return secUserRolesApi.patchUserRoleAssignments({
        user_ids: userIds,
        role_id: roleId,
      });
    },
    onSuccess: () => {
      toast.success("Members added successfully");
      refetchMembers();
      refetchAllUsers();
      queryClient.invalidateQueries({ queryKey: ["role-members"] });
      queryClient.invalidateQueries({
        queryKey: ["all-user-roles-for-members"],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add members");
    },
  });

  const removeMembersMutation = useMutation({
    mutationFn: async (userRoleIds: number[]) => {
      const promises = userRoleIds.map((id) =>
        secUserRolesApi.deleteUserRole(id)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Members removed successfully");
      setState((prev) => ({ ...prev, selected: [] }));
      refetchMembers();
      refetchAllUsers();
      queryClient.invalidateQueries({ queryKey: ["role-members"] });
      queryClient.invalidateQueries({
        queryKey: ["all-user-roles-for-members"],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove members");
    },
  });

  // Actions
  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setOrganizationFilter = useCallback((orgId: number | null) => {
    setState((prev) => ({ ...prev, organizationFilter: orgId, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const selectMember = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      selected: prev.selected.includes(id)
        ? prev.selected.filter((i) => i !== id)
        : [...prev.selected, id],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selected: allChecked
        ? prev.selected.filter((id: number) => !allIds.includes(id))
        : [
            ...prev.selected,
            ...allIds.filter((id: number) => !prev.selected.includes(id)),
          ],
    }));
  }, [allChecked, allIds]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selected: [] }));
  }, []);

  const addMembers = useCallback(
    (userIds: number[]) => {
      addMembersMutation.mutate(userIds);
    },
    [addMembersMutation]
  );

  const removeMembers = useCallback(
    (userRoleIds: number[]) => {
      removeMembersMutation.mutate(userRoleIds);
    },
    [removeMembersMutation]
  );

  return {
    members,
    availableEmployees,
    selected: state.selected,
    search: state.search,
    organizationFilter: state.organizationFilter,
    page: state.page,
    pageSize: state.pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageCount,
    allChecked,
    isLoading: isLoadingMembers || isLoadingAllUsers,
    isLoadingMembers,
    isLoadingAllUsers,
    hasNext: membersData?.hasNext || false,
    total: membersData?.total || 0,
    setSearch,
    setOrganizationFilter,
    setPage,
    setPageSize,
    selectMember,
    selectAll,
    clearSelection,
    addMembers,
    removeMembers,
    refetch: refetchMembers,
  };
};

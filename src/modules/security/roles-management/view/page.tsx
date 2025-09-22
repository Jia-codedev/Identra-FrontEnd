"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/security/useSecurityRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { Plus, Users, Shield, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SecRole } from "@/services/security/securityRoles";

export default function RolesManagementPage() {
  const { t } = useTranslations();
  const { 
    data: rolesData, 
    isLoading,
    refetch
  } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SecRole | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allChecked, setAllChecked] = useState(false);
  const [formData, setFormData] = useState({
    role_name: "",
    editable_flag: true,
  });

  const roles = rolesData?.data || [];
  
  const filteredRoles = roles.filter((role: SecRole) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: TableColumn<SecRole>[] = [
    {
      key: "role_name",
      header: "Role Name",
      accessor: (role: SecRole) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium">{role.role_name}</span>
        </div>
      ),
    },
    {
      key: "role_id",
      header: "Role ID",
      accessor: (role: SecRole) => role.role_id,
    },
    {
      key: "editable_flag",
      header: "Status",
      accessor: (role: SecRole) => (
        <Badge variant={role.editable_flag ? "default" : "secondary"}>
          {role.editable_flag ? "Editable" : "Read Only"}
        </Badge>
      ),
    },
    {
      key: "created_date",
      header: "Created Date",
      accessor: (role: SecRole) => 
        role.created_date ? new Date(role.created_date).toLocaleDateString() : "-",
    },
  ];

  const getRoleId = useCallback((role: SecRole): number => {
    return role.role_id;
  }, []);
  
  const getRoleDisplayName = useCallback((role: SecRole, isRTL: boolean): string => {
    return role.role_name;
  }, []);

  const handleSelectRole = (roleId: number) => {
    setSelected(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(filteredRoles.map((role: SecRole) => role.role_id));
    }
    setAllChecked(!allChecked);
  };

  const handleCreate = async () => {
    try {
      await createRole.mutateAsync({
        role_name: formData.role_name,
        editable_flag: formData.editable_flag,
      });
      toast.success("Role created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to create role");
    }
  };

  const handleEdit = (role: SecRole) => {
    setSelectedRole(role);
    setFormData({
      role_name: role.role_name,
      editable_flag: role.editable_flag || true,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    
    try {
      await updateRole.mutateAsync({
        id: selectedRole.role_id,
        data: {
          role_name: formData.role_name,
          editable_flag: formData.editable_flag,
        },
      });
      toast.success("Role updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (roleId: number) => {
    try {
      await deleteRole.mutateAsync(roleId);
      toast.success("Role deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const resetForm = () => {
    setFormData({ role_name: "", editable_flag: true });
    setSelectedRole(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Roles Management</h1>
            <p className="text-muted-foreground">
              Manage system roles and assign permissions
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new security role and assign permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <input
                  id="name"
                  type="text"
                  value={formData.role_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="Enter role name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createRole.isPending}>
                  {createRole.isPending ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Editable Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter((role: SecRole) => role.editable_flag).length}
            </div>
            <p className="text-xs text-muted-foreground">Can be modified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Read Only</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter((role: SecRole) => !role.editable_flag).length}
            </div>
            <p className="text-xs text-muted-foreground">System roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selected.length}</div>
            <p className="text-xs text-muted-foreground">Currently selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Security Roles</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={filteredRoles}
            columns={columns}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            getItemId={getRoleId}
            getItemDisplayName={getRoleDisplayName}
            onSelectItem={handleSelectRole}
            onSelectAll={handleSelectAll}
            onEditItem={handleEdit}
            onDeleteItem={handleDelete}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            noDataMessage="No roles found"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Role Name</Label>
              <input
                id="edit-name"
                type="text"
                value={formData.role_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, role_name: e.target.value })}
                placeholder="Enter role name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateRole.isPending}>
                {updateRole.isPending ? "Updating..." : "Update Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
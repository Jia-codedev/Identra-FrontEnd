"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Key, Shield, Search, Edit, Trash2, MoreHorizontal, CheckCircle, XCircle, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericTable } from "@/components/common/GenericTable";
import { toast } from "sonner";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  permissions: string[];
  status: "active" | "inactive";
  assignedRoles: number;
  createdAt: string;
  users: number;
}

interface PermissionModule {
  id: string;
  name: string;
  permissions: string[];
}

const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: "user-management",
    name: "User Management",
    permissions: ["view", "create", "edit", "delete", "export"]
  },
  {
    id: "attendance",
    name: "Attendance Management",
    permissions: ["view", "edit", "approve", "export", "reports"]
  },
  {
    id: "leave",
    name: "Leave Management",
    permissions: ["view", "apply", "approve", "reject", "edit"]
  },
  {
    id: "security",
    name: "Security Settings",
    permissions: ["view", "edit", "manage-roles", "audit-logs"]
  }
];

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: "1",
    name: "HR Manager",
    description: "Full access to HR operations",
    module: "user-management",
    action: "read",
    permissions: ["view", "create", "edit", "delete"],
    status: "active",
    assignedRoles: 5,
    createdAt: "2024-01-15",
    users: 5
  },
  {
    id: "2",
    name: "Team Lead",
    description: "Team management and attendance oversight",
    module: "attendance",
    action: "read",
    permissions: ["view", "edit", "approve"],
    status: "active",
    assignedRoles: 12,
    createdAt: "2024-01-10",
    users: 12
  },
  {
    id: "3",
    name: "Employee",
    description: "Basic employee access",
    module: "leave",
    action: "read",
    permissions: ["view", "apply"],
    status: "active",
    assignedRoles: 45,
    createdAt: "2024-01-05",
    users: 45
  },
  {
    id: "4",
    name: "Security Admin",
    description: "Security and system administration",
    module: "security",
    action: "read",
    permissions: ["view", "edit", "manage-roles"],
    status: "inactive",
    assignedRoles: 2,
    createdAt: "2024-01-01",
    users: 2
  }
];

export default function AccessPermissionsPage() {
  const { t } = useTranslations();
  
  const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTableRows, setSelectedTableRows] = useState<number[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === "all" || permission.module === selectedModule;
    const matchesStatus = selectedStatus === "all" || permission.status === selectedStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleCreatePermission = async (formData: any) => {
    try {
      const newPermission: Permission = {
        id: Date.now().toString(),
        ...formData,
        assignedRoles: 0,
        users: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPermissions([...permissions, newPermission]);
      toast.success("Permission created successfully");
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to create permission");
    }
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
  };

  const handleUpdatePermission = async (formData: any) => {
    if (!selectedPermission) return;
    
    try {
      setPermissions(permissions.map(p => 
        p.id === selectedPermission.id ? { ...p, ...formData } : p
      ));
      toast.success("Permission updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update permission");
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    try {
      setPermissions(permissions.filter(p => p.id !== permissionId));
      toast.success("Permission deleted successfully");
    } catch (error) {
      toast.error("Failed to delete permission");
    }
  };

  const PermissionForm = ({ permission, isEdit = false, onSubmit }: { 
    permission?: Permission; 
    isEdit?: boolean;
    onSubmit: (data: any) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: permission?.name || "",
      description: permission?.description || "",
      module: permission?.module || "",
      permissions: permission?.permissions || [],
      status: permission?.status || "active"
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
      permission?.permissions || []
    );

    const handlePermissionToggle = (permissionName: string) => {
      setSelectedPermissions(prev => {
        const updated = prev.includes(permissionName)
          ? prev.filter(p => p !== permissionName)
          : [...prev, permissionName];
        setFormData({ ...formData, permissions: updated });
        return updated;
      });
    };

    const selectedModuleData = PERMISSION_MODULES.find(m => m.id === formData.module);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ ...formData, permissions: selectedPermissions });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Permission Name</Label>
          <input
            id="name"
            className="w-full p-2-md mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter permission name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <input
            id="description"
            className="w-full p-2-md mt-1"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <Label htmlFor="module">Module</Label>
          <Select value={formData.module} onValueChange={(value) => setFormData({ ...formData, module: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {PERMISSION_MODULES.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedModuleData && (
          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {selectedModuleData.permissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={permission}
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={permission} className="capitalize">
                    {permission.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => isEdit ? setIsEditModalOpen(false) : setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Update" : "Create"} Permission
          </Button>
        </div>
      </form>
    );
  };

  const getPermissionId = useCallback((permission: Permission): number => {
    return parseInt(permission.id);
  }, []);
  
  const getPermissionDisplayName = useCallback((permission: Permission, isRTL: boolean): string => {
    return permission.name;
  }, []);

  const handleSelectPermission = (id: number) => {
    setSelectedTableRows(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAllPermissions = () => {
    if (allChecked) {
      setSelectedTableRows([]);
      setAllChecked(false);
    } else {
      setSelectedTableRows(filteredPermissions.map(p => parseInt(p.id)));
      setAllChecked(true);
    }
  };

  const tableColumns = [
    {
      key: "name",
      header: "Permission Name",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return (
          <div>
            <div className="font-medium">{permission.name}</div>
            <div className="text-sm text-gray-500">{permission.description}</div>
          </div>
        );
      }
    },
    {
      key: "module",
      header: "Module",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return (
          <span className="capitalize">
            {PERMISSION_MODULES.find(m => m.id === permission.module)?.name}
          </span>
        );
      }
    },
    {
      key: "permissions",
      header: "Permissions",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return (
          <div className="flex flex-wrap gap-1">
            {permission.permissions.slice(0, 3).map((perm) => (
              <Badge key={perm} variant="outline" className="text-xs">
                {perm}
              </Badge>
            ))}
            {permission.permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{permission.permissions.length - 3} more
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return (
          <Badge variant={permission.status === "active" ? "default" : "secondary"}>
            {permission.status}
          </Badge>
        );
      }
    },
    {
      key: "assignedRoles",
      header: "Assigned Roles",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return <span>{permission.assignedRoles}</span>;
      }
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (item: unknown) => {
        const permission = item as Permission;
        return <span className="text-sm text-gray-500">{permission.createdAt}</span>;
      }
    }
  ];

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Key className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Access Permissions</h1>
            <p className="text-muted-foreground">Manage user permissions and access controls</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <PermissionForm onSubmit={handleCreatePermission} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
                <p className="text-2xl font-bold">{permissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{permissions.filter((p: Permission) => p.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-gray-600"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{permissions.filter((p: Permission) => p.status === "inactive").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{permissions.reduce((sum: number, p: Permission) => sum + p.users, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 p-2-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {PERMISSION_MODULES.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <GenericTable
        data={filteredPermissions}
        columns={tableColumns}
        selected={selectedTableRows}
        page={currentPage}
        pageSize={pageSize}
        allChecked={allChecked}
        getItemId={getPermissionId}
        getItemDisplayName={getPermissionDisplayName}
        onSelectItem={handleSelectPermission}
        onSelectAll={handleSelectAllPermissions}
        onEditItem={(permission: Permission) => {
          setSelectedPermission(permission);
          setIsEditModalOpen(true);
        }}
        onDeleteItem={(permissionId: number) => {
          const permission = filteredPermissions.find(p => parseInt(p.id) === permissionId);
          if (permission) {
            handleDeletePermission(permission.id);
          }
        }}
        noDataMessage="No permissions found"
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        showActions={true}
      />

      {/* View Permission Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Permission Details</DialogTitle>
          </DialogHeader>
          {selectedPermission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Permission Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedPermission.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={selectedPermission.status === "active" ? "default" : "secondary"}>
                    {selectedPermission.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{selectedPermission.description}</p>
              </div>
              <div>
                <Label className="font-medium">Module</Label>
                <p className="text-sm text-muted-foreground capitalize">
                  {PERMISSION_MODULES.find(m => m.id === selectedPermission.module)?.name}
                </p>
              </div>
              <div>
                <Label className="font-medium">Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPermission.permissions.map((perm) => (
                    <Badge key={perm} variant="outline">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Users Assigned</Label>
                  <p className="text-sm text-muted-foreground">{selectedPermission.users}</p>
                </div>
                <div>
                  <Label className="font-medium">Created Date</Label>
                  <p className="text-sm text-muted-foreground">{selectedPermission.createdAt}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Permission Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <PermissionForm 
            permission={selectedPermission!} 
            isEdit={true} 
            onSubmit={handleUpdatePermission}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  permissions: string[];
  status: "active" | "inactive";
  assignedRoles: number;
  createdAt: string;
  users: number;
}

interface RolePermission {
  roleId: string;
  roleName: string;
  permissions: {
    [module: string]: {
      [permission: string]: boolean;
    };
  };
}
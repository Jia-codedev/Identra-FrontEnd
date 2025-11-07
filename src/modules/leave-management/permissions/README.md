# Permissions Module

This module handles employee short permissions management in the leave management system.

## Structure

```
permissions/
├── components/
│   ├── PermissionsHeader.tsx    # Search, add, delete header
│   ├── PermissionsList.tsx      # Data table with GenericTable
│   ├── PermissionRequestForm.tsx # Add/Edit modal form
│   ├── PermissionActions.tsx    # Action buttons for each row
├── hooks/
│   ├── usePermissions.ts        # Data fetching with infinite query
│   ├── useMutations.ts          # CRUD mutations
│   ├── useEmployeePermissions.ts # Employee-specific permissions
├── types/
│   └── index.ts                 # TypeScript interfaces
├── index.ts                     # Module exports
├── page.tsx                     # Main page component
└── README.md                    # This file
```

## Features

- ✅ List permissions with pagination
- ✅ Search by employee name
- ✅ Create new permission requests
- ✅ Edit existing permissions
- ✅ Delete single or multiple permissions
- ✅ View permission status (Pending/Approved/Rejected)
- ✅ Filter by permission type
- ✅ Responsive UI with dark mode support
- ✅ Permission-based access control

## API Integration

### Endpoints

- `GET /employeeShortPermission/all` - List all permissions
- `GET /employeeShortPermission/get/:id` - Get permission by ID
- `POST /employeeShortPermission/add` - Create new permission
- `PUT /employeeShortPermission/edit/:id` - Update permission
- `DELETE /employeeShortPermission/delete/:id` - Delete permission
- `PUT /employeeShortPermission/approve/:id` - Approve/Reject permission

### Data Model

```typescript
interface IPermission {
  employee_short_permission_id: number;
  employee_id: number;
  permission_type_id: number;
  from_date: string;
  to_date: string;
  from_time?: string;
  to_time?: string;
  remarks?: string;
  approve_reject_flag: number; // 0=Pending, 1=Approved, 2=Rejected
  employee_master?: {...};
  permission_types?: {...};
}
```

## Usage

### Import Components

```typescript
import {
  PermissionsHeader,
  PermissionsList,
  PermissionRequestForm,
  usePermissions,
  usePermissionMutations
} from '@/modules/leave-management/permissions';
```

### Use Hooks

```typescript
const { permissions, isLoading, refetch } = usePermissions();
const { createPermission, updatePermission, deletePermission } = usePermissionMutations();
```

## Security

This module uses `useSubModulePrivileges` to check permissions:
- Module: "self-services"
- Sub-module: "permission-management"

Permissions checked:
- `canView` - View permissions list
- `canCreate` - Create new permissions
- `canEdit` - Edit existing permissions
- `canDelete` - Delete permissions

## Translation Keys

```json
{
  "leaveManagement.permissions.title": "Permissions",
  "leaveManagement.permissions.columns.employee": "Employee",
  "leaveManagement.permissions.columns.type": "Type",
  "leaveManagement.permissions.columns.from": "From",
  "leaveManagement.permissions.columns.to": "To",
  "leaveManagement.permissions.columns.status": "Status",
  "leaveManagement.permissions.actions.add": "Add Permission",
  "leaveManagement.permissions.actions.edit": "Edit Permission",
  "leaveManagement.permissions.messages.created": "Permission created successfully",
  "leaveManagement.permissions.messages.updated": "Permission updated successfully",
  "leaveManagement.permissions.messages.deleted": "Permission deleted successfully"
}
```

## Similar Modules

This module follows the same pattern as:
- `masterdata/grades` - For UI structure and component organization
- `leave-management/permission-type` - For leave management domain

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `lodash` - Debouncing search
- `date-fns` - Date formatting
- `sonner` - Toast notifications
- Shadcn UI components

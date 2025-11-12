# Role Members Management Module

A fully functional role management system with organization filtering for managing user role assignments.

## Features

✅ **Member Management**
- View all members assigned to a specific role
- Add multiple members at once
- Remove members individually or in bulk
- Real-time search and filtering

✅ **Organization Filtering**
- Filter members by organization
- Async organization dropdown with search
- Persistent filter state

✅ **Advanced UI/UX**
- Pagination with customizable page size
- Bulk selection with "Select All" functionality
- Responsive design (mobile and desktop)
- Loading states and empty states
- RTL language support

✅ **Data Management**
- Automatic refetching after mutations
- Optimistic updates
- Error handling with toast notifications
- Duplicate prevention

## Components

### 1. **useMembers Hook** (`hooks/useMembers.ts`)
Custom hook that manages all state and data fetching for role members.

**Key Features:**
- Fetches role members with pagination
- Fetches available employees (non-members) with filters
- Manages search, organization filter, and pagination state
- Provides mutations for adding/removing members
- Handles bulk operations

**API:**
```typescript
const {
  members,              // Current role members
  availableEmployees,   // Employees not in this role
  selected,             // Selected member IDs
  search,               // Search query
  organizationFilter,   // Organization filter
  page,                 // Current page
  pageSize,             // Items per page
  setSearch,            // Update search
  setOrganizationFilter,// Update org filter
  addMembers,           // Add members to role
  removeMembers,        // Remove members from role
  ...
} = useMembers(roleId);
```

### 2. **MembersHeader** (`components/MembersHeader.tsx`)
Header component with search, filter, and action buttons.

**Features:**
- Search input for filtering members
- Organization combobox with async search
- "Add Members" button
- "Remove Selected" button (appears when items are selected)

### 3. **MembersTable** (`components/MembersTable.tsx`)
Table component displaying role members.

**Features:**
- Checkbox selection (individual and bulk)
- Displays employee number, name, organization, and effective date
- Individual remove action per row
- Pagination controls
- Page size selector
- Empty state when no members

### 4. **AddMembersDialog** (`components/AddMembersDialog.tsx`)
Modal dialog for adding new members to the role.

**Features:**
- Search available employees
- Bulk selection with "Select All"
- Shows employee details (number, name, organization)
- Filters out employees already in the role
- Scrollable list for large datasets

### 5. **ManageUserRoleMembers** (`view/page.tsx`)
Main page component that orchestrates all subcomponents.

**Features:**
- Manages dialog states
- Handles confirmation dialogs
- Integrates all components

## Backend Updates

### Updated Service (`secUserRoles.service.ts`)
Enhanced `getAllSecUserRoles` to include related data:

```typescript
include: {
  sec_roles: true,
  sec_users: {
    include: {
      employee_master: {
        include: {
          organizations: true,
        },
      },
    },
  },
}
```

This ensures the frontend receives complete employee and organization information.

## API Endpoints Used

1. **GET /secUserRole/all** - Fetch role members
   - Query params: `role_id`, `offset`, `limit`
   - Returns members with employee and organization details

2. **GET /employee/all** - Fetch available employees
   - Query params: `offset`, `limit`, `search`, `organization_id`
   - Returns employees not yet in the role

3. **POST /secUserRole/add** - Add member to role
   - Body: `user_id`, `role_id`, `effective_from_date`

4. **DELETE /secUserRole/delete/:id** - Remove member from role

## Usage Example

```tsx
import ManageUserRoleMembers from "@/modules/security/roles-management/members/view/page";

function RoleDetailsPage() {
  const roleId = 5; // From route params or props
  
  return (
    <div>
      <h1>Role Members</h1>
      <ManageUserRoleMembers roleId={roleId} />
    </div>
  );
}
```

## Translations Required

Add these keys to your translation files:

```json
{
  "security": {
    "roles": {
      "searchMembers": "Search members...",
      "addMembers": "Add Members",
      "removeSelected": "Remove Selected",
      "employeeNumber": "Employee No",
      "employeeName": "Employee Name",
      "organization": "Organization",
      "effectiveFrom": "Effective From",
      "noMembers": "No members found",
      "confirmRemove": "Confirm Remove",
      "confirmRemoveDescription": "Are you sure you want to remove these members?",
      "addMembersDescription": "Select employees to add as members to this role",
      "searchEmployees": "Search employees...",
      "noEmployeesAvailable": "No employees available",
      "roleIdRequired": "Role ID is required"
    }
  },
  "common": {
    "filterByOrganization": "Filter by organization",
    "selectAll": "Select All",
    "rowsPerPage": "Rows per page"
  }
}
```

## File Structure

```
members/
├── components/
│   ├── MembersHeader.tsx
│   ├── MembersTable.tsx
│   ├── AddMembersDialog.tsx
│   └── index.ts
├── hooks/
│   └── useMembers.ts
└── view/
    └── page.tsx
```

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `sonner` - Toast notifications
- `@/components/ui/*` - Shadcn UI components
- `@/services/security/securityRoles` - API client
- `@/services/employeemaster/employee` - Employee API client

## Performance Considerations

1. **Pagination** - Only loads necessary data per page
2. **Debounced Search** - Organization combobox uses debounced search
3. **Optimistic Updates** - Immediate UI feedback with automatic refetch
4. **Query Caching** - React Query caches responses for better performance
5. **Conditional Rendering** - Components only render when data is available

## Future Enhancements

- [ ] Export members list to CSV/Excel
- [ ] Bulk import members from file
- [ ] Advanced filters (by date range, status)
- [ ] Member activity history
- [ ] Role expiration date management
- [ ] Email notifications on role assignment

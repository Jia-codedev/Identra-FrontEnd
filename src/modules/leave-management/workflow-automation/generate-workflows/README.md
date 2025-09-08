# Generate Workflows Page

This page provides a comprehensive interface for creating workflow types and their associated steps in the leave management system.

## Features

### Workflow Configuration
- **Code**: Unique identifier for the workflow (auto-generated or manually entered)
- **Workflow Type**: Predefined categories like Leaves, Overtime, Training, etc.
- **Workflow Name**: English name for the workflow

### Dynamic Step Management
- **Add/Remove Steps**: Dynamic step creation with minimum of 1 step required
- **Step Configuration**:
  - Step Order: Automatically managed sequence
  - Step Name: Descriptive name for the workflow step
  - Role Assignment: Dropdown populated from system roles
  - Success/Failure Actions: Configurable outcomes

### Integration
- **Backend API**: Uses `/workflowType/add` and `/workflowTypeStep/add` endpoints
- **Role Management**: Integrates with security roles API
- **Navigation**: Seamless integration with existing workflow automation module

## API Endpoints Used

### Workflow Types
- `POST /workflowType/add` - Create new workflow type
- `GET /secRole/all` - Fetch available roles

### Workflow Steps
- `POST /workflowTypeStep/add` - Create workflow steps

## File Structure
```
workflow-automation/
├── generate-workflows/
│   └── page.tsx          # Main generate workflows page
├── components/
│   ├── WorkflowHeader.tsx
│   ├── WorkflowList.tsx
│   └── ...
└── page.tsx              # Main workflow automation page
```

## Usage

1. Navigate to Workflow Automation module
2. Click "Create Workflow" button in header
3. Fill workflow configuration details
4. Add/configure workflow steps
5. Assign roles to each step
6. Save to create the complete workflow

## Backend Schema Compatibility

The frontend is designed to work with the backend schema:

### Workflow Types Table
- `workflow_code` (required)
- `workflow_name_eng` / `workflow_name_arb`
- `workflow_category_eng` / `workflow_category_arb`

### Workflow Type Steps Table
- `workflow_id` (foreign key)
- `step_order` (sequence number)
- `step_eng` / `step_arb` (step descriptions)
- `role_id` (foreign key to roles)
- `is_final_step` (boolean flag)

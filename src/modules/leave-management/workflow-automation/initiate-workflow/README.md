# Workflow Request Initiation Module

## Overview
This module implements the `/workflowRequest/initiate` endpoint integration for frontend workflow request creation.

## Components Created

### 1. InitiateWorkflowPage (`/modules/leave-management/workflow-automation/initiate-workflow/page.tsx`)
- **Purpose**: Main component for initiating workflow requests
- **Features**:
  - Workflow selection from available workflow types
  - Transaction ID generation and management
  - Requestor ID input and validation
  - Request date selection
  - Action remarks text area
  - Real-time form validation
  - Success/error handling with toast notifications

### 2. Router Wrapper (`/app/(dashboard)/leave-management/workflow-automation/initiate-workflow/page.tsx`)
- **Purpose**: Next.js App Router integration
- **Route**: `/leave-management/workflow-automation/initiate-workflow`

### 3. Workflow Request Service (`/services/leaveManagement/workflowRequest.ts`)
- **Purpose**: API service layer for workflow request operations
- **Methods**:
  - `initiateWorkflow()`: Initiate workflow with automatic approval step creation
  - `getAllWorkflowRequests()`: Get all workflow requests with filtering
  - `getWorkflowRequestById()`: Get specific workflow request
  - `getWorkflowRequestsByRequestor()`: Get requests by requestor
  - `createWorkflowRequest()`: Create basic workflow request
  - `updateWorkflowRequest()`: Update workflow request
  - `updateWorkflowStatus()`: Update workflow status
  - `deleteWorkflowRequest()`: Delete workflow request

### 4. Updated WorkflowHeader Component
- **Added**: "Initiate Request" button with Play icon
- **Styling**: Green background color to distinguish from "Create Workflow"
- **Navigation**: Routes to initiate workflow page

### 5. Updated Main Workflow Page
- **Added**: `handleInitiateWorkflow()` method
- **Integration**: Connected header button to new functionality

## API Integration

### Backend Endpoint: `/workflowRequest/initiate`
- **Method**: POST
- **Purpose**: Creates workflow request and sets up ALL approval steps automatically
- **Required Fields**:
  - `workflow_id`: ID of the workflow type
  - `transaction_id`: Unique transaction identifier
  - `requestor_id`: Employee ID of the requestor
- **Optional Fields**:
  - `request_date`: Date of the request (defaults to current date)
  - `action_remarks`: Additional comments or context

### Request Flow
1. **Validation**: Frontend validates all required fields
2. **API Call**: POST to `/workflowRequest/initiate` with payload
3. **Backend Processing**:
   - Validates workflow and requestor existence
   - Creates workflow request record
   - Fetches all workflow steps for the selected workflow
   - Creates approval records for each step
   - Assigns first step as PENDING, others as WAITING
   - Returns complete workflow summary
4. **Frontend Response**: Shows success message with request ID

### Response Structure
```typescript
{
  message: "Workflow initiated successfully with all steps created",
  data: {
    workflow_request: { /* request details */ },
    current_step: { /* active step info */ },
    total_steps: number,
    all_approval_steps: [ /* array of approval steps */ ],
    workflow_summary: { /* summary with IDs and status */ }
  }
}
```

## Usage Instructions

### For End Users
1. Navigate to Workflow Automation page
2. Click "Initiate Request" (green button)
3. Select desired workflow from dropdown
4. Enter/Generate transaction ID
5. Enter requestor employee ID
6. Select request date
7. Add optional remarks
8. Click "Initiate Workflow" to submit

### For Developers
```typescript
// Import the service
import workflowRequestApi from "@/services/leaveManagement/workflowRequest";

// Initiate a workflow
const response = await workflowRequestApi.initiateWorkflow({
  workflow_id: 1,
  transaction_id: 123456,
  requestor_id: 101,
  request_date: "2025-01-08T10:00:00.000Z",
  action_remarks: "Annual leave request"
});
```

## Features

### Form Validation
- All required fields validated before submission
- Transaction ID and Requestor ID must be numeric
- Workflow selection is mandatory
- Real-time character count for remarks (500 char limit)

### User Experience
- Auto-generated transaction IDs
- Default request date to today
- Loading states for all API calls
- Toast notifications for success/error states
- Responsive design for mobile/desktop
- Instructions panel with helpful tips

### Error Handling
- Network error handling
- Backend validation error display
- Form validation with specific error messages
- Graceful fallbacks for missing data

## Testing

### Prerequisites
1. Ensure backend API is running
2. Have valid workflow types created
3. Have valid employee IDs in the system

### Test Cases
1. **Happy Path**: Select workflow, fill all fields, initiate successfully
2. **Validation**: Try submitting with missing required fields
3. **Invalid Data**: Use non-numeric IDs, non-existent workflow
4. **Network Issues**: Test with API disconnected
5. **Large Remarks**: Test character limit enforcement

### Sample Test Data
```json
{
  "workflow_id": 1,
  "transaction_id": 1736337123456,
  "requestor_id": 101,
  "request_date": "2025-01-08T10:00:00.000Z",
  "action_remarks": "Test workflow initiation from frontend"
}
```

## Integration Points

### Navigation
- Main workflow page → Generate workflows (existing)
- Main workflow page → Initiate workflow (new)
- Both pages → Back to main workflow page

### Services
- `workflowTypesApi`: For fetching available workflows
- `workflowRequestApi`: For initiating and managing workflow requests

### Dependencies
- React hooks for state management
- Next.js router for navigation
- Axios for API calls
- Sonner for toast notifications
- Lucide React for icons
- shadcn/ui for components

## Future Enhancements

### Potential Improvements
1. **Employee Search**: Add employee dropdown with search
2. **Workflow Preview**: Show workflow steps before initiation
3. **Bulk Initiation**: Support multiple requests at once
4. **Templates**: Save and reuse common request patterns
5. **Real-time Status**: WebSocket updates for approval progress
6. **Attachments**: Support file uploads with requests
7. **History**: Show previous requests by current user
8. **Approval Dashboard**: Separate page for approvers

### Technical Debt
1. Add comprehensive unit tests
2. Implement proper TypeScript interfaces for all API responses
3. Add API response caching
4. Implement optimistic updates
5. Add accessibility improvements
6. Performance optimization for large workflow lists

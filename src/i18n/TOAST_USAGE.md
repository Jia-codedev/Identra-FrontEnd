# Toast Messages Usage Guide

## Overview
Toast messages provide user feedback for various actions in both English and Arabic languages. They are organized by categories for easy maintenance and consistent messaging.

## Structure
```
toast.json
├── success/      # Success messages
├── error/        # Error messages  
├── warning/      # Warning messages
├── info/         # Informational messages
├── auth/         # Authentication related
├── employee/     # Employee management
├── attendance/   # Attendance & time tracking
├── masterData/   # Master data operations
└── system/       # System operations
```

## Usage Examples

### Basic Usage
```typescript
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';

function MyComponent() {
  const t = useTranslations('toast');
  
  const handleSave = async () => {
    try {
      await saveData();
      toast.success(t('success.saved'));
    } catch (error) {
      toast.error(t('error.saveFailed'));
    }
  };
}
```

### Category-specific Usage
```typescript
// Authentication toasts
const authT = useTranslations('toast.auth');
toast.success(authT('loginSuccess'));
toast.error(authT('loginFailed'));

// Employee management toasts  
const empT = useTranslations('toast.employee');
toast.success(empT('created'));
toast.success(empT('updated'));

// Master data toasts
const masterT = useTranslations('toast.masterData');
toast.success(masterT('regionCreated'));
toast.success(masterT('organizationUpdated'));
```

### With Custom Toast Components
```typescript
import { useTranslations } from 'next-intl';
import { toast } from 'sonner'; // or any toast library

function showSuccessToast(key: string) {
  const t = useTranslations('toast.success');
  toast.success(t(key), {
    duration: 3000,
    position: 'top-right'
  });
}

// Usage
showSuccessToast('saved');
showSuccessToast('updated');
```

## Available Categories

### Success Messages
- `general` - General success message
- `saved` - Data saved successfully
- `updated` - Data updated successfully  
- `deleted` - Data deleted successfully
- `created` - Data created successfully
- `uploaded` - File uploaded successfully
- `approved` - Approved successfully
- `submitted` - Submitted successfully

### Error Messages
- `general` - General error message
- `network` - Network error
- `server` - Server error
- `unauthorized` - Unauthorized access
- `validation` - Validation error
- `uploadFailed` - File upload failed
- `saveFailed` - Save operation failed
- `connectionLost` - Connection lost

### Warning Messages
- `unsavedChanges` - Unsaved changes warning
- `deleteConfirmation` - Delete confirmation
- `permanentAction` - Permanent action warning
- `sessionExpiring` - Session expiring soon
- `formIncomplete` - Form incomplete warning

### Info Messages
- `loading` - Loading indicator
- `processing` - Processing request
- `noData` - No data available
- `noResults` - No search results
- `allCaughtUp` - All caught up message

## Best Practices

### 1. Use Appropriate Categories
```typescript
// ✅ Good - specific category
const t = useTranslations('toast.employee');
toast.success(t('created'));

// ❌ Avoid - generic category for specific action
const t = useTranslations('toast.success');
toast.success(t('general'));
```

### 2. Consistent Error Handling
```typescript
try {
  await operation();
  toast.success(t('toast.success.saved'));
} catch (error) {
  if (error.status === 401) {
    toast.error(t('toast.error.unauthorized'));
  } else if (error.status === 500) {
    toast.error(t('toast.error.server'));
  } else {
    toast.error(t('toast.error.general'));
  }
}
```

### 3. Context-aware Messages
```typescript
// Different contexts, different messages
function handleEmployeeCreation() {
  const empT = useTranslations('toast.employee');
  toast.success(empT('created')); // "Employee created successfully"
}

function handleRegionCreation() {
  const masterT = useTranslations('toast.masterData');
  toast.success(masterT('regionCreated')); // "Region created successfully"
}
```

## Localization Support

Both English and Arabic translations are provided:

```typescript
// English: "Data saved successfully"
// Arabic: "تم حفظ البيانات بنجاح"
toast.success(t('toast.success.saved'));

// English: "Employee created successfully"  
// Arabic: "تم إنشاء الموظف بنجاح"
toast.success(t('toast.employee.created'));
```

## Integration with Toast Libraries

### React Hot Toast
```typescript
import toast from 'react-hot-toast';

toast.success(t('toast.success.saved'), {
  duration: 4000,
  position: 'top-center',
});
```

### Sonner
```typescript
import { toast } from 'sonner';

toast.success(t('toast.success.saved'), {
  description: t('toast.info.processing')
});
```

### React Toastify
```typescript
import { toast } from 'react-toastify';

toast.success(t('toast.success.saved'), {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
```

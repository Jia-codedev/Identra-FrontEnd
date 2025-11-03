# Regions Module

A fully optimized and internationalized regions management module for the Chronexa application.

## 🏗️ **File Structure**

```
regions/
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── data/
│   └── mockData.ts           # Mock data for development
├── hooks/
│   └── useRegions.ts         # Custom hook for regions management
├── components/
│   ├── RegionsHeader.tsx     # Header component with search and actions
│   ├── RegionsTable.tsx      # Data table component
│   ├── RegionsPagination.tsx # Pagination component
│   └── RegionModal.tsx       # Add/Edit modal component
├── view/
│   └── page.tsx              # Main page component
├── index.ts                  # Module exports
└── README.md                 # This documentation
```

## 🎯 **Features**

### **✅ Core Functionality**
- **CRUD Operations**: Create, Read, Update, Delete regions
- **Search & Filter**: Real-time search across name, code, and country
- **Pagination**: Efficient data pagination with configurable page size
- **Bulk Selection**: Select multiple regions for bulk operations
- **Responsive Design**: Mobile-first responsive layout

### **✅ Internationalization**
- **Multi-language Support**: English and Arabic translations
- **RTL Support**: Full right-to-left layout for Arabic
- **Dynamic Labels**: All UI text is translatable
- **Accessibility**: Proper ARIA labels and keyboard navigation

### **✅ Professional Features**
- **Type Safety**: Full TypeScript support with strict typing
- **Performance Optimized**: Memoized components and efficient state management
- **Modular Architecture**: Reusable components and hooks
- **Error Handling**: Graceful error states and user feedback

## 🚀 **Usage**

### **Basic Implementation**
```tsx
import { RegionsPage } from '@/modules/masterdata/regions';

export default function MyPage() {
  return <RegionsPage />;
}
```

### **Using Individual Components**
```tsx
import { 
  RegionsHeader, 
  RegionsTable, 
  useRegions 
} from '@/modules/masterdata/regions';

function CustomRegionsPage() {
  const regionsHook = useRegions();
  
  return (
    <div>
      <RegionsHeader {...headerProps} />
      <RegionsTable {...tableProps} />
    </div>
  );
}
```

### **Using the Hook**
```tsx
import { useRegions } from '@/modules/masterdata/regions';

function MyComponent() {
  const {
    regions,
    selected,
    search,
    page,
    setSearch,
    selectRegion,
    addRegion,
    deleteRegion,
  } = useRegions();

  // Use the hook methods...
}
```

## 📊 **Data Structure**

### **Region Interface**
```typescript
interface Region {
  id: number;
  name: string;
  code: string;
  country?: string;
  timezone?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### **Form Data Interface**
```typescript
interface RegionFormData {
  name: string;
  code: string;
  country?: string;
  timezone?: string;
  currency?: string;
}
```

## 🌍 **Internationalization**

### **Translation Keys**
```json
{
  "masterData": {
    "regions": {
      "title": "Regions",
      "description": "Manage all your organization regions here...",
      "addRegion": "Add Region",
      "editRegion": "Edit Region",
      "regionName": "Region Name",
      "regionCode": "Region Code",
      "country": "Country",
      "timezone": "Timezone",
      "currency": "Currency",
      "searchPlaceholder": "Search regions...",
      "noRegionsFound": "No regions found.",
      "enterRegionName": "Enter region name",
      "enterRegionCode": "Enter region code",
      "enterCountry": "Enter country",
      "enterTimezone": "Enter timezone (e.g., UTC+1)",
      "enterCurrency": "Enter currency (e.g., USD)"
    }
  }
}
```

### **Arabic Translations**
All text is automatically translated to Arabic with proper RTL layout support.

## 🎨 **Styling**

### **Design System**
- **Consistent Theming**: Uses the application's design system
- **Responsive Grid**: Adapts to different screen sizes
- **Smooth Animations**: Framer Motion animations for better UX
- **Accessibility**: High contrast and keyboard navigation support

### **RTL Support**
- **Automatic Layout**: Switches to RTL for Arabic
- **Text Alignment**: Right-aligned text in Arabic
- **Icon Positioning**: Icons reposition for RTL
- **Animation Direction**: Animations adapt to RTL

## 🔧 **Customization**

### **Modifying Page Size**
```typescript
// In useRegions.ts
const PAGE_SIZE = 10; // Change from 5 to 10
```

### **Adding New Fields**
```typescript
// In types/index.ts
interface Region {
  // ... existing fields
  population?: number;
  area?: string;
}
```

### **Custom Styling**
```tsx
// Override component styles
<RegionsTable 
  className="custom-table-class"
  // ... other props
/>
```

## 🧪 **Testing**

### **Component Testing**
```tsx
import { render, screen } from '@testing-library/react';
import { RegionsPage } from '@/modules/masterdata/regions';

test('renders regions page', () => {
  render(<RegionsPage />);
  expect(screen.getByText('Regions')).toBeInTheDocument();
});
```

### **Hook Testing**
```tsx
import { renderHook, act } from '@testing-library/react';
import { useRegions } from '@/modules/masterdata/regions';

test('useRegions hook', () => {
  const { result } = renderHook(() => useRegions());
  
  act(() => {
    result.current.setSearch('Europe');
  });
  
  expect(result.current.search).toBe('Europe');
});
```

## 📈 **Performance**

### **Optimizations**
- **Memoized Components**: React.memo for expensive components
- **Efficient Filtering**: Debounced search with useMemo
- **Lazy Loading**: Components load only when needed
- **State Management**: Optimized state updates with useCallback

### **Bundle Size**
- **Tree Shaking**: Only import what you need
- **Code Splitting**: Components are code-split automatically
- **Minimal Dependencies**: Uses only essential dependencies

## 🔒 **Security**

### **Input Validation**
- **Form Validation**: Required fields and format validation
- **XSS Prevention**: Sanitized inputs and outputs
- **Type Safety**: TypeScript prevents runtime errors

## 📝 **Best Practices**

### **Code Organization**
- **Separation of Concerns**: Logic, UI, and data are separated
- **Reusable Components**: Components are modular and reusable
- **Consistent Naming**: Clear and descriptive naming conventions
- **Documentation**: Well-documented code and interfaces

### **Performance**
- **Avoid Re-renders**: Use React.memo and useCallback
- **Efficient State**: Minimize state updates and use proper state structure
- **Optimized Queries**: Efficient data filtering and pagination

This module provides a complete, production-ready solution for regions management with full internationalization support and professional-grade architecture. 
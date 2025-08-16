# Nationalities Module

This module provides a complete CRUD interface for managing nationalities in the master data section. It uses the citizenship API endpoint from the backend.

## Features

- ✅ View all nationalities with pagination
- ✅ Search nationalities by name or code
- ✅ Add new nationalities
- ✅ Edit existing nationalities
- ✅ Delete single or multiple nationalities
- ✅ Multi-language support (English/Arabic)
- ✅ Responsive design
- ✅ Real-time updates with React Query

## File Structure

```
nationalities/
├── components/
│   ├── NationalitiesTable.tsx    # Main table component
│   ├── NationalityModal.tsx      # Add/Edit modal
│   ├── NationalitiesHeader.tsx   # Header with search and actions
│   └── index.ts                  # Component exports
├── hooks/
│   ├── useNationalities.ts       # Main data fetching hook
│   └── useMutations.ts          # CRUD operations hook
├── types/
│   └── index.ts                 # TypeScript interfaces
├── view/
│   └── page.tsx                 # Main page component
└── index.ts                     # Module exports
```

## Usage

### Accessing the Page
Navigate to `/masterdata/nationalities` in your browser.

### API Endpoints Used
- `GET /citizenship/all` - Fetch nationalities with pagination
- `GET /citizenship/get/{id}` - Get single nationality
- `POST /citizenship/add` - Create new nationality
- `PUT /citizenship/edit/{id}` - Update nationality
- `DELETE /citizenship/delete/{id}` - Delete single nationality
- `DELETE /citizenship/delete` - Delete multiple nationalities

### Data Structure

```typescript
interface INationality {
    citizenship_id: number;
    citizenship_code: string;
    citizenship_eng?: string;
    citizenship_arb?: string;
    created_id?: number; 
    created_date?: Date;
    last_updated_id?: number; 
    last_updated_date?: Date;
}
```

## Integration with Existing System

The module integrates seamlessly with:
- **Navigation**: Already configured in `use-navigation.ts`
- **Translations**: Added to both English and Arabic locale files
- **Styling**: Uses the same UI components as other master data modules
- **State Management**: Uses React Query for data fetching and caching

## Translation Keys

### English (`src/i18n/locales/en.json`)
```json
"nationalities": {
  "title": "Nationalities",
  "description": "Manage all your nationalities here...",
  "addNationality": "Add Nationality",
  "editNationality": "Edit Nationality",
  "nationalityName": "Nationality Name",
  "nationalityNameArabic": "Nationality Name (Arabic)",
  "nationalityCode": "Nationality Code",
  "searchPlaceholder": "Search nationalities...",
  "noNationalitiesFound": "No nationalities found.",
  "enterNationalityName": "Enter nationality name",
  "enterNationalityNameArabic": "Enter nationality name in Arabic",
  "enterNationalityCode": "Enter nationality code"
}
```

### Arabic (`src/i18n/locales/ar.json`)
```json
"nationalities": {
  "title": "الجنسيات",
  "description": "قم بإدارة جميع الجنسيات هنا...",
  "addNationality": "إضافة جنسية",
  // ... rest of translations
}
```

## Components

### NationalitiesPage
Main page component that orchestrates all functionality.

### NationalitiesTable  
Displays nationalities in a paginated table with selection and action capabilities.

### NationalityModal
Modal form for adding and editing nationalities with validation.

### NationalitiesHeader
Header section with title, search functionality, and action buttons.

## Hooks

### useNationalities
Manages fetching, pagination, search, and selection state.

### useNationalityMutations  
Handles all CRUD operations with optimistic updates and error handling.

## Notes

- The module reuses the citizenship API endpoints from the backend
- Both English and Arabic names are optional but at least one is recommended
- Nationality codes are automatically converted to uppercase
- The module follows the same patterns as other master data modules (grades, regions, etc.)
- All form inputs include proper validation and error handling

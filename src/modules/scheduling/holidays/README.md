# Holidays Module

This is a comprehensive holidays management module for the frontend application. It provides full CRUD operations for managing company holidays and observances.

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete holidays
- ✅ **Advanced Filtering**: Filter by year, month, recurring flag, public holiday flag
- ✅ **Search Functionality**: Search holidays by name (English/Arabic) and remarks
- ✅ **Bilingual Support**: Full English and Arabic language support
- ✅ **Responsive Design**: Works perfectly on desktop and mobile devices
- ✅ **Date Range Support**: Support for single-day and multi-day holidays
- ✅ **Bulk Operations**: Select and delete multiple holidays
- ✅ **Data Validation**: Client-side validation with proper error handling
- ✅ **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Backend API Endpoints Used

- `GET /holiday/all` - Get all holidays with optional filters
- `GET /holiday/get/:id` - Get holiday by ID
- `POST /holiday/add` - Create new holiday
- `PUT /holiday/edit/:id` - Update existing holiday
- `DELETE /holiday/delete/:id` - Delete holiday
- `GET /holiday/upcoming` - Get upcoming holidays

## File Structure

```
src/app/_modules/scheduling/holidays/
├── components/
│   ├── HolidaysHeader.tsx      # Header with search and filters
│   ├── HolidaysTable.tsx       # Data table with pagination
│   └── HolidayModal.tsx        # Add/Edit modal form
├── hooks/
│   ├── useHolidays.ts          # Main data fetching hook
│   └── useMutations.ts         # CRUD operations hook
├── types/
│   └── index.ts                # TypeScript interfaces
├── view/
│   └── page.tsx                # Main page component
└── index.ts                    # Exports
```

## Usage

The module is automatically integrated into the scheduling section and can be accessed at `/scheduling/holidays`.

### Key Components

1. **HolidaysHeader**: Search, filters, and action buttons
2. **HolidaysTable**: Displays holidays with sorting and selection
3. **HolidayModal**: Form for creating/editing holidays
4. **CustomPagination**: Pagination controls

### Hooks

1. **useHolidays**: Manages holiday data, search, filters, and pagination
2. **useHolidayMutations**: Handles CRUD operations with toast notifications

## Translation Keys

All text is internationalized using the following translation keys:

- `scheduling.holidays.*` - Holiday-specific translations
- `common.*` - Common UI text and actions
- `messages.*` - Success/error messages

## Data Validation

The module includes comprehensive validation:

- Required fields: Holiday names (English/Arabic), dates
- Date validation: End date must be after or equal to start date
- Form validation using Zod schema with React Hook Form

## Features in Detail

### Filtering
- Year selection (current year ±2)
- Month selection
- Recurring holidays filter
- Public holiday filter

### Search
- Real-time search across holiday names and remarks
- Debounced for performance (300ms delay)

### Date Handling
- Support for single-day holidays
- Support for multi-day holiday ranges
- Proper timezone handling
- Date formatting based on locale

### Responsive Design
- Mobile-first approach
- Responsive tables and forms
- Touch-friendly interface

## Dependencies

- React Query (TanStack Query) for data fetching
- React Hook Form for form management
- Zod for schema validation
- shadcn/ui for UI components
- Tailwind CSS for styling
- date-fns for date formatting
- Lucide React for icons

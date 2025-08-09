# i18n Organization Documentation

## Overview
The i18n translations have been reorganized into a modular structure for better maintainability, collaboration, and scalability.

## New Structure

```
src/i18n/
├── client.ts
├── config.ts
└── locales/
    ├── en/
    │   ├── common.json          # Shared UI elements, navigation, messages
    │   ├── auth.json            # Authentication & login related
    │   ├── dashboard.json       # Dashboard specific translations
    │   ├── master-data.json     # Master data management (regions, grades, etc.)
    │   ├── employee.json        # Employee management & forms
    │   ├── scheduling.json      # Scheduling & time management
    │   ├── settings.json        # Application settings & preferences
    │   ├── validation.json      # Form validation messages
    │   └── chatbot.json         # Chatbot interactions & responses
    └── ar/
        ├── common.json
        ├── auth.json
        ├── dashboard.json
        ├── master-data.json
        ├── employee.json
        ├── scheduling.json
        ├── settings.json
        ├── validation.json
        └── chatbot.json
```

## Module Descriptions

### common.json
- Basic UI elements (buttons, labels, statuses)
- Navigation items
- System messages (success, error, confirmation)
- Pagination controls
- Shared terminology

### auth.json
- Login/logout flows
- Password management
- Account creation
- Authentication errors

### dashboard.json
- Dashboard widgets
- Statistics labels
- Quick actions
- Overview elements

### master-data.json
- Regions management
- Grades and designations
- Nationalities
- Organizations and organization types
- All master data CRUD operations

### employee.json
- Employee forms and management
- Employee types and groups
- Personal information fields
- Employment settings
- Employee-related workflows

### scheduling.json
- Calendar and scheduling
- Shifts and rosters
- Time tracking
- Attendance management
- Leave and overtime

### settings.json
- Application preferences
- Appearance settings
- Notification configurations
- System settings

### validation.json
- Form validation messages
- Input requirements
- Error states
- Data format validations

### chatbot.json
- Chatbot responses
- Available actions
- Form interactions
- Status messages

## Usage

### Basic Usage
```typescript
import { useTranslations } from 'next-intl';

// Use specific module
const t = useTranslations('auth');
const loginText = t('login');

// Use common module
const common = useTranslations('common');
const saveButton = common('save');
```

### Nested Access
```typescript
// Access nested properties
const masterData = useTranslations('masterData');
const regionTitle = masterData('regions.title');

// Or access through common navigation
const nav = useTranslations('navigation');
const regionsNav = nav('regions');
```

## Migration Guide

### From Old Structure
The old flat structure is still supported for backward compatibility:
```typescript
// Old way (still works)
const t = useTranslations();
const dashboard = t('common.dashboard');

// New way (recommended)
const common = useTranslations('common');
const dashboard = common('dashboard');
```

### Updating Components
1. Replace `useTranslations()` with specific module calls
2. Update translation keys to match new structure
3. Remove redundant prefixes (e.g., `common.save` → `save`)

## Benefits

1. **Maintainability**: Smaller, focused files are easier to edit and review
2. **Team Collaboration**: Multiple developers can work on different modules simultaneously
3. **Performance**: Potential for lazy loading specific translation modules
4. **Type Safety**: Better IntelliSense support with focused modules
5. **Organization**: Clear separation of concerns by feature area
6. **Scalability**: Easy to add new modules as the application grows

## Development Workflow

### Adding New Translations
1. Identify the appropriate module (or create a new one)
2. Add the key-value pair to both `en/` and `ar/` versions
3. Update the config.ts if adding a new module
4. Test with both languages

### Creating New Modules
1. Create the JSON files in both language folders
2. Import the module in `config.ts`
3. Add to the messages object in the config
4. Document the module purpose in this README

## Backward Compatibility

The new structure maintains backward compatibility with existing code. All previously working translation keys will continue to function without modification.

## Future Enhancements

- TypeScript definitions for translation keys
- Automatic validation of translation completeness
- Dynamic module loading for performance optimization
- Translation management CLI tools

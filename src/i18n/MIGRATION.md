# i18n Migration Guide

## What Changed?

The i18n translations have been reorganized from large single files (`en.json`, `ar.json`) into smaller, feature-based modules for better organization and maintainability.

## Before vs After

### Before (Old Structure)
```
locales/
├── en.json (649 lines - huge file!)
└── ar.json (651 lines - huge file!)
```

### After (New Structure)
```
locales/
├── en/
│   ├── common.json       # 🔧 UI elements, navigation
│   ├── auth.json         # 🔐 Login, authentication
│   ├── dashboard.json    # 📊 Dashboard widgets
│   ├── master-data.json  # 📋 Regions, grades, etc.
│   ├── employee.json     # 👥 Employee management
│   ├── scheduling.json   # 📅 Time & scheduling
│   ├── settings.json     # ⚙️ App settings
│   ├── validation.json   # ✅ Form validations
│   └── chatbot.json      # 🤖 Chatbot interactions
└── ar/ (same structure)
```

## Usage Examples

### ✅ New Way (Recommended)
```typescript
import { useTranslations } from 'next-intl';

// Specific modules
const auth = useTranslations('auth');
const loginText = auth('login');

const common = useTranslations('common');
const saveBtn = common('save');

const masterData = useTranslations('masterData');
const regionTitle = masterData('regions.title');
```

### ⚠️ Old Way (Still Works - Backward Compatible)
```typescript
const t = useTranslations();
const loginText = t('auth.login');        // Still works
const saveBtn = t('common.save');         // Still works
const regionTitle = t('masterData.regions.title'); // Still works
```

## Migration Steps

1. **No Immediate Changes Required** - Your existing code will continue to work
2. **Gradually Update**: When you're editing a component, consider updating to the new modular approach
3. **Add New Translations**: Add them to the appropriate module file

## Benefits

- 🚀 **Faster Development**: Find translations quickly in smaller files
- 👥 **Better Collaboration**: Multiple developers can work on different modules
- 🧹 **Cleaner Code**: More focused and organized translation files
- 🔍 **Easier Maintenance**: Clear separation by feature area
- 📈 **Scalable**: Easy to add new features without cluttering

## Quick Reference

| Module | Use For |
|--------|---------|
| `common` | Buttons, navigation, basic UI |  
| `auth` | Login, password, authentication |
| `dashboard` | Dashboard widgets, statistics |
| `masterData` | Regions, grades, organizations |
| `employee` | Employee forms, management |
| `scheduling` | Calendar, shifts, attendance |
| `settings` | App preferences, appearance |
| `validation` | Form error messages |
| `chatbot` | AI assistant interactions |

## Need Help?

- Check the full documentation in `src/i18n/README.md`
- Look at existing components for examples
- Ask the team for guidance on which module to use

---
*This migration maintains 100% backward compatibility - your existing code will not break!*

"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/providers/language-provider';
import { useTranslations } from '@/hooks/use-translations';

const LANGUAGES = [
  { code: 'en', label: 'English', image: '/lang/usa.svg' },
  { code: 'ar', label: 'العربية', image: '/lang/uae.svg' },
];

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'desktop',
  className = '',
}) => {
  const { currentLocale, setLanguage } = useLanguage();
  const { t } = useTranslations();

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale);

  const handleLanguageChange = (locale: string) => {
    setLanguage(locale);
  };

  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col bg-background space-y-2 ${className}`}>
        <span className="text-xs text-muted-foreground bg-background">
          {t('common.language')}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
          asChild>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label={t('common.language')}
              type="button"
            >
              <span className="flex items-center gap-2">
                <Image
                  src={currentLanguage?.image || '/lang/usa.svg'}
                  alt={currentLanguage?.label || 'Language'}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="text-sm">{currentLanguage?.label}</span>
              </span>
              <ChevronDown size={14} className="ml-auto" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2 ${
                  currentLocale === lang.code ? 'font-semibold bg-muted' : ''
                }`}
              >
                <Image
                  src={lang.image}
                  alt={lang.label}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="text-sm">{lang.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${className}`}
          aria-label={t('common.language')}
          type="button"
        >
          <span className="flex items-center gap-1">
            <Image
              src={currentLanguage?.image || '/lang/usa.svg'}
              alt={currentLanguage?.label || 'Language'}
              width={16}
              height={16}
              className="rounded-sm"
            />
            <span className="text-xs">{currentLanguage?.label}</span>
          </span>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 ${
              currentLocale === lang.code ? 'font-semibold bg-muted' : ''
            }`}
          >
            <Image
              src={lang.image}
              alt={lang.label}
              width={16}
              height={16}
              className="rounded-sm"
            />
            <span className="text-xs">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 
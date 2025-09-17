"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppTheme } from '@/providers/app-theme-provider';
import { primaryThemeHexa } from '@/utils/themes';
import { useTranslations } from '@/hooks/use-translations';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Check,
  Paintbrush,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppearancePage() {
  const { t } = useTranslations();
  const { primaryColor, setPrimaryColor, theme, setTheme, mounted } = useAppTheme();

  const themeOptions = [
    {
      value: 'light',
      label: t('appearance.light'),
      description: t('appearance.lightDescription'),
      icon: Sun,
    },
    {
      value: 'dark', 
      label: t('appearance.dark'),
      description: t('appearance.darkDescription'),
      icon: Moon,
    },
    {
      value: 'system',
      label: t('appearance.system'),
      description: t('appearance.systemDescription'),
      icon: Monitor,
    },
  ];

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('appearance.title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('appearance.description')}
        </p>
      </div>

      {/* Theme Mode Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {t('appearance.themeMode')}
          </CardTitle>
          <CardDescription>
            {t('appearance.themeModeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary shadow-lg' 
                        : 'hover:border-muted-foreground/30'
                    }`}
                    onClick={() => setTheme(option.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-primary"
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Primary Color Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5" />
            {t('appearance.primaryColor')}
          </CardTitle>
          <CardDescription>
            {t('appearance.primaryColorDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Color Display */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div 
                className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-white/20"
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <p className="font-medium">{t('appearance.currentColor')}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {primaryColor.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <AnimatePresence>
                {primaryThemeHexa.map((color, index) => {
                  const isSelected = primaryColor === color.hex;
                  
                  return (
                    <motion.div
                      key={color.hex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                          isSelected 
                            ? 'ring-2 ring-offset-2 ring-primary shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setPrimaryColor(color.hex)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            {/* Color Preview */}
                            <div 
                              className="w-full h-20"
                              style={{ backgroundColor: color.hex }}
                            />
                            
                            {/* Selected Indicator */}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <Check className="w-5 h-5 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Color Info */}
                          <div className="p-3">
                            <h3 className="font-medium text-sm">{color.name}</h3>
                            <p className="text-xs text-muted-foreground font-mono">
                              {color.hex}
                            </p>
                            {color.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {color.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('appearance.preview')}
          </CardTitle>
          <CardDescription>
            {t('appearance.previewDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample UI Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Button className="w-full">
                  {t('appearance.primaryButton')}
                </Button>
                <Button variant="outline" className="w-full">
                  {t('appearance.secondaryButton')}
                </Button>
              </div>
              <div className="space-y-3">
                <Badge className="w-full justify-center py-2">
                  {t('appearance.sampleBadge')}
                </Badge>
                <div className="p-3-lg">
                  <div className="w-full h-2 bg-primary rounded-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('appearance.sampleProgress')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

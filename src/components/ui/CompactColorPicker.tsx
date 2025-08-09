"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppTheme } from '@/providers/app-theme-provider';
import { primaryThemeHexa } from '@/utils/themes';
import { cn } from '@/lib/utils';

interface CompactColorPickerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CompactColorPicker({ className, size = 'md' }: CompactColorPickerProps) {
  const { primaryColor, setPrimaryColor } = useAppTheme();

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  };

  const checkSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {primaryThemeHexa.map((color) => {
        const isSelected = primaryColor === color.hex;
        
        return (
          <motion.button
            key={color.hex}
            className={cn(
              "relative rounded-full border-2 border-transparent transition-all duration-200 hover:scale-110",
              sizeClasses[size],
              isSelected && "border-white shadow-lg ring-2 ring-offset-2 ring-current"
            )}
            style={{ 
              backgroundColor: color.hex,
              color: color.hex
            }}
            onClick={() => setPrimaryColor(color.hex)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={color.name}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className={cn("text-white", checkSizes[size])} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

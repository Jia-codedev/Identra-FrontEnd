'use client';
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const baseClasses = `w-auto h-10 flex items-center justify-center gap-2 border px-3 capitalize`;

const variantsLookup = {
  primary: `bg-primary text-white border-primary`,
  cancel: `bg-[#8080801A] text-[#808080CC] border-border-grey`,
  success: `bg-success text-white border-success`,
  danger: `bg-danger text-white border-danger`,
  outline: `bg-transparent text-[rgba(128,128,128,0.8)] border-[rgba(128,128,128,0.8)]`,
  primaryoutline: `bg-[#F1F8FD] text-primary border-[#C1DEF5] shadow-button`,
};

const borderRadiusLookup = {
  full: `rounded-full`,
  lg: `rounded-lg`,
  md: `rounded-md`,
};

type ButtonProps = {
  variant?: 'outline' | 'primary' | 'cancel' | 'success' | 'danger' | 'primaryoutline' ;
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: 'full' | 'lg' | 'md';
  btnText?: React.ReactNode;
  btnIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

// eslint-disable-next-line react/display-name
const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, width, height, variant, borderRadius, btnText, btnIcon, onClick, disabled, ...rest } = props;
  const classes = cn([
    baseClasses,
    variantsLookup[variant || 'outline'],
    borderRadiusLookup[borderRadius || 'lg'],
    className,
    disabled ? 'cursor-not-allowed opacity-50 text-secondary' : 'cursor-pointer',
  ]);
  return (
    <button 
        {...rest} 
        className={classes} 
        ref={ref} 
        onClick={onClick}
        style={{
            height,
            width
        }}
        disabled={disabled}
    >
        {btnIcon}
        {btnText}
    </button>
  );
});

export default CustomButton;
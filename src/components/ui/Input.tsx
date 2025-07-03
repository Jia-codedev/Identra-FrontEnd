'use client';
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
    inputLabel: string;
    placeholderText: string;
    inputType: string;
    inputAttr: boolean;
    className: any;
    labelClassName: any;
    inputClassName: any ;
    value? : string;
    onChange? : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ 
    inputLabel,
    placeholderText,
    inputType,
    inputAttr,
    className,
    labelClassName,
    inputClassName,
    value,
    onChange,
  }) => { 
  return (
    <div className= {cn("py-2 flex flex-col text-left", className)}>
      <label className={cn('font-bold font-base pb-1 text-text-primary', labelClassName)}>
        {inputLabel}
        {inputAttr===true ?
        <span className="text-danger ml-1">*</span>
        :
        null
        }
      </label>
      <input 
        className={cn('h-10 rounded-full border bg-transparent text-text-primary border-border-grey text-sm font-normal px-3 focus:outline-none focus:border-primary placeholder-text-secondary focus:ring-0', inputClassName)} 
        type={`${inputType}`} 
        placeholder={`${placeholderText}`}
        required={inputAttr} 
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
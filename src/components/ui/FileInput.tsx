'use client';
import React from "react";
import { cn } from "@/lib/utils";

interface Props {
    inputLabel: string;
    inputAttr: boolean;
    className: any;
    labelClassName: any;
    inputClassName: any;
    buttonClassName: any;
    value? : string;
    onChange? : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<Props> = ({ 
    inputLabel,
    inputAttr,
    className,
    labelClassName,
    inputClassName,
    buttonClassName,
    value,
    onChange,
  }) => { 
  return (
    <div className= {cn("py-4 flex flex-col text-left relative", className)}>
      <label className={cn('font-bold font-base pb-1 text-text-primary', labelClassName)}>
        {inputLabel}
        {inputAttr===true ?
        <span className="text-danger ml-1">*</span>
        :
        null
        }
      </label>
      <input 
        className={cn(
            'bg-transparent text-secondary text-xs cursor-pointer',
            'cursor-pointer z-1',
            inputClassName
        )} 
        type='file'
        required={inputAttr} 
        value={value}
        onChange={onChange}
      />
      <button className={cn("absolute left-0 w-auto min-w-[89px] h-auto flex items-center justify-center border px-2 py-1 bg-[#F1F8FD] text-primary border-[#C1DEF5] shadow-button cursor-pointer text-xs rounded-[5px]", buttonClassName)}>Choose File</button>
    </div>
  );
}

export default FileInput;
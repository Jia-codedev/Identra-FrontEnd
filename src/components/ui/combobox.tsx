"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Input } from "@/components/ui/input";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  label: string;
  value: string | number;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | number | null;
  onValueChange: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  disableLocalFiltering?: boolean; // New prop to disable local filtering for API-based search
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  disabled = false,
  className,
  emptyMessage = "No options found",
  onSearch,
  isLoading = false,
  disableLocalFiltering = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ left: number; top: number; width: number } | null>(null);

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  // Filter options based on search query (only if local filtering is enabled)
  const filteredOptions = disableLocalFiltering 
    ? options 
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setHighlightedIndex(-1);
    setIsOpen(true);

    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: ComboboxOption) => {
    onValueChange(option.value);
    setSearchQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(null);
    setSearchQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compute dropdown position so it can be rendered in a portal and not be clipped
  const updateDropdownPosition = () => {
    const el = inputRef.current;
    if (!el) return setDropdownStyle(null);
    const rect = el.getBoundingClientRect();
    setDropdownStyle({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY, width: rect.width });
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8 bg-input text-foreground text-sm"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-muted-foreground hover:text-foreground/80 mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground mr-2 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown (rendered in a portal to avoid clipping) */}
      {isOpen && dropdownStyle && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{ left: dropdownStyle.left, top: dropdownStyle.top, width: dropdownStyle.width }}
          className="absolute z-[9999] bg-popover text-popover-foreground border border-border rounded-md shadow-sm max-h-48 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-2 text-muted-foreground text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              {"Loading..."}
            </div>
          ) : filteredOptions.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "px-2 py-2 cursor-pointer border-b last:border-b-0 transition-colors duration-150 text-sm",
                    index === highlightedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/10"
                  )}
                >
                  <div className={cn("text-sm font-medium", index === highlightedIndex ? "" : "")}>{option.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 text-muted-foreground text-sm">{emptyMessage}</div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

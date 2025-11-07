"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SearchComboboxOption {
  label: string;
  value: string | number;
}

interface SearchComboboxProps {
  options: SearchComboboxOption[];
  value?: string | number | null;
  onValueChange: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchCombobox: React.FC<SearchComboboxProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Search...",
  disabled = false,
  className,
  emptyMessage = "No options found",
  onSearch,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset search query when closing if nothing selected
        if (!selectedOption) {
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [selectedOption]);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setHighlightedIndex(-1);

    if (!isOpen) {
      setIsOpen(true);
    }

    // Clear existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Set new timer for debounced search
    searchTimerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      // Trigger initial search if query is empty
      if (!searchQuery && !selectedOption) {
        onSearch("");
      }
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: SearchComboboxOption) => {
    onValueChange(option.value);
    setSearchQuery(option.label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(null);
    setSearchQuery("");
    inputRef.current?.focus();
    setIsOpen(true);
    onSearch("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleOptionSelect(options[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  // Update search query when value changes externally
  useEffect(() => {
    if (selectedOption && !isOpen) {
      setSearchQuery(selectedOption.label);
    } else if (!value && !isOpen) {
      setSearchQuery("");
    }
  }, [value, selectedOption, isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          {isLoading && options.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none transition-colors",
                  highlightedIndex === index &&
                    "bg-accent text-accent-foreground",
                  value === option.value && "bg-accent/50"
                )}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 ml-2 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

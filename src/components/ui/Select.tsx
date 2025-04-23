'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useClickAway, useKey } from 'react-use';
import { ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Spinner } from './Spinner';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  error?: string;
  'aria-label'?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isMulti = false,
  isSearchable = false,
  isDisabled = false,
  isLoading = false,
  className = '',
  error,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useClickAway(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useKey('Escape', () => {
    if (isOpen) setIsOpen(false);
  });

  const handleSelect = useCallback((optionValue: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  }, [isMulti, value, onChange]);

  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    return option.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const groupedOptions = filteredOptions.reduce<Record<string, SelectOption[]>>((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {});

  const selectedLabels = Array.isArray(value)
    ? options.filter(opt => value.includes(opt.value)).map(opt => opt.label)
    : options.find(opt => opt.value === value)?.label;

  const displayValue = selectedLabels
    ? Array.isArray(selectedLabels)
      ? selectedLabels.join(', ')
      : selectedLabels
    : placeholder;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={isDisabled}
      aria-label={ariaLabel || 'Select dropdown'}
      aria-controls="select-dropdown"
      aria-owns="select-dropdown"
    >
      <div
        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
          isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-500'
        } ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        aria-label={displayValue}
      >
        <div className="flex-grow truncate">{displayValue}</div>
        <div className="flex items-center">
          {isLoading ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {isOpen && !isDisabled && (
        <div 
          id="select-dropdown"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          role="listbox"
          aria-multiselectable={isMulti}
        >
          {isSearchable && (
            <div className="p-2 border-b border-gray-300">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full p-1 border border-gray-300 rounded"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
                role="searchbox"
                aria-label="Search options"
              />
            </div>
          )}

          <div className="max-h-60 overflow-auto">
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group || 'default'} role="group" aria-label={group || 'Options'}>
                {group && (
                  <div className="px-3 py-1 text-sm font-semibold bg-gray-100" role="presentation">
                    {group}
                  </div>
                )}
                {groupOptions.map(option => {
                  const isSelected = Array.isArray(value)
                    ? value.includes(option.value)
                    : value === option.value;

                  return (
                    <div
                      key={option.value}
                      className={`px-3 py-2 cursor-pointer flex items-center ${
                        isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelect(option.value)}
                      role={isMulti ? 'checkbox' : 'option'}
                      aria-selected={isSelected}
                      aria-checked={isMulti ? isSelected : undefined}
                      tabIndex={0}
                    >
                      {isMulti && (
                        <div 
                          className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`}
                          role="presentation"
                        >
                          {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                      )}
                      {option.label}
                    </div>
                  );
                })}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-500" role="alert">No options found</div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-1 text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

export default Select; 
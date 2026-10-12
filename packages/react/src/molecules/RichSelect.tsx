import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface RichSelectProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: 'single' | 'multi';
  compact?: boolean;
  dropUp?: boolean;
  searchable?: boolean;
  required?: boolean;
  className?: string;
}

export const RichSelect: React.FC<RichSelectProps> = ({
  label,
  hint,
  placeholder = 'Select option...',
  options,
  value,
  onChange,
  mode = 'single',
  compact = false,
  dropUp = false,
  searchable = true,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isMulti = mode === 'multi';
  const selectedValues: string[] = Array.isArray(value)
    ? value
    : value ? [value] : [];

  // Filter options
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.subtitle && opt.subtitle.toLowerCase().includes(q)) ||
      (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  });

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
  }, []);

  const openDropdown = () => {
    setIsOpen(true);
    setSearchQuery('');
    setFocusedIndex(0);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 40);
  };

  const toggleDropdown = () => {
    if (isOpen) closeDropdown();
    else openDropdown();
  };

  // Outside click dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  // Handle option select
  const handleSelect = (optValue: string) => {
    if (isMulti) {
      const nextValues = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(nextValues);
    } else {
      onChange?.(optValue);
      closeDropdown();
    }
  };

  const handleRemoveTag = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    if (isMulti) {
      onChange?.(selectedValues.filter((v) => v !== optValue));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
        handleSelect(filteredOptions[focusedIndex].value);
      } else {
        toggleDropdown();
      }
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault();
        closeDropdown();
      }
    }
  };

  // Current label for single-select
  const currentOption = options.find((o) => o.value === selectedValues[0]);

  return (
    <div className={`field-block ${className}`.trim()} ref={containerRef}>
      {label && (
        <label className="label">
          <span>{label}</span>
          {required && <span className="req">*</span>}
          {searchable && <span className="hint">Searchable</span>}
        </label>
      )}

      <div
        className={`rich-select ${isMulti ? 'multi-select' : ''} ${compact ? 'compact' : ''} ${dropUp ? 'drop-up' : ''} ${isOpen ? 'open' : ''}`}
        onKeyDown={handleKeyDown}
      >
        <div
          className="rs-trigger"
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={toggleDropdown}
        >
          {isMulti ? (
            <div className="rs-tags-container">
              {selectedValues.length === 0 ? (
                <span className="rs-placeholder">{placeholder}</span>
              ) : (
                selectedValues.map((v) => (
                  <span key={v} className="rs-pill-tag">
                    <span>{options.find((o) => o.value === v)?.label || v}</span>
                    <button
                      type="button"
                      className="rs-tag-remove"
                      onClick={(e) => handleRemoveTag(e, v)}
                      aria-label={`Remove ${v}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          ) : (
            <span className="rs-current">
              {currentOption?.icon}
              <span>{currentOption?.label || placeholder}</span>
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isMulti && selectedValues.length > 0 && (
              <span className="rs-count-badge">{selectedValues.length} selected</span>
            )}
            <svg
              className="rs-chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="rs-menu" role="listbox">
            {searchable && (
              <div className="rs-search-wrap" onClick={(e) => e.stopPropagation()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="rs-search-input"
                  placeholder="Filter options..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFocusedIndex(0);
                  }}
                />
              </div>
            )}

            <div className="rs-list">
              {filteredOptions.length === 0 ? (
                <div className="rs-empty-msg" style={{ display: 'block' }}>
                  No matching options found
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = selectedValues.includes(opt.value);
                  const isFocused = idx === focusedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      className={`rs-option ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                    >
                      <div className="rs-opt-main">
                        <div className="rs-opt-title">{opt.label}</div>
                        {opt.subtitle && <div className="rs-opt-sub">{opt.subtitle}</div>}
                      </div>

                      <div className="rs-opt-right">
                        {opt.badge && <span className="rs-opt-badge">{opt.badge}</span>}
                        <svg
                          className="rs-check-icon"
                          style={{ display: isSelected ? 'block' : 'none' }}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {hint && <div className="hint">{hint}</div>}
    </div>
  );
};

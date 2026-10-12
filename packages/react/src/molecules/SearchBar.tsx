import React, { forwardRef } from 'react';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcut?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onChange,
  onClear,
  shortcut = '⌘K',
  placeholder = 'Search ponds, sensors, batches...',
  className = '',
  ...props
}, ref) => {
  const hasValue = Boolean(value);

  return (
    <div className={`searchbar ${className}`.trim()}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ width: '16px', height: '16px', color: 'var(--muted)', flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />

      {hasValue && onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          ×
        </button>
      ) : shortcut ? (
        <span className="search-kbd">{shortcut}</span>
      ) : null}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

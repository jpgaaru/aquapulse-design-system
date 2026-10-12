import React, { useState, useMemo } from 'react';
import { SegmentedControl } from '../molecules/SegmentedControl.js';
import { RichSelect } from '../molecules/RichSelect.js';

export type TableDensity = 'compact' | 'standard' | 'spacious';

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  data: T[];
  density?: TableDensity;
  onDensityChange?: (density: TableDensity) => void;
  enableSelection?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  renderDetailRow?: (row: T) => React.ReactNode;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  bulkActions?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  density: controlledDensity,
  onDensityChange,
  enableSelection = false,
  selectedIds = [],
  onSelectionChange,
  renderDetailRow,
  pageSize = 10,
  onPageSizeChange,
  bulkActions,
  className = '',
}: DataTableProps<T>) {
  const [internalDensity, setInternalDensity] = useState<TableDensity>('standard');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string | number>>(new Set());

  const currentDensity = controlledDensity !== undefined ? controlledDensity : internalDensity;

  const handleDensityChange = (d: TableDensity) => {
    setInternalDensity(d);
    onDensityChange?.(d);
  };

  // Sort handler
  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(colKey);
      setSortOrder('asc');
    }
  };

  // Detail row toggle
  const toggleDetailRow = (id: string | number) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange?.(data.map((r) => r.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string | number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortOrder]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className={`table-panel ${className}`.trim()}>
      {/* Sticky Bulk Bar */}
      {enableSelection && selectedIds.length > 0 && (
        <div className="bulk show" style={{ margin: '12px 16px 0' }}>
          <span className="bulk-count">{selectedIds.length} selected</span>
          {bulkActions}
        </div>
      )}

      {/* Table Scroller */}
      <div className="table-wrap">
        <table className={`tbl tbl-${currentDensity}`}>
          <thead>
            <tr>
              {enableSelection && (
                <th style={{ width: '36px' }}>
                  <input
                    type="checkbox"
                    className="ck-all ckbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {renderDetailRow && <th style={{ width: '36px' }} />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span>{col.header}</span>
                  {col.sortable && (
                    <span className="sort-icon" style={{ marginLeft: '4px' }}>
                      {sortKey === col.key ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => {
              const isSelected = selectedIds.includes(row.id);
              const isExpanded = expandedRowIds.has(row.id);

              return (
                <React.Fragment key={row.id}>
                  <tr className={isSelected ? 'sel' : ''}>
                    {enableSelection && (
                      <td>
                        <input
                          type="checkbox"
                          className="ck ckbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </td>
                    )}
                    {renderDetailRow && (
                      <td>
                        <button
                          type="button"
                          className="detail-toggle"
                          style={{
                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                          onClick={() => toggleDetailRow(row.id)}
                          aria-label="Toggle subrow details"
                        >
                          ›
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                        {col.render ? col.render(row, idx) : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                  {renderDetailRow && isExpanded && (
                    <tr className="detail-row open">
                      <td colSpan={columns.length + (enableSelection ? 1 : 0) + 1}>
                        <div className="detail-inner">
                          {renderDetailRow(row)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div>
          Showing <b>{sortedData.length}</b> rows
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onPageSizeChange && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Rows:</span>
              <RichSelect
                compact
                dropUp
                value={`${pageSize} per page`}
                onChange={(val) => {
                  const num = parseInt(String(val), 10);
                  if (!isNaN(num)) onPageSizeChange(num);
                }}
                options={[
                  { value: '10 per page', label: '10 per page' },
                  { value: '25 per page', label: '25 per page' },
                  { value: '50 per page', label: '50 per page' },
                ]}
              />
            </div>
          )}

          {/* Density Control */}
          <SegmentedControl<TableDensity>
            value={currentDensity}
            onChange={handleDensityChange}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'standard', label: 'Standard' },
              { value: 'spacious', label: 'Spacious' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

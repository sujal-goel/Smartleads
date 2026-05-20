import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters, LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/types/lead';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: Partial<LeadFilters>) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: '', label: 'All Status' },
  ...LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCE_OPTIONS.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

export const LeadFiltersBar = ({ filters, onChange, onReset }: LeadFiltersBarProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.search;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </div>

      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <Input
          id="leads-search"
          type="search"
          placeholder="Search by name or email..."
          leftIcon={<Search className="h-4 w-4" />}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        />
      </div>

      {/* Status filter */}
      <div className="w-full sm:w-40">
        <Select
          id="leads-filter-status"
          options={statusOptions}
          value={filters.status ?? ''}
          onChange={(e) => onChange({ status: e.target.value as LeadFilters['status'], page: 1 })}
        />
      </div>

      {/* Source filter */}
      <div className="w-full sm:w-40">
        <Select
          id="leads-filter-source"
          options={sourceOptions}
          value={filters.source ?? ''}
          onChange={(e) => onChange({ source: e.target.value as LeadFilters['source'], page: 1 })}
        />
      </div>

      {/* Sort */}
      <div className="w-full sm:w-36">
        <Select
          id="leads-filter-sort"
          options={sortOptions}
          value={filters.sort ?? 'latest'}
          onChange={(e) => onChange({ sort: e.target.value as LeadFilters['sort'], page: 1 })}
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          id="leads-filter-reset"
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<X className="h-4 w-4" />}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

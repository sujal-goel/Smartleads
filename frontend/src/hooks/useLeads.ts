import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';
import { Lead, LeadFilters, LeadFormData, LeadsResponse } from '@/types/lead';
import { useDebounce } from './useDebounce';
import { getErrorMessage } from '@/lib/utils';

const QUERY_KEY = 'leads';

/**
 * Hook managing all lead state: filters, pagination, CRUD, CSV export.
 */
export function useLeads() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebounce(filters.search ?? '', 400);

  // Build query params — exclude empty strings
  const queryParams = {
    ...(filters.status && { status: filters.status }),
    ...(filters.source && { source: filters.source }),
    ...(debouncedSearch && { search: debouncedSearch }),
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  };

  // Fetch leads
  const { data, isLoading, isFetching, error } = useQuery<LeadsResponse>({
    queryKey: [QUERY_KEY, queryParams],
    queryFn: async () => {
      const { data } = await apiClient.get('/leads', { params: queryParams });
      return data;
    },
  });

  // Create lead
  const createMutation = useMutation({
    mutationFn: (leadData: LeadFormData) => apiClient.post('/leads', leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Lead created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // Update lead
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      apiClient.put(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Lead updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // Delete lead
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Lead deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // CSV export
  const exportCSV = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await apiClient.get('/leads/export/csv', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [filters.status, filters.source, debouncedSearch]);

  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // reset page on filter change unless explicitly set
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    leads: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    error,
    filters,
    updateFilters,
    setPage,
    createLead: createMutation.mutateAsync,
    updateLead: updateMutation.mutateAsync,
    deleteLead: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    exportCSV,
  };
}

// Hook for a single lead
export function useLead(id: string) {
  return useQuery<{ data: Lead }>({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/leads/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

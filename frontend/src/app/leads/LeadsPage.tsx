import React, { useEffect, useState } from 'react';
import { Filter, Plus, Download, X } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LeadFiltersBar } from '@/app/leads/components/LeadFiltersBar';
import { LeadTable } from '@/app/leads/components/LeadTable';
import { LeadForm } from '@/app/leads/components/LeadForm';
import { Pagination } from '@/app/leads/components/Pagination';
import { EmptyState } from '@/app/leads/components/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LeadTableSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useLeads } from '@/hooks/useLeads';
import { Lead, LeadFilters, LeadFormData } from '@/types/lead';
import { formatDate, getStatusColor, getSourceColor } from '@/lib/utils';

type ModalMode = 'create' | 'edit' | 'view' | 'delete' | null;

export const LeadsPage = () => {
  const {
    leads,
    meta,
    isLoading,
    isFetching,
    filters,
    updateFilters,
    setPage,
    createLead,
    updateLead,
    deleteLead,
    isCreating,
    isUpdating,
    isDeleting,
    exportCSV,
  } = useLeads();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isFiltersOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFiltersOpen(false);
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFiltersOpen]);

  const openModal = (mode: ModalMode, lead?: Lead) => {
    setModalMode(mode);
    setSelectedLead(lead ?? null);
  };
  const closeModal = () => {
    setModalMode(null);
    setSelectedLead(null);
  };

  const handleCreate = async (data: LeadFormData) => {
    await createLead(data);
    closeModal();
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!selectedLead) return;
    await updateLead({ id: selectedLead._id, data });
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedLead) return;
    deleteLead(selectedLead._id);
    closeModal();
  };

  const resetFilters = () =>
    updateFilters({ status: '', source: '', search: '', sort: 'latest', page: 1 });

  const modalTitles: Record<NonNullable<ModalMode>, string> = {
    create: 'Create New Lead',
    edit: 'Edit Lead',
    view: 'Lead Details',
    delete: 'Delete Lead',
  };

  return (
    <PageWrapper pageTitle="Leads">
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leads Pipeline</h2>
            {meta && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {meta.totalLeads} total leads
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              id="leads-export-csv-btn"
              variant="outline"
              size="sm"
              onClick={exportCSV}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export CSV
            </Button>
            <Button
              id="leads-create-btn"
              size="sm"
              onClick={() => openModal('create')}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="md:hidden">
          <Button
            id="leads-open-filters-btn"
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(true)}
            leftIcon={<Filter className="h-4 w-4" />}
            className="w-full justify-center"
          >
            Filters
          </Button>

          {isFiltersOpen && (
            <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Lead filters">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                aria-label="Close filters"
                onClick={() => setIsFiltersOpen(false)}
              />
              <div className="absolute inset-x-4 top-20 z-50 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:inset-x-6 sm:top-24">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Filters</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Search and refine leads without leaving the page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFiltersOpen(false)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    aria-label="Close filters panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <LeadFiltersBar
                  filters={filters}
                  onChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <LeadFiltersBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
        </div>

        {/* Table / Loading / Empty */}
        <div className={isFetching && !isLoading ? 'opacity-70 transition-opacity' : ''}>
          {isLoading ? (
            <LeadTableSkeleton />
          ) : leads.length === 0 ? (
            <EmptyState
              action={
                <Button id="leads-empty-create-btn" onClick={() => openModal('create')} leftIcon={<Plus className="h-4 w-4" />}>
                  Create First Lead
                </Button>
              }
            />
          ) : (
            <LeadTable
              leads={leads}
              onEdit={(l) => openModal('edit', l)}
              onDelete={(l) => openModal('delete', l)}
              onView={(l) => openModal('view', l)}
              isDeleting={isDeleting}
            />
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalMode === 'create'} onClose={closeModal} title={modalTitles.create} size="lg">
        <LeadForm onSubmit={handleCreate} onCancel={closeModal} isLoading={isCreating} mode="create" />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modalMode === 'edit'} onClose={closeModal} title={modalTitles.edit} size="lg">
        <LeadForm
          defaultValues={selectedLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={closeModal}
          isLoading={isUpdating}
          mode="edit"
        />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title={modalTitles.view}>
        {selectedLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Name', value: selectedLead.name },
                { label: 'Email', value: selectedLead.email },
                { label: 'Status', value: <Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge> },
                { label: 'Source', value: <Badge className={getSourceColor(selectedLead.source)}>{selectedLead.source}</Badge> },
                { label: 'Assigned To', value: selectedLead.assignedTo || '—' },
                { label: 'Created', value: formatDate(selectedLead.createdAt) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                  <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{value}</div>
                </div>
              ))}
            </div>
            {selectedLead.notes && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</p>
                <p className="mt-1 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                  {selectedLead.notes}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button id="lead-view-close-btn" variant="outline" onClick={closeModal}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={modalMode === 'delete'} onClose={closeModal} title={modalTitles.delete} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{selectedLead?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button id="lead-delete-cancel-btn" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button
              id="lead-delete-confirm-btn"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

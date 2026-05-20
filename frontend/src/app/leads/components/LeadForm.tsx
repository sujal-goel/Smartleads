import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Lead, LeadFormData, LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '@/types/lead';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(500).optional(),
  assignedTo: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const LeadForm = ({ defaultValues, onSubmit, onCancel, isLoading, mode = 'create' }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
      notes: '',
      assignedTo: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues } as LeadFormValues);
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: LeadFormValues) => {
    await onSubmit(data as LeadFormData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="lead-form-name"
          label="Full Name *"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          id="lead-form-email"
          type="email"
          label="Email *"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          id="lead-form-status"
          label="Status *"
          options={LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          id="lead-form-source"
          label="Source *"
          options={LEAD_SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>
      <Input
        id="lead-form-assigned"
        label="Assigned To"
        placeholder="Team member name"
        error={errors.assignedTo?.message}
        {...register('assignedTo')}
      />
      <div>
        <label htmlFor="lead-form-notes" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="lead-form-notes"
          rows={3}
          placeholder="Add any notes about this lead..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:border-brand-light resize-none"
          {...register('notes')}
        />
        {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          id="lead-form-cancel"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          id="lead-form-submit"
          type="submit"
          isLoading={isSubmitting || isLoading}
        >
          {mode === 'create' ? 'Create Lead' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

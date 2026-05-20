import React from 'react';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead.',
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 dark:bg-gray-800">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
      <Users className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    {action}
  </div>
);

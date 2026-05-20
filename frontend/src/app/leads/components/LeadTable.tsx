import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getStatusColor, getSourceColor } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  isDeleting?: boolean;
}

export const LeadTable = ({ leads, onEdit, onDelete, onView, isDeleting }: LeadTableProps) => {
  const { isAdmin } = useAuth();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="group transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-700/30"
              >
                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                      {lead.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{lead.name}</span>
                  </div>
                </td>
                {/* Email */}
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {lead.email}
                </td>
                {/* Status */}
                <td className="px-5 py-4">
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </td>
                {/* Source */}
                <td className="px-5 py-4">
                  <Badge className={getSourceColor(lead.source)}>{lead.source}</Badge>
                </td>
                {/* Created */}
                <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(lead.createdAt)}
                </td>
                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button
                      id={`lead-view-${lead._id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(lead)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      id={`lead-edit-${lead._id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(lead)}
                      title="Edit lead"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {isAdmin() && (
                      <Button
                        id={`lead-delete-${lead._id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(lead)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        isLoading={isDeleting}
                        title="Delete lead"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

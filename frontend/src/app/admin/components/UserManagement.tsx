import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShieldCheck, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getErrorMessage, formatDate } from '@/lib/utils';

export const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: User[] }>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  const users = data?.data ?? [];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
          <ShieldCheck className="h-5 w-5 text-brand" />
          User Management
        </h2>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}>
                {user.role}
              </Badge>
              <Button
                id={`user-delete-${user.id}`}
                variant="danger"
                size="sm"
                isLoading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

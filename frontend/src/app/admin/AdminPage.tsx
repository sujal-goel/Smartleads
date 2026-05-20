import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { UserManagement } from '@/app/admin/components/UserManagement';

export const AdminPage = () => {
  return (
    <PageWrapper pageTitle="User Management">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage team members and their roles.
          </p>
        </div>
        <UserManagement />
      </div>
    </PageWrapper>
  );
};

import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { DashboardStats } from '@/app/dashboard/components/DashboardStats';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <PageWrapper pageTitle="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Here's an overview of your leads pipeline.
          </p>
        </div>

        {/* Stats */}
        <DashboardStats />

        
      </div>
    </PageWrapper>
  );
};

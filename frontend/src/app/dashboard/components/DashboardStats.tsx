import React from 'react';
import { Users, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Lead } from '@/types/lead';
import { Skeleton } from '@/components/ui/Skeleton';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const StatCard = ({ label, value, icon, color, bg }: StatCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/70 p-5 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:shadow-indigo-950/10">
    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border dark:border-slate-800/40 shadow-inner ${bg}`}>
      <div className={color}>{icon}</div>
    </div>
    <div className="text-left">
      <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export const DashboardStats = () => {
  const { data, isLoading } = useQuery<{ data: Lead[]; meta: { totalLeads: number } }>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/leads?limit=1000');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const leads = data?.data ?? [];
  const total = data?.meta?.totalLeads ?? leads.length;
  const qualified = leads.filter((l) => l.status === 'Qualified').length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;

  const stats = [
    { label: 'Total Leads', value: total, icon: <Users className="h-5.5 w-5.5" />, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 border-indigo-100/30 dark:bg-indigo-950/20' },
    { label: 'Qualified', value: qualified, icon: <TrendingUp className="h-5.5 w-5.5" />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 border-emerald-100/30 dark:bg-emerald-950/20' },
    { label: 'New Leads', value: newLeads, icon: <Target className="h-5.5 w-5.5" />, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 border-sky-100/30 dark:bg-sky-950/20' },
    { label: 'Lost', value: lost, icon: <AlertCircle className="h-5.5 w-5.5" />, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 border-rose-100/30 dark:bg-rose-950/20' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LeadStatus, LeadSource } from '@/types/lead';

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format date to human-readable string
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get Tailwind color classes for lead status badge
export function getStatusColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    Lost: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-700';
}

// Get Tailwind color classes for lead source badge
export function getSourceColor(source: LeadSource): string {
  const colors: Record<LeadSource, string> = {
    Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    Referral: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  };
  return colors[source] ?? 'bg-gray-100 text-gray-700';
}

// Extract error message from Axios errors
export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = (error.response as { data: { message?: string } }).data;
    return data.message ?? 'An error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

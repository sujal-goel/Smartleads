import { useAuthContext } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

/**
 * Convenience hook for auth state and role-based access helpers.
 */
export function useAuth() {
  const auth = useAuthContext();

  const hasRole = (role: UserRole): boolean => auth.user?.role === role;
  const isAdmin = (): boolean => hasRole('admin');
  const isSales = (): boolean => hasRole('sales');

  return { ...auth, hasRole, isAdmin, isSales };
}

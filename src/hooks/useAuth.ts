import { useAuthContext } from '../contexts/AuthContext';

/**
 * Convenience hook for consuming the auth context.
 * Use this in any component that needs auth state.
 */
export const useAuth = () => useAuthContext();

export default useAuth;

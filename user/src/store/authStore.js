import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
          isAuthenticated: Boolean(accessToken),
        });
      },

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) => {
        const current = get();
        set({
          accessToken: accessToken || null,
          refreshToken: refreshToken !== undefined ? refreshToken : current.refreshToken,
          isAuthenticated: Boolean(accessToken),
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      hasRole: (role) => get().user?.role === role,

      hasAnyRole: (roles) => roles.includes(get().user?.role),

      isSuperAdmin: () => get().user?.role === 'superadmin',

      isAdmin: () => ['superadmin', 'admin'].includes(get().user?.role),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState ?? {};
        const current = currentState ?? {};

        if (current.isAuthenticated && current.accessToken) {
          return {
            ...current,
            user: current.user,
            accessToken: current.accessToken,
            refreshToken: current.refreshToken ?? persisted.refreshToken,
            isAuthenticated: true,
            hasHydrated: true,
          };
        }

        return {
          ...current,
          ...persisted,
          hasHydrated: true,
        };
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error('Auth storage rehydration failed:', error);
        }
      },
    }
  )
);

useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.getState().setHasHydrated(true);
});

const LOGIN_GRACE_MS = 15000;

export const markRecentLogin = () => {
  sessionStorage.setItem('auth-login-at', String(Date.now()));
};

export const clearRecentLogin = () => {
  sessionStorage.removeItem('auth-login-at');
};

export const isRecentLoginWindow = () => {
  const ts = Number(sessionStorage.getItem('auth-login-at') || 0);
  return ts > 0 && Date.now() - ts < LOGIN_GRACE_MS;
};

export const getAccessToken = () => useAuthStore.getState().accessToken;

export const getRefreshToken = () => useAuthStore.getState().refreshToken;

export const clearAuthStorage = () => {
  useAuthStore.getState().logout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export default useAuthStore;

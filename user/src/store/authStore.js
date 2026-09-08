import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const syncAuthToStorage = (state) => {
  if (!state) return;

  if (state.accessToken) {
    localStorage.setItem('accessToken', state.accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }

  if (state.refreshToken) {
    localStorage.setItem('refreshToken', state.refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }

  if (state.user) {
    localStorage.setItem('user', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getAccessToken = () =>
  useAuthStore.getState().accessToken || localStorage.getItem('accessToken');

export const getRefreshToken = () =>
  useAuthStore.getState().refreshToken || localStorage.getItem('refreshToken');

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) => {
        const nextState = {
          user,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
          isAuthenticated: Boolean(accessToken),
        };
        set(nextState);
        syncAuthToStorage(nextState);
      },

      setUser: (user) => {
        set({ user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      setTokens: (accessToken, refreshToken) => {
        const current = get();
        const nextState = {
          ...current,
          accessToken: accessToken || null,
          refreshToken: refreshToken !== undefined ? refreshToken : current.refreshToken,
          isAuthenticated: Boolean(accessToken),
        };
        set(nextState);
        syncAuthToStorage(nextState);
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      },

      setLoading: (isLoading) => set({ isLoading }),

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
      onRehydrateStorage: () => (state) => {
        syncAuthToStorage(state);
      },
    }
  )
);

export default useAuthStore;

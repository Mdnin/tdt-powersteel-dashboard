import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  approveUser,
  clearSession,
  ensureDefaultAdmin,
  getPendingUsers,
  getPublicUsers,
  getUsersWithPasswords,
  getRejectedRequests,
  getSession,
  loginWithQrCode,
  loginWithCredentials,
  registerEmployee,
  deactivateUser,
  forceUserPasswordReset,
  rejectUser,
  resetUserPassword,
  syncCurrentSession,
  updateCurrentUserProfile,
  updateCurrentUserPassword
} from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    ensureDefaultAdmin();
    return getSession();
  });
  const [users, setUsers] = useState(() => getPublicUsers());
  const [adminUsers, setAdminUsers] = useState(() => getUsersWithPasswords());

  const refreshUsers = useCallback(() => {
    ensureDefaultAdmin();
    const nextUsers = getPublicUsers();
    const nextAdminUsers = getUsersWithPasswords();
    const nextSession = syncCurrentSession();
    setUsers(nextUsers);
    setAdminUsers(nextAdminUsers);
    setUser(nextSession);
    return { users: nextUsers, user: nextSession };
  }, []);

  useEffect(() => {
    ensureDefaultAdmin();
    setUser(getSession());
    setUsers(getPublicUsers());
    setAdminUsers(getUsersWithPasswords());
  }, []);

  const login = useCallback((identity, password) => {
    const result = loginWithCredentials(identity, password);
    if (result.ok) {
      setUser(result.user);
      setUsers(getPublicUsers());
      setAdminUsers(getUsersWithPasswords());
    }
    return result;
  }, []);

  const loginWithQr = useCallback(value => {
    const result = loginWithQrCode(value);
    if (result.ok) {
      setUser(result.user);
      setUsers(getPublicUsers());
      setAdminUsers(getUsersWithPasswords());
    }
    return result;
  }, []);

  const signup = useCallback(account => {
    const result = registerEmployee(account);
    if (result.ok) {
      setUser(result.user);
      setUsers(getPublicUsers());
      setAdminUsers(getUsersWithPasswords());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const approveEmployee = useCallback(userId => {
    const nextUsers = approveUser(userId);
    setUsers(nextUsers);
    setAdminUsers(getUsersWithPasswords());
    setUser(syncCurrentSession());
  }, []);

  const rejectEmployee = useCallback(userId => {
    const nextUsers = rejectUser(userId);
    setUsers(nextUsers);
    setAdminUsers(getUsersWithPasswords());
    setUser(syncCurrentSession());
  }, []);

  const deactivateEmployee = useCallback(userId => {
    const nextUsers = deactivateUser(userId);
    setUsers(nextUsers);
    setAdminUsers(getUsersWithPasswords());
    setUser(syncCurrentSession());
  }, []);

  const updateProfile = useCallback(profile => {
    const result = updateCurrentUserProfile(profile);
    if (result.ok) {
      setUser(result.user);
      setUsers(getPublicUsers());
      setAdminUsers(getUsersWithPasswords());
    }
    return result;
  }, []);

  const updatePassword = useCallback((currentPassword, newPassword, confirmPassword) => {
    const result = updateCurrentUserPassword(currentPassword, newPassword, confirmPassword);
    if (result.ok) {
      setUsers(getPublicUsers());
      setAdminUsers(getUsersWithPasswords());
      setUser(syncCurrentSession());
    }
    return result;
  }, []);

  const resetEmployeePassword = useCallback(userId => {
    const result = resetUserPassword(userId);
    setUsers(getPublicUsers());
    setAdminUsers(getUsersWithPasswords());
    setUser(syncCurrentSession());
    return result;
  }, []);

  const forceEmployeePasswordReset = useCallback(userId => {
    const result = forceUserPasswordReset(userId);
    setUsers(getPublicUsers());
    setAdminUsers(getUsersWithPasswords());
    setUser(syncCurrentSession());
    return result;
  }, []);

  const value = useMemo(() => ({
    user,
    users,
    adminUsers,
    pendingUsers: users.filter(account => account.status === 'pending'),
    rejectedRequests: getRejectedRequests(),
    isAuthenticated: Boolean(user),
    isApproved: user?.status === 'approved',
    isAdmin: user?.role === 'admin',
    login,
    loginWithQr,
    signup,
    logout,
    approveEmployee,
    rejectEmployee,
    deactivateEmployee,
    resetEmployeePassword,
    forceEmployeePasswordReset,
    updateProfile,
    updatePassword,
    refreshUsers,
    getPendingUsers
  }), [adminUsers, approveEmployee, deactivateEmployee, forceEmployeePasswordReset, login, loginWithQr, logout, refreshUsers, rejectEmployee, resetEmployeePassword, signup, updatePassword, updateProfile, user, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

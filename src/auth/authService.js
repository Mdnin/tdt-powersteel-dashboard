const USERS_KEY = 'tdt_auth_users';
const SESSION_KEY = 'tdt_auth_session';
const REJECTED_KEY = 'tdt_rejected_requests';

export const PASSWORD_MIN_LENGTH = 6;

export const DEFAULT_ADMIN = {
  id: 'admin-001',
  firstName: 'System',
  lastName: 'Administrator',
  name: 'Administrator',
  position: 'Administrator',
  department: 'Executive Operations',
  email: 'admin@tdtpowersteel.com',
  password: 'admin123',
  role: 'admin',
  status: 'approved',
  token: 'admin-token'
};

const createEmployeeToken = id => `employee-token-${id}`;

const sanitizeUser = user => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const normalizeUserProfile = user => {
  if (!user) return user;
  const [firstName = '', ...restName] = (user.name || '').split(' ');
  const lastName = restName.join(' ');

  return {
    ...user,
    firstName: user.firstName || firstName,
    lastName: user.lastName || lastName,
    position: user.position || (user.role === 'admin' ? 'Administrator' : 'Sales Representative'),
    avatar: user.avatar || ''
  };
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export function ensureDefaultAdmin() {
  const users = readJson(USERS_KEY, []).map(normalizeUserProfile);
  const hasAdmin = users.some(user => user.email === DEFAULT_ADMIN.email);

  if (hasAdmin) {
    writeJson(USERS_KEY, users);
    return users;
  }

  const nextUsers = [normalizeUserProfile(DEFAULT_ADMIN), ...users];
  writeJson(USERS_KEY, nextUsers);
  return nextUsers;
}

export function getUsers() {
  return ensureDefaultAdmin();
}

export function getPublicUsers() {
  return getUsers().map(sanitizeUser);
}

export function getUsersWithPasswords() {
  return getUsers();
}

export function getPendingUsers() {
  return getPublicUsers().filter(user => user.status === 'pending');
}

export function getRejectedRequests() {
  return readJson(REJECTED_KEY, []);
}

export function getSession() {
  ensureDefaultAdmin();
  return readJson(SESSION_KEY, null);
}

export function setSession(user) {
  const session = sanitizeUser(user);
  writeJson(SESSION_KEY, session);
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginWithCredentials(identity, password) {
  const normalizedIdentity = identity.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(account => (
    account.email.toLowerCase() === normalizedIdentity ||
    account.name.toLowerCase() === normalizedIdentity
  ));

  if (!user || user.password !== password) {
    return { ok: false, message: 'Invalid account credentials.' };
  }

  return { ok: true, user: setSession(user) };
}

export function registerEmployee({ firstName, lastName, email, department, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, message: 'An account with this email already exists.' };
  }

  const id = `emp-${String(Date.now()).slice(-6)}`;
  const employee = {
    id,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    name: `${firstName.trim()} ${lastName.trim()}`.trim(),
    position: 'Sales Representative',
    department: department.trim() || 'Sales Department',
    email: normalizedEmail,
    password,
    role: 'employee',
    status: 'pending',
    forcePasswordReset: false,
    requestedAt: new Date().toISOString(),
    token: createEmployeeToken(id)
  };

  writeJson(USERS_KEY, [...users, employee]);
  return { ok: true, user: setSession(employee) };
}

export function approveUser(userId) {
  const users = getUsers();
  const nextUsers = users.map(user => (
    user.id === userId ? { ...user, status: 'approved' } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return getPublicUsers();
}

export function rejectUser(userId) {
  const users = getUsers();
  const rejectedUser = users.find(user => user.id === userId);
  if (rejectedUser) {
    writeJson(REJECTED_KEY, [
      ...getRejectedRequests(),
      { ...sanitizeUser(rejectedUser), status: 'rejected', rejectedAt: new Date().toISOString() }
    ]);
  }

  const nextUsers = users.map(user => (
    user.id === userId ? { ...user, status: 'rejected', rejectedAt: new Date().toISOString() } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return getPublicUsers();
}

export function deactivateUser(userId) {
  const users = getUsers();
  const nextUsers = users.map(user => (
    user.id === userId ? { ...user, status: 'inactive', inactiveAt: new Date().toISOString() } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return getPublicUsers();
}

export function resetUserPassword(userId) {
  const users = getUsers();
  const target = users.find(user => user.id === userId);
  if (!target) {
    return { ok: false, message: 'Employee account not found.', users: getUsersWithPasswords() };
  }

  const temporaryPassword = `TDT-${String(target.id).slice(-4).toUpperCase()}-${new Date().getFullYear()}`;
  const nextUsers = users.map(user => (
    user.id === userId ? { ...user, password: temporaryPassword, forcePasswordReset: true } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return { ok: true, message: 'Temporary password generated.', password: temporaryPassword, users: nextUsers };
}

export function forceUserPasswordReset(userId) {
  const users = getUsers();
  const nextUsers = users.map(user => (
    user.id === userId ? { ...user, forcePasswordReset: true } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return { ok: true, message: 'Password reset required on next employee update.', users: nextUsers };
}

export function updateCurrentUserProfile(profile) {
  const session = getSession();
  if (!session) {
    return { ok: false, message: 'No active profile session.' };
  }

  const users = getUsers();
  const nextUsers = users.map(user => {
    if (user.id !== session.id) return user;

    const firstName = profile.firstName?.trim() || user.firstName || '';
    const lastName = profile.lastName?.trim() || user.lastName || '';

    return normalizeUserProfile({
      ...user,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || user.name,
      position: profile.position?.trim() || user.position,
      department: profile.department?.trim() || user.department,
      avatar: profile.avatar ?? user.avatar
    });
  });

  writeJson(USERS_KEY, nextUsers);
  const nextSession = syncCurrentSession(nextUsers);
  return { ok: true, message: 'Profile updated.', user: nextSession };
}

export function syncCurrentSession(users = getUsers()) {
  const session = getSession();
  if (!session) return null;

  const currentUser = users.find(user => user.id === session.id);
  if (!currentUser) {
    clearSession();
    return null;
  }

  return setSession(currentUser);
}

export function updateCurrentUserPassword(currentPassword, newPassword, confirmPassword) {
  const session = getSession();
  const users = getUsers();
  const currentUser = users.find(user => user.id === session?.id);

  if (!currentUser || currentUser.password !== currentPassword) {
    return { ok: false, message: 'Current password is incorrect.' };
  }

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, message: 'New passwords do not match.' };
  }

  const nextUsers = users.map(user => (
    user.id === currentUser.id ? { ...user, password: newPassword, forcePasswordReset: false } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return { ok: true, message: 'Password updated successfully.' };
}

export function updateUserPasswordByIdentity(identity, currentPassword, newPassword, confirmPassword) {
  const normalizedIdentity = identity.trim().toLowerCase();
  const users = getUsers();
  const targetUser = users.find(user => (
    user.email.toLowerCase() === normalizedIdentity ||
    user.name.toLowerCase() === normalizedIdentity
  ));

  if (!targetUser || targetUser.password !== currentPassword) {
    return { ok: false, message: 'Current account credentials are incorrect.' };
  }

  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, message: 'New passwords do not match.' };
  }

  const nextUsers = users.map(user => (
    user.id === targetUser.id ? { ...user, password: newPassword, forcePasswordReset: false } : user
  ));
  writeJson(USERS_KEY, nextUsers);
  syncCurrentSession(nextUsers);
  return { ok: true, message: 'Password updated successfully.' };
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export function isApproved() {
  return getSession()?.status === 'approved';
}

export function getApprovalStatus() {
  return getSession()?.status || 'guest';
}

export function logout() {
  clearSession();
}

export const changePassword = updateCurrentUserPassword;

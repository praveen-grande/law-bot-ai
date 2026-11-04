import { AdminCredential, UserProfile, Role } from '../types/legal';

export interface AdminAccountRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  department: string;
  createdBy: string;
  createdAt: string;
  status: 'Active' | 'Suspended';
}

/**
 * Validates Google Authentication for standard users.
 * Enforces security rule: Google Authentication is strictly for citizen/researcher accounts.
 * Google login CANNOT grant Admin or Super Admin privileges.
 */
export function processGoogleUserAuth(googlePayload: {
  email: string;
  name?: string;
  avatar?: string;
  googleId?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  if (!googlePayload.email || !googlePayload.email.includes('@')) {
    return { success: false, error: 'Valid Google email is required' };
  }

  const user: UserProfile = {
    id: `usr-g-${Date.now()}`,
    name: googlePayload.name || googlePayload.email.split('@')[0],
    email: googlePayload.email.toLowerCase().trim(),
    role: 'user', // Strictly 'user' role
    avatar: googlePayload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authProvider: 'google',
    preferredLanguage: 'en',
    jurisdictionPreference: 'India (Central + State)',
    theme: 'light',
    savedItemsCount: {
      bookmarks: 0,
      savedCases: 0,
      documents: 0
    }
  };

  return { success: true, user };
}

/**
 * Verifies email & password credentials for Administrative Access (Admin & Super Admin).
 * No Google authentication is used for administrative accounts.
 */
export function verifyAdminCredentials(
  email: string,
  password: string,
  accounts: AdminAccountRecord[]
): { success: boolean; account?: AdminAccountRecord; error?: string } {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const cleanEmail = email.toLowerCase().trim();
  const matched = accounts.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.passwordHash === password
  );

  if (!matched) {
    return {
      success: false,
      error: 'Invalid administrative credentials. Admin accounts must be created by the Super Admin.'
    };
  }

  if (matched.status === 'Suspended') {
    return {
      success: false,
      error: 'This administrative credential has been suspended by the Super Admin.'
    };
  }

  return { success: true, account: matched };
}

/**
 * Enforces least-privilege authorization rule:
 * ONLY Super Admin can create or provision administrative credentials.
 */
export function canCreateAdmin(requesterRole: Role): boolean {
  return requesterRole === 'superadmin';
}

/**
 * Creates a new Admin credential under strict Super Admin authorization.
 */
export function createAdminRecord(
  requesterRole: Role,
  requesterEmail: string,
  newAdmin: {
    name: string;
    email: string;
    password: string;
    department: string;
  },
  existingAccounts: AdminAccountRecord[]
): { success: boolean; createdAccount?: AdminAccountRecord; error?: string } {
  // Authorization Gate
  if (!canCreateAdmin(requesterRole)) {
    return {
      success: false,
      error: 'Unauthorized: Only the Super Admin has authority to provision administrative credentials.'
    };
  }

  if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
    return { success: false, error: 'Admin name, email, and password are required' };
  }

  const cleanEmail = newAdmin.email.toLowerCase().trim();
  const emailExists = existingAccounts.some((a) => a.email.toLowerCase() === cleanEmail);
  if (emailExists) {
    return { success: false, error: 'An administrative account with this email already exists' };
  }

  if (newAdmin.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const createdAccount: AdminAccountRecord = {
    id: `admin-usr-${Date.now()}`,
    name: newAdmin.name.trim(),
    email: cleanEmail,
    passwordHash: newAdmin.password,
    role: 'admin', // Super Admin can only provision 'admin' role
    department: newAdmin.department || 'Legal Operations',
    createdBy: requesterEmail || 'superadmin@lawbot.ai',
    createdAt: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  return { success: true, createdAccount };
}

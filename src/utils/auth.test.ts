import test from 'node:test';
import assert from 'node:assert/strict';
import {
  processGoogleUserAuth,
  verifyAdminCredentials,
  canCreateAdmin,
  createAdminRecord,
  AdminAccountRecord
} from './auth';

const sampleAccounts: AdminAccountRecord[] = [
  {
    id: 'admin-super-1',
    name: 'Super Admin',
    email: 'superadmin@lawbot.ai',
    passwordHash: 'SuperSecret123',
    role: 'superadmin',
    department: 'Executive',
    createdBy: 'Root',
    createdAt: '2026-01-01',
    status: 'Active'
  },
  {
    id: 'admin-1',
    name: 'Adv. Sneha Patel',
    email: 'sneha@univ.edu',
    passwordHash: 'AdminPass456',
    role: 'admin',
    department: 'Legal Ingestion',
    createdBy: 'superadmin@lawbot.ai',
    createdAt: '2026-02-01',
    status: 'Active'
  },
  {
    id: 'admin-suspended',
    name: 'Suspended Admin',
    email: 'suspended@lawbot.ai',
    passwordHash: 'TestPass789',
    role: 'admin',
    department: 'Audit',
    createdBy: 'superadmin@lawbot.ai',
    createdAt: '2026-02-15',
    status: 'Suspended'
  }
];

test('Google user authentication assigns user role and google authProvider', () => {
  const result = processGoogleUserAuth({
    email: 'kondetisrideepakrayal3006@gmail.com',
    name: 'Deepak Rayal',
    avatar: 'https://example.com/avatar.jpg'
  });

  assert.equal(result.success, true);
  assert.equal(result.user?.role, 'user');
  assert.equal(result.user?.authProvider, 'google');
  assert.equal(result.user?.email, 'kondetisrideepakrayal3006@gmail.com');
});

test('Google user authentication rejects invalid emails', () => {
  const result = processGoogleUserAuth({ email: 'invalid-email-format' });
  assert.equal(result.success, false);
});

test('verifyAdminCredentials authenticates valid admin and superadmin passwords', () => {
  const superRes = verifyAdminCredentials(
    'superadmin@lawbot.ai',
    'SuperSecret123',
    sampleAccounts
  );
  assert.equal(superRes.success, true);
  assert.equal(superRes.account?.role, 'superadmin');

  const adminRes = verifyAdminCredentials(
    'sneha@univ.edu',
    'AdminPass456',
    sampleAccounts
  );
  assert.equal(adminRes.success, true);
  assert.equal(adminRes.account?.role, 'admin');
});

test('verifyAdminCredentials rejects wrong password and unprovisioned accounts', () => {
  const wrongPass = verifyAdminCredentials(
    'superadmin@lawbot.ai',
    'WrongPassword',
    sampleAccounts
  );
  assert.equal(wrongPass.success, false);

  const notFound = verifyAdminCredentials(
    'random.user@gmail.com',
    'SomePassword',
    sampleAccounts
  );
  assert.equal(notFound.success, false);
});

test('verifyAdminCredentials blocks suspended admin accounts', () => {
  const res = verifyAdminCredentials(
    'suspended@lawbot.ai',
    'TestPass789',
    sampleAccounts
  );
  assert.equal(res.success, false);
  assert.ok(res.error?.includes('suspended'));
});

test('canCreateAdmin only allows superadmin role', () => {
  assert.equal(canCreateAdmin('superadmin'), true);
  assert.equal(canCreateAdmin('admin'), false);
  assert.equal(canCreateAdmin('user'), false);
});

test('createAdminRecord allows Super Admin to provision Admin credentials', () => {
  const res = createAdminRecord(
    'superadmin',
    'superadmin@lawbot.ai',
    {
      name: 'Adv. Rajesh Mehta',
      email: 'r.mehta@highcourt.gov.in',
      password: 'SecureAdminPass2026',
      department: 'Case Law Ingestion'
    },
    sampleAccounts
  );

  assert.equal(res.success, true);
  assert.equal(res.createdAccount?.email, 'r.mehta@highcourt.gov.in');
  assert.equal(res.createdAccount?.role, 'admin');
  assert.equal(res.createdAccount?.createdBy, 'superadmin@lawbot.ai');
});

test('createAdminRecord blocks regular Admin or User from creating Admin accounts', () => {
  const resFromAdmin = createAdminRecord(
    'admin',
    'sneha@univ.edu',
    {
      name: 'Unauthorized User',
      email: 'unauth@test.com',
      password: 'Password123',
      department: 'Support'
    },
    sampleAccounts
  );
  assert.equal(resFromAdmin.success, false);
  assert.ok(resFromAdmin.error?.includes('Super Admin'));

  const resFromUser = createAdminRecord(
    'user',
    'user@gmail.com',
    {
      name: 'Unauthorized User',
      email: 'unauth2@test.com',
      password: 'Password123',
      department: 'Support'
    },
    sampleAccounts
  );
  assert.equal(resFromUser.success, false);
});

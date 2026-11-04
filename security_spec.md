# Security Specification — Law Bot AI Firestore Database

## 1. Data Invariants
1. **Master Gate & Relational Sync:**
   - Every message in `/conversations/{conversationId}/messages/{messageId}` must belong to an existing parent `/conversations/{conversationId}` document owned by `request.auth.uid`.
   - Every private PII record in `/users/{userId}/private/{infoId}` must belong to the parent `/users/{userId}` owned by `request.auth.uid`.
2. **PII Isolation:**
   - Emails and authentication provider details are isolated inside `/users/{userId}/private/{infoId}` and are strictly readable only by `isOwner(userId)` or `isAdmin()`.
3. **Anti-Update-Gap & Schema Enforcement:**
   - Every `create` and `update` rule invokes its `isValid[Entity](incoming())` helper, enforcing strict keys (`hasAll` / `hasOnly`), string length bounds (`.size()`), regex validation on IDs (`isValidId()`), and server timestamp verification (`request.time`).
4. **Privilege Escalation Prevention:**
   - Standard users creating `/users/{userId}` can only set `role == 'user'`. Only `isAdmin()` can assign or modify administrative roles.
5. **Terminal State Locking:**
   - Once a `/feedback_reports/{reportId}` document reaches `status == 'Resolved'`, non-admin users cannot mutate it further.
6. **Query Enforcer (No Blanket Reads):**
   - `allow list` on `/conversations` and `/feedback_reports` strictly verifies `resource.data.ownerId == request.auth.uid` (or `isAdmin()`).

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Shadow Field Injection):** Creating a `Conversation` with an undeclared field `{ ownerId, title, topic, createdAt, updatedAt, isVerifiedAdmin: true }` -> `PERMISSION_DENIED`.
2. **Payload 2 (Identity Spoofing on Create):** User `uid_A` creates a `Conversation` with `ownerId: "uid_B"` -> `PERMISSION_DENIED`.
3. **Payload 3 (Self-Assigned Admin Role):** User creates `/users/uid_A` with `role: "superadmin"` -> `PERMISSION_DENIED`.
4. **Payload 4 (Unverified Email Write):** User with `email_verified: false` attempts to create a `Conversation` -> `PERMISSION_DENIED`.
5. **Payload 5 (Orphaned Subcollection Write):** User creates `/conversations/non_existent_conv/messages/msg1` where parent conversation does not exist -> `PERMISSION_DENIED`.
6. **Payload 6 (Cross-Tenant Message Injection):** User `uid_B` writes a message into `/conversations/conv_owned_by_A/messages/msg1` -> `PERMISSION_DENIED`.
7. **Payload 7 (PII Blanket Read):** Authenticated user `uid_B` attempts `get` on `/users/uid_A/private/info` -> `PERMISSION_DENIED`.
8. **Payload 8 (Timestamp Forgery):** User creates a `Conversation` with a past or future `createdAt` instead of `request.time` -> `PERMISSION_DENIED`.
9. **Payload 9 (Immortal Field Mutation):** Owner updates `Conversation` and attempts to mutate `createdAt` or `ownerId` -> `PERMISSION_DENIED`.
10. **Payload 10 (Terminal State Re-opening):** User attempts to update a `FeedbackReportDoc` whose existing `status` is `'Resolved'` -> `PERMISSION_DENIED`.
11. **Payload 11 (Value / Size Poisoning):** User updates `Conversation.title` with a 5,000-character string (exceeding `maxLength: 250`) -> `PERMISSION_DENIED`.
12. **Payload 12 (Unauthorized Blanket List Scraping):** User `uid_A` runs an unconstrained `list` query on `/conversations` without filtering `ownerId == uid_A` -> `PERMISSION_DENIED`.

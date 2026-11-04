import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ChatConversation, ChatMessage } from '../types/legal';

export interface StoredConversationRecord extends ChatConversation {
  userId: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatConversationsStoreSchema {
  schemaVersion: number;
  lastUpdatedAt: string;
  conversations: StoredConversationRecord[];
}

const DEFAULT_CHAT_STORE_PATH = path.resolve(
  process.cwd(),
  process.env.CHAT_DB_PATH || 'data/chat_conversations_store.json'
);

/**
 * Authoritative Per-User Persistent Conversation Store.
 * Guarantees:
 * - New users start with an empty conversation list ([]).
 * - Zero dummy or sample conversations are ever seeded.
 * - Strict user isolation: User A can never view, modify, or delete User B's conversations.
 */
export class PersistentChatStore {
  private storePath: string;
  private data: ChatConversationsStoreSchema;

  constructor(customPath?: string) {
    this.storePath = customPath || DEFAULT_CHAT_STORE_PATH;
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): ChatConversationsStoreSchema {
    try {
      if (fs.existsSync(this.storePath)) {
        const raw = fs.readFileSync(this.storePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.conversations)) {
          return {
            schemaVersion: 1,
            lastUpdatedAt: parsed.lastUpdatedAt || new Date().toISOString(),
            conversations: parsed.conversations.filter(
              (c: any) => c && typeof c.id === 'string' && typeof c.userId === 'string'
            )
          };
        }
      }
    } catch {
      // Fall through to empty store
    }

    return {
      schemaVersion: 1,
      lastUpdatedAt: new Date().toISOString(),
      conversations: []
    };
  }

  private reloadFromDisk(): void {
    this.data = this.loadFromDisk();
  }

  private saveToDisk(): void {
    try {
      const dir = path.dirname(this.storePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.data.lastUpdatedAt = new Date().toISOString();
      const tmpPath = `${this.storePath}.${process.pid}.${Date.now()}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tmpPath, this.storePath);
    } catch {
      // Ignore write errors in read-only test contexts
    }
  }

  /**
   * Returns ONLY the authenticated user's real conversations, sorted newest first.
   * Never returns another user's conversations or dummy conversations.
   */
  public getUserConversations(userId: string): StoredConversationRecord[] {
    if (!userId || typeof userId !== 'string') return [];
    this.reloadFromDisk();
    return this.data.conversations
      .filter((c) => c.userId === userId)
      .sort((a, b) => Date.parse(b.updatedAt || b.createdAt) - Date.parse(a.updatedAt || a.createdAt));
  }

  /**
   * Retrieves a specific conversation only if it belongs to the specified userId.
   */
  public getConversationForUser(
    userId: string,
    conversationId: string
  ): StoredConversationRecord | null {
    if (!userId || !conversationId) return null;
    this.reloadFromDisk();
    const found = this.data.conversations.find(
      (c) => c.id === conversationId && c.userId === userId
    );
    return found || null;
  }

  /**
   * Checks whether a conversation exists and whether it belongs to the requesting user.
   * Returns 403 if the conversation belongs to another user, 404 if it does not exist, or 200 if owned.
   */
  public checkConversationOwnership(
    userId: string,
    conversationId: string
  ): {
    allowed: boolean;
    statusCode: number;
    conversation?: StoredConversationRecord;
    error?: string;
  } {
    if (!userId) {
      return {
        allowed: false,
        statusCode: 401,
        error: 'Authentication required.'
      };
    }
    this.reloadFromDisk();
    const raw = this.data.conversations.find((c) => c.id === conversationId);
    if (!raw) {
      return {
        allowed: false,
        statusCode: 404,
        error: 'Conversation not found.'
      };
    }
    if (raw.userId !== userId) {
      return {
        allowed: false,
        statusCode: 403,
        error: 'Forbidden: You do not have permission to access another user’s conversation.'
      };
    }
    return {
      allowed: true,
      statusCode: 200,
      conversation: raw
    };
  }

  /**
   * Creates a new conversation for the user when explicitly initiated or when sending their first message.
   */
  public createConversation(
    userId: string,
    params?: {
      id?: string;
      title?: string;
      topic?: string;
      userEmail?: string;
      initialMessages?: ChatMessage[];
    }
  ): StoredConversationRecord {
    if (!userId) {
      throw new Error('Authenticated userId is required to create a conversation.');
    }
    this.reloadFromDisk();

    const convId = params?.id || `conv-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const existing = this.data.conversations.find((c) => c.id === convId && c.userId === userId);
    if (existing) {
      return existing;
    }

    const nowIso = new Date().toISOString();
    const record: StoredConversationRecord = {
      id: convId,
      userId,
      userEmail: params?.userEmail,
      title: (params?.title || 'New Legal Consultation').trim().slice(0, 120),
      date: 'Just now',
      topic: params?.topic || 'General Inquiry',
      messages: Array.isArray(params?.initialMessages) ? params!.initialMessages : [],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.data.conversations.unshift(record);
    this.saveToDisk();
    return record;
  }

  /**
   * Appends one or more messages to a user's conversation (creating the conversation if it does not yet exist for this user).
   * Rejects if the conversationId belongs to a different user.
   */
  public appendMessages(
    userId: string,
    conversationId: string,
    newMessages: ChatMessage[],
    options?: {
      titleHint?: string;
      topicHint?: string;
      userEmail?: string;
    }
  ): StoredConversationRecord {
    if (!userId) {
      throw new Error('Authenticated userId is required to save messages.');
    }
    this.reloadFromDisk();

    const nowIso = new Date().toISOString();
    const existingById = this.data.conversations.find((c) => c.id === conversationId);

    if (existingById && existingById.userId !== userId) {
      throw new Error('Forbidden: Cannot append messages to another user’s conversation.');
    }

    let target = existingById;
    if (!target) {
      const derivedTitle =
        options?.titleHint ||
        newMessages.find((m) => m.role === 'user')?.content.slice(0, 64) ||
        'Legal Consultation';

      target = {
        id: conversationId || `conv-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        userId,
        userEmail: options?.userEmail,
        title: derivedTitle,
        date: 'Just now',
        topic: options?.topicHint || 'Legal Research',
        messages: [],
        createdAt: nowIso,
        updatedAt: nowIso
      };
      this.data.conversations.unshift(target);
    }

    for (const msg of newMessages) {
      if (!target.messages.some((existingMsg) => existingMsg.id === msg.id)) {
        target.messages.push(msg);
      }
    }

    // Auto-title if title was generic placeholder and first user question arrives
    if (
      (target.title === 'New Legal Consultation' || target.title === 'New Chat') &&
      (options?.titleHint || newMessages.some((m) => m.role === 'user'))
    ) {
      const firstUserText =
        options?.titleHint || newMessages.find((m) => m.role === 'user')?.content || target.title;
      target.title = firstUserText.length > 60 ? `${firstUserText.slice(0, 60)}...` : firstUserText;
    }

    if (options?.topicHint) {
      target.topic = options.topicHint;
    }

    target.date = 'Just now';
    target.updatedAt = nowIso;

    this.saveToDisk();
    return target;
  }

  /**
   * Replaces the last assistant response in a conversation (used for Regenerate Response).
   */
  public replaceLastAssistantMessage(
    userId: string,
    conversationId: string,
    replacementMessage: ChatMessage
  ): StoredConversationRecord | null {
    this.reloadFromDisk();
    const target = this.data.conversations.find(
      (c) => c.id === conversationId && c.userId === userId
    );
    if (!target) return null;

    let lastAssistantIdx = -1;
    for (let i = target.messages.length - 1; i >= 0; i--) {
      if (target.messages[i].role === 'assistant') {
        lastAssistantIdx = i;
        break;
      }
    }

    if (lastAssistantIdx !== -1) {
      target.messages[lastAssistantIdx] = replacementMessage;
    } else {
      target.messages.push(replacementMessage);
    }

    target.updatedAt = new Date().toISOString();
    target.date = 'Just now';
    this.saveToDisk();
    return target;
  }

  /**
   * Renames a conversation owned by userId.
   */
  public renameConversation(
    userId: string,
    conversationId: string,
    newTitle: string
  ): StoredConversationRecord | null {
    const cleanTitle = (newTitle || '').trim();
    if (!userId || !conversationId || !cleanTitle) return null;

    this.reloadFromDisk();
    const target = this.data.conversations.find(
      (c) => c.id === conversationId && c.userId === userId
    );
    if (!target) return null;

    target.title = cleanTitle.slice(0, 120);
    target.updatedAt = new Date().toISOString();
    this.saveToDisk();
    return target;
  }

  /**
   * Deletes a conversation owned by userId.
   */
  public deleteConversation(userId: string, conversationId: string): boolean {
    if (!userId || !conversationId) return false;
    this.reloadFromDisk();

    const beforeLen = this.data.conversations.length;
    this.data.conversations = this.data.conversations.filter(
      (c) => !(c.id === conversationId && c.userId === userId)
    );

    const deleted = this.data.conversations.length < beforeLen;
    if (deleted) {
      this.saveToDisk();
    }
    return deleted;
  }
}

export const chatStore = new PersistentChatStore();

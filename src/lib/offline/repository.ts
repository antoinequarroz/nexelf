import type { AccountId, OperationId, OutboxOperation } from "./types";

export interface OutboxRepository {
  enqueue(operation: OutboxOperation): Promise<boolean>;
  due(accountId: AccountId, now: number, limit: number): Promise<OutboxOperation[]>;
  acknowledge(accountId: AccountId, ids: readonly OperationId[]): Promise<void>;
  retry(accountId: AccountId, operation: OutboxOperation): Promise<void>;
  clearAccount(accountId: AccountId): Promise<void>;
}

/**
 * Implémentation de référence testable. La persistance mobile pourra respecter
 * la même interface sans exposer les données d'un compte à un autre.
 */
export class MemoryOutboxRepository implements OutboxRepository {
  private readonly operations = new Map<OperationId, OutboxOperation>();

  async enqueue(operation: OutboxOperation): Promise<boolean> {
    if (this.operations.has(operation.id)) return false;
    this.operations.set(operation.id, { ...operation });
    return true;
  }

  async due(accountId: AccountId, now: number, limit: number): Promise<OutboxOperation[]> {
    return [...this.operations.values()]
      .filter((item) => item.accountId === accountId && item.nextAttemptAt <= now)
      .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
      .slice(0, Math.max(0, limit))
      .map((item) => ({ ...item }));
  }

  async acknowledge(accountId: AccountId, ids: readonly OperationId[]): Promise<void> {
    for (const id of ids) {
      if (this.operations.get(id)?.accountId === accountId) this.operations.delete(id);
    }
  }

  async retry(accountId: AccountId, operation: OutboxOperation): Promise<void> {
    if (operation.accountId !== accountId) throw new Error("account_mismatch");
    if (this.operations.get(operation.id)?.accountId === accountId) {
      this.operations.set(operation.id, { ...operation });
    }
  }

  async clearAccount(accountId: AccountId): Promise<void> {
    for (const [id, operation] of this.operations) {
      if (operation.accountId === accountId) this.operations.delete(id);
    }
  }
}

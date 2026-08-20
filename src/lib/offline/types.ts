export type AccountId = string;
export type OperationId = string;

export type OfflineEntity =
  | "dailyAction"
  | "dailyReview"
  | "goal"
  | "habitOccurrence"
  | "note";

/** Opérations métier transportables, et non requêtes HTTP à rejouer. */
export type SemanticOperation =
  | { type: "complete"; completed: boolean }
  | { type: "reschedule"; scheduledAt: number | null }
  | { type: "setNote"; note: string }
  | { type: "setReview"; energy: number | null; blocker: string | null }
  | { type: "setStatus"; status: "active" | "archived" | "paused" };

export interface OutboxOperation {
  id: OperationId;
  accountId: AccountId;
  entity: OfflineEntity;
  entityId: string;
  operation: SemanticOperation;
  /** Horodatage logique produit par le client, en millisecondes. */
  occurredAt: number;
  createdAt: number;
  attempts: number;
  nextAttemptAt: number;
}

export interface VersionedValue<T> {
  value: T;
  updatedAt: number;
  /** Départage stable lorsque deux changements ont le même horodatage. */
  operationId: OperationId;
}

export interface PushResult {
  acceptedIds: OperationId[];
  rejected: { id: OperationId; retryable: boolean; reason?: string }[];
}

export interface SyncTransport {
  push(accountId: AccountId, operations: readonly OutboxOperation[]): Promise<PushResult>;
}

export interface Clock {
  now(): number;
}

export interface RandomSource {
  next(): number;
}

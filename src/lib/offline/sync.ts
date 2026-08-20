import { retryDelayMs, type BackoffOptions } from "./backoff";
import type { OutboxRepository } from "./repository";
import type {
  AccountId,
  Clock,
  OutboxOperation,
  RandomSource,
  SyncTransport,
} from "./types";

export interface SyncOptions {
  batchSize?: number;
  backoff?: BackoffOptions;
}

export interface SyncSummary {
  sent: number;
  acknowledged: number;
  scheduledForRetry: number;
  permanentlyRejected: number;
}

export class OutboxSync {
  private readonly repository: OutboxRepository;
  private readonly transport: SyncTransport;
  private readonly clock: Clock;
  private readonly random: RandomSource;
  private readonly options: SyncOptions;

  constructor(
    repository: OutboxRepository,
    transport: SyncTransport,
    clock: Clock,
    random: RandomSource,
    options: SyncOptions = {},
  ) {
    this.repository = repository;
    this.transport = transport;
    this.clock = clock;
    this.random = random;
    this.options = options;
  }

  async run(accountId: AccountId): Promise<SyncSummary> {
    const now = this.clock.now();
    const operations = await this.repository.due(accountId, now, this.options.batchSize ?? 50);
    if (operations.length === 0) return emptySummary();

    try {
      const result = await this.transport.push(accountId, operations);
      const sentIds = new Set(operations.map((item) => item.id));
      const accepted = result.acceptedIds.filter((id) => sentIds.has(id));
      const rejected = result.rejected.filter((item) => sentIds.has(item.id));
      const permanent = rejected.filter((item) => !item.retryable).map((item) => item.id);
      await this.repository.acknowledge(accountId, [...accepted, ...permanent]);

      const retryableIds = new Set(
        rejected.filter((item) => item.retryable).map((item) => item.id),
      );
      const mentioned = new Set([...accepted, ...rejected.map((item) => item.id)]);
      for (const operation of operations) {
        // Une réponse partielle est traitée comme transitoire pour éviter une perte.
        if (retryableIds.has(operation.id) || !mentioned.has(operation.id)) {
          await this.scheduleRetry(accountId, operation, now);
        }
      }

      return {
        sent: operations.length,
        acknowledged: accepted.length,
        scheduledForRetry: retryableIds.size + operations.filter((item) => !mentioned.has(item.id)).length,
        permanentlyRejected: permanent.length,
      };
    } catch {
      for (const operation of operations) await this.scheduleRetry(accountId, operation, now);
      return {
        sent: operations.length,
        acknowledged: 0,
        scheduledForRetry: operations.length,
        permanentlyRejected: 0,
      };
    }
  }

  private async scheduleRetry(
    accountId: AccountId,
    operation: OutboxOperation,
    now: number,
  ): Promise<void> {
    const attempts = operation.attempts + 1;
    await this.repository.retry(accountId, {
      ...operation,
      attempts,
      nextAttemptAt: now + retryDelayMs(attempts, this.random, this.options.backoff),
    });
  }
}

function emptySummary(): SyncSummary {
  return { sent: 0, acknowledged: 0, scheduledForRetry: 0, permanentlyRejected: 0 };
}

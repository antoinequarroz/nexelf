import assert from "node:assert/strict";
import test from "node:test";

import { retryDelayMs } from "../backoff";
import { resolveLastWriteWins } from "../conflict";
import { MemoryOutboxRepository } from "../repository";
import { OutboxSync } from "../sync";
import type { OutboxOperation, SyncTransport } from "../types";

const operation = (id: string, accountId = "account-a"): OutboxOperation => ({
  id,
  accountId,
  entity: "dailyAction",
  entityId: "action-1",
  operation: { type: "complete", completed: true },
  occurredAt: 100,
  createdAt: 100,
  attempts: 0,
  nextAttemptAt: 100,
});

test("l'outbox est idempotente et isolée par compte", async () => {
  const repository = new MemoryOutboxRepository();
  assert.equal(await repository.enqueue(operation("same-id")), true);
  assert.equal(await repository.enqueue(operation("same-id")), false);
  await repository.enqueue(operation("other-id", "account-b"));

  assert.deepEqual((await repository.due("account-a", 100, 10)).map((item) => item.id), [
    "same-id",
  ]);
  await repository.acknowledge("account-b", ["same-id"]);
  assert.equal((await repository.due("account-a", 100, 10)).length, 1);
});

test("LWW converge même lorsque les horodatages sont égaux", () => {
  const first = { value: "first", updatedAt: 100, operationId: "a" };
  const second = { value: "second", updatedAt: 100, operationId: "b" };
  assert.equal(resolveLastWriteWins(first, second).value, "second");
  assert.equal(resolveLastWriteWins(second, first).value, "second");
});

test("le backoff est exponentiel, borné et déterministe avec une source injectée", () => {
  const random = { next: () => 0.5 };
  assert.equal(retryDelayMs(1, random), 1_000);
  assert.equal(retryDelayMs(3, random), 4_000);
  assert.equal(retryDelayMs(99, random), 300_000);
});

test("la synchronisation acquitte les succès et reprogramme les erreurs", async () => {
  const repository = new MemoryOutboxRepository();
  await repository.enqueue(operation("ok"));
  await repository.enqueue(operation("retry"));
  const transport: SyncTransport = {
    push: async () => ({
      acceptedIds: ["ok"],
      rejected: [{ id: "retry", retryable: true }],
    }),
  };
  const sync = new OutboxSync(repository, transport, { now: () => 100 }, { next: () => 0.5 });

  assert.deepEqual(await sync.run("account-a"), {
    sent: 2,
    acknowledged: 1,
    scheduledForRetry: 1,
    permanentlyRejected: 0,
  });
  assert.equal((await repository.due("account-a", 100, 10)).length, 0);
  assert.equal((await repository.due("account-a", 1_100, 10))[0]?.attempts, 1);
});

test("une panne réseau conserve chaque opération", async () => {
  const repository = new MemoryOutboxRepository();
  await repository.enqueue(operation("pending"));
  const transport: SyncTransport = { push: async () => Promise.reject(new Error("offline")) };
  const sync = new OutboxSync(repository, transport, { now: () => 100 }, { next: () => 0.5 });
  const result = await sync.run("account-a");

  assert.equal(result.scheduledForRetry, 1);
  assert.equal((await repository.due("account-a", 1_100, 10))[0]?.id, "pending");
});

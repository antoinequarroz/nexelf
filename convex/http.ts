import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();
authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/revenuecat-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.REVENUECAT_WEBHOOK_AUTHORIZATION;
    if (!secret || request.headers.get("authorization") !== secret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as {
      event?: Record<string, unknown>;
    } | null;
    const event = body?.event;
    if (
      !event ||
      typeof event.id !== "string" ||
      typeof event.type !== "string" ||
      typeof event.app_user_id !== "string"
    ) {
      return new Response("Invalid event", { status: 400 });
    }

    const entitlementIds = Array.isArray(event.entitlement_ids)
      ? event.entitlement_ids.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
    if (!entitlementIds.includes("pro"))
      return new Response(null, { status: 204 });

    const inactif = ["EXPIRATION", "REFUND"].includes(event.type);
    await ctx.runMutation(internal.revenuecat.appliquerEvenement, {
      evenementId: event.id,
      type: event.type,
      appUserId: event.app_user_id,
      entitlement: "pro",
      actif: !inactif,
      plateforme: typeof event.store === "string" ? event.store : undefined,
      expireLe:
        typeof event.expiration_at_ms === "number"
          ? event.expiration_at_ms
          : undefined,
    });
    return new Response(null, { status: 204 });
  }),
});

export default http;

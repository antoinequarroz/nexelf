/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as copilote from "../copilote.js";
import type * as habitudes from "../habitudes.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as memoire from "../memoire.js";
import type * as notifications from "../notifications.js";
import type * as objectifs from "../objectifs.js";
import type * as onboarding from "../onboarding.js";
import type * as planning from "../planning.js";
import type * as profils from "../profils.js";
import type * as revues from "../revues.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  copilote: typeof copilote;
  habitudes: typeof habitudes;
  http: typeof http;
  lib: typeof lib;
  memoire: typeof memoire;
  notifications: typeof notifications;
  objectifs: typeof objectifs;
  onboarding: typeof onboarding;
  planning: typeof planning;
  profils: typeof profils;
  revues: typeof revues;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};

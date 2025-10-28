/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addSampleTurfs from "../addSampleTurfs.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as favorites from "../favorites.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as payments from "../payments.js";
import type * as router from "../router.js";
import type * as turfs from "../turfs.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addSampleTurfs: typeof addSampleTurfs;
  auth: typeof auth;
  bookings: typeof bookings;
  favorites: typeof favorites;
  http: typeof http;
  notifications: typeof notifications;
  payments: typeof payments;
  router: typeof router;
  turfs: typeof turfs;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

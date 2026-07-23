/**
 * Example: end-to-end per-tab course context with dce-expresskit.
 *
 * This file is illustrative teaching material — it is intentionally kept out of
 * /src so it is not compiled into the published library. It shows the full loop:
 *
 *   1. (Server) Mint a course-context token for the current launch.
 *   2. (Client) Store the token per browser tab and send it on every request.
 *   3. (Server) genRouteHandler verifies the token automatically.
 *
 * Prerequisite: set DCEKIT_COURSE_CONTEXT_SECRET in the server environment. This
 * secret signs and verifies tokens, so it must be stable and kept private.
 *
 * @author Karen Dolan
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

// Import express
import express from 'express';

// Import expresskit
import {
  addCourseContextEndpoint,
  genRouteHandler,
  COURSE_CONTEXT_HEADER,
} from 'dce-expresskit';

/*------------------------------------------------------------------------*/
/* ------------------------- 1. Server: mint it ------------------------- */
/*------------------------------------------------------------------------*/

const app = express();

// Option A (recommended): use the ready-made endpoint helper. This mounts
// GET /api/course-context, which returns a signed token for the current launch.
addCourseContextEndpoint({ app });

// Option B: mint inside your own endpoint if you need custom behavior.
// import { genCourseContext } from 'dce-expresskit';
// app.get('/api/my-course-context', genRouteHandler({
//   handler: async ({ req }) => {
//     return genCourseContext({ req });
//   },
// }));

// Every normal endpoint stays exactly as it is today. When a verified course
// context is present on the request, genRouteHandler trusts it for this
// request's course + roles; when it is absent, behavior is unchanged.
app.get(
  '/api/assignments',
  genRouteHandler({
    handler: async (
      handlerOpts: {
        params: { [k: string]: any },
      },
    ) => {
      // params.courseId / params.isTTM / params.isAdmin now reflect the verified
      // course context for THIS tab, not just the shared session launch.
      const {
        courseId,
        isTTM,
      } = handlerOpts.params;
      return { courseId, isTTM };
    },
  }),
);

/*------------------------------------------------------------------------*/
/* ------------------- 2. Client: store + attach it --------------------- */
/*------------------------------------------------------------------------*/

/**
 * The snippet below is pseudocode for the client (for example, in a dce-reactkit
 * app). Once dce-reactkit ships built-in support (Phase 2), visitServerEndpoint
 * will do this automatically and app code will not need any of it. Until then,
 * this shows the contract a client must honor.
 *
 * IMPORTANT: use sessionStorage, NOT localStorage. sessionStorage is scoped to a
 * single browser tab, which is exactly what lets two tabs hold two different
 * course contexts at once. localStorage is shared across tabs and would defeat
 * the purpose.
 *
 * // On app launch, fetch and store the token for THIS tab:
 * const { token } = await visitServerEndpoint({
 *   path: '/api/course-context',
 *   method: 'GET',
 * });
 * window.sessionStorage.setItem('courseContextToken', token);
 *
 * // On every request, attach the stored token as a header:
 * const token = window.sessionStorage.getItem('courseContextToken');
 * const headers = token ? { [COURSE_CONTEXT_HEADER]: token } : {};
 *
 * // If a request fails with the "expired" code (DEK39), re-mint once and retry:
 * // 1) GET /api/course-context again, 2) store the new token, 3) retry.
 */

export default app;

/**
 * The release tag is deliberately checked by the landing resolver. A site build
 * must never send someone to an older desktop binary after the web app changes.
 */
export const appVersion = '0.1.22';

/**
 * Vite always supplies this from VITE_FOOD_LOG_SOURCE_COMMIT or the checked-out
 * Git commit. Production downloads are therefore never checked without identity.
 */
export const sourceCommit = import.meta.env.VITE_FOOD_LOG_SOURCE_COMMIT;

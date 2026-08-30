/**
 * The release tag is deliberately checked by the landing resolver. A site build
 * must never send someone to an older desktop binary after the web app changes.
 */
export const appVersion = '0.1.7';

/**
 * Static deployment and the release workflow set this to the checked-out commit.
 * An empty value is intentional for local development and recorded browser tests.
 */
export const sourceCommit = import.meta.env.VITE_FOOD_LOG_SOURCE_COMMIT ?? '';

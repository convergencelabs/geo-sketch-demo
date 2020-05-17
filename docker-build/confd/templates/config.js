/**
 *
 * Configures the GeoSketch application.
 *
 * baseUrl: The context root of the app.
 *
 * domainUrl: The connection URL to a Convergence domain.  This domain must
 * have anonymous authentication enabled.
 *
 */
const GEO_SKETCH_DEMO_CONFIG = {
    baseUrl: '{{ getenv "BASE_URL" }}',
    domainUrl: '{{ getenv "CONVERGENCE_URL" }}'
};
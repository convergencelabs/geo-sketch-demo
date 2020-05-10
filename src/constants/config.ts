/*
 * Copyright (c) 2020 Convergence Labs, Inc.
 *
 * This file is part of the Convergence Chat Demo, which is released under
 * the terms of the MIT License. A copy of the MIT should have been provided
 * along with this file, typically located in the "LICENSE" file, which is part
 * of this source code package. Alternatively, see
 * <https://opensource.org/licenses/MIT> for the full text of theMIT license,
 *  if it was not provided.
 */

export interface IGeoSketchDemoConfig {
  baseUrl: string;
  domainUrl: string;
}

declare const GEO_SKETCH_DEMO_CONFIG: IGeoSketchDemoConfig;

if (GEO_SKETCH_DEMO_CONFIG === undefined) {
  throw new Error("GEO_SKETCH_DEMO_CONFIG was not defined.")
}

if (GEO_SKETCH_DEMO_CONFIG.domainUrl === undefined) {
  throw new Error("CONVERGENCE_ADMIN_CONSOLE_CONFIG.restApiUrl was not defined.");
}


const config = {...GEO_SKETCH_DEMO_CONFIG};
export const GeoSketchDemoConfig: IGeoSketchDemoConfig = config;

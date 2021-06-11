import type {} from "piral-core";

declare module "piral-core/lib/types/custom" {
  interface PiletCustomApi extends AngleSharpDocletApi {}
}

export interface AngleSharpDocletApi {
  setDocDetails(details: { version?: string; updated?: string }): void;
}

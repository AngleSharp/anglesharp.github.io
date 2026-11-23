import type { PiralPlugin, PiletApi } from "piral-core";

export { PiralPlugin, PiletApi };

declare module "piral-core/lib/types/custom" {
  interface PiletCustomApi extends AngleSharpDocletApi {}

  interface PiralCustomState extends AngleSharpDocState {}
}

export interface DocDetails {
  version?: string;
  updated?: string;
}

export interface AngleSharpDocState {
  docs: DocDetails;
}

export interface AngleSharpDocletApi {
  setDocDetails(details: DocDetails): void;
}

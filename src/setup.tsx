import type { PiletApi } from "./types";

export default function setup(api: PiletApi) {
  api.setDocDetails({
    // set default version
    version: "0.16.1",
  });
}

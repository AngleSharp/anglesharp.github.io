import { PiletApi } from "piral-docs-tools";

export default function setup(api: PiletApi) {
  api.setDocDetails({
    // set default version
    version: "0.15.0",
  });
}

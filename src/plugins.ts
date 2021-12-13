import type { PiralPlugin } from "./types";

const plugins: Array<PiralPlugin> = [
  (context) => ({
    setDocDetails(details) {
      context.dispatch((state) => ({
        ...state,
        docs: {
          ...state.docs,
          ...details,
        },
      }));
    },
  }),
];

export default plugins;

import type { PiralPlugin } from "piral-docs-tools";

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

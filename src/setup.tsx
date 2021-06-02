import * as React from 'react';

export default function setup(api) {
  api.registerDocumentation(
    {
      title: "Foo",
      links: [
        {
          id: "foo",
          page: () => <div />,
          route: "/docs/foo",
          link: "/docs/foo",
          title: "Foo Page",
        },
      ],
    },
    "docs"
  );
}

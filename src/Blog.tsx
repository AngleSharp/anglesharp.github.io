import * as React from "react";

export default ({ meta, children }) => (
  <article>
    <h2>{meta.title}</h2>

    <div className="blog-info">
      {meta.author} • {meta.date} • {meta.categories}
    </div>

    <div className="blog-post">{children}</div>
  </article>
);

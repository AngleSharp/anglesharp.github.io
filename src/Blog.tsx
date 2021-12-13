import * as React from "react";

export default ({ meta, children }) => (
  <article>
    <h2>{meta.title}</h2>

    <div className="blog-info">
      <i className="far fa-clock" /> {meta.date} • {meta.categories}
    </div>

    <div className="blog-post">{children}</div>

    <div className="blog-author">
      <div className="author-photo">
        <img
          src={`https://github.com/${meta.userId}.png?size=48`}
          alt={meta.author}
        />
      </div>
      <div className="author-info">
        <strong>{meta.author}</strong>
        <span>Contributor</span>
      </div>
    </div>
  </article>
);

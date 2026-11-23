import * as React from "react";

const year = new Date().getFullYear();

export default () => (
  <footer>
    <div className="container">
      <div className="left">
        <p>Copyright &copy; AngleSharp, 2013 - {year}.</p>
        <p>
          Published with <a href="http://pages.github.com">GitHub Pages</a>.
          Licensed under MIT.
        </p>
      </div>
      <div className="right">
        <p>
          <small>Supported by the</small>
        </p>
        <a href="https://dotnetfoundation.org/" target="_blank">
          <img
            src={require("../images/dotnetfoundation.svg")}
            alt=".NET Foundation"
            className="foundation-logo"
          />
        </a>
      </div>
    </div>
  </footer>
);

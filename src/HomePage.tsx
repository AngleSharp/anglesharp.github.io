import * as React from "react";

export default () => (
  <div className="homepage">
    <header className="header-large full-bleed">
      <div className="headline-large">
        <div className="container">
          <h1>ΛngleSharp</h1>
          <h2>
            makes .NET <span className="red">❤</span> HTML5
          </h2>
        </div>
      </div>
    </header>

    <hr className="feature-divider" />

    <div className="row">
      <div className="text-center">
        <img src={require("../images/github-icon.png")} />
        <h3>Repository on GitHub</h3>
        <a
          href="https://github.com/AngleSharp/AngleSharp"
          className="btn btn-primary"
          target="_blank"
        >
          View it on GitHub
        </a>
      </div>
      <div className="text-center">
        <img src={require("../images/nuget-icon.png")} />
        <h3>Get it from NuGet</h3>
        <a
          href="https://www.nuget.org/packages/AngleSharp"
          className="btn btn-primary"
          target="_blank"
        >
          Package Information
        </a>
      </div>
      <div className="text-center">
        <img src={require("../images/download-icon.png")} />
        <h3>Download latest release</h3>
        <a
          href="https://github.com/AngleSharp/AngleSharp/archive/master.zip"
          className="btn btn-primary"
          target="_blank"
        >
          Get Zip Archive
        </a>
      </div>
    </div>

    <hr className="feature-divider" />

    <div className="feature">
      <img
        className="feature-image img-responsive pull-right"
        src={require("../images/teasers/dom.gif")}
      />
      <h2 className="feature-heading">
        Explore <span className="text-muted">the DOM</span>.
      </h2>
      <p className="lead">
        AngleSharp follows the W3C specifications and gives you the same results
        as state of the art browsers. Besides the official API AngleSharp adds
        some useful extension methods on top. This makes working with the DOM
        convenient.
      </p>
    </div>

    <hr className="feature-divider" />

    <div className="feature">
      <img
        className="feature-image img-responsive pull-left"
        src={require("../images/teasers/queries.gif")}
      />
      <h2 className="feature-heading">
        Want <span className="text-muted">Selector Queries</span>?
      </h2>
      <p className="lead">
        AngleSharp integrates everything you need to explore and mutate the DOM
        tree. Node retrieval is straight forward by using powerful CSS query
        selectors. The CSS queries in AngleSharp are super fast and very simple
        to use.
      </p>
    </div>

    <hr className="feature-divider" />

    <div className="feature">
      <img
        className="feature-image img-responsive pull-right"
        src={require("../images/teasers/sheets.gif")}
      />
      <h2 className="feature-heading">
        Full <span className="text-muted">CSS Support</span>!
      </h2>
      <p className="lead">
        AngleSharp respects the relationship of HTML with CSS. Therefore CSS is
        a first class citizen in the AngleSharp eco-system. Nevertheless, it is
        your choice if you want to use CSS with HTML, CSS alone or if you
        provide your own CSS solution.
      </p>
    </div>

    <hr className="feature-divider" />

    <div className="feature">
      <img
        className="feature-image img-responsive pull-left"
        src={require("../images/teasers/scripts.gif")}
      />
      <h2 className="feature-heading">
        You need <span className="text-muted">JavaScript</span>?
      </h2>
      <p className="lead">
        AngleSharp offers a lot of extension points. One of the best
        possibilities is providing scripting engines. This gives you a very
        elegant way of using JavaScript with C# on webpages. You can even script
        in other languages if you want to.
      </p>
    </div>

    <hr className="feature-divider" />

    <div className="row">
      <div className="half-width">
        <img
          src={require("../images/perf-icon.png")}
          className="eyecatcher-image pull-right"
        />
        <div className="text-right">
          <h4>Performance</h4>
          <p>
            AngleSharp gives you great performance. Parse your favorite websites
            in practically no-time.
          </p>
        </div>
      </div>
      <div className="half-width">
        <img
          src={require("../images/dom-icon.png")}
          className="eyecatcher-image pull-left"
        />
        <div className="text-left">
          <h4>Interactive DOM</h4>
          <p>
            The DOM exposed by AngleSharp is fully functional and interactive.
            Handle DOM events in your code.
          </p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="half-width">
        <img
          src={require("../images/standards-icon.png")}
          className="eyecatcher-image pull-right"
        />
        <div className="text-right">
          <h4>Standard-Driven</h4>
          <p>
            Everything works just like in modern browsers. From DOM construction
            to serialization.
          </p>
        </div>
      </div>
      <div className="half-width">
        <img
          src={require("../images/doc-icon.png")}
          className="eyecatcher-image pull-left"
        />
        <div className="text-left">
          <h4>Great Documentation</h4>
          <p>
            The whole code is documentated with XML documentation. Also more
            tutorials are in progress.
          </p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="half-width">
        <img
          src={require("../images/new-icon.png")}
          className="eyecatcher-image pull-right"
        />
        <div className="text-right">
          <h4>Latest Features</h4>
          <p>
            Enjoy the <code>template</code> element. Use multiple image sources
            in a <code>picture</code>. Shadow DOM? AngleSharp got you covered.
          </p>
        </div>
      </div>
      <div className="half-width">
        <img
          src={require("../images/portable-icon.png")}
          className="eyecatcher-image pull-left"
        />
        <div className="text-left">
          <h4>Portable</h4>
          <p>
            AngleSharp is a .NET Standard library that can be used on many
            platforms. This includes, but is not limited to, .NET (Core / FX),
            Unity, and Xamarin.
          </p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="half-width">
        <img
          src={require("../images/linq-icon.png")}
          className="eyecatcher-image pull-right"
        />
        <div className="text-right">
          <h4>LINQ Enhanced</h4>
          <p>
            AngleSharp brings LINQ to the DOM. Use LINQ to get the information
            you desire. Also some more useful helpers are available.
          </p>
        </div>
      </div>
      <div className="half-width">
        <img
          src={require("../images/services-icon.png")}
          className="eyecatcher-image pull-left"
        />
        <div className="text-left">
          <h4>Easy to Extend</h4>
          <p>
            You want to use your own HTTP requester? Cookies? Decode images or
            run scripts? It's easy to setup and integrate.
          </p>
        </div>
      </div>
    </div>
  </div>
);

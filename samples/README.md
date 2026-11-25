# AngleSharp samples

Runnable .NET 10 console projects for the AngleSharp tutorial videos (`../videos/TUTORIALS-PLAN.md`). Every snippet and every terminal output shown in a tutorial comes from these projects.

| Project | Package(s) | What it does |
| ------- | ---------- | ------------ |
| `01-querying`   | AngleSharp | Turns a product listing page into JSON: parsing vs. loading, selectors, typed elements, traversal. |
| `02-generating` | AngleSharp | Cleans a newsletter: create/insert, remove/replace, link rewriting, fragments, serializing. |
| `03-styles`     | AngleSharp.Css | A CSS inliner for HTML emails: CSSOM, inline and computed styles, media queries. |
| `04-xml`        | AngleSharp.Xml | Reads an Atom feed, reports parse errors, validates a config with XSD, handles SVG/XHTML. |
| `05-browsing`   | AngleSharp.Io | Requesters, cookies, forms, redirects and offline testing against the AngleSharp test site. |
| `06-rendering`  | AngleSharp.Renderer | Renders social cards, a clipped banner, an element, an SVG chart and a canvas to PNG. |

## Running

```sh
cd samples/01-querying
dotnet run
```

Inputs live in each project's `input/` folder; results are written to `output/` (git-ignored).

`05-browsing` needs [AngleSharp.Infrastructure.TestSite](https://github.com/AngleSharp/AngleSharp.Infrastructure.TestSite) running locally:

```sh
cd AngleSharp.Infrastructure.TestSite
npm install
npm run dev   # http://localhost:8080
```

Pass another base URL as the first argument if it runs elsewhere: `dotnet run -- http://localhost:5000`.

## Package versions

Versions are managed centrally in `Directory.Packages.props`. `AngleSharp.Renderer` uses `0.13.0-beta.240` until 0.13.0 is on nuget.org.

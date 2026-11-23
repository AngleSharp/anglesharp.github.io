# Examples (AngleSharp.Io)

> Source: https://anglesharp.github.io/docs/io/tutorials/examples/
> Project: AngleSharp.Io (https://github.com/AngleSharp/AngleSharp.Io)
> Package: AngleSharp.Io 1.3.3 — install with `dotnet add package AngleSharp.Io`
> Docs revision: 04108d0016949a158c855c362073b1883c674c2b

This is a (growing) list of examples for every-day usage of AngleSharp.Io.

## Some Example

AngleSharp.Io makes it easy to use the `HttpClient` for, e.g., utilizing a proxy to make HTTP requests.

```cs
var handler = new HttpClientHandler
{
    Proxy = new WebProxy(myProxyHost, false),
    PreAuthenticate = true,
    UseDefaultCredentials = false,
};

var config = Configuration.Default
    .WithRequesters(handler) // from AngleSharp.Io with a handler config
    .WithDefaultLoader();

var context = BrowsingContext.New(config);

// this will load the document using the given requester, i.e., using the proxy
var document = await context.OpenAsync("https://some-page.com/foo");
```

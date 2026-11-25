using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using AngleSharp.Xhtml;

var html = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "input", "newsletter.html"));
var context = BrowsingContext.New(Configuration.Default);
var document = await context.OpenAsync(r => r
    .Content(html)
    .Address("https://news.example.com/2026/spring"));

// ── 1. Create and insert ────────────────────────────────────────
var footer = document.CreateElement("p");
footer.ClassList.Add("unsubscribe");
footer.TextContent = "Don't want these emails? ";

var unsubscribe = document.CreateElement<IHtmlAnchorElement>();
unsubscribe.Href = "/unsubscribe";
unsubscribe.TextContent = "Unsubscribe";
footer.Append(unsubscribe);
document.Body!.Append(footer);

var heading = document.QuerySelector<IHtmlElement>("h1")!;
heading.Dataset["campaign"] = "spring-2026";
heading.After(document.CreateElement("hr"));

// ── 2. Remove and replace ───────────────────────────────────────
string[] blocked = ["script", "iframe", "object", "embed"];
var selector = string.Join(", ", blocked);
foreach (var element in document.QuerySelectorAll(selector))
{
    element.Remove();
}

foreach (var element in document.Body.QuerySelectorAll("*"))
{
    var handlers = element.Attributes
        .Where(a => a.Name.StartsWith("on"))
        .Select(a => a.Name)
        .ToList();
    foreach (var name in handlers)
    {
        element.RemoveAttribute(name);
    }
}

foreach (var font in document.QuerySelectorAll("font"))
{
    font.Replace([.. font.ChildNodes]);
}

var links = document.QuerySelectorAll<IHtmlAnchorElement>("a[href]");
foreach (var link in links)
{
    var separator = link.Href.Contains('?') ? "&" : "?";
    link.Href += separator + "utm_source=newsletter";
    if (link.HostName != "news.example.com")
    {
        link.Target = "_blank";
        link.Relation = "noopener";
    }
}

// ── 3. Fragments ────────────────────────────────────────────────
var row = "<tr><td>May 12</td><td>AngleSharp meetup</td></tr>";
var parser = new HtmlParser();
var events = document.QuerySelector("#events tbody")!;

var inBody = parser.ParseFragment(row, document.Body);
var inTable = parser.ParseFragment(row, events);
Console.WriteLine($"In <body>:  {Names(inBody)}");
Console.WriteLine($"In <tbody>: {Names(inTable)}");
events.Append([.. inTable]);

// ── 4. Serialize ────────────────────────────────────────────────
var full = document.ToHtml();
Console.WriteLine($"ToHtml(): {full[..44]}…");

var body = document.Body.InnerHtml;
var pretty = document.Body.ToHtml(new PrettyMarkupFormatter());
var minified = document.Body.Minify();
var xhtml = document.Body.ToHtml(new XhtmlMarkupFormatter());

Save("body.html", body);
Save("pretty.html", pretty);
Save("minified.html", minified);
Save("body.xhtml", xhtml);
var sizes = $"{body.Length} / {pretty.Length} / {minified.Length}";
Console.WriteLine($"Sizes: {sizes}");
Console.WriteLine();
Console.WriteLine(pretty);

// ── Helpers ─────────────────────────────────────────────────────
static string Names(INodeList nodes) =>
    string.Join(", ", nodes.Select(n => n.NodeName));

static void Save(string name, string content)
{
    Directory.CreateDirectory("output");
    File.WriteAllText(Path.Combine("output", name), content);
}

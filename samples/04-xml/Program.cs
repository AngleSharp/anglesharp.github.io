using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;
using AngleSharp.Xhtml;
using AngleSharp.Xml;
using AngleSharp.Xml.Parser;

// ── 1. Why a second parser ──────────────────────────────────────
var snippet = "<Settings><Theme Mode='dark'/>" +
    "<Language>en</Language></Settings>";
var asHtml = new HtmlParser().ParseDocument(snippet);
var asXml = new XmlParser().ParseDocument(snippet);
Console.WriteLine($"HTML: {asHtml.Body!.InnerHtml}");
Console.WriteLine($"XML:  {asXml.DocumentElement.ToXml()}");

// WithXml() handles text/xml, application/xml and image/svg+xml.
var context = BrowsingContext.New(Configuration.Default.WithXml());
foreach (var type in new[] { "application/xml", "application/atom+xml" })
{
    var loaded = await context.OpenAsync(r => r
        .Content(Input("feed.xml"))
        .Header("Content-Type", type));
    var kind = loaded.GetType().Name;
    Console.WriteLine($"{type,-21} → {kind}");
}

// ── 2. Reading a feed ───────────────────────────────────────────
var parser = new XmlParser();
var feed = parser.ParseDocument(Input("feed.xml"));
var atom = feed.DocumentElement.NamespaceUri;
Console.WriteLine($"{feed.QuerySelector("feed > title")?.TextContent}");

var entries = feed.DocumentElement.GetElementsByTagNameNS(atom, "entry");
foreach (var entry in entries)
{
    var title = entry.QuerySelector("title")?.TextContent;
    var stamp = entry.QuerySelector("updated")!.TextContent;
    var updated = DateTimeOffset.Parse(stamp);
    Console.WriteLine($"  {updated:yyyy-MM-dd}  {title}");
}

// ── 3. Errors ───────────────────────────────────────────────────
try
{
    parser.ParseDocument(Input("broken.xml"));
}
catch (XmlParseException ex)
{
    var at = ex.Position;
    Console.WriteLine($"Line {at.Line}, column {at.Column}: {ex.Message}");
}

var lenient = new XmlParser(new XmlParserOptions
{
    IsSuppressingErrors = true,
});
var partial = lenient.ParseDocument(Input("broken.xml"));
var partialXml = partial.DocumentElement.ToXml().ReplaceLineEndings(" ");
Console.WriteLine($"Suppressed: {partialXml}");

var tracking = new XmlParser(new XmlParserOptions
{
    IsKeepingSourceReferences = true,
});
var tracked = tracking.ParseDocument(Input("config.xml"));
foreach (var element in tracked.QuerySelectorAll("feed"))
{
    var line = element.SourceReference?.Position.Line;
    Console.WriteLine($"<feed> at line {line}");
}

// ── 4. Validation ───────────────────────────────────────────────
var config = parser.ParseDocument(Input("config.xml"));
var result = config.ValidateXsd(Input("config.xsd"));
Console.WriteLine($"Valid: {result.IsValid}");
foreach (var d in result.Diagnostics)
{
    Console.WriteLine($"  line {d.LineNumber}: {d.Message}");
}

// ── 5. SVG and XHTML ────────────────────────────────────────────
var svg = parser.ParseDocument(Input("logo.svg"));
var svgRoot = svg.DocumentElement;
Console.WriteLine($"<{svgRoot.LocalName}> in {svgRoot.NamespaceUri}");
Console.WriteLine($"viewBox: {svgRoot.GetAttribute("viewBox")}");
Console.WriteLine($"polygons: {svg.QuerySelectorAll("polygon").Length}");

var html = "<p>Line one<br>Line two<img src=logo.svg alt=Logo>";
var page = new HtmlParser().ParseDocument(html);
var paragraph = page.Body!.FirstElementChild!;
Console.WriteLine($"HTML:  {paragraph.OuterHtml}");
Console.WriteLine($"XHTML: {paragraph.ToHtml(new XhtmlMarkupFormatter())}");

// ── Helpers ─────────────────────────────────────────────────────
static string Input(string name) =>
    File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "input", name));

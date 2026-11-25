using AngleSharp;
using AngleSharp.Css;
using AngleSharp.Css.Dom;
using AngleSharp.Css.Parser;
using AngleSharp.Dom;

var html = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "input", "email.html"));

// ── 1. Setup ────────────────────────────────────────────────────
var desktop = new DefaultRenderDevice
{
    ViewPortWidth = 800,
    DeviceWidth = 800,
};
var config = Configuration.Default
    .WithCss()
    .WithRenderDevice(desktop);
var context = BrowsingContext.New(config);
var document = await context.OpenAsync(r => r.Content(html));

// ── 2. Style sheets as objects ──────────────────────────────────
var css = document.QuerySelector("style")!.TextContent;
var sheet = new CssParser().ParseStyleSheet(css);

foreach (var rule in sheet.Rules.OfType<ICssStyleRule>())
{
    var count = rule.Style.Length;
    Console.WriteLine($"{rule.SelectorText,-10} {count} declarations");
}

var button = sheet.GetStyleRuleWith(".button")!;
button.Style.SetProperty("border-radius", "6px");
Console.WriteLine(button.Style.ToCss());

// ── 3. Inline styles ────────────────────────────────────────────
var cta = document.QuerySelector("#cta")!;
cta.GetStyle().SetProperty("margin-top", "24px");
Console.WriteLine($"Inline: {cta.GetAttribute("style")}");

// ── 4. Computed styles ──────────────────────────────────────────
var note = document.QuerySelector(".note")!;
var noteStyle = note.ComputeCurrentStyle();
Console.WriteLine($"color: {noteStyle.GetColor()}");
Console.WriteLine($"font-size: {noteStyle.GetFontSize()}");
Console.WriteLine($"display: {noteStyle.GetDisplay()}");
var family = noteStyle.GetPropertyValue("font-family");
Console.WriteLine($"font-family: {family}");

// ── 5. Media queries ────────────────────────────────────────────
// Default device: 0 × 0 viewport, so every max-width query matches.
foreach (var width in new[] { 0, 375, 800 })
{
    var device = new DefaultRenderDevice
    {
        ViewPortWidth = width,
        DeviceWidth = width,
    };
    var sized = Configuration.Default.WithCss().WithRenderDevice(device);
    var doc = await BrowsingContext.New(sized)
        .OpenAsync(r => r.Content(html));
    var column = doc.QuerySelector(".column")!.ComputeCurrentStyle();
    var h1 = doc.QuerySelector("h1")!.ComputeCurrentStyle();
    var w = column.GetPropertyValue("width");
    Console.WriteLine($"{width,4}px  column {w,-5} h1 {h1.GetFontSize()}");
}

// ── 6. The inliner ──────────────────────────────────────────────
string[] inherited =
    ["color", "font-family", "font-size", "line-height", "text-align"];
string[] own =
    ["background-color", "padding", "margin",
     "text-decoration-line", "width"];
var initial = new Dictionary<string, string>
{
    ["background-color"] = "rgba(0, 0, 0, 0)",
    ["padding"] = "0",
    ["margin"] = "0",
    ["text-decoration-line"] = "none",
    ["width"] = "auto",
};

var body = document.Body!;
foreach (var element in body.QuerySelectorAll("*").Prepend(body))
{
    var style = element.ComputeCurrentStyle();
    var parent = element.ParentElement?.ComputeCurrentStyle();
    var inline = element.GetStyle();

    foreach (var name in inherited)
    {
        var value = style.GetPropertyValue(name);
        if (value.Length > 0 && value != parent?.GetPropertyValue(name))
        {
            inline.SetProperty(name, value);
        }
    }

    foreach (var name in own)
    {
        var value = style.GetPropertyValue(name);
        if (value.Length > 0 && value != initial[name])
        {
            inline.SetProperty(name, value);
        }
    }
}

document.QuerySelector("style")!.Remove();
var inlined = document.DocumentElement.OuterHtml;
Directory.CreateDirectory("output");
File.WriteAllText(Path.Combine("output", "inlined.html"), inlined);

foreach (var element in body.QuerySelectorAll("[style]").Prepend(body))
{
    var inlineCss = element.GetAttribute("style");
    Console.WriteLine($"<{element.LocalName}> {inlineCss}");
}

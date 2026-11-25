using AngleSharp;
using AngleSharp.Css;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Renderer;
using AngleSharp.Renderer.Rendering;

// ── 1. First render ─────────────────────────────────────────────
var device = new DefaultRenderDevice
{
    ViewPortWidth = 1200,
    ViewPortHeight = 630,
};
var config = Configuration.Default
    .WithCss()
    .WithRenderDevice(device)
    .WithRendering();
var context = BrowsingContext.New(config);

var template = Input("card.html");
var document = await context.OpenAsync(r => r.Content(template));
var png = document.RenderToPng();
await Save("card-template.png", png.Data);
Console.WriteLine($"template.png {png.Width} × {png.Height}");

// ── 2. The template ─────────────────────────────────────────────
(string Title, string Date, string Tag)[] posts =
[
    ("AngleSharp 1.11.0", "November 24, 2026", "Release"),
    ("Native AoT, across the board", "November 24, 2026", "Deep dive"),
    ("Rendering, close to 1.0", "December 2026", "Roadmap"),
];

for (var i = 0; i < posts.Length; i++)
{
    var card = await context.OpenAsync(r => r.Content(template));
    card.QuerySelector(".title")!.TextContent = posts[i].Title;
    card.QuerySelector(".date")!.TextContent = posts[i].Date;
    card.QuerySelector(".badge")!.TextContent = posts[i].Tag;

    var file = $"card-{i + 1}.png";
    await Save(file, card.RenderToPng().Data);
    Console.WriteLine($"{file,-12} {posts[i].Title}");
}

// ── 3. Controlling the output ───────────────────────────────────
var retina = document.RenderToImage(new RenderOptions
{
    DeviceScaleFactor = 2f,
});
var banner = document.RenderToImage(new RenderOptions
{
    Clip = new RenderRect(0, 0, 1200, 200),
});
var badge = document.QuerySelector(".badge")!.RenderToImage();

await Save("card@2x.png", retina.Data);
await Save("banner.png", banner.Data);
await Save("badge.png", badge.Data);
Console.WriteLine($"card@2x.png  {retina.Width} × {retina.Height}");
Console.WriteLine($"banner.png   {banner.Width} × {banner.Height}");
Console.WriteLine($"badge.png    {badge.Width} × {badge.Height}");

// ── 4. SVG to PNG ───────────────────────────────────────────────
var small = new DefaultRenderDevice
{
    ViewPortWidth = 480,
    ViewPortHeight = 240,
};
var charts = BrowsingContext.New(Configuration.Default
    .WithCss()
    .WithRenderDevice(small)
    .WithRendering());
var chartHtml = Input("chart.html");
var chart = await charts.OpenAsync(r => r.Content(chartHtml));
var chartPng = chart.RenderToPng();
await Save("chart.png", chartPng.Data);
Console.WriteLine($"chart.png    {chartPng.Width} × {chartPng.Height}");

// ── 5. Canvas 2D ────────────────────────────────────────────────
var markup = "<canvas width=320 height=160></canvas>";
var page = await context.OpenAsync(r => r.Content(markup));
var canvas = page.QuerySelector<IHtmlCanvasElement>("canvas")!;
var ctx = (Canvas2DRenderingContext)canvas.GetContext("2d")!;

ctx.SetFillStyle("#070b14");
ctx.FillRect(0f, 0f, 320f, 160f);
string[] colors = ["#0a6fd1", "#1ba1e2", "#36c5f4", "#6ad7fb"];
for (var i = 0; i < colors.Length; i++)
{
    ctx.SetFillStyle(colors[i]);
    ctx.FillRect(24f + i * 72f, 120f - i * 28f, 56f, 16f + i * 28f);
}

var pixel = ctx.GetImageData(30, 130, 1, 1).Data;
Console.WriteLine($"Pixel (30, 130): {string.Join(", ", pixel.ToArray())}");
var drawing = ctx.ToImage("image/png");
await Save("canvas.png", drawing);
Console.WriteLine($"canvas.png   {drawing.Length:N0} bytes");

// ── Helpers ─────────────────────────────────────────────────────
static string Input(string name) =>
    File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "input", name));

static async Task Save(string name, byte[] data)
{
    Directory.CreateDirectory("output");
    await File.WriteAllBytesAsync(Path.Combine("output", name), data);
}

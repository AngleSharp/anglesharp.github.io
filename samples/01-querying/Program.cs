using System.Globalization;
using System.Text.Json;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

var html = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "input", "products.html"));

// ── 1. Parse or load ────────────────────────────────────────────
var parser = new HtmlParser();
var quick = parser.ParseDocument(html);
Console.WriteLine($"Parsed: {quick.Title}");

var context = BrowsingContext.New(Configuration.Default);
var document = await context.OpenAsync(r => r
    .Content(html)
    .Address("https://shop.example.com/garden/"));

// ── 2. Selectors ────────────────────────────────────────────────
var products = document.QuerySelectorAll("article.product");
var onSale = document.QuerySelectorAll(".product[data-sale]");
var second = document.QuerySelector(".product:nth-child(2) h2");
Console.WriteLine($"{products.Length} products, {onSale.Length} on sale");
Console.WriteLine($"Second: {second?.TextContent}");

var badge = document.QuerySelector(".badge");
var article = badge?.Closest("article");
Console.WriteLine($"Matches: {badge?.Matches(".product .badge")}");
Console.WriteLine($"Belongs to: {article?.GetAttribute("data-sku")}");

// ── 3. Typed elements ───────────────────────────────────────────
var link = document.QuerySelector<IHtmlAnchorElement>(".product a");
Console.WriteLine(link?.GetAttribute("href"));
Console.WriteLine(link?.Href);

var image = document.QuerySelector<IHtmlImageElement>(".product img");
Console.WriteLine(image?.Source);

// ── 4. Traversal and text ───────────────────────────────────────
var gloves = document.QuerySelector("[data-sku=GG-310]")!;
Console.WriteLine($"Parent: {gloves.ParentElement?.Id}");
Console.WriteLine($"Children: {gloves.Children.Length}");
var next = gloves.NextElementSibling;
Console.WriteLine($"Next: {next?.GetAttribute("data-sku")}");

var text = gloves.TextContent;
Console.WriteLine($"Has script text: {text.Contains("trackImpression")}");
var title = gloves.QuerySelector("h2")?.TextContent.Trim();
Console.WriteLine($"Title: {title}");

// ── 5. Into objects ─────────────────────────────────────────────
var items = products
    .Select(p => new Product(
        Sku: p.GetAttribute("data-sku") ?? "",
        Name: p.QuerySelector("h2")?.TextContent.Trim() ?? "",
        Price: ParsePrice(p.QuerySelector(".price")),
        OnSale: p.HasAttribute("data-sale"),
        Url: p.QuerySelector<IHtmlAnchorElement>("h2 a")?.Href))
    .ToList();

var options = new JsonSerializerOptions { WriteIndented = true };
var json = JsonSerializer.Serialize(items, options);
Directory.CreateDirectory("output");
File.WriteAllText(Path.Combine("output", "products.json"), json);
Console.WriteLine(json);

// ── Helpers ─────────────────────────────────────────────────────
static decimal ParsePrice(IElement? price) => decimal.Parse(
    price?.GetAttribute("content") ?? "0",
    CultureInfo.InvariantCulture);

record Product(
    string Sku, string Name, decimal Price, bool OnSale, string? Url);

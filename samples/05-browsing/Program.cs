using System.Net;
using System.Text;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using AngleSharp.Io;
using AngleSharp.Io.Network;

// Runs against AngleSharp.Infrastructure.TestSite (npm run dev → http://localhost:8080).
var site = args.FirstOrDefault() ?? "http://localhost:8080";

// ── 1. Requesters ───────────────────────────────────────────────
var basic = Configuration.Default.WithDefaultLoader();
Console.WriteLine(await Text(basic, $"{site}/test-cases/user-agent"));

var io = Configuration.Default.WithRequesters().WithDefaultLoader();
Console.WriteLine(await Text(io, $"{site}/test-cases/user-agent"));

var http = new HttpClient();
http.DefaultRequestHeaders.UserAgent
    .ParseAdd("GardenBot/1.0 (+https://example.com/bot)");
var polite = Configuration.Default
    .With(new HttpClientRequester(http))
    .WithDefaultLoader();
Console.WriteLine(await Text(polite, $"{site}/test-cases/user-agent"));

// ── 2. Cookies ──────────────────────────────────────────────────
var login = $"{site}/test-cases/set-cookies?session=abc123";
Console.WriteLine($"No jar:    {await Text(io, login)}");

var config = Configuration.Default
    .WithRequesters()
    .WithDefaultLoader()
    .WithTemporaryCookies();
var context = BrowsingContext.New(config);
var afterLogin = await context.OpenAsync(login);
Console.WriteLine($"Landed on: {afterLogin.Url}");
Console.WriteLine($"Cookies:   {Flat(afterLogin)}");

Directory.CreateDirectory("output");
var jar = Path.Combine("output", "session.cookies");
var saved = io.WithPersistentCookies(jar);
await BrowsingContext.New(saved).OpenAsync(login);
var check = $"{site}/test-cases/get-cookies";
var nextRun = io.WithPersistentCookies(jar);
// Like a browser, only cookies with Expires/Max-Age go to the file.
Console.WriteLine($"Next run:  {await Text(nextRun, check)}");

// ── 3. Forms ────────────────────────────────────────────────────
var ok = await SubmitAsync(context, site, name: "Test", number: "1");
Console.WriteLine($"Submit: {(int)ok.StatusCode} {Flat(ok)}");
var wrong = await SubmitAsync(context, site, name: "Nope", number: "1");
Console.WriteLine($"Wrong:  {(int)wrong.StatusCode} {Flat(wrong)}");

// ── 4. Redirects and status codes ───────────────────────────────
var target = $"{site}/test-cases/redirect?url=/test-cases/status/404";
var moved = await context.OpenAsync(target);
Console.WriteLine($"Landed on: {moved.Url}");
Console.WriteLine($"Status:    {(int)moved.StatusCode} {moved.StatusCode}");

// ── 5. Offline tests ────────────────────────────────────────────
var canned = new CannedRequester
{
    ["GET /PostUrlencodeNormal"] = """
        <form method="post" action="/PostUrlencodeNormal">
          <input name="Name"><input name="Number" type="number">
          <input name="IsActive" type="checkbox" value="true">
        </form>
        """,
    ["POST /PostUrlencodeNormal"] = "okay",
};
var offline = BrowsingContext.New(Configuration.Default
    .With(canned)
    .WithDefaultLoader());
var result = await SubmitAsync(offline, "https://test.example", "Test", "1");
Console.WriteLine($"Offline: {(int)result.StatusCode} {Flat(result)}");
Console.WriteLine($"Posted:  {canned.LastBody}");

// ── 6. Being a good citizen ─────────────────────────────────────
var robots = await context.OpenAsync($"{site}/test-cases/robots");
Console.WriteLine($"robots.txt: {Flat(robots)}");

// ── Helpers ─────────────────────────────────────────────────────
static string Flat(IDocument document) =>
    document.Body?.TextContent.Trim().ReplaceLineEndings(" ") ?? "";

static async Task<string> Text(IConfiguration config, string url) =>
    Flat(await BrowsingContext.New(config).OpenAsync(url));

static async Task<IDocument> SubmitAsync(
    IBrowsingContext context, string site, string name, string number)
{
    var page = await context.OpenAsync($"{site}/PostUrlencodeNormal");
    var form = page.QuerySelector<IHtmlFormElement>("form")!;
    var fields = form.Elements;
    (fields["Name"] as IHtmlInputElement)!.Value = name;
    (fields["Number"] as IHtmlInputElement)!.Value = number;
    (fields["IsActive"] as IHtmlInputElement)!.IsChecked = true;
    return await form.SubmitAsync();
}

/// <summary>Answers "METHOD /path" from a dictionary: no network needed.</summary>
sealed class CannedRequester : BaseRequester
{
    private readonly Dictionary<string, string> _responses = [];

    public string this[string request]
    {
        set => _responses[request] = value;
    }

    public string? LastBody { get; private set; }

    public override bool SupportsProtocol(string protocol) =>
        protocol is "http" or "https";

    protected override async Task<IResponse?> PerformRequestAsync(
        Request request, CancellationToken cancel)
    {
        if (request.Content is { } content)
        {
            LastBody = await new StreamReader(content).ReadToEndAsync(cancel);
        }

        var method = request.Method.ToString().ToUpperInvariant();
        var key = $"{method} {request.Address.PathName}";
        var found = _responses.TryGetValue(key, out var body);
        return new DefaultResponse
        {
            Address = request.Address,
            StatusCode = found ? HttpStatusCode.OK : HttpStatusCode.NotFound,
            Headers = new Dictionary<string, string>
            {
                ["Content-Type"] = "text/html; charset=utf-8",
            },
            Content = new MemoryStream(Encoding.UTF8.GetBytes(body ?? "")),
        };
    }
}

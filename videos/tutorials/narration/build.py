#!/usr/bin/env python3
"""Builds part-N.md narration files from the scene data below.

Scene starts and cue times are taken from the scene durations and highlight
frames in src/tN/index.tsx (scene start = sum of earlier scenes − index × 15
frames). Re-run after changing timings:  python3 narration/build.py
"""
import re
from pathlib import Path

HERE = Path(__file__).parent

HEADER = """Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-{n}` in `videos/` (with music), or `npm run render:{n}:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/{sample}` and were captured from real runs (`npm run sync:tutorials`).
"""

# (title, sample, length, scenes); scene = (name, start, seconds, on-screen, text)
PARTS = {
    1: ("Finding things: selectors, types, traversal", "01-querying", "5:00", [
        ("Opening", "0:00", 8, "Title card", "Welcome to the AngleSharp tutorials. Part one: finding things in a document."),
        ("The goal", "0:07.5", 20, "The product page next to the JSON it becomes",
         "Here's what we'll build. On the left, a product listing page. On the right, the JSON our code extracts from it: SKU, name, price, a sale flag and an absolute link. Everything on screen comes from the sample project, so you can run it yourself."),
        ("Parse or load", "0:27", 50, "Program.cs section 1, notes on HtmlParser and BrowsingContext",
         "There are two ways to get a document.\n**0:31** — The HtmlParser is the direct way. It's synchronous, needs no configuration, and turns a string or a stream into a document. Perfect for files and tests.\n**0:48.5** — The other way is a browsing context. Think of it as a browser tab. It's async, and it's where loaders, cookies and scripts plug in later. Here we give it the content and an address. That address matters: relative URLs on the page are resolved against it."),
        ("Selectors", "1:16.5", 70, "Selectors code, output appears at 1:36 and 1:55",
         "Once you have a document, you query it with CSS selectors, using the same engine rules as your browser.\n**1:20** — QuerySelectorAll returns every match: all products, only the ones with a data-sale attribute, or exactly the second one with nth-child.\n**1:35** — Four products, two on sale, and the second one is the pruning shears.\n**1:48.5** — Two more helpers. Closest walks up from an element to the nearest ancestor that matches: here, from the sale badge to its product. Matches tests a single element against a selector. Both are standard DOM methods, so what you know from JavaScript applies one to one."),
        ("Typed elements", "2:26", 50, "QuerySelector<T>, note on attribute vs. property",
         "QuerySelector also has a generic version.\n**2:29** — Ask for an IHtmlAnchorElement and you get the anchor's properties directly. Now compare the two lines of output. GetAttribute returns exactly what's in the markup: a relative path. The Href property is resolved against the document address, just like in the browser.\n**2:51.5** — Images work the same way: Source is the absolute URL. This one surprises a lot of people, so remember: attributes are raw, properties are resolved."),
        ("Traversal and text", "3:15.5", 50, "Traversal code, notes on null and TextContent",
         "From any element you can move around the tree.\n**3:18.5** — ParentElement, Children and NextElementSibling work exactly as in the DOM. And because QuerySelector returns null when nothing matches, use the null-conditional operator or check the result.\n**3:37** — Careful with TextContent: it includes everything, even the text of a script inside the element.\n**3:49** — So select the element you actually want, here the heading, and trim the whitespace."),
        ("Into objects", "4:05", 40, "LINQ into records, JSON output",
         "Now we put it all together.\n**4:09** — A LINQ projection turns each product element into a record: the SKU from the data attribute, the name from the heading, the price from its content attribute, the sale flag, and the resolved link.\n**4:25.5** — From here it's plain .NET. System.Text.Json writes the file, and there's our data."),
        ("Outro", "4:44.5", 15.5, "Recap, sample path, next part",
         "To recap: QuerySelectorAll, the typed QuerySelector, Closest, and attributes versus properties. The sample is in samples, zero-one querying. Next time: changing and generating HTML."),
    ]),
    2: ("Changing and generating HTML", "02-generating", "4:30", [
        ("Opening", "0:00", 8, "Title card", "Part two: changing and generating HTML."),
        ("The goal", "0:07.5", 20, "Input newsletter next to the cleaned output",
         "We'll clean up a newsletter. On the left, the input: an inline click handler, a font tag, a script and an iframe. On the right, the result: those are gone, the links carry a tracking parameter, and there's a footer and an events table."),
        ("Create and insert", "0:27", 45, "Section 1, three notes",
         "Let's start by adding things.\n**0:30.5** — CreateElement makes a new paragraph. ClassList and TextContent work like in the browser.\n**0:43** — There's also a typed CreateElement. Ask for an IHtmlAnchorElement and Href is right there. Append puts the link into the paragraph, and the paragraph into the body.\n**0:57** — Dataset maps to data attributes, and After inserts a node right behind an element: here, a horizontal rule after the heading."),
        ("Remove and replace", "1:11.5", 55, "Removing elements and event handlers, three notes",
         "Now the cleanup.\n**1:15** — Build one selector from a list of tags, select every match, and call Remove. The element and everything inside it is gone.\n**1:29** — Event handler attributes like onclick need a bit more care. The attribute collection is live, so collect the names first, then remove them.\n**1:50** — One warning: this is fine for a demo, but for untrusted input use a real sanitizer. HtmlSanitizer, for example, is built on AngleSharp."),
        ("Unwrap and rewrite links", "2:06", 40, "Unwrapping <font>, the link loop, rewritten links from the output",
         "Two more rewrites.\n**2:09.5** — To unwrap the font tag, Replace swaps the element for its own children. That's the DOM's replaceWith.\n**2:19.5** — Then the links: every anchor with an href, typed as IHtmlAnchorElement. Href is already absolute, so even the relative archive link becomes a full URL, and we append a tracking parameter.\n**2:31.5** — HostName tells us whether a link leaves our site. External links get target blank and rel noopener."),
        ("Fragments", "2:45.5", 40, "ParseFragment with two contexts",
         "Sometimes you only need to parse a piece of HTML.\n**2:49** — Here's a table row, as a string.\n**2:59** — ParseFragment takes a context element, and the context changes the result. In the body a table row isn't allowed, so only the text survives. In a tbody it's a real row.\n**3:15.5** — Then we append the parsed row to our table."),
        ("Serializing", "3:25", 50, "ToHtml and formatters, sizes in the output",
         "Finally, back to text.\n**3:28.5** — ToHtml serializes the whole document, and you'll notice html, head and body, even though our input had none. The parser adds them, exactly like a browser.\n**3:41** — If you only want the content, take Body.InnerHtml. Formatters change the style: pretty-printed, minified, or XHTML.\n**4:00** — We save all four, and here are their sizes."),
        ("Outro", "4:14.5", 15.5, "Recap, sample path, next part",
         "CreateElement and Append, Remove and Replace, ParseFragment with a context, and ToHtml with a formatter. Next time: styles, with AngleSharp.Css."),
    ]),
    3: ("Working with styles: AngleSharp.Css", "03-styles", "5:30", [
        ("Opening", "0:00", 8, "Title card", "Part three: working with styles, using AngleSharp.Css."),
        ("The goal", "0:07.5", 25, "The input email and the inliner's output, side by side",
         "We'll build a CSS inliner for HTML emails. Many email clients drop style blocks completely, and the left side shows what readers would get. The inliner computes every element's style and writes it into a style attribute, so the email looks right everywhere."),
        ("Setup", "0:32", 30, "Configuration with WithCss and a render device",
         "Install AngleSharp.Css and call WithCss on the configuration.\n**0:35.5** — The core already understands selectors. WithCss adds the CSS parser, the object model for style sheets, and computed styles.\n**0:47** — We also set a render device with an 800 pixel viewport, a typical email width. You'll see in a minute why that matters."),
        ("Style sheets as objects", "1:01.5", 45, "CssParser, rule list in the output",
         "Style sheets are objects.\n**1:05** — CssParser turns CSS text into a style sheet.\n**1:15** — Its rules are typed. Each style rule has its selector text and a declaration block, so we can list them.\n**1:28** — GetStyleRuleWith finds a rule by its selector. We add a border radius, and ToCss writes the rule back out. Notice that the colors come back normalized to rgba."),
        ("Inline styles", "1:46", 25, "GetStyle and the style attribute",
         "Inline styles work the same way.\n**1:49.5** — GetStyle is the element's style property. Set a property, and the style attribute is updated for you."),
        ("Computed styles", "2:10.5", 45, "ComputeCurrentStyle, four values in the output",
         "Now the interesting part: what actually applies to an element.\n**2:14** — ComputeCurrentStyle runs the cascade for one element: selectors, specificity, inheritance and defaults.\n**2:27** — The note gets its gray color and its size from its class, its font family is inherited from the body, and display block is the default for a paragraph. Typed helpers like GetColor and GetFontSize save you from spelling property names."),
        ("Media queries", "2:55", 45, "Three devices, warning about the 0 × 0 default",
         "Media queries depend on the device.\n**2:58.5** — We load the same email three times, with viewports of zero, 375 and 800 pixels.\n**3:15** — At 800 the column is half the width and the heading is 28 pixels. At 375 the mobile rules apply. And look at the first line: without a render device the viewport is zero by zero, so every max-width query matches. That's why we set one at the start."),
        ("Which properties", "3:39.5", 25, "Property lists and initial values",
         "Now the inliner itself.\n**3:42** — Writing every computed property would bloat the email. So inherited properties are only written where they differ from the parent,\n**3:53** — and everything else only where it differs from its initial value."),
        ("The loop", "4:04", 40, "The inliner loop",
         "The loop visits the body and every element inside it.\n**4:07.5** — For each one we compute its style and its parent's style, and grab its inline style.\n**4:19** — Inherited properties are copied when they differ from the parent,\n**4:30.5** — the others when they differ from the initial value. Read with ComputeCurrentStyle, write with SetProperty."),
        ("The result", "4:43.5", 35, "Inline styles per element in the output",
         "Last, we remove the style element and save the result.\n**4:47** — Here's what ended up inline: a handful of declarations per element, and nothing redundant. That's the email you saw at the beginning."),
        ("Outro", "5:18", 12, "Recap, sample path, next part",
         "WithCss, the CSS parser, GetStyle, ComputeCurrentStyle, and a render device. Next: XML, with AngleSharp.Xml."),
    ]),
    4: ("XML, SVG and XHTML: AngleSharp.Xml", "04-xml", "4:00", [
        ("Opening", "0:00", 8, "Title card", "Part four: XML, SVG and XHTML, with AngleSharp.Xml."),
        ("The goal", "0:07.5", 18, "The feed next to the program output",
         "We'll read an Atom feed into a list of entries, and validate an XML config file, with errors that point to the exact line."),
        ("Why a second parser", "0:25", 50, "HTML vs. XML parsing, warning about content types",
         "Why do we need a second parser?\n**0:28.5** — Here's the same snippet, parsed as HTML and as XML. HTML lowercases every name and ignores the self-closing slash, so the Theme element swallows the Language element. The XML parser keeps the case and the structure.\n**0:48.5** — With WithXml, a browsing context picks the XML parser for XML content, but only for text/xml, application/xml and SVG. A feed sent as application/atom+xml lands in the HTML parser. Check the content type, or use the XmlParser directly."),
        ("Reading a feed", "1:14.5", 35, "Namespaces, three entries in the output",
         "Reading the feed uses the DOM API you already know.\n**1:18** — Atom lives in its own namespace, which we read from the root element.\n**1:29.5** — GetElementsByTagNameNS matches elements in that namespace. For each entry we read the title and parse the updated timestamp. Three posts, newest first."),
        ("Errors", "1:49", 33, "XmlParseException, then IsSuppressingErrors",
         "XML is strict.\n**1:52.5** — Our broken file never closes an element, so ParseDocument throws an XmlParseException, with the line and column.\n**2:05.5** — If you'd rather keep going, IsSuppressingErrors gives you whatever could be built."),
        ("Line numbers", "2:21.5", 24, "IsKeepingSourceReferences",
         "For your own error messages you need positions.\n**2:24** — IsKeepingSourceReferences stores where each element came from,\n**2:33** — so every element can tell you its line."),
        ("Validation", "2:45", 33, "ValidateXsd, two diagnostics",
         "Well-formed isn't the same as valid.\n**2:48.5** — ValidateXsd checks the document against a schema. Our config has two problems, and each diagnostic gives the line: an invalid refresh value on line three, and a missing url on line four."),
        ("SVG and XHTML", "3:17.5", 29, "SVG facts, then HTML vs. XHTML output",
         "Two quick extras.\n**3:21** — SVG is XML, so the same parser gives you its namespace, its viewBox and its shapes.\n**3:32.5** — And when you need XHTML output, the XhtmlMarkupFormatter closes the void elements."),
        ("Outro", "3:46", 14, "Recap, sample path, next part",
         "XmlParser, WithXml and its content types, namespaces, XmlParseException, and ValidateXsd. Next: real-world browsing with AngleSharp.Io."),
    ]),
    5: ("Real-world browsing: AngleSharp.Io", "05-browsing", "5:30", [
        ("Opening", "0:00", 8, "Title card", "Part five: real-world browsing, with AngleSharp.Io."),
        ("The goal", "0:07.5", 17, "The network log of the whole session",
         "We'll run a whole session against the AngleSharp test site, the same server the integration tests use: headers, cookies, a form and redirects. Then we run it again, without any network."),
        ("Requesters", "0:24", 55, "Three user agents in the output, warning at 0:47.5",
         "Every request goes through a requester.\n**0:27.5** — The default loader identifies itself as AngleSharp, with its version.\n**0:39** — WithRequesters from AngleSharp.Io switches to an HttpClient-based requester, with handlers for proxies, certificates and decompression. But notice the empty user agent. Many sites reject that.\n**0:52.5** — So bring your own HttpClient, give your bot a name and a contact URL, and register the requester with With."),
        ("Cookies", "1:18.5", 60, "No jar, temporary jar, persistent jar",
         "Next, cookies.\n**1:22** — This endpoint sets a session cookie and redirects. Without a cookie jar, the cookie is lost on the way.\n**1:33.5** — With WithTemporaryCookies the context keeps an in-memory jar. The redirect already sends the session back, and the echo shows it.\n**1:53.5** — WithPersistentCookies writes the jar to a file, so the next run can continue. But like a browser, it only saves cookies with an expiry date. Our session cookie has none, so the next run starts empty. That's correct behavior, not a bug."),
        ("Forms", "2:18", 55, "Submitting the test form twice, SubmitAsync helper",
         "Forms are where browsing gets real.\n**2:21.5** — We submit the test site's form twice: once with valid values, once with a wrong name.\n**2:34.5** — The helper opens the page, finds the form and sets the inputs by name: Value for the text fields, IsChecked for the checkbox.\n**2:58** — SubmitAsync posts it and returns the response page. A rejected submission is still a document, so check StatusCode: 200 for okay, 400 for error."),
        ("Redirects and status codes", "3:12.5", 35, "Redirect to a 404",
         "What about redirects?\n**3:16** — They're followed automatically. The document's Url is where we ended up, and StatusCode belongs to the last response. Here, a 404."),
        ("Offline tests", "3:47", 60, "CannedRequester, the same flow without network",
         "Scrapers need tests, and tests shouldn't need a server.\n**3:50.5** — So we write our own requester. CannedRequester derives from BaseRequester and answers from a dictionary: the form page for GET, okay for POST. It's about thirty lines in the sample.\n**4:10.5** — Register it with With, add the default loader, and every request goes through it.\n**4:23.5** — Then run the exact same SubmitAsync. Status 200, okay, and we can even check the posted body."),
        ("Being a good citizen", "4:46.5", 30, "robots.txt, three notes",
         "One last thing: be a good citizen.\n**4:50** — robots.txt is just another document, so load it and honor Disallow. Slow down, cache what you can, identify yourself, and prefer an official API when there is one."),
        ("Outro", "5:16", 14, "Recap, sample path, next part",
         "WithRequesters, the cookie jars, SubmitAsync, StatusCode, and BaseRequester. Next: from HTML to pixels, with AngleSharp.Renderer."),
    ]),
    6: ("From HTML to pixels: AngleSharp.Renderer", "06-rendering", "6:00", [
        ("Opening", "0:00", 8, "Title card", "Part six, the last one: from HTML to pixels, with AngleSharp.Renderer."),
        ("The goal", "0:07.5", 25, "Three rendered social cards fan out",
         "We'll build a social card generator: an HTML and CSS template in, PNG images out. These three cards were rendered by the sample, with no browser and no headless Chrome involved."),
        ("What the renderer is", "0:32", 40, "Pipeline, then strengths and limits",
         "AngleSharp.Renderer takes the document and the styles from AngleSharp.Css, lays everything out, and paints it with SkiaSharp.\n**0:46.5** — It's good at pages you control: templates with flexbox, grid, gradients and web fonts, plus SVG and the canvas.\n**0:50.5** — It's still in preview. It's not meant for screenshots of arbitrary websites, the API can change before 1.0, and when you need exactly what Chrome shows, use Playwright."),
        ("First render", "1:11.5", 55, "Device, configuration, RenderToPng, the template image",
         "Install the renderer. It's a prerelease for now.\n**1:15** — First, the render device. Its viewport is the size of the image: here 1200 by 630. The default is zero by zero, so always set it.\n**1:28** — The configuration adds CSS, the device, and rendering.\n**1:43** — Then open the template and call RenderToPng. You get a RenderedImage with the bytes, the width and the height. There's our first card."),
        ("The template", "2:06", 55, "Filling the template through the DOM, cards appear",
         "Now, one card per blog post.\n**2:09.5** — Three posts, as tuples.\n**2:21** — For each one we open the template and fill it through the DOM: title, date and tag. Setting TextContent escapes the text for you, so a title with an angle bracket can't break the markup.\n**2:39.5** — Render, save, and here are the cards."),
        ("Controlling the output", "3:00.5", 50, "RenderOptions, banner and badge images",
         "RenderToImage takes options.\n**3:04** — A device scale factor of two gives a retina image, twice the size.\n**3:15.5** — Clip renders just a region: here the top 200 pixels.\n**3:27** — And you can render a single element, like the badge."),
        ("SVG to PNG", "3:50", 40, "A small device and an SVG chart",
         "SVG works too.\n**3:53.5** — A smaller device for a 480 by 240 chart,\n**4:06.5** — and the SVG inside the page renders like any other content. Great for charts and badges on a server."),
        ("Canvas 2D", "4:29.5", 45, "Canvas drawing, pixel readback, the PNG",
         "And there's the 2D canvas.\n**4:33** — Load a page with a canvas element and get its 2D context.\n**4:44.5** — Fill styles and rectangles work like in JavaScript.\n**4:59.5** — GetImageData reads pixels back, which is handy in tests, and ToImage exports a PNG."),
        ("Where it's going", "5:14", 30, "Three guidelines, roadmap at 5:24",
         "To sum up: render what you control. Pin the exact version you tested with, and if you need any website exactly the way Chrome renders it, Playwright is the right tool.\n**5:24** — AngleSharp.Renderer 1.0 is planned for this year."),
        ("Outro", "5:43.5", 16.5, "Recap, end of the series",
         "WithRenderDevice, WithRendering, RenderToPng and RenderToImage, and GetContext for the canvas. That's the series. Thanks for watching!"),
    ]),
}


def words(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9][\w.'#-]*", re.sub(r"\*\*[\d:.]+\*\* —", "", text)))


def build(n: int) -> list[str]:
    title, sample, length, scenes = PARTS[n]
    warnings = []
    lines = [f"# Tutorial {n}: {title} — narration", "", HEADER.format(n=n, sample=sample), ""]
    lines += ["| # | Scene | Starts | Length | Words |", "| - | ----- | ------ | ------ | ----- |"]
    for i, (name, start, secs, _, text) in enumerate(scenes):
        lines.append(f"| {i} | {name} | {start} | {secs:g} s | {words(text)} |")
    total = sum(words(s[4]) for s in scenes)
    lines += ["", f"Total: {total} words over {length}.", "", "---", ""]
    for i, (name, start, secs, screen, text) in enumerate(scenes):
        wpm = words(text) / secs * 60
        if wpm > 140:
            warnings.append(f"part {n} · {name}: {wpm:.0f} wpm")
        lines += [f"## {i} · {name} ({start})", "", f"**{start}** · *{screen}.* ({secs:g} s)", ""]
        lines += [f"> {p}" for p in text.split("\n")]
        lines.append("")
    (HERE / f"part-{n}.md").write_text("\n".join(lines))
    return warnings


if __name__ == "__main__":
    problems = [w for n in PARTS for w in build(n)]
    print("\n".join(problems) or "All scenes at or below 140 wpm.")

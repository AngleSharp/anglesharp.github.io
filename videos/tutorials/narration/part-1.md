# Tutorial 1: Finding things: selectors, types, traversal — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-1` in `videos/` (with music), or `npm run render:1:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/01-querying` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 12 |
| 1 | The goal | 0:07.5 | 20 s | 45 |
| 2 | Parse or load | 0:27 | 50 s | 81 |
| 3 | Selectors | 1:16.5 | 70 s | 98 |
| 4 | Typed elements | 2:26 | 50 s | 73 |
| 5 | Traversal and text | 3:15.5 | 50 s | 64 |
| 6 | Into objects | 4:05 | 40 s | 53 |
| 7 | Outro | 4:44.5 | 15.5 s | 24 |

Total: 450 words over 5:00.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Welcome to the AngleSharp tutorials. Part one: finding things in a document.

## 1 · The goal (0:07.5)

**0:07.5** · *The product page next to the JSON it becomes.* (20 s)

> Here's what we'll build. On the left, a product listing page. On the right, the JSON our code extracts from it: SKU, name, price, a sale flag and an absolute link. Everything on screen comes from the sample project, so you can run it yourself.

## 2 · Parse or load (0:27)

**0:27** · *Program.cs section 1, notes on HtmlParser and BrowsingContext.* (50 s)

> There are two ways to get a document.
> **0:31** — The HtmlParser is the direct way. It's synchronous, needs no configuration, and turns a string or a stream into a document. Perfect for files and tests.
> **0:48.5** — The other way is a browsing context. Think of it as a browser tab. It's async, and it's where loaders, cookies and scripts plug in later. Here we give it the content and an address. That address matters: relative URLs on the page are resolved against it.

## 3 · Selectors (1:16.5)

**1:16.5** · *Selectors code, output appears at 1:36 and 1:55.* (70 s)

> Once you have a document, you query it with CSS selectors, using the same engine rules as your browser.
> **1:20** — QuerySelectorAll returns every match: all products, only the ones with a data-sale attribute, or exactly the second one with nth-child.
> **1:35** — Four products, two on sale, and the second one is the pruning shears.
> **1:48.5** — Two more helpers. Closest walks up from an element to the nearest ancestor that matches: here, from the sale badge to its product. Matches tests a single element against a selector. Both are standard DOM methods, so what you know from JavaScript applies one to one.

## 4 · Typed elements (2:26)

**2:26** · *QuerySelector<T>, note on attribute vs. property.* (50 s)

> QuerySelector also has a generic version.
> **2:29** — Ask for an IHtmlAnchorElement and you get the anchor's properties directly. Now compare the two lines of output. GetAttribute returns exactly what's in the markup: a relative path. The Href property is resolved against the document address, just like in the browser.
> **2:51.5** — Images work the same way: Source is the absolute URL. This one surprises a lot of people, so remember: attributes are raw, properties are resolved.

## 5 · Traversal and text (3:15.5)

**3:15.5** · *Traversal code, notes on null and TextContent.* (50 s)

> From any element you can move around the tree.
> **3:18.5** — ParentElement, Children and NextElementSibling work exactly as in the DOM. And because QuerySelector returns null when nothing matches, use the null-conditional operator or check the result.
> **3:37** — Careful with TextContent: it includes everything, even the text of a script inside the element.
> **3:49** — So select the element you actually want, here the heading, and trim the whitespace.

## 6 · Into objects (4:05)

**4:05** · *LINQ into records, JSON output.* (40 s)

> Now we put it all together.
> **4:09** — A LINQ projection turns each product element into a record: the SKU from the data attribute, the name from the heading, the price from its content attribute, the sale flag, and the resolved link.
> **4:25.5** — From here it's plain .NET. System.Text.Json writes the file, and there's our data.

## 7 · Outro (4:44.5)

**4:44.5** · *Recap, sample path, next part.* (15.5 s)

> To recap: QuerySelectorAll, the typed QuerySelector, Closest, and attributes versus properties. The sample is in samples, zero-one querying. Next time: changing and generating HTML.

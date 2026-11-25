# Tutorial 2: Changing and generating HTML — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-2` in `videos/` (with music), or `npm run render:2:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/02-generating` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 6 |
| 1 | The goal | 0:07.5 | 20 s | 44 |
| 2 | Create and insert | 0:27 | 45 s | 66 |
| 3 | Remove and replace | 1:11.5 | 55 s | 71 |
| 4 | Unwrap and rewrite links | 2:06 | 40 s | 68 |
| 5 | Fragments | 2:45.5 | 40 s | 57 |
| 6 | Serializing | 3:25 | 50 s | 55 |
| 7 | Outro | 4:14.5 | 15.5 s | 20 |

Total: 387 words over 4:30.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Part two: changing and generating HTML.

## 1 · The goal (0:07.5)

**0:07.5** · *Input newsletter next to the cleaned output.* (20 s)

> We'll clean up a newsletter. On the left, the input: an inline click handler, a font tag, a script and an iframe. On the right, the result: those are gone, the links carry a tracking parameter, and there's a footer and an events table.

## 2 · Create and insert (0:27)

**0:27** · *Section 1, three notes.* (45 s)

> Let's start by adding things.
> **0:30.5** — CreateElement makes a new paragraph. ClassList and TextContent work like in the browser.
> **0:43** — There's also a typed CreateElement. Ask for an IHtmlAnchorElement and Href is right there. Append puts the link into the paragraph, and the paragraph into the body.
> **0:57** — Dataset maps to data attributes, and After inserts a node right behind an element: here, a horizontal rule after the heading.

## 3 · Remove and replace (1:11.5)

**1:11.5** · *Removing elements and event handlers, three notes.* (55 s)

> Now the cleanup.
> **1:15** — Build one selector from a list of tags, select every match, and call Remove. The element and everything inside it is gone.
> **1:29** — Event handler attributes like onclick need a bit more care. The attribute collection is live, so collect the names first, then remove them.
> **1:50** — One warning: this is fine for a demo, but for untrusted input use a real sanitizer. HtmlSanitizer, for example, is built on AngleSharp.

## 4 · Unwrap and rewrite links (2:06)

**2:06** · *Unwrapping <font>, the link loop, rewritten links from the output.* (40 s)

> Two more rewrites.
> **2:09.5** — To unwrap the font tag, Replace swaps the element for its own children. That's the DOM's replaceWith.
> **2:19.5** — Then the links: every anchor with an href, typed as IHtmlAnchorElement. Href is already absolute, so even the relative archive link becomes a full URL, and we append a tracking parameter.
> **2:31.5** — HostName tells us whether a link leaves our site. External links get target blank and rel noopener.

## 5 · Fragments (2:45.5)

**2:45.5** · *ParseFragment with two contexts.* (40 s)

> Sometimes you only need to parse a piece of HTML.
> **2:49** — Here's a table row, as a string.
> **2:59** — ParseFragment takes a context element, and the context changes the result. In the body a table row isn't allowed, so only the text survives. In a tbody it's a real row.
> **3:15.5** — Then we append the parsed row to our table.

## 6 · Serializing (3:25)

**3:25** · *ToHtml and formatters, sizes in the output.* (50 s)

> Finally, back to text.
> **3:28.5** — ToHtml serializes the whole document, and you'll notice html, head and body, even though our input had none. The parser adds them, exactly like a browser.
> **3:41** — If you only want the content, take Body.InnerHtml. Formatters change the style: pretty-printed, minified, or XHTML.
> **4:00** — We save all four, and here are their sizes.

## 7 · Outro (4:14.5)

**4:14.5** · *Recap, sample path, next part.* (15.5 s)

> CreateElement and Append, Remove and Replace, ParseFragment with a context, and ToHtml with a formatter. Next time: styles, with AngleSharp.Css.

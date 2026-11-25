# Tutorial 4: XML, SVG and XHTML: AngleSharp.Xml — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-4` in `videos/` (with music), or `npm run render:4:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/04-xml` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 8 |
| 1 | The goal | 0:07.5 | 18 s | 24 |
| 2 | Why a second parser | 0:25 | 50 s | 85 |
| 3 | Reading a feed | 1:14.5 | 35 s | 45 |
| 4 | Errors | 1:49 | 33 s | 32 |
| 5 | Line numbers | 2:21.5 | 24 s | 23 |
| 6 | Validation | 2:45 | 33 s | 38 |
| 7 | SVG and XHTML | 3:17.5 | 29 s | 31 |
| 8 | Outro | 3:46 | 14 s | 15 |

Total: 301 words over 4:00.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Part four: XML, SVG and XHTML, with AngleSharp.Xml.

## 1 · The goal (0:07.5)

**0:07.5** · *The feed next to the program output.* (18 s)

> We'll read an Atom feed into a list of entries, and validate an XML config file, with errors that point to the exact line.

## 2 · Why a second parser (0:25)

**0:25** · *HTML vs. XML parsing, warning about content types.* (50 s)

> Why do we need a second parser?
> **0:28.5** — Here's the same snippet, parsed as HTML and as XML. HTML lowercases every name and ignores the self-closing slash, so the Theme element swallows the Language element. The XML parser keeps the case and the structure.
> **0:48.5** — With WithXml, a browsing context picks the XML parser for XML content, but only for text/xml, application/xml and SVG. A feed sent as application/atom+xml lands in the HTML parser. Check the content type, or use the XmlParser directly.

## 3 · Reading a feed (1:14.5)

**1:14.5** · *Namespaces, three entries in the output.* (35 s)

> Reading the feed uses the DOM API you already know.
> **1:18** — Atom lives in its own namespace, which we read from the root element.
> **1:29.5** — GetElementsByTagNameNS matches elements in that namespace. For each entry we read the title and parse the updated timestamp. Three posts, newest first.

## 4 · Errors (1:49)

**1:49** · *XmlParseException, then IsSuppressingErrors.* (33 s)

> XML is strict.
> **1:52.5** — Our broken file never closes an element, so ParseDocument throws an XmlParseException, with the line and column.
> **2:05.5** — If you'd rather keep going, IsSuppressingErrors gives you whatever could be built.

## 5 · Line numbers (2:21.5)

**2:21.5** · *IsKeepingSourceReferences.* (24 s)

> For your own error messages you need positions.
> **2:24** — IsKeepingSourceReferences stores where each element came from,
> **2:33** — so every element can tell you its line.

## 6 · Validation (2:45)

**2:45** · *ValidateXsd, two diagnostics.* (33 s)

> Well-formed isn't the same as valid.
> **2:48.5** — ValidateXsd checks the document against a schema. Our config has two problems, and each diagnostic gives the line: an invalid refresh value on line three, and a missing url on line four.

## 7 · SVG and XHTML (3:17.5)

**3:17.5** · *SVG facts, then HTML vs. XHTML output.* (29 s)

> Two quick extras.
> **3:21** — SVG is XML, so the same parser gives you its namespace, its viewBox and its shapes.
> **3:32.5** — And when you need XHTML output, the XhtmlMarkupFormatter closes the void elements.

## 8 · Outro (3:46)

**3:46** · *Recap, sample path, next part.* (14 s)

> XmlParser, WithXml and its content types, namespaces, XmlParseException, and ValidateXsd. Next: real-world browsing with AngleSharp.Io.

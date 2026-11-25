# Tutorial 3: Working with styles: AngleSharp.Css — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-3` in `videos/` (with music), or `npm run render:3:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/03-styles` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 7 |
| 1 | The goal | 0:07.5 | 25 s | 43 |
| 2 | Setup | 0:32 | 30 s | 50 |
| 3 | Style sheets as objects | 1:01.5 | 45 s | 60 |
| 4 | Inline styles | 1:46 | 25 s | 23 |
| 5 | Computed styles | 2:10.5 | 45 s | 63 |
| 6 | Media queries | 2:55 | 45 s | 70 |
| 7 | Which properties | 3:39.5 | 25 s | 35 |
| 8 | The loop | 4:04 | 40 s | 51 |
| 9 | The result | 4:43.5 | 35 s | 32 |
| 10 | Outro | 5:18 | 12 s | 14 |

Total: 448 words over 5:30.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Part three: working with styles, using AngleSharp.Css.

## 1 · The goal (0:07.5)

**0:07.5** · *The input email and the inliner's output, side by side.* (25 s)

> We'll build a CSS inliner for HTML emails. Many email clients drop style blocks completely, and the left side shows what readers would get. The inliner computes every element's style and writes it into a style attribute, so the email looks right everywhere.

## 2 · Setup (0:32)

**0:32** · *Configuration with WithCss and a render device.* (30 s)

> Install AngleSharp.Css and call WithCss on the configuration.
> **0:35.5** — The core already understands selectors. WithCss adds the CSS parser, the object model for style sheets, and computed styles.
> **0:47** — We also set a render device with an 800 pixel viewport, a typical email width. You'll see in a minute why that matters.

## 3 · Style sheets as objects (1:01.5)

**1:01.5** · *CssParser, rule list in the output.* (45 s)

> Style sheets are objects.
> **1:05** — CssParser turns CSS text into a style sheet.
> **1:15** — Its rules are typed. Each style rule has its selector text and a declaration block, so we can list them.
> **1:28** — GetStyleRuleWith finds a rule by its selector. We add a border radius, and ToCss writes the rule back out. Notice that the colors come back normalized to rgba.

## 4 · Inline styles (1:46)

**1:46** · *GetStyle and the style attribute.* (25 s)

> Inline styles work the same way.
> **1:49.5** — GetStyle is the element's style property. Set a property, and the style attribute is updated for you.

## 5 · Computed styles (2:10.5)

**2:10.5** · *ComputeCurrentStyle, four values in the output.* (45 s)

> Now the interesting part: what actually applies to an element.
> **2:14** — ComputeCurrentStyle runs the cascade for one element: selectors, specificity, inheritance and defaults.
> **2:27** — The note gets its gray color and its size from its class, its font family is inherited from the body, and display block is the default for a paragraph. Typed helpers like GetColor and GetFontSize save you from spelling property names.

## 6 · Media queries (2:55)

**2:55** · *Three devices, warning about the 0 × 0 default.* (45 s)

> Media queries depend on the device.
> **2:58.5** — We load the same email three times, with viewports of zero, 375 and 800 pixels.
> **3:15** — At 800 the column is half the width and the heading is 28 pixels. At 375 the mobile rules apply. And look at the first line: without a render device the viewport is zero by zero, so every max-width query matches. That's why we set one at the start.

## 7 · Which properties (3:39.5)

**3:39.5** · *Property lists and initial values.* (25 s)

> Now the inliner itself.
> **3:42** — Writing every computed property would bloat the email. So inherited properties are only written where they differ from the parent,
> **3:53** — and everything else only where it differs from its initial value.

## 8 · The loop (4:04)

**4:04** · *The inliner loop.* (40 s)

> The loop visits the body and every element inside it.
> **4:07.5** — For each one we compute its style and its parent's style, and grab its inline style.
> **4:19** — Inherited properties are copied when they differ from the parent,
> **4:30.5** — the others when they differ from the initial value. Read with ComputeCurrentStyle, write with SetProperty.

## 9 · The result (4:43.5)

**4:43.5** · *Inline styles per element in the output.* (35 s)

> Last, we remove the style element and save the result.
> **4:47** — Here's what ended up inline: a handful of declarations per element, and nothing redundant. That's the email you saw at the beginning.

## 10 · Outro (5:18)

**5:18** · *Recap, sample path, next part.* (12 s)

> WithCss, the CSS parser, GetStyle, ComputeCurrentStyle, and a render device. Next: XML, with AngleSharp.Xml.

# Tutorial 5: Real-world browsing: AngleSharp.Io — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-5` in `videos/` (with music), or `npm run render:5:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/05-browsing` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 6 |
| 1 | The goal | 0:07.5 | 17 s | 31 |
| 2 | Requesters | 0:24 | 55 s | 61 |
| 3 | Cookies | 1:18.5 | 60 s | 83 |
| 4 | Forms | 2:18 | 55 s | 69 |
| 5 | Redirects and status codes | 3:12.5 | 35 s | 24 |
| 6 | Offline tests | 3:47 | 60 s | 70 |
| 7 | Being a good citizen | 4:46.5 | 30 s | 35 |
| 8 | Outro | 5:16 | 14 s | 15 |

Total: 394 words over 5:30.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Part five: real-world browsing, with AngleSharp.Io.

## 1 · The goal (0:07.5)

**0:07.5** · *The network log of the whole session.* (17 s)

> We'll run a whole session against the AngleSharp test site, the same server the integration tests use: headers, cookies, a form and redirects. Then we run it again, without any network.

## 2 · Requesters (0:24)

**0:24** · *Three user agents in the output, warning at 0:47.5.* (55 s)

> Every request goes through a requester.
> **0:27.5** — The default loader identifies itself as AngleSharp, with its version.
> **0:39** — WithRequesters from AngleSharp.Io switches to an HttpClient-based requester, with handlers for proxies, certificates and decompression. But notice the empty user agent. Many sites reject that.
> **0:52.5** — So bring your own HttpClient, give your bot a name and a contact URL, and register the requester with With.

## 3 · Cookies (1:18.5)

**1:18.5** · *No jar, temporary jar, persistent jar.* (60 s)

> Next, cookies.
> **1:22** — This endpoint sets a session cookie and redirects. Without a cookie jar, the cookie is lost on the way.
> **1:33.5** — With WithTemporaryCookies the context keeps an in-memory jar. The redirect already sends the session back, and the echo shows it.
> **1:53.5** — WithPersistentCookies writes the jar to a file, so the next run can continue. But like a browser, it only saves cookies with an expiry date. Our session cookie has none, so the next run starts empty. That's correct behavior, not a bug.

## 4 · Forms (2:18)

**2:18** · *Submitting the test form twice, SubmitAsync helper.* (55 s)

> Forms are where browsing gets real.
> **2:21.5** — We submit the test site's form twice: once with valid values, once with a wrong name.
> **2:34.5** — The helper opens the page, finds the form and sets the inputs by name: Value for the text fields, IsChecked for the checkbox.
> **2:58** — SubmitAsync posts it and returns the response page. A rejected submission is still a document, so check StatusCode: 200 for okay, 400 for error.

## 5 · Redirects and status codes (3:12.5)

**3:12.5** · *Redirect to a 404.* (35 s)

> What about redirects?
> **3:16** — They're followed automatically. The document's Url is where we ended up, and StatusCode belongs to the last response. Here, a 404.

## 6 · Offline tests (3:47)

**3:47** · *CannedRequester, the same flow without network.* (60 s)

> Scrapers need tests, and tests shouldn't need a server.
> **3:50.5** — So we write our own requester. CannedRequester derives from BaseRequester and answers from a dictionary: the form page for GET, okay for POST. It's about thirty lines in the sample.
> **4:10.5** — Register it with With, add the default loader, and every request goes through it.
> **4:23.5** — Then run the exact same SubmitAsync. Status 200, okay, and we can even check the posted body.

## 7 · Being a good citizen (4:46.5)

**4:46.5** · *robots.txt, three notes.* (30 s)

> One last thing: be a good citizen.
> **4:50** — robots.txt is just another document, so load it and honor Disallow. Slow down, cache what you can, identify yourself, and prefer an official API when there is one.

## 8 · Outro (5:16)

**5:16** · *Recap, sample path, next part.* (14 s)

> WithRequesters, the cookie jars, SubmitAsync, StatusCode, and BaseRequester. Next: from HTML to pixels, with AngleSharp.Renderer.

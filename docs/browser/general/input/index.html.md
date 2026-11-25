# Input (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/input/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.3.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 4d468a5b7b6bbf724b3d145420d5704ed9e43ad2

The engine translates input into DOM interactions. It fires the same events as a browser, and performs the default actions of the page, such as following a link, focusing a text field, toggling a checkbox, or submitting a form.

All positions are in CSS pixels relative to the viewport.

## Pointer

| Member | Description |
| --- | --- |
| `MovePointer(x, y)` | Moves the pointer without waiting. Moves are coalesced, which is what a UI should use. |
| `MovePointerAsync(x, y)` | Moves the pointer and waits until the hover state has been updated. |
| `PointerDownAsync(x, y, modifiers)` | Presses the primary button. |
| `PointerDownAsync(x, y, clickCount, modifiers)` | Presses the primary button for the given time in a row, e.g., 2 for a double click. |
| `PointerUpAsync(x, y, modifiers)` | Releases the primary button. |
| `ClickAsync(x, y, modifiers)` | Presses and releases the primary button. |
| `HoveredLink`, `Cursor` | The link below the pointer and the `BrowserCursor` a host should display. |

Awaiting a click also awaits the navigation it caused:

```cs
await engine.ClickAsync(40, 390);
Console.WriteLine(engine.Url);
```

Holding Control while clicking a link requests a new window, as does a link with `target="_blank"`. See [Multiple Windows](https://anglesharp.github.io/docs/browser/general/configuration/index.html.md#multiple-windows).

```cs
await engine.ClickAsync(40, 390, InputModifiers.Control);
```

## Selecting Text

With `BrowserOptions.IsTextSelectionEnabled`, the text of a page can be selected as in a browser. It is off by default, as the layouts then also record where their text comes from.

- Pressing the button and moving the pointer with it held selects the text in between; with Shift, a press extends the selection.
- A second press in a row (`clickCount` 2) selects a word, a third one the paragraph.
- Control+A (or Cmd+A) selects all text of the page, unless a text field has the focus.
- Over text that can be selected, `Cursor` is `BrowserCursor.Text`, unless the page asks for another cursor.
- A page can cancel `mousedown` or `selectstart`, and `user-select: none` keeps text from being selected. Scripts see the selection through `getSelection()`.

`CopySelectionAsync` fires `copy` and returns the selected text for the clipboard, or an empty text if nothing is selected or the page canceled the event:

```cs
var engine = new BrowserEngine(new BrowserOptions { IsTextSelectionEnabled = true });
await engine.LoadHtmlAsync("<p>Hello world</p>");
await engine.PointerDownAsync(30, 20, 2);
await engine.PointerUpAsync(30, 20);
Console.WriteLine(await engine.CopySelectionAsync());
```

## Keyboard

Keys are named by their DOM key value, e.g., `"a"`, `"Enter"`, `"Backspace"`, `"Tab"`, or `"ArrowDown"`. Keys and text are separate on purpose, just like in most UI frameworks:

- `KeyDownAsync` and `KeyUpAsync` fire the keyboard events and perform the actions of keys, e.g., Tab moving the focus, or Enter submitting a form.
- `TextInputAsync` enters text into the focused text field at its cursor, replacing the selected text. It works for whole strings, too.

In a text field (`input` or `textarea`) the keys edit like in browsers. The cursor is the field's `selectionStart` and `selectionEnd`, so scripts see it and can place it:

- The left and right keys move the cursor, by words with Ctrl (or Alt). Home and End go to the start and end of the line, with Ctrl of the whole text. In a `textarea` the up and down keys go to the line above and below.
- Shift extends the selection, Ctrl+A (or Cmd+A) selects all of the text.
- Backspace and Delete remove the selected text, or the character (with Ctrl the word) before or after the cursor.
- Focusing a field by clicking it puts the cursor at the end of its text; tabbing into an `input` selects its text.

```cs
await engine.ClickAsync(100, 200);
await engine.TextInputAsync("angle brackets");
await engine.KeyDownAsync("Enter");
await engine.KeyUpAsync("Enter");
```

## Selects

A `select` showing several options (`multiple` or `size`) is a list box:

- A click selects a row. With `multiple`, Ctrl (or Cmd) toggles it and Shift selects the rows from the last one clicked.
- The up and down keys move the selection, with Shift (and `multiple`) extending it.
- The wheel scrolls it before the page.

Any other `select` is a dropdown. Pressing it, or Enter, Space or Alt+Down while it has the focus, opens its list:

- `IsSelectPopupOpen` tells if the list is open. Frames from `PrepareFrameAsync` show it on top of the page (the image of `PaintAsync` does not), so a host has nothing to do for it. It stays within the viewport, opening above the select without room below.
- While it is open, the list takes all keys: they move its highlight (skipping what is disabled), Enter, Space or Tab choose the highlighted row, and Escape closes it without a change. A click on a row chooses it.
- A press elsewhere or scrolling the page closes it. So do the select losing the focus or going away, and a change of the viewport.
- While it is closed, the up and down keys, Home, End, Page Up, Page Down and typing change the value right away.
- The list uses the color scheme of the select: dark if its `color-scheme` (or else the `color-scheme` meta element of the page) supports dark, and doesn't also support light unless `ColorScheme` is `dark`. `ColorScheme` alone doesn't make it dark, as in other browsers. Colors of the select and of its options win over those of the scheme.

Choosing a row fires `input` and `change` if the value changed, then `click`.

## Scrolling

`ScrollAsync` scrolls by a distance: what is below the pointer, if that is a scroll container, or else the page. The returned task completes once the scrolling arrived.

```cs
await engine.MovePointerAsync(400, 300);
await engine.ScrollAsync(0, 480);
Console.WriteLine(engine.ScrollPosition);
```

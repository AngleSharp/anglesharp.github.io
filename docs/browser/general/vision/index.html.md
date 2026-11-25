# Vision Sample (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/vision/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.3.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 4d468a5b7b6bbf724b3d145420d5704ed9e43ad2

Vision is the sample application living in `src/Vision`: a small desktop browser built on `AngleSharp.Browser.Avalonia`. It is a proof of concept, which shows how the packages fit together, and is not shipped as a package.

## Running

```sh
dotnet run --project src/Vision -- https://example.org
```

| Argument | Description |
| --- | --- |
| `<address>` | The address to open instead of the start page. |
| `--profile <directory>` | The directory to use for cookies, web storage and the HTTP cache. |
| `--in-memory` | Persists no browsing data. |

New windows open `vision:start` unless the settings say otherwise: the pages visited most, a few demos and Vision's own pages. All of Vision's pages are listed at `vision:pages`; `vision:requester` sends HTTP requests with the requesters of the window (with its user agent, default headers and cookies) and shows the responses. Requests can be saved there under a name (the button below the response asks for it), and are kept with the profile (`requests.json`); the menu button in the top-left corner opens a sheet with the saved ones.

The profile and the settings are kept in the `Vision` folder of the local application data directory by default.

## What to Look At

| File | Shows |
| --- | --- |
| `App.axaml.cs` | One engine per window, sharing a profile using `CreateWindow`, and handling `WindowRequested`. |
| `ViewModels/MainViewModel.cs` | A toolbar and status bar on top of the engine's state and events, including the page's icon. |
| `Views/MainWindow.axaml` | Placing `BrowserView` in a window, next to a second one for the diagnostics. |
| `Models/BrowserSettings.cs` | Turning user settings into `BrowserOptions`. |
| `Audio/OpenAlAudioOutput.cs` | An `IAudioOutput` playing the audio of pages on the default device (OpenAL Soft via Silk.NET), shared by all windows, silent without a device. |
| `Pages/` | The app's own UI (start page, requester, diagnostics, inspector, settings, site information, about) written as HTML and CSS, and wired up with .NET event handlers through `InvokeAsync`, in an engine with scripting disabled. Their text can be selected and copied like the one of pages. |

---
title: "Examples"
section: "General"
---
# Example Code Snippets

This is a (growing) list of examples for every-day usage of AngleSharp.

## Parsing a Well-Defined Document

Of course AngleSharp can handle well-defined documents very well. But what about a document that seems ill-defined, however, is in fact well-defined. The following document works, has no errors at all and is also used in production by Google. The serialized output of the document generation can be compared with the serialization done by browsers such as IE, Chrome or Firefox.

```cs
var source = @"
<!DOCTYPE html>
<html lang=en>
  <meta charset=utf-8>
  <meta name=viewport content=""initial-scale=1, minimum-scale=1, width=device-width"">
  <title>Error 404 (Not Found)!!1</title>
  <style>
    *{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/errors/logo_sm_2.png) no-repeat}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/errors/logo_sm_2_hr.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/errors/logo_sm_2_hr.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/errors/logo_sm_2_hr.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:55px;width:150px}
  </style>
  <a href=//www.google.com/><span id=logo aria-label=Google></span></a>
  <p><b>404.</b> <ins>That’s an error.</ins>
  <p>The requested URL <code>/error</code> was not found on this server.  <ins>That’s all we know.</ins>";

//Use the default configuration for AngleSharp
var config = Configuration.Default;

//Create a new context for evaluating webpages with the given config
var context = BrowsingContext.New(config);

//Just get the DOM representation
var document = await context.OpenAsync(req => req.Content(source));

//Serialize it back to the console
Console.WriteLine(document.DocumentElement.OuterHtml);
```

So we define some source code, call the `OpenAsync` method of a an `BrowsingContext` instance. The `OpenAsync` method allows us to parse documents from any kind of requests, e.g., from a webserver. The callback style is called a "virtual request", which does not invoke a real request, but stays within our code.

In this case we use the provided source code to determine the content of the request's response. This content of the response is then parsed into an HTML document. Afterwards we serialize the DOM back to a string. Finally we output this string in the console.

## Simple Document Manipulation

AngleSharp constructs a DOM according to the official HTML5 specification. This also means that the resulting model is fully interactive and could be used for simple manipulation. The following example creates a document and changes the tree structure by inserting another paragraph element with some text.

```cs
static async Task FirstExample()
{
    //Use the default configuration for AngleSharp
    var config = Configuration.Default;

    //Create a new context for evaluating webpages with the given config
    var context = BrowsingContext.New(config);

    //Parse the document from the content of a response to a virtual request
    var document = await context.OpenAsync(req => req.Content("<h1>Some example source</h1><p>This is a paragraph element"));

    //Do something with document like the following
    Console.WriteLine("Serializing the (original) document:");
    Console.WriteLine(document.DocumentElement.OuterHtml);

    var p = document.CreateElement("p");
    p.TextContent = "This is another paragraph.";

    Console.WriteLine("Inserting another element in the body ...");
    document.Body.AppendChild(p);

    Console.WriteLine("Serializing the document again:");
    Console.WriteLine(document.DocumentElement.OuterHtml);
}
```

Here the parser will create a new `IHtmlDocument` instance, which is then queried to find some matching nodes. In the example code above we also create another `IElement`, which is the `IHtmlParagraphElement`. This one is then appended to the `Body` node of the document.

## Getting Certain Elements

AngleSharp exposes all DOM lists as `IEnumerable<T>` like `IEnumerable<Node>` for the `NodeList` class. This allows us to use LINQ in combination with some already given DOM capabilities like the `QuerySelectorAll` method.

```cs
static async Task UsingLinq()
{
    //Create a new context for evaluating webpages with the default config
    var context = BrowsingContext.New(Configuration.Default);

    //Create a document from a virtual request / response pattern
    var document = await context.OpenAsync(req => req.Content("<ul><li>First item<li>Second item<li class='blue'>Third item!<li class='blue red'>Last item!</ul>"));

    //Do something with LINQ
    var blueListItemsLinq = document.All.Where(m => m.LocalName == "li" && m.ClassList.Contains("blue"));

    //Or directly with CSS selectors
    var blueListItemsCssSelector = document.QuerySelectorAll("li.blue");

    Console.WriteLine("Comparing both ways ...");

    Console.WriteLine();
    Console.WriteLine("LINQ:");

    foreach (var item in blueListItemsLinq)
    {
        Console.WriteLine(item.Text());
    }

    Console.WriteLine();
    Console.WriteLine("CSS:");

    foreach (var item in blueListItemsCssSelector)
    {
        Console.WriteLine(item.Text());
    }
}
```

Since the `All` property of an `IDocument` returns all `IElement` nodes that are contained in a document, we can use it very efficiently with LINQ. On the other hand the `QuerySelectorAll` also returns (same as `All`) an `IHtmlCollection` object. Hence this can be filtered with LINQ as well! Additionally this list is already filtered.

It is also possible to get the same as `All` with a selector - the special asterisk `*` selector:

```cs
//Same as document.All
var blueListItemsLinq = document.QuerySelectorAll("*").Where(m => m.LocalName == "li" && m.ClassList.Contains("blue"));
```

Is this exactly the same? Actually no - `All` returns a so called _live_ DOM list, i.e. if we save the object somewhere we will always have access to the latest DOM changes.

## Getting Single Elements

Additionally we have the `QuerySelector` method. This one is quite close to LINQ statements that use `FirstOrDefault()` for generating results. The tree traversal might be a little bit more efficient using the `QuerySelector` method.

Let's see some sample code:

```cs
static async Task SingleElements()
{
    //Create a new context for evaluating webpages with the default config
    var context = BrowsingContext.New(Configuration.Default);

    //Create a new document
    var document = await context.OpenAsync(req => req.Content("<b><i>This is some <em> bold <u>and</u> italic </em> text!</i></b>"));

    var emphasize = document.QuerySelector("em");

    Console.WriteLine("Difference between several ways of getting text:");
    Console.WriteLine();
    Console.WriteLine("Only from C# / AngleSharp:");
    Console.WriteLine();
    Console.WriteLine(emphasize.ToHtml());   //<em> bold <u>and</u> italic </em>
    Console.WriteLine(emphasize.Text());   // bold and italic

    Console.WriteLine();
    Console.WriteLine("From the DOM:");
    Console.WriteLine();
    Console.WriteLine(emphasize.InnerHtml);  // bold <u>and</u> italic
    Console.WriteLine(emphasize.OuterHtml);  //<em> bold <u>and</u> italic </em>
    Console.WriteLine(emphasize.TextContent);// bold and italic
}
```

The output commands try to demonstrate the differences between several ways of getting back strings from nodes. In fact the DOM property `OuterHtml` uses the `ToHtml()` version to generate the HTML code. The other variants are all different. While `Text()` is just a helper to strip text (and omit unwanted text contents like in `<script>` tags), the other two variants behave like the official W3C specified properties, leaving everything as it is.

Extension methods such as `ToHtml()` and `Text()` can be found in the namespace `AngleSharp.Extensions`.

## Connecting JavaScript Evaluation

The project also contains a sample JavaScript engine based on Jint (JavaScript Interpreter).

The sample starts by creating a customized version based on the pre-defined `Configuration` class. Here we just include another engine, located in `AngleSharp.Js` (namespace and project). It is important to also enable scripting. AngleSharp knows that having script engines and using them are two different things.

```ps1
Install-Package AngleSharp.Js
```

Here is the full sample code.

```cs
static async Task SimpleScriptingSample()
{
    //We require a custom configuration
    var config = Configuration.Default.WithJs();

    //Create a new context for evaluating webpages with the given config
    var context = BrowsingContext.New(config);

    //This is our sample source, we will set the title and write on the document
    var source = @"<!doctype html>
        <html>
        <head><title>Sample</title></head>
        <body>
        <script>
        document.title = 'Simple manipulation...';
        document.write('<span class=greeting>Hello World!</span>');
        </script>
        </body>";

    var document = await context.OpenAsync(req => req.Content(source));

    //Modified HTML will be output
    Console.WriteLine(document.DocumentElement.OuterHtml);
}
```

This code just parses the given HTML code, encounters the provided JavaScript and executes it. The JavaScript will manipulate the document at the given point, changing the title of the document and appending some more HTML to parse. In the end we will see, that the printed (serialized) HTML is different to the original one.

## More Complex JavaScript DOM Interaction

Using JavaScript with AngleSharp is no problem. In the current state we can also easily use DOM manipulation like creating elements, appending or removing them.

For this example, we'll need two additional packages besides `AngleSharp`: `AngleSharp.Js` (for evaluating JavaScript) and `AngleSharp.Css` (for understanding CSS).

```ps1
Install-Package AngleSharp.Js
Install-Package AngleSharp.Css
```

The following example code performs DOM queries, creates new elements and removes existing ones.

```cs
static void ExtendedScriptingSample()
{
    //We require a custom configuration with JavaScript and CSS
    var config = Configuration.Default.WithJs().WithCss();

    //Create a new context for evaluating webpages with the given config
    var context = BrowsingContext.New(config);

    //This is our sample source, we will do some DOM manipulation
    var source = @"<!doctype html>
        <html>
        <head><title>Sample</title></head>
        <style>
            .bold {
                font-weight: bold;
            }
            .italic {
                font-style: italic;
            }
            span {
                font-size: 12pt;
            }
            div {
                background: #777;
                color: #f3f3f3;
            }
        </style>
        <body>
        <div id=content></div>
        <script>
        (function() {
            var doc = document;
            var content = doc.querySelector('#content');
            var span = doc.createElement('span');
            span.id = 'myspan';
            span.classList.add('bold', 'italic');
            span.textContent = 'Some sample text';
            content.appendChild(span);
            var script = doc.querySelector('script');
            script.parentNode.removeChild(script);
        })();
        </script>
        </body>";

    var document = await context.OpenAsync(req => req.Content(source));

    //HTML will have changed completely (e.g., no more script element)
    Console.WriteLine(document.DocumentElement.OuterHtml);
}
```

In principle other JavaScript engines can be added as well. Of course manually wrapping the objects would give a superior performance compared to the automatic version that is based on reflection. Nevertheless, the `AngleSharp.Js` library (available on NuGet) shows the possibilities and the basics of binding an existing JavaScript engine to AngleSharp.

## Events in JavaScript and C&#35;

The beginning of the following example is exactly the same as the previous two examples. We create a custom configuration, which contains the `JavaScriptEngine` engine. After enabling scripting (and styling in this case), we can parse our document.

The sample document of this example consists of a single script, that calls the `console.log` method. One time before adding a listener, another time after adding the listener.

You'll need to add the additional `AngleSharp.Js` package:

```ps1
Install-Package AngleSharp.Js
```

The listener is called once the document is fully loaded. This happens after executing the provided JavaScript, hence we should see this event at the end. We also registered another event listener, which will be invoked once the custom event **hello** is dispatched.

```cs
public static void EventScriptingExample()
{
    //We require a custom configuration
    var config = Configuration.Default.WithJs();

    //Create a new context for evaluating webpages with the given config
    var context = BrowsingContext.New(config);

    //This is our sample source, we will trigger the load event
    var source = @"<!doctype html>
        <html>
        <head><title>Event sample</title></head>
        <body>
        <script>
        console.log('Before setting the handler!');

        document.addEventListener('load', function() {
        console.log('Document loaded!');
        });

        document.addEventListener('hello', function() {
        console.log('hello world from JavaScript!');
        });

        console.log('After setting the handler!');
        </script>
        </body>";

    var document = await context.OpenAsync(req => req.Content(source));

    //HTML should be output in the end
    Console.WriteLine(document.DocumentElement.OuterHtml);

    //Register Hello event listener from C# (we also have one in JS)
    document.AddEventListener("hello", (s, ev) =>
    {
        Console.WriteLine("hello world from C#!");
    });

    var e = document.CreateEvent("event");
    e.Init("hello", false, false);
    document.Dispatch(e);
}
```

We also register an event listener for this custom event in C#. Here we have intelli sense and all other comfortable tools. After initiating the event via the official API we will recognize output from both registered event listeners (coming from JavaScript and C#).

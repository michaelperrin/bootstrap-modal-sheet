bootstrap-modal-sheet
=====================

Bootstrap modal sheets are a kind of modals inspired by OS X sheets and are an alternative to the usual Twitter Bootstrap modals.

![Boostrap modal sheet screenshot](http://demo.michaelperrin.fr/assets/sheet-screenshot.png)

They have several advantages:
* They are not intrusive (usually smaller, and hiding a smaller part)
* They have a scope: user interaction is required in the current area rather than the whole web page.
* They have a context. They appear *from* a chosen header


## Usage example

Include CSS:

```html
<script src="lib/boostrap-sheet/js/bootstrap-sheet.js" type="text/javascript"></script>
```

Include JS:

```html
<link href="lib/boostrap-sheet/css/bootstrap-sheet.css" type="text/css" rel="stylesheet">
```

Create an info box from which a modal sheet will appear when clicking on the "Show info" button:

```html
<div id="info-box">
    ...
</div>

<a data-toggle="sheet" data-sheet-parent="#info-box" href="#mySheet">Show info</a>

<div class="sheet hide fade" id="mySheet">
    <div class="sheet-body">
        <p>
            I'm an information modal sheet.
        </p>
    </div>

    <div class="sheet-footer">
        <a href="#" class="btn" data-dismiss="sheet" aria-hidden="true">Cancel</a>
    </div>
</div>
```

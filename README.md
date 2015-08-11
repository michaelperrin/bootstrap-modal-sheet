bootstrap-modal-sheet
=====================

Bootstrap modal sheets are a kind of modals inspired by OS X sheets and are an alternative to the usual Twitter Bootstrap modals.

![Boostrap modal sheet screenshot](http://demo.michaelperrin.fr/assets/sheet-screenshot.png)

They have several advantages:
* They are not intrusive (usually smaller, and hiding a smaller part)
* They have a scope: user interaction is required in the current area rather than the whole web page.
* They have a context. They appear *from* a chosen header

## Demo

A demo has been set up at this address: http://demo.michaelperrin.fr/bootstrap-modal-sheet/demo/index.html

This shows a table with 2 modal sheet dialogs attached to it:

* one for adding a row to the table
* one that shows an information text.

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

<a data-toggle="sheet" href="#mySheet">Show info</a>

<div class="sheet slide" id="mySheet" data-sheet-parent="#info-box">
    <div class="sheet-content">
        <div class="sheet-body">
            <p>
                I'm an information modal sheet.
            </p>
        </div>

        <div class="sheet-footer">
            <a href="#" class="btn btn-default" data-dismiss="sheet" aria-hidden="true">Cancel</a>
        </div>
    </div>
</div>
```

## Events

Events of the standard Bootstrap modal are available as well for modal sheets (see http://getbootstrap.com/javascript/#modals-events):

* `show.bs.sheet`: Fired immediately when the `show` instance method is called.
* `shown.bs.sheet`: (IE10+ and all other browsers) Fired when the modal sheet has been made visible to the user.
* `hide.bs.sheet`: Fired immediately when the `hide` instance method has been called.
* `hidden.bs.sheet`: Fired when the modal has finished being hidden from the user.

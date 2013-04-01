bootstrap-modal-sheet
=====================

Bootstrap modal sheets are a kind of modals inspired by OS X sheets and are an alternative to the usual Twitter Bootstrap modals.

![Boostrap modal sheet screenshot](http://demo.michaelperrin.fr/assets/sheet-screenshot.png)

They have several advantages:
* they are not intrusive (usually smaller, and hiding a smaller part)
* they have a context. They appear *from* a chosen header


## Example of use

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

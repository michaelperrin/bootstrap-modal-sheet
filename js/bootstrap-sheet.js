/**
 * Bootstrap modal sheet
 * 
 * Author: Michaël Perrin
 * https://github.com/michaelperrin/bootstrap-modal-sheet
 */
 
(function () {
  "use strict";

  /*
   * Sheet class definition
   */

  var Sheet = function (element, options) {
    this.options = options;
    this.$element = $(element)
      .delegate('[data-dismiss="sheet"]', 'click.dismiss.sheet', $.proxy(this.hide, this));
    this.options.remote && this.$element.find('.sheet-body').load(this.options.remote);
  };

  Sheet.DEFAULTS = {
    keyboard: true,
    show: true,
    backdrop: true
  };

  Sheet.prototype = {
    constructor: Sheet,

    toggle: function () {
      return this.isShown ? this.hide() : this.show();
    },

    show: function () {
      var e = $.Event('show.bs.sheet');
      var that = this;

      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = true;

      this.escape();

      var transition = this.$element.hasClass('fade');

      if (!this.$element.parent().length) {
        this.$element.appendTo(document.body); // don't move modals dom position
      }

      this.placeBelowParent();

      if (this.options.backdrop) {
        this.$backdrop = $('<div class="sheet-backdrop" />')
          .appendTo(document.body)
        ;

        this.$backdrop.click(
          this.options.backdrop == 'static' ?
            $.proxy(this.$element[0].focus, this.$element[0])
          : $.proxy(this.hide, this)
        );

        this.$backdrop.addClass('in');
      }

      var e = $.Event('shown.bs.sheet');

      this.$element.one('transitionend', function() {
        that.$element.trigger(e);
      });

      this.$element
        .addClass('in')
        .attr('aria-hidden', false)
        .focus()
      ;
    },

    placeBelowParent: function() {
      if ( ! this.options.sheetParent) {
        return;
      }

      var $parent = $(this.options.sheetParent);

      if ( ! $parent) {
        return;
      }

      // Compute vertical position
      var sheetPosition = $parent.offset().top + $parent.height();
      this.$element.css('top', sheetPosition + 'px');

      // Compute horizontal position (make the sheet centered)
      var margin = ($parent.width() - this.$element.width()) / 2;
      var leftPosition = $parent.offset().left + margin;

      this.$element.css('left', leftPosition + 'px');
    },

    hide: function (e) {
      e && e.preventDefault();

      var that = this;

      e = $.Event('hide.bs.sheet');

      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = false;

      this.escape();

      $(document).off('focusin.sheet');

      var e = $.Event('hidden.bs.sheet');

      this.$element.one('transitionend', function() {
        that.$element.trigger(e);
      });

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true)
      ;

      this.hideSheet();
    },

    hideSheet: function () {
      this.removeBackdrop();
      this.$element.trigger('hidden');
    },

    removeBackdrop: function () {
      if ( ! this.options.backdrop) {
        return;
      }

      this.$backdrop.remove();
      this.$backdrop = null;
    },

    escape: function () {
      var that = this;

      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.sheet', function (e) {
          e.which == 27 && that.hide();
        });
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.sheet');
      }
    }
  };

  /*
   * jQuery Modal Sheet plugin definition
   */

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);

      var data = $this.data('sheet');

      var options = $.extend({}, Sheet.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) {
        $this.data('sheet', (data = new Sheet(this, options)));
      }

      if (typeof option == 'string') {
        data[option]();
      } else if (options.show) {
        data.show();
      }
    });
  }

  var old = $.fn.sheet

  $.fn.sheet             = Plugin;
  $.fn.sheet.Constructor = Sheet;

 /* SHEET DATA-API
  * ============== */

  $(document).on('click.sheet.data-api', '[data-toggle="sheet"]', function (e) {
    var $this   = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || href);
    var option  = $target.data('sheet') ? 'toggle' : $.extend($target.data(), $this.data());

    if ($this.is('a')) {
      e.preventDefault();
    }

    $target.one('show.bs.sheet', function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
         // only register focus restorer if modal will actually get shown
        return;
      }

      $target.one('hidden.bs.sheet', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });

    Plugin.call($target, option, this);
  });
}).call(this);

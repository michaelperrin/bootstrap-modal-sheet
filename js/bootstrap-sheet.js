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

  Sheet.prototype = {
    constructor: Sheet,

    toggle: function () {
      return this[!this.isShown ? 'show' : 'hide']();
    },

    show: function () {
      var that = this;
      var e = $.Event('show');

      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = true;

      this.escape();

      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body); //don't move modals dom position
      }

      // Place the dialog just below product list header and show it
      if (this.options.sheetParent) {
        // TODO : do this once
        // TODO : check if parent doesn't exist
        var $parent = $(this.options.sheetParent);

        var sheetPosition = $parent.offset().top + $parent.height();
        that.$element.css('top', sheetPosition + 'px');

        // Compute horizontal position
        var margin = ($parent.width() - that.$element.width()) / 2;
        var leftPosition = $parent.offset().left + margin;

        that.$element.css('left', leftPosition + 'px');
      }

      // TODO : embed this in backdrop function?
      var animate = this.$element.hasClass('fade') ? 'fade' : '';
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $('<div class="sheet-backdrop ' + animate + '" />')
        .appendTo(document.body);

      this.$backdrop.click(
        this.options.backdrop == 'static' ?
          $.proxy(this.$element[0].focus, this.$element[0])
        : $.proxy(this.hide, this)
      );

      if (doAnimate) {
        this.$backdrop[0].offsetWidth; // force reflow
      }

      this.$backdrop.addClass('in');

      // END backdrop

      that.$element.slideDown('fast');

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false);

      that.enforceFocus();

      transition ?
        that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown'); }) :
        that.$element.focus().trigger('shown')
      ;
    },

    hide: function (e) {
      e && e.preventDefault();

      var that = this;

      e = $.Event('hide');

      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) {
        return;
      }

      this.isShown = false;

      this.escape();

      $(document).off('focusin.sheet');

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true);

      $.support.transition && this.$element.hasClass('fade') ?
        this.hideWithTransition() :
        this.hideSheet()
      ;
    },

    hideWithTransition: function () {
      var that = this;
      var timeout = setTimeout(function () {
        that.$element.off($.support.transition.end);
        that.hideSheet();
      }, 500);

      this.$element.one($.support.transition.end, function () {
        clearTimeout(timeout);
        that.hideSheet();
      });
    },

    hideSheet: function () {
      var that = this;

      this.$element
        .slideUp('fast')
        .trigger('hidden')
      ;

      //this.backdrop(function () {
        that.removeBackdrop();
        that.$element.trigger('hidden');
      //});
    },

    removeBackdrop: function () {
      this.$backdrop.remove();
      this.$backdrop = null;
    },

    enforceFocus: function () {
      var that = this;

      $(document).on('focusin.sheet', function (e) {
        if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
          that.$element.focus();
        }
      });
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
   * jQuery plugin definition
   */

  $.fn.sheet = function (option) {
    return this.each(function () {
      var $this = $(this);

      var data = $this.data('sheet');

      var options = $.extend({}, $.fn.sheet.defaults, $this.data(), typeof option == 'object' && option);

      if (!data) {
        $this.data('sheet', (data = new Sheet(this, options)));
      }

      if (typeof option == 'string') {
        data[option]();
      } else if (options.show) {
        data.show();
      }
    });
  };

  $.fn.sheet.defaults = {
    keyboard: true,
    show: true
  };

  $.fn.sheet.Constructor = Sheet;

 /* SHEET DATA-API
  * ============== */

  $(document).on('click.sheet.data-api', '[data-toggle="sheet"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); //strip for ie7
    var option = $target.data('sheet') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());

    e.preventDefault();

    $target
      .sheet(option)
      .one('hide', function () {
        $this.focus();
      });
  });
}).call(this);
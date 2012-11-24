(function () {
    /*
     Sheet class definition
     */

    var Sheet,
        privateMethod;

    Sheet = (function () {

        /*
         Sheet constructor
         */

        function Sheet(element, options) {
            this.options = options;
            this.$element = $(element);

            console.log('constructor');
        }

        Sheet.prototype = {
            constructor: Sheet,

            toggle: function () {
              return this[!this.isShown ? 'show' : 'hide']();
            },

            show: function () {
                console.log('test');

                var that = this;
                var e = $.Event('show');

                this.$element.trigger(e);

                if (this.isShown || e.isDefaultPrevented()) return;

                this.isShown = true;

                this.escape();

                this.backdrop(function () {
                  var transition = $.support.transition && that.$element.hasClass('fade');

                  if (!that.$element.parent().length) {
                    that.$element.appendTo(document.body); //don't move modals dom position
                  }

                  that.$element
                    .slideDown('fast');

                  if (transition) {
                    that.$element[0].offsetWidth; // force reflow
                  }

                  that.$element
                    .addClass('in')
                    .attr('aria-hidden', false);

                  that.enforceFocus();

                  transition ?
                    that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown'); }) :
                    that.$element.focus().trigger('shown');

                });
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
                  this.hideSheet();
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

              hideSheet: function (that) {
                this.$element
                  .hide()
                  .trigger('hidden');

                this.backdrop();
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
                  this.$element.on('keyup.dismiss.sheet', function ( e ) {
                    e.which == 27 && that.hide();
                  });
                } else if (!this.isShown) {
                  this.$element.off('keyup.dismiss.sheet');
                }
              },

              backdrop: function (callback) {
                var that = this;
                var animate = this.$element.hasClass('fade') ? 'fade' : '';

                if (this.isShown && this.options.backdrop) {
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

                  doAnimate ?
                    this.$backdrop.one($.support.transition.end, callback) :
                    callback();

                } else if (!this.isShown && this.$backdrop) {
                  this.$backdrop.removeClass('in');

                  $.support.transition && this.$element.hasClass('fade') ?
                    this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
                    this.removeBackdrop();

                } else if (callback) {
                  callback();
                }
              }
        };

        return Sheet;

    })();

    /*
     Private method
     */

    privateMethod = function () {
        /* Method body here
         */
    };

    /*
     Sheet definition
     */

    $.fn.sheet = function (options) {
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
        backdrop: false,
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

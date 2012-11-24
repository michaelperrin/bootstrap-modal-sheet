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
            this.settings = $.extend({}, $.fn.sheet.defaults, options);
            this.$element = $(element);
            /* Do some initialization
             */
        }

        /*
         Public method
         */

        Sheet.prototype.doSomething = function () {
            /* Method body here
             */
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
        var instance;
        instance = this.data('sheet');
        if (!instance) {
            return this.each(function () {
                return $(this).data('sheet', new Sheet(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') instance[options]();
        return this;
    };

    $.fn.sheet.defaults = {
        property1: 'value',
        property2: 'value'
    };

    /*
     Apply sheet automatically to any element with data-sheet
     */

    $(function () {
        return new Sheet($('[data-sheet]'));
    }); 
}).call(this);

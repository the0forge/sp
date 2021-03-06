$(function () {
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                    .addClass("custom-combobox")
                    .insertAfter(this.element);

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function () {
            var selected = this.element.children(":selected"),
                    value = selected.val() ? selected.text() : "";

            this.input = $("<input>")
                    .appendTo(this.wrapper)
                    .val(value)
                    .attr("title", "")
                    .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                    .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy(this, "_source")
                    })
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });

            this._on(this.input, {
                autocompleteselect: function (event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function () {
            var input = this.input,
                    wasOpen = false;

            $("<a>")
                    .attr("tabIndex", -1)
                    .attr("title", "Show All Items")
                    .tooltip()
                    .appendTo(this.wrapper)
                    .button({
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        },
                        text: false
                    })
                    .removeClass("ui-corner-all")
                    .addClass("custom-combobox-toggle ui-corner-right")
                    .mousedown(function () {
                        wasOpen = input.autocomplete("widget").is(":visible");
                    })
                    .click(function () {
                        input.focus();

                        // Close if already visible
                        if (wasOpen) {
                            return;
                        }

                        // Pass empty string as value to search for, displaying all results
                        input.autocomplete("search", "");
                    });
        },

        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text)))
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }));
        },

        _removeIfInvalid: function (event, ui) {

            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
            this.element.children("option").each(function () {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if (valid) {
                return;
            }

            // Remove invalid value
            this.input
                    .val("")
                    .attr("title", value + " didn't match any item")
                    .tooltip("open");
            this.element.val("");
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.data("ui-autocomplete").term = "";
        },

        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });
    $.widget("ui.pcntspinner", $.ui.spinner, {
        _format: function (value) {
            return value + '%';
        },

        _parse: function (value) {
            return parseFloat(value);
        }
    });

    $.br2nl = function(varTest){
        return varTest.replace(/<br>/g, "\r");
    };
    $.nl2br = function(varTest){
        return varTest.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
    };

});


$.fn.extend({
    getDataFields: function () {
        var model_data = {};
        var form_model = $(this).attr('data-model');
        this.find('[data-field]').each(function () {
            var field_model = $(this).attr('data-model');
            var model = field_model ? field_model : form_model;
            var type = $(this).attr('data-type');
            var value = $.trim($(this).val());

            if (model_data[model] == undefined)
                model_data[model] = {};

            switch (type) {
                case 'integer':
                    value = parseInt(value.replace(/[^\d.]/g, ''));
                    if (isNaN(value)) {
                        value = null;
                    }
                    break;

                case 'boolean':
                    if (value.test(/true/i)) {
                        value = true;
                    } else {
                        value = false;
                    }
                    break;
            }

            model_data[model][$(this).attr('data-field')] = value;
        });
        return model_data;
    },

    // appends a hidden input element to the target (form).  Used by fillFormModelData() when it cannot place a Models data in an element, and that field is not non-editable.
    appendHiddenInput: function (field_data) {
        var data_type = undefined;
        switch (typeof field_data.value) {
            case 'number':
                data_type = 'integer';
                break;

            case 'object':
                if (field_data.value == null) {
                    data_type = 'integer';
                }
                break;

            case 'boolean':
                data_type = 'boolean';
                break;
        }


        $(this).append($('<input>')
                .prop('name', field_data.model + '_' + field_data.field)
                .prop('id', field_data.model + '_' + field_data.field + '_' + field_data.pk)
                .prop('type', 'hidden')
                .attr('data-model', field_data.model)
                .attr('data-field', field_data.field)
                .attr('data-type', data_type)
                .prop('value', field_data.value)
        );
    },

    //    add to options ability to not create hidden fields for data-fields which are not found on the form.
    //   When using the Customer form, the CustomerContacts are also sent; but the CustomerContacts do not go into input fields.  (We could add tags to the td's etc)
    fillFormModelData: function (json, options) { //{'non_editable_models': [], 'non_editable_model_fields': []}) {
        options = options || {};
        options = $.extend({'non_editable_models': [], 'non_editable_model_fields': { } }, options);

        var form_model = $(this).attr('data-model');
        var form = this;

        $(this).find('[data-field]').each(function () {
            var field_model = $(this).attr('data-model');
            var model = field_model ? field_model : form_model;
            var field = $(this).attr('data-field');

            $(this).val(json[model]['fields'][field]);
            delete json[model]['fields'][field];
            /* This currently makes no sense, its for a multiple model objects, e.g. 2 CustomerContacts for a Customer, but such requests would not need to fill form inputs for
             * each of these models (currently) - it is displayed text
             if ($.isArray(json[model])) {
             var index = parseInt($(this).attr('id').replace(model + '_' + field + '_', ''))
             console.log('model index is probably not right!! - ' + index);
             $(this).val(json[model][index]['fields'][field]);
             delete json[model][index]['fields'][field];
             } else { // no index } */
        });

        // Each data item is DELETED from the json once an element was found to store the data in.
        // Any remaining fields in a models 'fields' has not been filled to an element.
        // We go through these fields, check they shouldn't be ignored (non_editable_models, non_editable_model_fields)
        // 	and create a hidden input element to store its value
        $.each(json, function (model, model_data) {
            if ($.inArray(model, options.non_editable_models) != -1) {
                console.debug('model; ' + model + ' is in ignore unpopulated fields for models list NOOPING');
                $.noop();
            } else {
                if (!$.isArray(model_data)) {
                    model_data = [model_data];
                }

                $.each(model_data, function (index, data_fields) {
                    $.each(data_fields.fields, function (field, value) {
                        if (options.non_editable_model_fields.model && $.inArray(field, options.non_editable_model_fields.model)) {
                            console.debug('[IGNORE FIELD] model:' + model + '[' + index + '].' + field + ' is a non-editable model field; ignoring unpopulated fied');
                            $.noop();
                        } else {
                            console.debug('[CREATE HIDDEN] model:' + model + '[' + index + '].' + field + ' was unpopulated, creating hidden input');
                            $(form).appendHiddenInput({'model': model, 'pk': data_fields.pk, 'field': field, 'value': value});
                        }
                    });
                });

            }
        });
    },

    clear: function () {
        $(this).val('');
    }
});

function refresh_size(){
    $.ajax({url: '/lookup/size',
        type: 'GET',
        dataType: 'json',
        headers: { 'X_HTTP_REQUESTED_WITH': 'XMLHttpRequest' },
        success: function (json) {
            $('.product_size').html('');
            $.each(json, function (k, v) {
                $('.product_size').append(new Option(v, k));
            });
        }
    });
}

function refresh_medium(){
    $.ajax({url: '/lookup/medium',
        type: 'GET',
        dataType: 'json',
        headers: { 'X_HTTP_REQUESTED_WITH': 'XMLHttpRequest' },
        success: function (json) {
            $('.product_medium').html('');
            $.each(json, function (k, v) {
                $('.product_medium').append(new Option(v, k));
            });
        }
    });
}

function refresh_supplier(){
    $.ajax({url: '/lookup/supplier',
        type: 'GET',
        dataType: 'json',
        headers: { 'X_HTTP_REQUESTED_WITH': 'XMLHttpRequest' },
        success: function (json) {
            $('.product_supplier').html('');
            $.each(json, function (k, v) {
                $('.product_supplier').append(new Option(v, k));
            });
        }
    });
}

function refresh_royalty(){
    $.ajax({url: '/lookup/royalty_group',
        type: 'GET',
        dataType: 'json',
        headers: { 'X_HTTP_REQUESTED_WITH': 'XMLHttpRequest' },
        success: function (json) {
            $('.product_royalty_group').html('').append(new Option('--- none ---', ''));
            $.each(json, function (k, v) {
                $('.product_royalty_group').append(new Option(v, k));
            });
        }
    });
}

function refresh_catalog(){
    $.ajax({url: '/lookup/catalog',
        type: 'GET',
        dataType: 'json',
        headers: { 'X_HTTP_REQUESTED_WITH': 'XMLHttpRequest' },
        success: function (json) {
            $('.catalog_issues').html('');
            $('.catalog_issues.with_none').append(new Option('', ''));
            var group;
            $.each(json, function (k, v) {
                if (v[0] == 0){
                    if (group){
                        $('.catalog_issues').append(group);
                    }
                    group = document.createElement('optgroup');
                    group.label = v[1];
                } else {
                    var o = new Option(v[1], v[0]);
                    group.appendChild(o);
                }
            });
            if (group) {
                $('.catalog_issues').append(group);
            }
        }
    });
}

function loader_on(selector) {
    var $el = $(selector);
    $el.css('position', 'relative');

    var $loader = $('<div>').addClass('loader');
    $el.append($loader);


    return $loader;
}

$(function() {
 $('#customer_delivery_address_same').live("click", function() {
    if ($('#customer_delivery_address_same').prop("checked")) {
        $('#toggle_customer_main_options_delivery').hide('blind');
    }
    else {
        $('#toggle_customer_main_options_delivery').show('slide');
    }
 });
});


	$(function() {
		$( "#window" ).draggable({ revert: "invalid" });
		$( "#order_window" ).draggable({ revert: "invalid" });
		
		$( "#container" ).droppable({
			drop: function( event, ui ) {
				$( this )
					.find( "#debug_msg" )
						.html( "window in position" );
			}
		});
	});


	$(function() {
		$( document ).tooltip({
			position: {
				my: "right bottom+6",
				at: "center bottom",
				of: "#avator",
				using: function( position, feedback ) {
					$( this ).css( position );
					$( "<div>" )
						.addClass( "arrow" )
						.addClass( feedback.vertical )
						.addClass( feedback.horizontal )
						.appendTo( this );
				}
			}
		});
	});
	

$(function() {
	$( "#order_content" ).dialog({
			title: "Orders",
			autoOpen: false,
			width: 800
			});
	$( "#button_orders_open_dialog" )
			.click(function() {
				$( "#order_content" ).dialog( "open" );
			});
	});


$(function() {
	$( "#customer_content" ).dialog({
			title: "Customers",
			autoOpen: false,
			width: 414
			});
	$( "#button_customers_open_dialog" )
			.click(function() {
				$( "#customer_content" ).dialog( "open" );
			});
	});


$(function() {
	$( "#product_content" ).dialog({
			title: "Products",
			autoOpen: false,
			width: 414
			});
	$( "#button_products_open_dialog" )
			.click(function() {
				$( "#product_content" ).dialog( "open" );
			});
	});


  $(function() {
    var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( "#order_order_company22" ).autocomplete({
      source: availableTags
    });
  });
  
  
  $(function() {
    var availableTags = [
      "Australian Institute Optom (AIO)",
      "AIOLT",
      "AMI",
      "BackTalk (BT)",
      "Chiro Assc. Aus (CAA)",
      "Disney (JH)",
      "Koren 1",
      "Koren 2",
      "LT",
      "MedART",
      "SP"
    ];
    $( "#product_supplier" ).autocomplete({
      source: availableTags
    });
  });
  
    
  $(function() {
    $( "#order_order_date" ).datepicker();
  });
  
      
    $(function() {
    $( "#order_wanted_by" ).datepicker();
  });
  

  jQuery(function($){
   $("#product").mask("99/99/9999",{completed:function(){alert("You typed the following: "+this.val());}});
});

 
  $(function() {
    $( "#order_shipping_cost" ).spinner({
      min: 0,
      max: 2500,
      step: .15,
      start: 1000,
      numberFormat: "C",
      culture: "en-AU"
    });
  });
  
   
  $(function() {
    $( "#product_cost_price" ).spinner({
      min: 0,
      max: 2500,
      step: .25,
      start: 1000,
      numberFormat: "C",
      culture: "en-AU"
    });
  });
  
     
  $(function() {
    $( "#product_current_stock" ).spinner({
      min: 0,
      max: 250000,
      step: 1,
      start: 1000,
      culture: "en-AU"
    });
  });
  
       
  $(function() {
    $( "#product_minimum_stock" ).spinner({
      min: 0,
      max: 250000,
      step: 25,
      start: 1000,
      culture: "en-AU"
    });
  });
  
   
  $(function() {
  $.widget( "ui.pcntspinner", $.ui.spinner, {
    _format: function(value) { return value + '%'; },

    _parse: function(value) { return parseFloat(value); }
   }); 
   $("#order_product_item_percentage_ID").pcntspinner({   
	min: 0,
	max: 100,
	step: 5,
	start: 0,
	culture: "en-AU"
    });
   $("#order_product_item_percentage_ID2").pcntspinner({   
	min: 0,
	max: 100,
	step: 5,
	start: 0,
	culture: "en-AU"
    });     
 });
  
  
  (function( $ ) {
    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );
 
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";
 
        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            tooltipClass: "ui-state-highlight"
          });
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid"
        });
      },
 
      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;
 
        $( "<a>" )
          .attr( "tabIndex", -1 )
          .attr( "title", "Show All Items" )
          .tooltip()
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .mousedown(function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .click(function() {
            input.focus();
 
            // Close if already visible
            if ( wasOpen ) {
              return;
            }
 
            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },
 
      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },
 
      _removeIfInvalid: function( event, ui ) {
 
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
        // Remove invalid value
        this.input
          .val( "" )
          .attr( "title", value + " didn't match any item" )
          .tooltip( "open" );
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.data( "ui-autocomplete" ).term = "";
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
  })( jQuery );
 
  $(function() {
    $( "#order_order_company" ).combobox();
  });
  
  
  $(function() {
    $( "#order_accordion" ).accordion({
      collapsible: true
    });
  });
  
    
  $(function() {
    $( "#customer_accordion" ).accordion({
      collapsible: true
    });
  });
  
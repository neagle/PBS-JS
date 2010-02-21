PBS.Tabs = PBS.Class.subclass({
    init: function(options){
        var settings = {
            container: null,
            defaultTab: null,
            removeLabel: false,
            speedClose: 'fast',
            speedOpen: 'fast',
            tabControls: null,
            tabPanes: '.tabContent',
            tabLabel: 'h3',
            // Ask Ian about making transition configurable
            transitionClose: null, 
            transitionOpen: null
        }
        jQuery.extend(settings, options);
        // After adding custom settings, call base class init
        this.superclass.init.call(this, settings);

        this.tabPanes = jQuery(this.tabPanes);
    },
    //private
    initDOM: function(){
        // Create tabs
        this.createTabControls();
        this.prepareTabPanes();
    },
    //private
    initEvents: function(){
        // Create Change Event
        this.tabControls.bind('change', jQuery.proxy(function(e) {
            var tab = jQuery(e.target).parent(),
                pane = jQuery(tab.data('pane'));

            if(!pane.hasClass('selected')) {
                // Close currently open pane
                var selected = jQuery('.selected');
                selected.children('.inner').slideUp(this.speedClose, function() {
                    selected.hide().removeClass('selected');
                    pane.show()
                        .addClass('selected')
                        .children('.inner').slideDown(this.speedOpen, function(){
                            // Reserved for anything that needs to happen at
                            // the end 
                        });
                });
            }
            
        }, this)); 
        
        // Create Click Event
        this.tabControls.find('a').click(function(e){
            jQuery(e.target).trigger('change', [e]);
            return false;
        });

        // Hide all panes on page load
        this.tabPanes.hide().children('.inner').hide();
        // Show the first pane on page load
        this.tabPanes.first().show()
            .addClass('selected')
            .children('.inner').show();
    },

    createTabControls: function(){
        var tabs = [],
            tabLabel = this.tabLabel;

        // Populate tab array with the text from the tab label elements
        this.tabPanes.each(function(i, item) {
            // Note: label must be a child (not just a decendant)
            tabs.push(jQuery(item).children(tabLabel).text());
        });

        // Hide the labels if set to do so
        if (this.removeLabel == true) {
            this.tabPanes.children(this.tabLabel).remove();
        };

        // Create UL for tabs
        this.tabControls = jQuery('<ul />', {
            class: 'tabControls'
        });

        if (this.container == null) {
            // If no container is set, create tab controls before the 
            // first tabPane
            this.tabControls.insertBefore(this.tabPanes[0]);
        } else {
            // If a container is set, prepend the controls to it 
            this.tabControls.prependTo(this.container);
        }
        // Populate tab controls with tab <li>s
        for (var i=tabs.length-1;i>=0;i--) {
            jQuery('<li>', {
                html: '<a href="#">' + tabs[i] + '</a>'
            })
                .prependTo(this.tabControls)
                // Store a reference to the tab's pane
                .data('pane', this.tabPanes[i]);
        }
    },

    prepareTabPanes: function() {
        // Add an inner wrapper to tab panes so that we can control pane
        // heights and transition them nicely
        this.tabPanes.wrapInner('<div class="inner"></div>');
        // Prevents margin collapsing
        this.tabPanes.children('.inner').css({
            overflow: 'hidden'
        })

        // Set the height of the panes explicitly
        this.tabPanes.each(function(i, item) {
            var $item = jQuery(item);
            $item.height($item.height() + 'px');
        });
    }

});

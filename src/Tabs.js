PBS.Tabs = PBS.Class.subclass({
    init: function(options){
        var settings = {
            container: null,
            defaultTab: null,
            removeLabels: false,
            speedClose: 'fast',
            speedOpen: 'fast',
            tabControls: null,
            tabControlsClass: 'tabControls',
            // Call this content elements to make a common nomenclature for
            // multiple classes? (contentEl)
            tabPanes: '.tabContent',
            tabLabel: 'h3',
            // Ask Ian about making transition configurable
            transitionClose: null, 
            transitionOpen: null
        };
        jQuery.extend(settings, options);
        // After adding custom settings, call base class init
        this.superclass.init.call(this, settings);

        this.tabPanes = jQuery(this.tabPanes);
    },
    //private
    initDOM: function(){
        // Create tabs
        this.superclass.initDOM.call(this);
        this.createTabControls();
        this.prepareTabPanes();
    },
    //private
    initEvents: function(){
        // Create Change Event
        // this.tabControl.bind('change', this.changeTab);
        this.superclass.initEvents.call(this);
        this.tabControls.bind('change', jQuery.proxy(function(e) {
            var tab = jQuery(e.target),
                pane = jQuery(tab.parent().data('pane'));

            if(!pane.hasClass('selected')) {
                this.tabControls.find('a').removeClass('active');
                tab.addClass('active');

                // Close currently open pane
                var selected = this.tabPanes.closest('.selected');
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
            jQuery(e.target).parent().trigger('click', [e]);
            return false;
        });

        PBS.noLinkAnchorClickEvent = function(e, func){
            func(jQuery(e.target));
            jQuery(e).parent().trigger('click', []);
            return false;
        }

        // Hide all panes on page load
        this.tabPanes.hide().children('.inner').hide();
        // Show the first pane on page load
        this.tabPanes.first().show()
            .addClass('selected')
            .children('.inner').show();
        this.tabControls.find('a').first().addClass('active');
    },

    createTabControls: function(){
        var tabs = [],
            tabLabel = this.tabLabel;

        // Populate tab array with the text from the tab label elements
        this.tabPanes.each(function(i, item) {
            // Note: label must be a child (not just a decendant)
            tabs.push(jQuery(item).children(tabLabel).first().text());
        });

        // Hide the labels if set to do so
        if (this.removeLabels) {
            this.tabPanes.children(tabLabel).remove();
        }

        // Create UL for tabs
        this.tabControls = jQuery('<ul />', {
            'class': 'tabControls'
        }).addClass(this.tabControlsClass);

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
        });

        // Set the height of the panes explicitly
        this.tabPanes.each(function(i, item) {
            var $item = jQuery(item);
            $item.height($item.height() + 'px');
        });
    }

});

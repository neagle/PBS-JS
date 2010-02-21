/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};//Just a comment

var PBS = PBS || {};

(function(){

PBS.namespace = function(ns){
    ns = ns.split('.');
    var p = window;
    for(var i=0;i<ns.length;i++) {
        var name = ns[i];
        p[name] = p[name] || {};
        p = p[name];
    }
    return p;
} // PBS.namespace
PBS.ns = PBS.namespace;

PBS.Class = function(){};
PBS.Class.prototype = {
    init: function(options) {
        jQuery.extend(this, options);
        var lifeCycle = jQuery.proxy(function(){
            this.initDOM();
            this.initEvents();
        }, this);
        jQuery(document).ready(lifeCycle);
     },
     initDOM: function(){},
     initEvents: function(){}
};


var initializing = false;

PBS.Class.subclass = function(properties) {
    var superclass = this.prototype; 

    // Instantiating base class
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Overwrite stuff in prototype with stuff from properties
    for (var name in properties) {
        var prop = properties[name];
        if (typeof(prop) === 'function') {
            prototype[name] = (function(fn){
                return function() {
                    return fn.apply(this, arguments);
                }
            })(prop);
        } else {
            prototype[name] = prop;
        }
    }

    prototype.superclass = superclass;

    function Class() {
        if (!initializing && this.init) {
            this.init.apply(this, arguments);
        }
    }

    Class.prototype = prototype;
    Class.constructor = Class;
    Class.subclass = arguments.callee;
    
    return Class;
}

})() // End local namespace
//Yay bridge
//

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

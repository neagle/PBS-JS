//Just a comment

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
        jQuery(document).ready(function(){
            this.initDOM();
            this.initEvents();
        })
     }
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
            prototype[name] = function() {
                return prop.apply(this, arguments);
            }
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

/*

<div class="tabContent">

    <h3>This is my tab label</h3>

    <p>There's some content in here.</p>

</div><!-- end .tabContent -->

<div class="tabContent">
</div>

<div class="tabContent">
</div>

var MyNewClass = Ext.extend(MyOldClass, {
    construtor: function()
});

 */
/*
        extend = function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(Ext.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){return Ext.extend(sb, o);};
                return sb;
            };
        }(),
        */

PBS.Tabs = PBS.Class.subclass({
    init: function(options){
        var settings = {
            container: null,
            defaultTab: null,
            removeLabel: false,
            tabContent: '.tabContent',
            tabLabel: 'h3'
        }
        jQuery.extend(settings, options);
        // After adding custom settings, call base class init
        PBS.Tabs.superclass.init.call(this, settings);
    },
    //private
    initDOM: function(){

    },
    //private
    initEvents: function(){

    }
});


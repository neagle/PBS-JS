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
        console.log('Start class lifecycle');
        jQuery.extend(this, options);
        var lifeCycle = jQuery.proxy(function(){
            console.log(this);
            this.initDOM();
            this.initEvents();
        }, this);
        jQuery(document).ready(lifeCycle);
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
        console.log('This from inside Class(): ', this);
        if (!initializing && this.init) {
            console.log('Running init...');
            this.init.apply(this, arguments);
        }
    }

    Class.prototype = prototype;
    Class.constructor = Class;
    Class.subclass = arguments.callee;
    
    return Class;
}

})() // End local namespace

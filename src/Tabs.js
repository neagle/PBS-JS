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
            tabPanes: '.tabContent',
            tabLabel: 'h3'
        }
        jQuery.extend(settings, options);
        // After adding custom settings, call base class init
        console.log('checking');
        // PBS.Tabs.superclass.init.call(this, settings);
    },
    //private
    initDOM: function(){
        console.log('initdom');
        // Create tabs
        this.createTabs();

        
    },
    //private
    initEvents: function(){

    },

    createTabs: function(){
        var tabs = [];
        // Populate tab array with the text from the tab label elements
        console.log(this.settings);
    }
});


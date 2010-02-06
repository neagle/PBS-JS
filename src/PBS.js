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


})() // End local namespace

require.config({
    paths: {
    	'jquery' : 'lib/jquery.min',
        'underscore' : 'lib/underscore-min',
        'd3'    : 'lib/d3.min',
        'angular' : 'lib/angular.min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});

//MAIN BLOCK
require(["jquery", "angular"],function($, angular) {

    var wg = function(){
        $(".black").removeClass("black").addClass("gold");
        $(".blue").removeClass("blue").addClass("white");
        $(".black-text").removeClass("black-text").addClass("gold-text");
        $(".blue-text").removeClass("blue-text").addClass("white-text");
        setTimeout(bb, 5000);
    }


    var bb = function(){
        $(".gold").removeClass("gold").addClass("black");
        $(".white").removeClass("white").addClass("blue");
        $(".gold-text").removeClass("gold-text").addClass("black-text");
        $(".white-text").removeClass("white-text").addClass("blue-text");
        setTimeout(wg, 5000);
    };

    wg();


    console.log(angular);
    var app = angular.module("main", []);

    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
        angular.bootstrap(document, ["main"]);
	});

});
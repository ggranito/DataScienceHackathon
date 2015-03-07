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
    console.log(angular);
    var app = angular.module("main", []);

    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
        angular.bootstrap(document, ["main"]);
	});

});
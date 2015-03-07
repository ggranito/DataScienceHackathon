require.config({
    paths: {
    	'jquery' : 'lib/jquery.min',
        'backbone': 'lib/backbone-min',
        'underscore' : 'lib/underscore-min'
    }
});

//MAIN BLOCK
require(["backbone","jquery", "routers/main", "views/test"],function(Backbone, $, MainRouter, TestView) {
    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
    	$("body").append((new TestView()).el);
		router = new MainRouter();
    	Backbone.history.start({pushState: true});
	});
});
require.config({
    paths: {
    	'jquery' : 'lib/jquery.min',
        'underscore' : 'lib/underscore-min'
    }
});

//MAIN BLOCK
require(["jquery"],function($) {
    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
    	$("body").append("Working");
	});
});
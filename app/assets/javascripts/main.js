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


    app.controller("AppController", ['$scope', '$http', function($scope, $http){

        $scope.newQuestion = function(){
            console.log($scope.questions);
            var newQ = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
            $scope.currentQuestion = {
                categories: newQ.categories,
                question: newQ.question,
                answer1: "1",
                answer2: newQ.name,
                answer3: "3",
                answer4: "4",
                correct: 2,
                answered: -1
            };
        };

        $scope.isCorrect = function(answer){
            return $scope.currentQuestion.answered != -1 && 
                   $scope.currentQuestion.correct == answer;
        };

        $scope.isWrong = function(answer){
            return $scope.currentQuestion.answered == answer && 
                   $scope.currentQuestion.correct != answer;
        };

        $scope.display = "question";

        $scope.askQuestion = function(){
            return $scope.display == "question";
        };

        $scope.showGraphs = function(){
            return $scope.display == "graphs";
        };

        $scope.setDisplay = function(screen){
            $scope.display = screen;
        };

        $scope.currentQuestion = {
            categories: ["Category"],
            question: "What color is the dress?",
            answer1: "1",
            answer2: "2",
            answer3: "3",
            answer4: "4",
            correct: 2,
            answered: -1
        };

        $scope.stats = {
            all: {
                correct: 0,
                total: 0
            }
        };

        $scope.answer = function(number){
            if($scope.currentQuestion.answered != -1){
                $scope.newQuestion();
            }else{
                $scope.currentQuestion.answered = number;
                if(number == $scope.currentQuestion.correct){
                    $scope.stats.all.correct +=1;
                }
                $scope.stats.all.total +=1;
            }
        };

        $http.get("/assets/questions.json").success(function(qs){
            $scope.questions = qs.output; 
            $scope.newQuestion();
        });

    }]);




    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
        angular.bootstrap(document, ["main"]);
	});

});
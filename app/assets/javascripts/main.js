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
require(["jquery", "angular", "underscore"],function($, angular, _) {


    var app = angular.module("main", []);


    app.controller("AppController", ['$scope', '$http', function($scope, $http){

        $scope.getCategory= function(){
            return $scope.currentQuestion.categories[0].split("_")
                         .map(function(e){
                            return e.charAt(0).toUpperCase() + e.slice(1);
                         }).join(" ");
        };

        $scope.newQuestion = function(){
            var newQ = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
            var correct = Math.ceil(Math.random() * 4);
            var answers = _.without(_.shuffle($scope.questions.map(function(e){return e.name})), newQ.name).slice(0, 4);
            answers[correct-1] = newQ.name;

            $scope.currentQuestion = {
                categories: newQ.categories,
                question: newQ.question,
                answer1: answers[0],
                answer2: answers[1],
                answer3: answers[2],
                answer4: answers[3],
                correct: correct,
                answered: -1
            };
        };

        $scope.getResult = function(){
            return $scope.currentQuestion.correct == $scope.currentQuestion.answered? "correct" : "wrong";
        };

        $scope.getResultText = function(){
            return $scope.currentQuestion.correct == $scope.currentQuestion.answered? "Correct" : "Incorrect";
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
            $("#scoreBar").css("width", (100*($scope.stats.all.correct/ $scope.stats.all.total))+"%");
        };

        $http.get("/assets/musician_output.json").success(function(qs){
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
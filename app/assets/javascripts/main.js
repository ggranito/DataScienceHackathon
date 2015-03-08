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
require(["jquery", "angular", "underscore", "d3"],function($, angular, _, d3) {


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

        $scope.showGraph = function(){
            return $scope.display == "graph";
        };

        $scope.setDisplay = function(screen){
            $scope.display = screen;
            if(screen == "graph"){
                $scope.visualizeit();
            }
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

        var data; // a global

        d3.json("/assets/input_musicians.json", function(error, json) {
          if (error) return console.warn(error);
          data = json;
        });
        
        $scope.visualizeit = function(){
            console.log("Drawing graph");
            var foo = processData(data);
            var nodes = foo.nodes;
            var links = foo.links;
            var width = 1200,
                height = 800;

            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

            var color = d3.scale.category20();

            var force = d3.layout.force()
                .charge(-120)
                .linkDistance(30)
                .size([width, height])
                .nodes(nodes)
                .links(links);

            force.linkDistance(width/2);

            var link = svg.selectAll('.link')
                .data(links)
                .enter().append('line')
                .attr('class', 'link')
                .style('stroke-width', '1')
                .style('stroke', 'red')
                .style('opacity', '0.1');

            var node = svg.selectAll('.node')
                .data(nodes)
                .enter().append('circle')
                .attr('class', 'node');

            force.on('end', function() {

                node.attr('r', 10)
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                // We also need to update positions of the links.
                // For those elements, the force layout sets the
                // `source` and `target` properties, specifying
                // `x` and `y` values in each case.

                link.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

            });

            force.start();

          
            function processData(data) {
                var input = data.input;

                var newDataSet = [];
                var links = [];

                for ( var i = 0; i < input.length; i++) {
                    var obj = input[i];
                    obj.id = i;
                    input.slice(0,i).filter(function(e){
                        if(obj.categories.filter(function(f){return e.categories.indexOf(f) != -1}).length >0){
                            links.push({source: i, target: e.id});
                        }
                    });

                    //console.log(links);
                    //console.log(obj);
                    newDataSet.push({name: obj.name, className: obj.name/*.toLowerCase()*/, size: obj.categories.length})    
                    //console.log({name: obj.name, className: obj.name.toLowerCase(), size: obj.categories.length});
                }
                return {nodes: newDataSet, links: links};
            }
      
        };
    }]);




    $(document).ready(function(){
        $.ajaxSetup({
            contentType: "application/json"
        });
        angular.bootstrap(document, ["main"]);
	});

});
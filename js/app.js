var app= angular.module("groceryListApp",["ngRoute"]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: "views/groceryList.html",
            controller: "HomeCtrl"
        })
        .when('/addItem',{
            templateUrl: "views/inputItem.html",
            controller: "GroceryListCtrl"
        })
        .when('/addItem/edit/:id',{
            templateUrl: "views/inputItem.html",
            controller: "GroceryListCtrl"
        })
    
        .otherwise({
            redirectTo: "/"
        });
});

app.service("GroceryService", function(){
    var groceryService= {};
    groceryService.groceryItems= [
        {id:1, completed: false, itemName: 'milk',       date:("Mar 16, 2017 9:10:23 AM")},
        {id:2, completed: false, itemName: 'cookies',    date:("Mar 17, 2017 9:10:23 AM")},
        {id:3, completed: false, itemName: 'ice cream',  date:("Mar 18, 2017 9:10:23 AM")},
        {id:4, completed: false, itemName: 'bread',      date:("Mar 18, 2017 9:10:23 AM")},
        {id:5, completed: false, itemName: 'eggs',       date:("Mar 19, 2017 9:10:23 AM")}
    ];
    
    groceryService.findById = function(id){
        for(var item in groceryService.groceryItems){
            if(groceryService.groceryItems[item].id===id){
                return groceryService.groceryItems[item];
            }
        }
    };
    
    groceryService.getNewId = function(){
        if(groceryService.newId){
            groceryService.newId++;
            return groceryService.newId;
        }
        else{
            var maxId = _.max(groceryService.groceryItems , function(entry){return entry.id;});
            groceryService.newId= maxId.id+1;
            return groceryService.newId;
        }
    };
    
    groceryService.markCompleted = function(entry){
        entry.completed= !entry.completed;
    }
    
    groceryService.removeItem = function(entry){
        var index = groceryService.groceryItems.indexOf(entry);
        groceryService.groceryItems.splice(index, 1);
    };
    
    groceryService.save= function(entry){
        var updatedItem = groceryService.findById(entry.id);
        if(updatedItem){
            updatedItem.completed=entry.completed;
            updatedItem.itemName= entry.itemName;
            updatedItem.date=entry.date;
        }else{
            entry.id= groceryService.getNewId(entry);
            groceryService.groceryItems.push(entry);
        }
    };
    
    return groceryService;
});

app.controller("HomeCtrl", ["$scope", "GroceryService", function($scope, GroceryService){
    $scope.groceryItems = GroceryService.groceryItems;
    $scope.removeItem = function(entry){
        GroceryService.removeItem(entry);
    };
    $scope.markCompleted= function(entry){
        GroceryService.markCompleted(entry);
    };
}]);


app.controller("GroceryListCtrl", ["$scope", "$routeParams", "$location", "GroceryService", function($scope, $routeParams, $location, GroceryService){
    
    if(!$routeParams.id){
        $scope.groceryItem = {id:0, completed: false, itemName: "", date: new Date()};
    }else{
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id))); 
    }

    $scope.save= function(){
        GroceryService.save($scope.groceryItem);  
        $location.path('/');
    };
}]);

app.directive("tbGroceryItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/groceryItem.html"
    }
});

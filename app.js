(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMessages', 'ngStorage', 'ngMockE2E'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        // app routes
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'loginText': {
                        templateUrl: 'home/loginText.html',
                        controller: function ($rootScope, $localStorage) {
                            if ($localStorage.currentUser) {
                                $rootScope.userName = $localStorage.currentUser.username; //show user name when logged in: {{userName}}
                            }
                        }
                    },
                    'home': {
                        templateUrl: 'home/index.view.html',
                        controller: 'Home.IndexController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login/index.view.html',
                controller: 'Login.IndexController',
                controllerAs: 'vm'
            });
    }
    
    function run($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });

        $rootScope.select = function(data) { //selects location name and displays it inside modal
            $rootScope.selected = data;
        };

        $rootScope.isSelected = function(data) {
            return $rootScope.selected == data
        };

        $rootScope.sortType     = 'name'; // set the default sort type
        $rootScope.sortReverse  = false;  // set the default sort order
        $rootScope.searchFish   = '';     // set the default search/filter term

        $http.get("dataSet.json").then(function(response) { //http service requesting json data
            $rootScope.dataSet = response.data.dataSet;

        });
    }

})();
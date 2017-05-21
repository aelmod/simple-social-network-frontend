angular
    .module('ssnApp', ['ui.router', 'ssnApp.user', 'ngFileUpload', 'ngImgCrop'])
    .run(($rootScope, $http) => {
        if (localStorage.token !== undefined) {
            $http
                .get('/api/users/currentUser')
                .then((res) => {
                    $rootScope.currentUser = res.data;
                });
        }
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state({
                name: 'home',
                url: '',
                controller: 'HomeController',
                templateUrl: 'app/home/home.html'
            })
            .state({
                name: 'conversation',
                url: '/conversation',
                controller: 'ConversationController',
                templateUrl: 'app/conversation/conversation-view.html'
            })
            .state({
                name: 'login',
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'app/login/login.html'
            })
            .state({
                name: 'upload',
                url: '/upload',
                controller: 'MyCtrl',
                templateUrl: 'app/upload/upload-view.html'
            })
            .state({
                name: 'register',
                url: '/register',
                controller: 'RegisterController',
                templateUrl: 'app/register/register.html'
            });
    })
    .factory('authInterceptor', function ($q, $location, $rootScope) {
        function logout() {
            localStorage.removeItem('token');
            $location.path('/login');
            $rootScope.currentUser = undefined;
        }

        return {
            request: function (config) {
                if (localStorage.token !== undefined) {
                    config.headers['X-Token'] = localStorage.token;
                }
                if (localStorage.token === undefined) {
                    if ($location.path() !== '/register') {
                        logout();
                    }
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    logout();
                }
                if (rejection.status === 500) {
                    alert('Error');
                }
                return $q.reject(rejection);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
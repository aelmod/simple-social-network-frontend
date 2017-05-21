angular
    .module('ssnApp.user')
    .controller('LogoutController', LogoutController);

function LogoutController($location, $rootScope) {
    localStorage.removeItem('token');
    $location.path('/login');
    $rootScope.currentUser = undefined;
}
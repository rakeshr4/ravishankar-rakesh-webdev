/**
 * Created by Rakesh on 2/10/17.
 */
(function () {
    angular
        .module("WebApp")
        .controller("loginController", loginController);

    function loginController(UserService, $location) {
        var vm = this;

        init();

        function init() {
            vm.login = login;
        }

        function login(user) {
            if (typeof user === "undefined") {
                vm.error = "Undefined Entry!";
                return;
            }
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise.success(function(loginUser){
                if (loginUser) {
                    $location.url('/user/' + loginUser._id);
                }
                else {
                    vm.error = "Login Failed!";
                }
            });

        }
    }


})();
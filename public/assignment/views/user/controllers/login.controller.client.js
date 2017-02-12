/**
 * Created by Rakesh on 2/10/17.
 */
(function(){
    angular
        .module("WebApp")
        .controller("loginController", loginController);

    function loginController(UserService, $location){
        var vm  = this;
        vm.login = login;

        function login(user){
            if(typeof user === "undefined"){
                vm.error = "Undefined Entry!";
                return;
            }
            var loginUser = UserService.findUserByCredentials(user.username, user.password);
            if (loginUser != null)
            {
                $location.url('/profile/' + loginUser._id);

            }
            else
            {
                vm.error = "Login Failed!";
            }
        }
    }


})();
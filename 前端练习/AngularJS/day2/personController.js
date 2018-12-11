// JavaScript source code
app.controller("personCtrl", function ($scope) {
    $scope.firstName = "chen";
    $scope.lastName = "zhihua";
});
app.controller("namesCtrl", function ($scope) {
    $scope.names = [
        { name: "aaa", country: "中国" },
        { name: "bbb", country: "美国" },
        { name: "ccc", country: "德国" }];
});
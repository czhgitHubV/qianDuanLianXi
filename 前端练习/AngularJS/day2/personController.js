// JavaScript source code
app.controller("personCtrl", function ($scope) {
    $scope.firstName = "chen";
    $scope.lastName = "zhihua";
});
app.controller("namesCtrl", function ($scope) {
    $scope.names = [
        { name: "aaa", country: "�й�" },
        { name: "bbb", country: "����" },
        { name: "ccc", country: "�¹�" }];
});
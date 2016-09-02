var app = angular.module('stockAdmin', ['ui.bootstrap', 'ui.router', 'ngTable']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                controllerAs: '$ctrl'
            })
            .state('login',{
            	url: '/login',
            	templateUrl: '/login.html',
            	controller: 'LoginCtrl',
            	controllerAs: 'loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'InsertNewCtrl'
            });
    }])
    .controller('MainCtrl', ['$rootScope', '$scope', '$http', '$uibModal', function($rootScope, $scope, $http, $uibModal) {
        $scope.names = {
            "02": "ACOM",
            "03": "SUBA",
            "01": "SHOP",
            "07": "SOUB",
            "20": "MOTO",
            "21": "LENOVO",
            "22": "LG",
            "23": "XIAOMI",
            "24": "SAMSUNG"
        };

        //ALERTS STUFF

        $rootScope.alerts = [];

        $rootScope.addAlert = function(msg, type) {
            $rootScope.alerts.push({
                type: type,
                msg: msg
            });
        };

        $rootScope.closeAlert = function(index) {
            $rootScope.alerts.splice(index, 1);
        };

        //MODAL BEGIN

        $scope.modalDelete = function(row) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function($scope, $uibModalInstance, row) {
                        $scope.row = row;

                        $scope.ok = function() {
                            $uibModalInstance.close($scope.row);
                        };

                        $scope.cancel = function() {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        row: function() {
                            return row;
                        }
                    }
                });
            }
            

        //GET PRIORITIES

        $scope.retrievePriorities = function() {
            rowCollection = [];
            var brand = $scope.brand;
            var structure = $scope.structure + "";
            var request = $http.post('/data', {
                    "brand": brand,
                    "structure": structure
                })
                .then(function successCallback(response) {
                    var priorities = response;
                    for (priority in priorities.data) {
                        rowCollection.push({
                            'brand': priorities.data[priority].brand,
                            'structure': priorities.data[priority].structure_id,
                            'id': priorities.data[priority].id,
                            'priority': priorities.data[priority].priority,
                            'subinventory': priorities.data[priority].subinventory_id,
                            'warehouse': priorities.data[priority].warehouse_id
                        });
                    }
                    console.log(rowCollection);
                    $rootScope.rowCollection = rowCollection;

                }, function errorCallback(response) {
                    //something went wrong
                    if (response.status == '404') {
                        $scope.addAlert('Sem resultados.', 'warning');
                        console.log(response);
                    } else {
                        $scope.addAlert('Houve um erro!', 'danger');
                        console.log(response);
                    }
                    $scope.rowCollection = undefined;
                    console.log('Error: ' + rowCollection);
                });
        }


    }])
    .controller('DeleteCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        var row = $scope.row;
        console.log($rootScope);
        console.log(row);

        //REMOVES ROW
        this.removeRow = function(row) {
            console.log(row);
            var index = $rootScope.rowCollection.indexOf(row);
            if (index !== -1) {
                console.log(index);
                console.log(row);
                var brand = row.brand + "";
                var structure = row.structure + "";
                var id = row.id;
                var request = $http.post('/remove', {
                        "brand": brand,
                        "structure": structure,
                        "id": id
                    })
                    .then(function successCallback(response) {
                        $rootScope.rowCollection.splice(index, 1);
                        $rootScope.addAlert('Excluído com sucesso.', 'success');
                    }, function errorCallback(response) {
                        if (response.status == '404') {
                            $scope.addAlert('Sem resultados.', 'warning');
                            console.log(response);
                        } else {
                            $scope.addAlert('Houve um erro!', 'danger');
                            console.log(response);
                        }
                    });
            }
        };
    }])
    .controller('InsertNewCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
        $scope.names = {
            "02": "ACOM",
            "03": "SUBA",
            "01": "SHOP",
            "07": "SOUB",
            "20": "MOTO",
            "21": "LENOVO",
            "22": "LG",
            "23": "XIAOMI",
            "24": "SAMSUNG"
        };

        $scope.warehouses = {
            "55": "55 - Osasco",
            "95": "95 - Cajamar 2 Virtual",
            "88": "88 - Itapevi Virtual",
            "461": "461 - Santa Rita",
            "63": "63 - Caxias RJ",
            "72": "72 - Seropédica RJ Virtual",
            "73": "73 - Cajamar 3 Virtual",
            "84": "84 - Itajai Virtual",
            "44": "44 - Uberlandia",
            "460": "460 - Santa Rita bkp",
            "98": "98 - MarketPlace",
            "75": "75 - Uberlandia Virtual",
            "86": "86 - Recife Virtual",
            "85": "85 - Santa Cruz RJ Virtual",
            "36": "36 - Itajai",
            "71": "71 - Caxias RJ Virtual",
            "64": "64 - Seropédica RJ",
            "37": "37 - Cajamar 2",
            "35": "35 - Recife 2",
            "48": "48 - Cajamar",
            "92": "92 - Osasco Virtual",
            "65": "65 - Cajamar 3",
            "34": "34 - Santa Cruz RJ",
            "87": "87 - Cajamar Virtual",
            "90": "90 - backup 33",
            "77": "77 - Itapevi"
        };

        $scope.alerts = [];

        $scope.addAlert = function(msg, type) {
            $scope.alerts.push({
                type: type,
                msg: msg
            });
        };

        $scope.clear = function() {
            $scope.brand = undefined;
            $scope.structure = undefined;
            $scope.priority = undefined;
            $scope.subinventory = undefined;
            $scope.warehouse = undefined;
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        //ADD NEW PRIORITY
        $scope.upsertPriority = function() {
            var brand = $scope.brand;
            var structure = $scope.structure + "";
            var priority = $scope.priority;
            var subinventory = $scope.subinventory;
            var warehouse = parseInt($scope.warehouse);

            var request = $http.post('/register', {
                    "brand": brand,
                    "structure": structure,
                    "priority": priority,
                    "subinventory": subinventory,
                    "warehouse": warehouse
                })
                .then(function successCallback(response) {
                    console.log(response);
                    $scope.addAlert('Priorização incluída com sucesso', 'success');
                    $scope.clear();

                }, function errorCallback(response) {
                    //something went wrong
                    if (response.status == '404') {
                        $scope.addAlert('Sem resultados.', 'warning');
                        console.log(response);
                    } else {
                        $scope.addAlert('Houve um erro!', 'danger');
                        console.log(response);
                    }
                    $scope.rowCollection = undefined;
                    console.log('Error: ' + rowCollection);
                });
        }
    }])
    .controller('LoginCtrl', ['$scope', function($scope){
    	$scope.foo = [];
    	
    }]);
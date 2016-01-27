angular.module('starter')
.controller('ChannelsViewCtrl', ['$scope', '$state', 'DataManagerSvc',
  function($scope, $state, DataManagerSvc) {

    $scope.DeleteChannel = function(uuid) {
      delete DataManagerSvc.tracking_data_manager.GetChannelContainer()[uuid];
    };

    $scope.$on('$destroy', function() {
    });

    $scope.$on('popover.hidden', function() {
      $ionicSideMenuDelegate.toggleLeft(false);
    });

    $scope.LoadConfig = function() {
      DataManagerSvc.LoadConfig();
    };

    $scope.SaveConfig = function() {
      DataManagerSvc.SaveConfig();
    };

    $scope.ClearConfig = function() {
      DataManagerSvc.ClearConfig();
    };

    $scope.GetChannelContainer = function() {
      return DataManagerSvc.tracking_data_manager.GetChannelContainer();
    };

    $scope.GetMarker = function(uuid) {
      return DataManagerSvc.tracking_data_manager.GetMarker(uuid);
    };

    $scope.GetContents = function(uuid) {
      return DataManagerSvc.tracking_data_manager.GetContents(uuid);
    };

    $scope.LoadPreset = function() {
      DataManagerSvc.LoadPreset();
    };

    $scope.CreateChannel = function() {
      $state.go('channel_create');
    };

    $scope.LoadChannelsServer = function() {
      DataManagerSvc.LoadChannelsServer();
    };
}]);
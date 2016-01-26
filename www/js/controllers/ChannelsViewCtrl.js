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
      DataManagerSvc.tracking_data_manager.Clean();
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
    }

    $scope.CreateChannel = function() {
      var channel_id = DataManagerSvc.tracking_data_manager.AddChannel();
      $state.go('channel_create', { channel_id: channel_id });
    }
}]);
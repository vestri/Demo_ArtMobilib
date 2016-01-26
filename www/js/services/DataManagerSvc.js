angular.module('starter')
.service('DataManagerSvc', function() {
  var that = this;

  var _config_manager = new ConfigManager();

  this.tracking_data_manager = new TrackingDataManager();
  this.tracking_data_manager.LoadContentsAssets('./assets/objects/contents.json');

  this.tracking_data_manager.ParseMarkers(config.markers);
  this.tracking_data_manager.ParseContents(config.contents);
  

  this.LoadConfig = function() {
    _config_manager.Load();
    that.tracking_data_manager.ParseChannels(_config_manager.json, true);
  };

  this.SaveConfig = function() {
    _config_manager.json = that.tracking_data_manager.ChannelsToJson();
    _config_manager.Save();
  };

  this.ClearConfig = function() {
    that.tracking_data_manager.ClearCustom();
  };

  this.LoadPreset = function() {
    this.tracking_data_manager.ParseChannels(config.channels);
  }
})
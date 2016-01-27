angular.module('starter')

.service('DataManagerSvc', function() {
  var that = this;

  var _config_manager = new ConfigManager();

  function GetXDomainRequest() {
    var xdr = null;

    if (window.XDomainRequest) {
      xdr = new XDomainRequest(); 
    }
    else if (window.XMLHttpRequest) {
      xdr = new XMLHttpRequest(); 
    }
    else {
      alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
    }

    return xdr; 
  }

  function LoadFile(url, on_load, on_error) {
    var req = GetXDomainRequest();

    var no_cache_suffix =  '' + ((/\?/).test(url) ? '&' : '?') + (new Date()).getTime();

    req.open('GET', url + no_cache_suffix, true);
    req.setRequestHeader('Access-Control-Allow-Origin', '*');

    var onreadystatechange = function(on_load, on_error) {
      return function (aEvt) {
        if (req.readyState == 4) {
          if(req.status == 200)
            on_load(req.responseText);
          else if (on_error)
            on_error('error status: ' + req.status);
        }
      };
    }(on_load, on_error);

    req.onreadystatechange = onreadystatechange;
    req.send();
  }

  function LoadJsonFile(url, on_load, on_error) {
    var on_load_file = function(on_load, on_error) {
      return function(data) {
        var json;

        try {
          json = JSON.parse(data);
        } catch(e) {
          if (on_error)
            on_error('parsing error: ' + e);
          return;
        }
        on_load(json);
      };
    }(on_load, on_error);

    LoadFile(url, on_load_file, on_error);
  }

  function ResetOrigin() {
    that.origin = './assets';
  }

  function SetOriginToServer() {
    that.origin = 'http://www.lehublot.net/artmobilis/assets';
  }

  function GetPath(url) {
    return that.origin + '/' + url;
  }

  this.origin;
  ResetOrigin();
  this.tracking_data_manager = new TrackingDataManager();
  this.tracking_data_manager.LoadContentsAssets(GetPath('contents_objects.json'));



  this.LoadMarkers = function(url) {
    LoadJsonFile(GetPath(url), function(json) {
      that.tracking_data_manager.ParseMarkers(json);
    }, function(error) {
      console.log('DataManagerSvc: failed to load markers: ' + error);
    });
  };

  this.LoadContents = function(url) {
    LoadJsonFile(GetPath(url), function(json) {
      that.tracking_data_manager.ParseContents(json);
    }, function(error) {
      console.log('DataManagerSvc: failed to load contents: ' + error);
    });
  };

  this.LoadChannels = function(url) {
    LoadJsonFile(GetPath(url), function(json) {
      that.tracking_data_manager.ParseChannels(json);
    }, function(error) {
      console.log('DataManagerSvc: failed to load channels: ' + error);
    });
  };

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
    ResetOrigin();
    this.LoadChannels('channels.json', true);
  };

  this.LoadChannelsServer = function() {
    SetOriginToServer();
    that.LoadChannels('channels.json');
  };

  ResetOrigin();
  this.LoadMarkers('markers.json', true);
  this.LoadContents('contents.json', true);
})
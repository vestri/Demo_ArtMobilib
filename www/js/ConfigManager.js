ConfigManager = function() {
  var that = this;

  this.json = {};

  this.filename = 'config';

  this.Load = function() {
    if (typeof(Storage) !== 'undefined') {
      var str = localStorage[that.filename];
      if (typeof(str) !== 'undefined') {
        try {
          that.json = JSON.parse(str);
        }
        catch(e) {
          that.json = {};
        }
      }
    }
    else
      console.warn('ConfigManager: Load failed: "Storage" undefined');
  };

  this.Save = function() {
    if (typeof(Storage) !== 'undefined') {
      var str = JSON.stringify(that.json, undefined, 2);
      localStorage[that.filename] = str;
    }
    else
      console.warn('ConfigManager: Save failed: "Storage" undefined');
  };

  this.Clear = function() {
    if (typeof(Storage) !== 'undefined') {
      localStorage[that.filename] = '{}';
      that.json = {};
    }
    else
      console.warn('ConfigManager: Save failed: "Storage" undefined');
  }
};
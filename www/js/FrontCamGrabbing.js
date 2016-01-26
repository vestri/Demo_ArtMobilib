FrontCamGrabbing = function() {

  var _dom_element = document.createElement('video');
  _dom_element.setAttribute('autoplay', true)

  _dom_element.style.zIndex = -1;
  _dom_element.style.position = 'absolute'

  _dom_element.style.top = '0px'
  _dom_element.style.left = '0px'
  _dom_element.style.width = '100%'
  _dom_element.style.height = '100%'


  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

  window.URL = window.URL || window.webkitURL;


  /*window.addEventListener('resize', function(event) {
    if (_dom_element.videoHeight === 0) return;

    var videoAspect = _dom_element.videoWidth / _dom_element.videoHeight;
    var windowAspect = window.innerWidth / window.innerHeight;
  });*/

  function OnGetSources(on_error) {
    return function(source_infos) {

      var constraints = {
        video: true,
        audio: false,
      };

      for (var i = 0; i != source_infos.length; ++i) {
        var sourceInfo = source_infos[i];
        if (sourceInfo.kind == "video" && sourceInfo.facing == "environment") {
          constraints.video = {
            optional: [{sourceId: sourceInfo.id}]
          }
        }
      }

      navigator.getUserMedia(constraints, function(stream) {
        _dom_element.src = window.URL.createObjectURL(stream);
      }, function(error) {
        console.error("Cant getUserMedia()! due to ", error);
        if (on_error)
          on_error();
      });

    }
  }

  function GetSourcesMST(on_error) {
    if (typeof (MediaStreamTrack) !== 'undefined'
      && typeof(MediaStreamTrack.getSources) !== 'undefined') {

      MediaStreamTrack.getSources(OnGetSources(on_error));
    
    }
    else if (on_error)
      on_error();
  }

  function GetSourcesMD(on_error) {
    if (typeof(navigator.mediaDevices) !== 'undefined'
      && typeof(navigator.mediaDevices.enumerateDevices) !== 'undefined') {

      navigator.mediaDevices.enumerateDevices().then(OnGetSources(on_error));

    }
    else if (on_error)
      on_error();
  }

  GetSourcesMST(GetSourcesMD);

  this.domElement = _dom_element;
};
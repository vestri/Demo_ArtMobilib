angular.module('starter')

.directive('trackingView', ['$ionicPlatform', 'DataManagerSvc', 
  function($ionicPlatform, DataManagerSvc) {
    return {
      restrict: 'E',
      template: '<div/>',
      link: function(scope, element, attr) {

        var that = this;

        var _webcam_grabbing; // background
        var _scene;
        var _canvas;

        var _orientationControl;

        var _device_lock_screen = new DeviceLockScreenOrientation();

        var _video_grabbing;  // video Frozen, contents
        var _js_aruco_marker;
        var _trackedObjManager;

        var _running = false;
        var _destroyed = false;


        function CreateCanvasElementGlobal(id) {

          var canvas = document.createElement('canvas');

          canvas.id = id;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          return canvas;
        }


        $ionicPlatform.ready(function() {

          _device_lock_screen.LockPortrait();

          _canvas = CreateCanvasElementGlobal('canvasthree');


          _scene = new Scene( { canvas: _canvas, fov: (scope.is_web_view) ? 80 : 40 } );
          _scene.SetFullWindow();
          

          // Create background
          _webcam_grabbing = new FrontCamGrabbing();
          document.body.appendChild(_webcam_grabbing.domElement);

          // Create scene
          var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
          _scene.AddObject(light);


          // Orient camera
          _orientationControl = new DeviceOrientationControl(_scene.GetCamera());
          _orientationControl.Connect();


          // Start Aruco
          _js_aruco_marker = new THREEx.JsArucoMarker();

          // start Image marker detection
          var canvas2d = document.createElement('canvas');
          canvas2d.width = 640;
          canvas2d.height = 480;
          var _AMmarkerManager = new MarkerManager(_webcam_grabbing.domElement, canvas2d);

          // we load trained images
          /*_AMmarkerManager.AddMarker("lib/ArtMobilib/data/gvf.jpg");
          _AMmarkerManager.AddMarker("lib/ArtMobilib/data/3Dtricart.jpg");
          _AMmarkerManager.AddMarker("lib/ArtMobilib/data/vsd.jpg");*/

          
          _trackedObjManager = new TrackedObjManager( { camera: _scene.GetCamera() } );


          function OnWindowResize() {
            _scene.ResizeRenderer(window.innerWidth, window.innerHeight);
          }
          window.addEventListener('resize', OnWindowResize, false);


          document.body.appendChild(_canvas);


          var DetectorWorker = function(videoElement) {
            var _worker;

            var _canvas = document.createElement('canvas');
            var _ctx = _canvas.getContext('2d');
            var _markers = [];
            var _video = videoElement;


            this.Start = function() {
              _worker = new Worker('js/MarkerDetectorWorker.js');
              _worker.onmessage = function(e) {
                if (e.data.msg === 'markers') {
                  _markers = e.data.markers;
                }
              }
            };

            this.Update = function() {

              if (_worker && _video instanceof HTMLVideoElement
                && _video.readyState == _video.HAVE_ENOUGH_DATA) {

                _canvas.width = _video.videoWidth;
                _canvas.height = _video.videoHeight;
                _ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);

                var data = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
                var size = data.width * data.height * 4;
                var buffer = new ArrayBuffer(size);

                for (var i = 0; i < size; ++i) {
                  buffer[i] = data.data[i];
                }

                var obj_data = {
                  msg: 'new_img',
                  buffer: buffer,
                  width: data.width,
                  height: data.height
                };
                _worker.postMessage(obj_data, [obj_data.buffer]);

              }
            };

            this.Stop = function() {
              if (_worker) {
                _worker.terminate();
                _worker = undefined;
              }
            };

            this.GetMarkers = function() {
              return _markers;
            };

            this.Empty = function() {
              _markers = [];
            };
          };

          var _detector_worker = new DetectorWorker(_webcam_grabbing.domElement);
          

          scope.$on('$destroy', function() {
            _running = false;
            _destroyed = true;
            document.body.removeChild(_webcam_grabbing.domElement);
            document.body.removeChild(_canvas);
            _webcam_grabbing.Stop();
            _detector_worker.Stop();
          });


          function InitScene() {
            if (_destroyed)
              return;

            var channels = DataManagerSvc.tracking_data_manager.GetChannelContainer();
            for (uuid in channels) {

              var marker = DataManagerSvc.tracking_data_manager.GetMarker(channels[uuid].marker);

              if (marker) {
                if (marker.is_tag) {
                  var object = DataManagerSvc.tracking_data_manager.BuildChannelContents(uuid);

                  (function(object) {
                    _trackedObjManager.Add(object, uuid, function() {
                      _scene.AddObject(object);
                    }, function() {
                      _scene.RemoveObject(object);
                    });
                  })(object);
                }
              }

            }

            _webcam_grabbing.Start();
          }

          function Run() {
            if (_destroyed)
              return;

            _detector_worker.Start();

            _running = true;
            (function loop() {
              if (!_running)
                return;

              _orientationControl.Update();

              _detector_worker.Update();

              //var tags = _js_aruco_marker.detectMarkers(_webcam_grabbing.domElement);

              var tags = _detector_worker.GetMarkers();

              var channels = DataManagerSvc.tracking_data_manager.GetChannelContainer();

              for (tag of tags) {
                for (uuid in channels) {
                  var marker = DataManagerSvc.tracking_data_manager.GetMarker(channels[uuid].marker);
                  if (marker.is_tag && marker.tag_id === tag.id) {
                    var o = new THREE.Object3D();
                    _js_aruco_marker.markerToObject3D(tag, o);
                    _trackedObjManager.TrackCompose(uuid, o.position, o.quaternion, o.scale);
                  }
                }
              }

              /*if (_AMmarkerManager.ProcessVideo()) {
                console.log("Marker detected");
                var o = new THREE.Object3D();
                _AMmarkerManager.markerToObject3D(o);
                _trackedObjManager.TrackCompose('mesh', o.position, o.quaternion, o.scale);
              }*/

              _trackedObjManager.Update();

              DataManagerSvc.tracking_data_manager.UpdateAnimations();

              _scene.Update();
              _scene.Render();

              window.requestAnimationFrame(loop);
            })();
          }

          DataManagerSvc.OnLoadConfig(function() {
            DataManagerSvc.tracking_data_manager.OnLoadContentsAssets(function() {
              InitScene();
              Run();
            });
          });

        });


      }

    }
  }
])
angular.module('starter')
.directive('canvasDrawObject', ['DataManagerSvc', function(DataManagerSvc) {
  return {
    restrict: 'E',
    template: '<div/>',
    link: function(scope, element, attr) {

      var _running = true;

      var _div = element.children()[0];
      var _canvas, _scene, _renderer;

      var _has_object = false;

      var _alt = '';

      var _object;


      function setAlt() {
        _div.innerHTML = _alt;
      }

      function resetAlt() {
        _div.innerHTML = '';
      }

      function OnHasObject() {
        resetAlt();
        _has_object = true;

        if (!_canvas) {
          _canvas = document.createElement('canvas');
          _div.appendChild(_canvas);

          _scene = new Scene( { canvas: _canvas } );
          _renderer = _scene.GetRenderer();

          _scene.AddObject(new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ));
          _scene.AddObject(new THREE.AmbientLight( 0x404040 ));
        }
        else {
          _scene.remove(_object);
          _object = undefined;
        }
      }

      function OnHasntObject() {
        setAlt();
        _has_object = false;
        _running = false;

        if (_canvas) {
          _div.removeChild(_canvas);
          _canvas = undefined;
          _scene = undefined;
          _renderer = undefined;
        }
      }

      attr.$observe('alt', function(alt) {
        _alt = alt;
        if (!_has_object)
          setAlt();
      })

      attr.$observe('object', function(attr_object_id) {

        DataManagerSvc.tracking_data_manager.OnLoadContentsAssets(function() {

          var object = DataManagerSvc.tracking_data_manager.GetObject(attr_object_id);
          if (!object) {
            OnHasntObject();
            return;
          }

          OnHasObject();


          attr.$observe('width', function(width) {
            _scene.ResizeRenderer(width, _canvas.height);
          });
          attr.$observe('height', function(height) {
            _scene.ResizeRenderer(_canvas.width, height);
          });

          object = object.clone();

          var box = new THREE.Box3();
          box.setFromObject(object);
          var sphere = box.getBoundingSphere();
          object.position.sub(sphere.center);

          _scene.GetCameraBody().position.z = sphere.radius * 1.5;

          _object = new THREE.Object3D();
          _object.add(object);

          _scene.AddObject(_object);

          (function step() {
            if (_running) {
              window.requestAnimationFrame(step);
              _object.rotation.y += 0.01;
              _scene.Update();
              _scene.Render();
            }
          })();
        });
      });

      scope.$on('$destroy', function() {
        _running = false;
      });
    }
  };
}]);
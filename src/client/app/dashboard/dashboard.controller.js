(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(logger, authService, NgMap, $window) {
        var vm = this;
        vm.jktGeoLocation = '-6.2297263, 106.6890863';
        vm.pushMarker = pushMarker;
        vm.map = null;
        vm.wayPoints = [];
        vm.markers = [];
        vm.origin = '';
        vm.destination = '';
        vm.popMarker = popMarker;
        vm.exportMap = exportMap;
        /* jshint -W117 */
        var geocoder = new google.maps.Geocoder();
        var staticMapUrl = 'https://maps.googleapis.com/maps/api/staticmap';

        activate();

        function activate() {
            NgMap.getMap().then(function (map) {
                vm.map = map;
            });
        }

        function pushMarker(e) {
            vm.markers.push({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
            vm.wayPoints.push({
                location: vm.markers[vm.markers.length - 1],
                stopover: true
            });
            var latLngNow = {};

            if (vm.wayPoints.length === 1) {
                latLngNow = {
                    lat: vm.wayPoints[0].location.lat,
                    lng: vm.wayPoints[0].location.lng
                };
            }

            if (vm.wayPoints.length > 1) {
                latLngNow = {
                    lat: vm.wayPoints[vm.wayPoints.length - 1].location.lat,
                    lng: vm.wayPoints[vm.wayPoints.length - 1].location.lng
                };
            }
            geocoder.geocode({ location: latLngNow }, getLocation);
        }

        function getLocation(result) {
            /* jshint -W106 */
            var address = result[0].formatted_address;
            if (vm.wayPoints.length === 1) {
                vm.origin = address;
            }
            vm.destination = address;
        }

        function popMarker() {
            vm.markers.pop();
            vm.wayPoints.pop();
            if (vm.markers.length === 0) {
                vm.origin = '';
                vm.destination = '';
            }
        }

        function exportMap() {
            var centerMap = vm.map.getCenter();
            var exportUrl = angular.copy(staticMapUrl);
            exportUrl += '?center=' + centerMap.lat() + ',' + centerMap.lng();
            exportUrl += '&size=640x480';
            exportUrl += '&maptype=google.maps.MapTypeId.ROADMAP';
            exportUrl += '&zoom=' + vm.map.getZoom();
            vm.markers.forEach(function (marker) {
                exportUrl += '&markers=color:red|' + marker.lat + ',' +
                    marker.lng;
            });
            $window.open(exportUrl);
        }
    }
})();

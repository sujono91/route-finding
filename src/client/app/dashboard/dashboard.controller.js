(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController(logger, NgMap, $window, dataService,
        constant, _) {
        var vm = this;
        var endpoints = dataService.endpoints;
        vm.jktGeoLocation = '-6.2297263, 106.6890863';
        vm.pushMarker = pushMarker;
        vm.map = null;
        vm.wayPoints = [];
        vm.markers = [];
        vm.origin = '';
        vm.destination = '';
        vm.addresses = [];
        vm.popMarker = popMarker;
        vm.exportMap = exportMap;
        vm.isLoading = false;
        var isAdd = false;
        /* jshint -W117 */
        var geocoder = new google.maps.Geocoder();
        var staticMapUrl = constant.STATIC_MAP_API;

        activate();

        function activate() {
            vm.isLoading = true;
            NgMap.getMap().then(function (map) {
                vm.map = map;
            }).then(fetchLocations)
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function fetchLocations() {
            return dataService.get(endpoints.LOCATIONS).then(setMarker);
        }

        function setMarker(locations) {
            isAdd = false;
            if (locations.length > 0) {
                vm.origin = locations[0].address;
                vm.destination = locations[locations.length - 1].address;
            }
            _.forEach(locations, function (location) {
                vm.markers.push({
                    id: location.id,
                    lat: location.latitude,
                    lng: location.longitude
                });
                setWayPoints();
            });
        }

        function pushMarker(e) {
            isAdd = true;
            vm.markers.push({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
            setWayPoints();
        }

        function setWayPoints() {
            vm.wayPoints.push({
                location: vm.markers[vm.markers.length - 1],
                stopover: true
            });
            var indexLatLngNow = vm.wayPoints.length - 1;
            var latLngNow = {
                lat: vm.wayPoints[indexLatLngNow].location.lat,
                lng: vm.wayPoints[indexLatLngNow].location.lng
            };

            if (isAdd) {
                geocoder.geocode({
                    location: latLngNow
                }, getLocation);
                return;
            }
        }

        function getLocation(result) {
            /* jshint -W106 */
            var address = result[0].formatted_address;
            vm.addresses.push(address);
            if (vm.wayPoints.length === 1) {
                vm.origin = address;
            }
            vm.destination = address;
            saveLocation();
        }

        function saveLocation() {
            isAdd = false;
            vm.isLoading = true;
            dataService.post(endpoints.LOCATIONS, {
                latitude: vm.markers[vm.markers.length - 1].lat,
                longitude: vm.markers[vm.markers.length - 1].lng,
                address: vm.addresses[vm.addresses.length - 1],
            }).then(function (result) {
                logger.success('Succesfully save marker');
                vm.markers[vm.markers.length - 1].id = result.id;
            }).finally(function () {
                vm.isLoading = false;
            });
        }

        function popMarker() {
            if (vm.markers.length > 0) {
                var id = vm.markers[vm.markers.length - 1].id;
                removeMarker(id).finally(validatePopMarker);
            }
        }

        function removeMarker(id) {
            vm.isLoading = true;
            return dataService.del(endpoints.LOCATIONS + '/' + id)
                .then(function (result) {
                    logger.success('Successfully remove marker');
                });
        }

        function validatePopMarker() {
            vm.markers.pop();
            vm.wayPoints.pop();
            vm.addresses.pop();
            if (vm.markers.length === 0) {
                vm.origin = '';
                vm.destination = '';
            }
            vm.isLoading = false;
        }

        function exportMap() {
            var centerMap = vm.map.getCenter();
            var exportUrl = angular.copy(staticMapUrl);
            exportUrl += '&center=' + centerMap.lat() + ',' + centerMap.lng();
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

/**
 * @memberof dashboard
 * @ngdoc controller
 * @name DashboardController
 * @param logger {service} Show status message
 * @param NgMap {service} Google maps service 
 * @param $window {service} Window wrapper
 * @param dataService {service} API Request Service in promise
 * @param constant {constant} App constant
 * @param _ {external} Lodash library
 */
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

        /**
        * Fetch locations and init map
        * @memberof DashboardController
        * @function activate
        */
        function activate() {
            vm.isLoading = true;
            NgMap.getMap().then(function (map) {
                vm.map = map;
            }).then(fetchLocations)
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        /**
        * Fetch locations
        * @memberof DashboardController
        * @function fetchLocations
        * @returns {Promise} array of locations
        */
        function fetchLocations() {
            return dataService.get(endpoints.LOCATIONS).then(setMarker);
        }

        /**
        * Set marker after fetch data
        * @memberof DashboardController
        * @function setMarker
        * @param {Array} locations Array of locations
        */
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

        /**
        * Add Marker
        * @memberof DashboardController
        * @function pushMarker
        * @param {Object} e Object of latitude and longitude
        */
        function pushMarker(e) {
            isAdd = true;
            vm.markers.push({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            });
            setWayPoints();
        }

        /**
        * Set way of points with stopover is true and get geocode if new marker is added
        * @memberof DashboardController
        * @function setWayPoints
        */
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

        /**
        * add formatted address and call saveLocation function
        * @memberof DashboardController
        * @function getLocation
        * @param {Array} result
        */
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

        /**
        * Add the location using API and give logger if success
        * @memberof DashboardController
        * @function saveLocation
        */
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

        /**
        * Get latest marker and call removeMarker function
        * @memberof DashboardController
        * @function popMarker
        */
        function popMarker() {
            if (vm.markers.length > 0) {
                var id = vm.markers[vm.markers.length - 1].id;
                removeMarker(id).finally(validatePopMarker);
            }
        }

        /**
        * Delete the location using API and give logger if success
        * @memberof DashboardController
        * @function removeMarker
        * @param {Number} id Id of removed marker
        */
        function removeMarker(id) {
            vm.isLoading = true;
            return dataService.del(endpoints.LOCATIONS + '/' + id)
                .then(function (result) {
                    logger.success('Successfully remove marker');
                });
        }

        /**
        * Pop marker, wayPoints, and address and validate if markers is empty
        * @memberof DashboardController
        * @function validatePopMarker
        */
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

        /**
        * Export the map using google static map API
        * @memberof DashboardController
        * @function exportMap
        */
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

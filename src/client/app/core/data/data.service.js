/**
 * @memberof core
 * @ngdoc service
 * @name dataService
 * @param {service} $q Angular Promise Service
 * @param {service} $http Angular HTTP Request Service
 * @param {service} exception Exception Servic
 * @param {constant} constant App Constant
 * @param {constant} ENDPOINTS Endpoint Constant
 * @description
 *   API Request Service
 */

/* jshint -W117 */
(function () {
    'use strict';

    angular
        .module('app.core.data')
        .factory('dataService', dataService);

    /* @ngInject */
    function dataService($q, $http, exception, constant, ENDPOINTS) {
        var apiRoot = constant.API_HOST + '/api/';
        var service = {
            endpoints: ENDPOINTS,
            get: get,
            post: post,
            put: put,
            patch: patch,
            del: del
        };

        return service;

        /**
        * send HTTP GET Request
        * @memberof dataService
        * @param {string} endpoint endpoint URL
        * @param {Object} params endpoint params
        * @param {Object} config endpoint config
        * @returns {Promise} HTTP Promise
        */
        function get(endpoint, params, config) {
            params = params ? '?' + $.param(params) : '';
            config = config || {};
            return $http.get(apiRoot + endpoint + params, config)
                .then(function (result) {
                    return $q.when(result.data);
                })
                .catch(function (message) {
                    exception.catcher('Failed get data')(message);
                    return $q.reject(message.data);
                });
        }

        /**
        * send HTTP POST Request
        * @memberof dataService
        * @param {string} endpoint endpoint URL
        * @param {Object} data request data
        * @returns {Promise} HTTP Promise
        */
        function post(endpoint, data) {
            return $http.post(apiRoot + endpoint, data)
                .then(function (result) {
                    return $q.when(result.data);
                })
                .catch(function (message) {
                    exception.catcher('Failed post data')(message);
                    return $q.reject(message.data);
                });
        }

        /**
        * send HTTP PUT Request
        * @memberof dataService
        * @param {string} endpoint endpoint URL
        * @param {Object} data request data
        * @returns {Promise} HTTP Promise
        */
        function put(endpoint, data) {
            return $http.put(apiRoot + endpoint, data)
                .then(function (result) {
                    return $q.when(result.data);
                })
                .catch(function (message) {
                    exception.catcher('Failed put data')(message);
                    return $q.reject(message.data);
                });
        }

        /**
        * send HTTP PATCH Request
        * @memberof dataService
        * @param {string} endpoint endpoint URL
        * @param {Object} data request data
        * @returns {Promise} HTTP Promise
        */
        function patch(endpoint, data) {
            return $http.patch(apiRoot + endpoint, data)
                .then(function (result) {
                    return $q.when(result.data);
                })
                .catch(function (message) {
                    exception.catcher('Failed patch data')(message);
                    return $q.reject(message.data);
                });
        }

        /**
        * send HTTP DELETE Request
        * @memberof dataService
        * @param {string} endpoint endpoint URL
        * @returns {Promise} HTTP Promise
        */
        function del(endpoint) {
            return $http.delete(apiRoot + endpoint)
                .then(function (result) {
                    return $q.when(result);
                })
                .catch(function (message) {
                    exception.catcher('Failed delete data')(message);
                    return $q.reject(message.data);
                });
        }
    }
})();

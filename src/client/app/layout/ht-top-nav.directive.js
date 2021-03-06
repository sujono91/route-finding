/**
 * @memberof layout
 * @ngdoc directive
 * @name ht-top-nav
 * @param  {constant} constant App Constant
 * @description
 *  Header of Finding Route App
 * @example
 *   Usage:
 *   <ht-top-nav></ht-top-nav>
 */

(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);

    /* @ngInject */
    function htTopNav(constant) {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'navline': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        /* @ngInject */
        function TopNavController() {
            var vm = this;
            vm.appName = constant.APP_NAME;
        }

        return directive;
    }
})();

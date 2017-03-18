(function () {
    'use strict';

    angular
        .module('app.core', [
            'blocks.exception',
            'blocks.logger',
            'blocks.router',
            'app.core.data',
            'ngAnimate',
            'ngSanitize',
            'ui.router',
            'ui.bootstrap',
            'ngMap'
        ]);
})();

/* global _:false */
/* global moment:false */
/* global toastr:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('_', _)
        .constant('constant', {
            APP_NAME: 'Route Finding',
            API_HOST: 'https://aqueous-plains-83586.herokuapp.com',
            STATIC_MAP_API: 'https://maps.googleapis.com/maps/api/staticmap?' +
                'key=AIzaSyDAERBv9jkVSgNHaQBYGz52Ob7kO5XNBDI'
        });

})();

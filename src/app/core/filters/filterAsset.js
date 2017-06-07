(function() {
    'use strict';

    angular.module('app.components')
        .filter('AssetsFilter', AssetsFilter);


    function AssetsFilter() {

        return function(items, text, param0, param1) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var str;
                if (param1) {
                    str = item[param0];
                    str = str[param1];
                } else {
                    str = str = item[param0];
                }


                if (!text || str.toLowerCase().indexOf(text.toLowerCase()) > 0) {
                    filtered.push(item);
                }


            }
            return filtered;
        };
    }
})();

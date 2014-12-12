angular.module('trackme.directives', [])
.directive('mapDynamic', function() {

        function link(scope, elem, attrs) {

            var mapOptions, map;
//
//            elem.bind('click', function (e) {
//                e.stopImmediatePropagation();
//                e.stopPropagation();
//            });
//

            attrs.$observe('coords',

                function (value) {


                    var coords = attrs.coords.replace("[", "").replace("]", "").split(",");

                    var latitudeA = parseFloat(coords[0], 10);
                    var longitudeA = parseFloat(coords[1], 10);
                    var latitudeB = parseFloat(coords[2], 10);
                    var longitudeB = parseFloat(coords[3], 10);


                    var latLngA = new google.maps.LatLng(latitudeA, longitudeA);
                    var latLngB = new google.maps.LatLng(latitudeB, longitudeB);
                    var latCenter = (latitudeA + latitudeB) / 2;
                    var longCenter = (longitudeA + longitudeB) / 2;

                    mapOptions = {
                        disableDefaultUI: true
                    };
                    map = new google.maps.Map(elem[0], mapOptions);

                    var markerA = new google.maps.Marker({
                        position: latLngA,
                        animation: google.maps.Animation.DROP,
                        map: map,
                        title: "A: origin",
                        icon: {
                            url: "img/marker0.png"

                        }
                    });

                    var markerB = new google.maps.Marker({
                        position: latLngB,
                        animation: google.maps.Animation.DROP,
                        map: map,
                        title: "B: destination",
                        icon: {
                            url: "img/marker-end.png"
                        }
                    });

                    //google.maps.event.trigger(map, "resize");
                    var latLngList = new Array(latLngA, latLngB);
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0; i < latLngList.length; i++) {
                        bounds.extend(latLngList[i]);
                    }
                    map.fitBounds(bounds);
                }
            );

        };

        return {
            restrict: 'AE',
            scope: {},
            link: link
        };
});


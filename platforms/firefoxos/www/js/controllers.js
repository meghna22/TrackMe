angular.module('trackme.controllers', ['trackme.services'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, TrackSrv) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        TrackSrv.initTracks();
        var time = new Date();
        var t1 = TrackSrv.createTrack([], "Everest");
        t1.addPoint(37, -122, time.getTime() - 900000)
            .addPoint(37.343, -122.102, (new Date()).getTime())
            .addPoint(37.346, -122.132, (new Date()).getTime())
            .addPoint(37.348, -122.18, (new Date()).getTime())
            .addPoint(37.405, -122.34, (new Date()).getTime());

        TrackSrv.addTrack(t1);

        var t2 = TrackSrv.createTrack([], "Ottawa");
        t2.addPoint(37, -122, time.getTime() - 1290000).addPoint(37.04, -122.23, (new Date()).getTime());

        TrackSrv.addTrack(t2);
    })

    .controller('TrackListCtrl', function ($scope, TrackSrv) {

        $scope.tracks = TrackSrv.getAllTracks();
    })

    .controller('TrackCtrl', function ($scope, $stateParams, TrackSrv, $compile, $ionicPlatform) {
        var id = parseInt($stateParams.trackId);
        $scope.track = TrackSrv.getTrackById(id);
        var points = $scope.track.getPoints();
        $scope.p1 = points[0];
        $scope.p2 = points[1];

        function initialize() {

            var mapOptions = {
                center: new google.maps.LatLng(points[0].getLat(), points[0].getLong()),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            var allLatLng = [];
            var markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < points.length; i++) {
                var newLatLng = new google.maps.LatLng(points[i].getLat(), points[i].getLong());
                var iconUrl = "../img/marker" + i + ".png";
                if (i > 9) {
                    iconUrl = "../img/marker" + i + ".png";
                } else if (i === points.length - 1 ) {
                    iconUrl = "../img/marker-end.png";
                } else {
                    iconUrl = "../img/marker" + (i) + ".png";
                }
                var marker = new google.maps.Marker({
                    position: newLatLng,
                    map: map,
                    title: "Point " + (i + 1) ,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        url: iconUrl
                    }
                });
                markers.push(marker);
                bounds.extend(newLatLng);

            }

            map.fitBounds(bounds);

            $scope.map = map;
        }
        $ionicPlatform.ready(initialize);

    });

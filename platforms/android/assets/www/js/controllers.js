angular.module('trackme.controllers', ['trackme.services'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, TrackSrv) {
        // Form data for the login modal
        $scope.loginData = {username: 'test', password: 'password'};

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

        // create some sample tracks
        var trackSanJose = TrackSrv.createTrack([], "San Jose");
        trackSanJose.addPoint(37.343, -122, 1417928400000)
            .addPoint(37.343, -122.102, 1417929000000)
            .addPoint(37.346, -122.132, 1417929600000)
            .addPoint(37.348, -122.18, 1417930200000)
            .addPoint(37.405, -122.34, 1417930800000);

        var trackOttawa = TrackSrv.createTrack([], "Ottawa Baseline");
                trackOttawa.addPoint(45.3733581,-75.7505996, 1417410000000)
                    .addPoint(45.3748052,-75.7507712, 1417410600000)
                    .addPoint(45.3758905,-75.7491405, 1417411200000)
                    .addPoint(45.3761919,-75.7483251,1417411800000)
                    .addPoint(45.3800052,-75.7442266,1417412400000)
                    .addPoint(45.384926,-75.739109,1417413000000)
                    .addPoint(45.3941311,-75.7306776, 1417413600000)
                    .addPoint(45.4018631,-75.7142376,1417414200000)
                    .addPoint(45.4034096,-75.7088725,1417414800000)
                    .addPoint(45.4038815,-75.7057541,1417415400000);

        var trackNepean = TrackSrv.createTrack([], "Nepean Meadowlands");
                        trackNepean.addPoint(45.3597877,-75.7444187,1416459600000)
                            .addPoint(45.3498316,-75.7338274,1416460200000)
                            .addPoint(45.3500399,-75.7330348,1416460800000)
                            .addPoint(45.3543827,-75.7287433,1416461400000)
                            .addPoint(45.3580618,-75.7239368,1416462000000)
                            .addPoint(45.3595997,-75.7208469,1416462600000)
                            .addPoint(45.360444,-75.7175853,1416463200000)
                            .addPoint(45.3612808,-75.7151713,1416463800000)
                            .addPoint(45.3619819,-75.7133045,1416464400000)
                            .addPoint(45.3625473,-75.7119098,1416465000000);

        TrackSrv.addTrack(trackOttawa);
        TrackSrv.addTrack(trackSanJose);
        TrackSrv.addTrack(trackNepean);

        TrackSrv.saveTracksToStorage();
        console.log(JSON.parse(localStorage.getItem("tracks")));
        TrackSrv.getTracksFromStorage();
    })

    .controller('TrackListCtrl', function ($scope, TrackSrv) {

        $scope.tracks = TrackSrv.getAllTracks();
    })

    .controller('TrackCtrl', function ($scope, $stateParams, TrackSrv, $compile, $ionicPlatform) {
        var id = parseInt($stateParams.trackId);
        $scope.track = TrackSrv.getTrackById(id);
        var points = $scope.track.getPoints();

        function initialize() {

            var mapOptions = {
                center: new google.maps.LatLng(points[0].getLat(), points[0].getLong()),
                zoom: 9,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            //var allLatLng = [];
            var markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < points.length; i++) {
                var newLatLng = new google.maps.LatLng(points[i].getLat(), points[i].getLong());
                var iconUrl = "img/marker" + i + ".png";
                if (i < 10) {
                    iconUrl = "img/marker" + (i) + ".png";
                } else if (i === points.length - 1 ) {
                    iconUrl = "img/marker-end.png";
                } else {
                    iconUrl = "img/marker.png";
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

    })
    .controller('RecordTrackCtrl', function ($scope, TrackSrv, $ionicPlatform, $state) {
        $scope.mapheight = window.innerHeight;
        $scope.mapstyle = "width:100%;height:" + ($scope.mapheight - 43) + "px";
        function showMap() {
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    renderMap(pos.coords.latitude, pos.coords.longitude);
                },
                function(error) {
                    alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
                }

            );

        }

        function renderMap(lat, long) {
            var newLatLng = new google.maps.LatLng(lat, long);
            var mapOptions = {
                center: newLatLng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("record-map"),
                mapOptions);

            var iconUrl = "img/marker0.png";

            var marker = new google.maps.Marker({
                position: newLatLng,
                map: map
//                icon: {
//                    url: iconUrl
//                }
            });

            $scope.map = map;
        }
        $ionicPlatform.ready(showMap);

//        TrackSrv.startRecord();

        $scope.startRecord = function() {
            TrackSrv.startRecord();
            $scope.isRecording = true;
        }

        $scope.stopRecord = function() {
            TrackSrv.stopRecord();
            TrackSrv.saveTracksToStorage();
            $scope.isRecording = false;
            $state.transitionTo('app.tracklist');
        }

        $scope.isRecording = false;
    });



angular.module('trackme.services', [])
.service('TrackSrv', function() {

        var tracks; //singleton of all saved tracks
        var trackid;

        var Track = function (points, description) {
            this.points = points;
            this.description = description;
            this.id = trackid++;
            this.pointid = 0;
        };

        Track.prototype = {

            getPoints: function() {
                return this.points;
            },

            getStartTime: function() {
                return new Date(this.points[0].getTime());
            },

            getEndTime: function() {
                return new Date(this.points[this.points.length - 1].getTime());
            },

            getDescription: function() {
                return this.description;
            },

            setDescription: function(description) {
                this.description = description;
            },

            getId: function() {
                return this.id;
            },

            // @return Distance in KM between the first point and last point
            getDistance: function() {
                var distance = 0;
                var allPoints = this.getPoints();
                for (var i = 0; i < this.numPoints() - 1; i++) {
                    var p1 = allPoints[i];
                    var p2 = allPoints[i + 1];
                    distance += p1.getDistanceFrom(p2);
                }
                return distance;
            },

            // @return Duration in minutes between the first point and last point
            getDuration: function() {
                var allPoints = this.getPoints();
                var p1 = allPoints[0], p2 = allPoints[allPoints.length - 1];
                return (p2.time - p1.time)/60000;
            },

            addPoint: function(lat, long, time) {
                this.points.push(new Point(lat, long, time, this.pointid++));
                return this;
            },

            numPoints: function() {
                return this.points.length;
            }

        };

        var Point = function(lat, long, time, id) {
            this.lat = lat;
            this.long = long;
            this.time = time;
            this.id = id;
        };

        Point.prototype = {
            getLat: function() {
                return this.lat;
            },

            getLong: function() {
                return this.long;
            },

            getTime: function() {
                return this.time;
            },

            getId: function() {
                return this.id;
            },

            getDistanceFrom: function(p2) {
                var diffLong = (this.getLong() - p2.getLong()) * Math.PI / 180;
                var diffLat = (this.getLat() - p2.getLat()) * Math.PI / 180;
                var a = Math.pow((Math.sin(diffLat / 2.0)), 2) + Math.cos(this.getLat() * Math.PI / 180) * Math.cos(p2.getLat() * Math.PI/180) * Math.pow((Math.sin(diffLong / 2)),  2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var distanceMeters = 6373 * c;
                return distanceMeters;
            }
        };

        this.createTrack = function(points, description) {
            return new Track(points, description, trackid);
        };

        this.getAllTracks = function() {
            return tracks;
        };

        this.initTracks = function() {
            tracks = [];
            trackid = 0;
        };

        this.addTrack = function(t) {
            tracks.push(t);
        };

        this.removeTrack = function(t, id) {
            //
        };

        this.getTrackById = function(id) {
            for(var i = 0; i < tracks.length; i++) {
                if (tracks[i].getId() === id) return tracks[i];
            }
        };




});
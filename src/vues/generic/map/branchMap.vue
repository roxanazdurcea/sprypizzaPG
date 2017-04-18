<template>
    <div style="margin:0; padding:0;">
        <div id="map-branch-id" style="height:32vh; margin-bottom: 4%;"></div>
    </div>
</template>

<script>
    export default {
        name: 'branchMap',
        data: function() {
            return {
                latitude: '',
                longitude: '',
                info: '',
                geocoder: '',
                center: '',
                map: '',
                markers: []
            }
        },
        methods: {
            Initialize: function() {
                this.geocoder = new google.maps.Geocoder();

                this.center = new google.maps.LatLng(this.latitude, this.longitude);

                this.map = new google.maps.Map(document.getElementById('map-branch-id'), {
                    center: this.center,
                    zoom: 14,
                    draggable: true,
                    scrollwheel: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    disableDoubleClickZoom: false
                });
                //Markers
                if (this.markers) {
                    this.SetMarkers();
                }
                //Info
                if (this.info) {
                    var info = new google.maps.InfoWindow();
                    info.setContent(this.info);
                    info.setPosition(this.center);
                    info.open(this.map);
                }
            },
            SetMarkers: function() {

                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < this.markers.length; i++) {

                    var pos = new google.maps.LatLng(this.markers[i]['lati'], this.markers[i]['longi']);

                    bounds.extend(pos);

                    this.marker = new google.maps.Marker({
                        position: pos,
                        map: this.map,
                        icon: this.markers[i]['icon'],
                        title: this.markers[i]['title']
                    });
                    this.marker.setMap(this.map);
                }

                if (this.markers.length > 1) {
                    this.map.fitBounds(bounds);
                }
            }
        },
        mounted: function() {

            Events.$on('branchMapInfo-ev', function(data) {
                this.latitude = data.latitude;
                this.longitude = data.longitude;
                this.info = data.info;
                this.Initialize();
            }.bind(this));
        }
    }
</script>

<style scoped>
    #map-id {
        width: 100%;
        height: 250px;
        background-color: grey;
        margin: 0 auto;
        border: 1px solid #ccc;
    }
</style>
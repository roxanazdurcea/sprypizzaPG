<template>
    <div>
        <div v-show="search">
            <input style="z-index:0; width:100%;" placeholder="Search for your address directly on the map" id="map-search" type="text" v-on:keyup.13="Search">
        </div>
        <div style="margin:0; padding:0;">
            <div id="map-id"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['search', 'zoom', 'event'],
        name: 'Gmap',
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

                this.map = new google.maps.Map(document.getElementById('map-id'), {
                    center: this.center,
                    zoom: this.zoom,
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
                //Resize event
                google.maps.event.trigger(this.map, 'resize');
                //Mouse event
                if (this.event === true) {
                    google.maps.event.addListener(this.map, "click", function (event) {

                        this.latitude = event.latLng.lat();
                        this.longitude = event.latLng.lng();

                        var latlng = {lat: this.latitude, lng: this.longitude};

                        this.geocoder.geocode({'location': latlng}, function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    //Initialize map
                                    this.info = results[0].formatted_address;
                                    this.Initialize();
                                    //Prepare address components
                                    var address_components = {
                                        street_number: '',
                                        route: '',
                                        locality: '',
                                        postal_code: '',
                                        administrative_area_level_2: '',
                                        administrative_area_level_1: '',
                                        country: ''
                                    };
                                    results[0].address_components.map(function (component, index) {
                                        _.find(_.values(component.types), function (types) {
                                            switch (types) {
                                                case 'street_number':
                                                    address_components.street_number = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'route':
                                                    address_components.route = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'locality':
                                                    address_components.locality = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'postal_code':
                                                    address_components.postal_code = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'administrative_area_level_2':
                                                    address_components.administrative_area_level_2 = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'administrative_area_level_1':
                                                    address_components.administrative_area_level_1 = results[0].address_components[index]['long_name'];
                                                    break;
                                                case 'country':
                                                    address_components.country = results[0].address_components[index]['long_name'];
                                                    break;

                                            }
                                        });
                                    });
                                    Events.$emit('setAddress-ev', {
                                        address_components: address_components,
                                        formatted_address: results[0].formatted_address,
                                        latitude: this.latitude,
                                        longitude: this.longitude
                                    });
                                }
                            }
                        }.bind(this));
                    }.bind(this));
                }
            },
            Search: function() {
                var address = document.getElementById('map-search').value;
                this.geocoder.geocode({'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        this.map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: this.map,
                            position: results[0].geometry.location
                        });
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                }.bind(this));
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
            },
        },
        mounted: function() {

            Events.$on('mapInfo-ev', function(data) {
                this.latitude = data.latitude;
                this.longitude = data.longitude;
                this.info = data.info;
                this.Initialize();
            }.bind(this));

            Events.$on('mapMarkers-ev', function(markers) {
                this.markers = markers;
                this.Initialize();
            }.bind(this));
        }
    }
</script>

<style>
    #map-id {
        width: 100%;
        height: 250px;
        background-color: grey;
        margin: 0 auto;
        border: 1px solid #ccc;
    }
</style>
import statusBar from "../../vues/tracking/status.vue";
import Gmap from "../../vues/generic/map/map.vue";
import driverDetails from "../../vues/tracking/driver.vue";

new Vue({
    el: "#tracking-container",
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    data: {
        order: {
            order_id: '',
            address: '',
        },
        employee: {
            name: '',
            mobile: ''
        },
        branch: {
            name: ''
        }
    },
    methods: {
        Get: function() {
            this.$http.post('/orders/track', {
                order_id: document.order_id
            }).then(function (response) {
                var order = response.body.response.order;
                var branch = response.body.response.branch;
                var employee = response.body.response.employee;
                console.log(order);
                console.log(branch);
                console.log(employee);
                //Order
                Events.$emit('status-ev', order.status);
                this.order.address = order.full_address;
                this.order.order_id = order.id;
                //Branch
                this.branch.name = branch.name;
                //Init Map
                var markers = [
                    {lati: order.latitude, longi: order.longitude, icon: "/assets/images/map_marker.png",title: 'Delivery Address'},
                    {lati: branch.latitude, longi: branch.longitude, icon: "/assets/images/branch_icon.png", title: 'Branch Location'}
                ];
                if (employee) {
                    markers.push({lati: employee.latitude_c, longi: employee.longitude_c, icon: "/assets/images/driver_marker.png", title: 'Driver Location'});
                }
                Events.$emit('mapMarkers-ev', markers);
                //Employee
                this.employee.name = employee.title + ' ' + employee.first_name + ' ' + employee.last_name;
                this.employee.mobile = employee.mobile;
            }.bind(this));
        }
    },
    components: {
        statusBar,
        Gmap,
        driverDetails
    },
    mounted: function() {
        this.Get();
    }
});

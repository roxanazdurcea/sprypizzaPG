<template>
    <f7-page>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="f7-icons size-22 left-side-icon">left</i>
                        <!-- Back link text rendered only for iOS theme -->
                        <span>Back</span>
                    </a>
                </div>
                <div class="center">Track your order</div>
                <login-icon></login-icon>
            </div>
        </div>
        <f7-block inner>
            <section style="padding: 10px;">
                <div>
                    <div id="tracking-container">

                        <h1>Track your<span style="color: #999;">&nbsp;&nbsp;Order no {{ order.order_id }}</span></h1>
                        <h2 style="margin-top: 0px;">Start drolling</h2>
                        <!--<br><br>-->
                        <!--<div class="label label-success" style="width: 100% !important; border-radius: 0;"><p style="margin-top: 0px;"><b>Order Status</b></p></div>-->
                        <div style="padding:20px; height: 190px;">
                            <status-bar></status-bar>
                        </div>
                        <div style="border: 4px solid #ccc; margin-bottom: 15px;">
                            <Gmap :search="false" :height="300" :zoom="14" :events="false"></Gmap>
                        </div>
                        <driver-details :address="order.address" :name="employee.name" :mobile="employee.mobile" :branch="branch.name"></driver-details>
                    </div>
                </div>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import statusBar from "./status.vue";
    import driverDetails from "./driver.vue";
    import Gmap from "../generic/map/map.vue";
    import loginIcon from "../login/pageIcon.vue";
    export default {
        name: 'pageTrack',
        data() {
            return {
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
            }
        },
        methods: {
            Get() {

                window.db.spryDB.find({}, (err, doc) => {
                    _.map(doc, (obj, idx) => {
                        if (_.has(obj, 'order_id')) {
                            this.order.order_id = obj.order_id;
                        }
                    });
                });

                setTimeout(() => {
                    axios.post('https://sprypizza.com/api/orders/track', {
                        order_id: this.order.order_id
                    }).then(function(response) {

                        var order = response.data.response.order;
                        var branch = response.data.response.branch;
                        var employee = response.data.response.employee;

                        //Order
                        Events.$emit('status-ev', order.status);
                        this.order.address = order.full_address;
                        this.order.order_id = order.id;
                        //Branch
                        this.branch.name = branch.name;
                        //Init Map
                        var markers = [
                            {
                                lati: order.latitude,
                                longi: order.longitude,
                                icon: "img/pins/map_marker.png",
                                title: 'Delivery Address'
                            },
                            {
                                lati: branch.latitude,
                                longi: branch.longitude,
                                icon: "img/pins/branch_icon.png",
                                title: 'Branch Location'
                            }
                        ];
                        if (employee) {
                            markers.push({
                                lati: employee.latitude_c,
                                longi: employee.longitude_c,
                                icon: "img/pins/driver_marker.png",
                                title: 'Driver Location'
                            });
                        }
                        Events.$emit('mapMarkers-ev', markers);
                        //Employee
                        this.employee.name = employee.title + ' ' + employee.first_name + ' ' + employee.last_name;
                        this.employee.mobile = employee.mobile;
                    }.bind(this));
                }, 500);
            }
        },
        components: {
            statusBar,
            Gmap,
            driverDetails,
            loginIcon
        },
        mounted: function() {
            this.Get();
        }
    }
</script>
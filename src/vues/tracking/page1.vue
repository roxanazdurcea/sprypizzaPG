<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>Track your order</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
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


        <!-- Bottom Tabbar-->
        <div class="toolbar tabbar tabbar-labels toolbar-bottom">
            <div class="toolbar-inner bottom-padding">
                <a href="/" class="item-link"><i class="f7-icons">home</i><span class="tabbar-label">Home</span></a>
                <a href="/menu/" class="item-link"><i class="f7-icons">favorites</i><span class="tabbar-label">Menu</span></a>
                <a href="/cart/" class="item-link"><i class="f7-icons">bag</i><span class="tabbar-label">Cart</span><item-count></item-count></a>
                <a href="/track-order/" class="item-link"><i class="f7-icons">navigation_fill</i><span class="tabbar-label">Track</span></a>
            </div>
        </div>

    </f7-page>
</template>

<script>
    import statusBar from "./status.vue";
    import driverDetails from "./driver.vue";
    import Gmap from "../generic/map/map.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
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
            loginIcon,
            itemCount
        },
        mounted: function() {
            this.Get();
        }
    }
</script>
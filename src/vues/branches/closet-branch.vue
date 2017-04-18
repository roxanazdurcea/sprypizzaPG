<template>
    <div>
        <div class="closestBranch" style="padding: 3%;">

            <div style="padding: 3%;"><h5><b><em>Find our closest location</em></b></h5></div>
            <hr>
            <div style="background-color: #f4f4f4; padding: 3%;">
                <div class="row" style="align-items: center;">
                    <div class="col-33 padleft0">
                        <h5 style="color:red;"><em><span>{{branch.name}}</span></em></h5>
                    </div>
                    <div class="col-66 padleft0">
                        <p style="text-align: right;"><span><i class="f7-icons size-15">navigation_fill</i></span>&nbsp;&nbsp;{{branch.distance}}&nbsp;Km</p>
                    </div>
                </div>

                <div><i style="float: left; width:8%;" class="f7-icons size-15">home</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.street}}, {{branch.city}}, {{branch.country}}</p></div>
                <br>
                <div><i style="float: left; width:8%;" class="f7-icons size-15">email</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.email_address}}</p></div>
                <br>
                <div><i style="float: left; width:8%;" class="f7-icons size-15">phone</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.number}}</p></div>
                <div style="clear: both;"></div>
                <hr>

                <div>
                    <div>
                        <ul>
                            <li v-for="sch in branch.schedule" v-if="sch.day === today">
                                <p v-if="sch.status === '1'">
                                    <span class="schDay">{{ sch.day }}'s Schedule</span><span style="width: 50%; float: right; text-align: right; color: #000;"><span style="color: #D12027;">{{ sch.time_start }}</span> &#8594; <span style="color: #D12027;">{{ sch.time_end }}</span></span>
                                </p>
                                <p v-if="sch.status === '0'">
                                    <span class="schDay">{{ sch.day }}</span><span style="width: 50%; float: right; text-align: right; color: #000;">Closed</span>
                                </p>
                            </li>
                            <li style="clear: both"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import moment from 'moment';

    export default {
        name: 'closestBranch',
        data: function () {
            return {
                branch: []
            }
        },
        computed: {
            today: function () {
                return moment().format('dddd');
            }
        },
        methods: {
            Get: function () {
                this.$http.post('https://sprypizza.com/api/branches/get/closest', {
                    latitude: Cookies.Get('latitude') || '44.4267674',
                    longitude: Cookies.Get('longitude') || '26.1025384',
                }).then(function (data) {
                    this.branch = data.body.response;
                });
            }
        },
        mounted: function () {
            this.Get();
        }
    }

</script>

<style scoped>

    .closestBranch {
        text-align: left;
    }

    .padleft0 {
        padding-left: 0;
    }

    .closestBranch .schedStyle i {
        float: left;
        width: 3%;
    }

    .closestBranch .schedStyle p {
        float: left;
        width: 95%;
    }

    .closestBranch .schDay {
        width: 50%;
        float: left;
        font-weight: 600;
    }

    hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    a, a:hover, a:focus {
        text-decoration: none;
        font-size: 2rem;
        color: #000;
        display: block;
        transition: 0.3s;
    }

    p {
        font-size: 0.8rem;
        color: #818181;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    h5 {
        color: #F9A153;
        font-size: 1rem;
    }

    h5 span {
        font-size: 1rem;
    }

    ul {
        padding-left: 0px;
    }

    ul li {
        list-style: none;
        background-color: #f4f4f4;
        margin-bottom: 10px;
    }

</style>
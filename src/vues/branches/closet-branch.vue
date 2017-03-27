<template>

    <div class="closestBranch" style="padding: 3%;">
        <div class="row">
            <div class="col-xs-5 padleft0">
                <h5 style="color: #D12027;"><em><span>{{branch.name}}</span></em></h5>
            </div>
            <div class="col-xs-7 padleft0">
                <p style="text-align: right;"><span><i class="fa fa-location-arrow"></i></span>&nbsp;&nbsp;{{branch.distance}}&nbsp;Km</p>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-1 padleft0"><i class="fa fa-home fa-lg"></i></div>
            <div class="col-xs-11 padleft0"><p>{{branch.street}}, {{branch.city}}, {{branch.country}}</p></div>
        </div>
        <div class="row">
            <div class="col-xs-1 padleft0"><i class="fa fa-envelope fa-lg"></i></div>
            <div class="col-xs-11 padleft0"><p>{{branch.email_address}}</p></div>
        </div>
        <div class="row">
            <div class="col-xs-1 padleft0"><i class="fa fa-phone fa-lg"></i></div>
            <div class="col-xs-11 padleft0"><p>{{branch.number}}</p></div>
        </div>
        <hr>

        <div>
            <div style="height: 50px;">
                <ul>
                    <li v-for="sch in branch.schedule" v-if="sch.day === today">
                        <p v-if="sch.status === '1'">
                            <span class="schDay">{{ sch.day }}'s Schedule</span><span style="width: 50%; float: right; text-align: right; color: #000;"><span style="color: #D12027;">{{ sch.time_start }}</span> &#8594; <span style="color: #D12027;">{{ sch.time_end }}</span></span>
                        </p>
                        <p v-if="sch.status === '0'">
                            <span class="schDay">{{ sch.day }}</span><span style="width: 50%; float: right; text-align: right; color: #000;">Closed</span>
                        </p>
                    </li>
                </ul>
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
                this.$http.post('/branches/get/closest', {
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

<style>

    .closestBranch {
        text-align: left;
    }
    .closestBranch h5 {
        color: #fff;
        margin-top: 0px !important;
    }

    .closestBranch p {
        font-size: 1.2rem;
        color: #000;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .closestBranch ul {
        padding-left: 0px;
    }

    .closestBranch ul li {
        list-style: none;
        background-color: #fff;
        margin-bottom: 10px;
    }

    .padleft0 {
        padding-left: 0;
    }

    .closestBranch .schedStyle {
        height: 30px;
    }

    .closestBranch .schedStyle i {
        float: left;
        width: 3%;
    }

    .closestBranch .schedStyle p {
        float: left;
        width: 95%;
    }

    .closestBranch .fa-envelope {
        font-size: 1.2rem;
        line-height: 2rem;
        color: #D12027;
    }
    .closestBranch .fa-home {
        font-size: 1.4rem;
        line-height: 2rem;
        color: #D12027;
    }
    .closestBranch .fa-phone {
        font-size: 1.4rem;
        line-height: 2rem;
        color: #D12027;
    }
    .closestBranch hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .closestBranch a {
        text-decoration: none;
        font-size: 2rem;
        color: #000;
        display: block;
        transition: 0.3s;
    }

    .closestBranch a, .closestBranch a:hover, .closestBranch a:focus {
        color: #000;
        font-size: 2rem;
    }

    .closestBranch .fa {
        color: #000;
    }
    .closestBranch .schDay {
        width: 50%;

        float: left;
        font-weight: 600;
    }
</style>
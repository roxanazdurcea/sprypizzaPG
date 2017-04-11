<template>
    <div>
        <div id="myNav" class="overlay" v-show="isVisible">
            <div style="padding: 3%;">
                <div class="vertical-align overlay-header">
                    <div class="col-xs-10 col-sm-11"><h5><b><em>Find our closest location</em></b></h5></div>
                    <div class="col-xs-2 col-sm-1">
                        <button type="button" class="closebtn" v-on:click="HideAside">
                            <i class="fa fa-close"></i>
                        </button>
                    </div>
                </div>
                <div class="overlay-content coolScroll">
                    <ul style="margin-bottom: 0px;">
                        <li v-for="(branch, idx) in branches">
                            <div style="padding: 3%;">
                                <div class="row">
                                    <div class="col-xs-5 col-sm-5 padleft0">
                                        <h5 style="color:red;"><em><span>{{branch.name}}</span></em></h5>
                                    </div>
                                    <div class="col-xs-3 col-sm-3 padleft0">
                                        <p><span><i class="fa fa-location-arrow"></i></span>&nbsp;&nbsp;{{branch.distance}}&nbsp;Km
                                        </p>
                                    </div>
                                    <div class="col-xs-4 col-sm-4 padleft0">
                                        <p style="text-align: right; cursor:pointer;" v-on:click="ShowBranch(branch)"><span><i
                                                class="fa fa-map-marker"></i></span>&nbsp;Show on Map</p>
                                    </div>
                                </div>

                                <div class="row vertical-align">
                                    <div class="col-xs-1 padleft0"><i class="fa fa-home "></i></div>
                                    <div class="col-xs-11 padleft0"><p>{{branch.street}}, {{branch.city}},
                                        {{branch.country}}</p></div>
                                </div>
                                <div class="row vertical-align">
                                    <div class="col-xs-1 padleft0"><i class="fa fa-envelope "></i></div>
                                    <div class="col-xs-11 padleft0"><p>{{branch.email_address}}</p></div>
                                </div>
                                <div class="row vertical-align">
                                    <div class="col-xs-1 padleft0"><i class="fa fa-phone "></i></div>
                                    <div class="col-xs-11 padleft0"><p>{{branch.number}}</p></div>
                                </div>
                                <hr>
                                <div class="schedStyle"><i style="color: red;" class="fa" aria-hidden="true"
                                                           v-bind:class="[branch.showSchedule ? 'fa-caret-down' : 'fa-caret-right']"></i>
                                    <p style="color: red;" v-on:click="ShowSchedule(idx)"><em>Branch Schedule</em></p>
                                </div>
                                <div v-show="branch.showSchedule" style="height: 170px;">
                                    <ul>
                                        <li v-for="sch in branch.schedule">
                                            <p><span class="schDay">{{ sch.day }}</span>
                                                <span style="width: 70%; float: right; text-align: right; color: #000;" v-show="sch.status === '1'">From  <span style="color: red;">{{ sch.time_start }}</span>  to  <span style="color: red;">{{ sch.time_end }}</span></span>
                                                <span style="width: 70%; float: right; text-align: right; color: #000;" v-show="sch.status === '0'">Closed</span>
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="overlay-map">
                    <Gmap :zoom="14" :search="false" :height="mapHeight" :event="false"></Gmap>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


    import Gmap from "../generic/map/map.vue";

    export default {
        name: 'branches',
        data: function () {
            return {
                branches: [],
                isVisible: false,
                mapHeight: '32vh'
            }
        },
        mounted: function () {
            this.List();
            Events.$on('showAside-ev', function () {
                this.ShowAside();
            }.bind(this));
        },
        methods: {
            List: function () {
                this.$http.post('/branches', {
                    latitude: Cookies.Get('latitude') || '44.4267674',
                    longitude: Cookies.Get('longitude') || '26.1025384',
                }).then(function (data) {
                    var branches = data.body.response;
                    branches.map(function (branch) {
                        branch.showSchedule = false;
                        return branch;
                    });
                    this.branches = branches;
                });
            },
            ShowBranch: function (branch) {
                var data = {'latitude': branch.latitude, 'longitude': branch.longitude, 'info': branch.street};
                Events.$emit('mapInfo-ev', data);
            },
            ShowAside: function () {
                this.isVisible = true;
                setTimeout(function () {
                    this.ShowBranch(this.branches[0]);
                }.bind(this), 500);
            },
            HideAside: function () {
                this.isVisible = false;
            },
            ShowSchedule: function (idx) {
                this.branches[idx].showSchedule = !this.branches[idx].showSchedule;
            }
        },
        components: {
            Gmap
        }
    }
</script>

<style scoped>

    .overlay {
        height: 100%;
        width: 25%;
        position: fixed;
        z-index: 100000;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.9);
        overflow: hidden;
        transition: 0.5s;
    }

    .overlay .fa-close {
        color: #fff !important;
        font-size: 2rem !important;
    }

    .overlay-header {
        height: 5vh;
    }

    .schDay {
        width: 30%;
        float: left;
        color: #D12027;
        font-weight: 600;
    }

    .overlay-header h5 {
        color: #fff;
        margin-top: 0px !important;
        margin-bottom: 0px !important;
    }

    .overlay-content {
        max-height: 60vh;
        margin-bottom: 10px;
    }

    .overlay-content h5 {
        margin-top: 0px;
    }

    .overlay-content p {
        font-size: 1.2rem;
        color: #818181;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .overlay-content ul {
        padding-left: 0px;
    }

    .overlay-content ul li {
        list-style: none;
        background-color: #fff;
        margin-bottom: 10px;
    }

    .padleft0 {
        padding-left: 0;
    }

    .schedStyle {
        height: 30px;
        cursor: pointer;
    }

    .schedStyle i {
        float: left;
        width: 3%;
    }

    .schedStyle p {
        float: left;
        width: 95%;
    }

    .overlay-content .fa-envelope {
        font-size: 1.2rem;
        line-height: 2rem;
        color: #D12027;
    }
    .overlay-content .fa-home {
        font-size: 1.4rem;
        line-height: 2rem;
        color: #D12027;
    }
    .overlay-content .fa-phone {
        font-size: 1.4rem;
        line-height: 2rem;
        color: #D12027;
    }

    .overlay hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .overlay a, .overlay a:hover, .overlay a:focus {
        text-decoration: none;
        font-size: 2rem;
        color: #818181;
        display: block;
    }

    .overlay .closebtn {
        font-size: 2rem;
        background-color: transparent;
        color: #fff !important;
        border: 0px;
    }

    .coolScroll {
        overflow-y: auto;
    }

    /* Let's get this party started */
    .coolScroll::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    /* Track */
    .coolScroll::-webkit-scrollbar-track {
        background-color: rgb(231, 231, 231);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    /* Handle */
    .coolScroll::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        height: 20px;
        background-color: #777;;
    }

    @media (max-width: 425px) {
        .overlay {
            width: 100%;
        }
    }

    @media only screen and (min-width: 426px) and (max-width: 768px) {
        .overlay {
            width: 60%;
        }
    }

    @media only screen and (min-width: 769px) and (max-width: 1280px) {
        .overlay {
            width: 50%;
        }
    }

    @media only screen and (min-width: 1281px) and (max-width: 1440px) {
        .overlay {
            width: 40%;
        }
    }

</style>
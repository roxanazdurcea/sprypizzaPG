<template>
    <div>
        <div id="myNav" style="padding: 3%;">

            <div style="padding: 3%;"><h5><b><em>Find all our locations</em></b></h5></div>
            <hr>
            <ul style="margin-bottom: 0px; margin-top: 0px;">
                <li v-for="(branch, idx) in branches">
                    <div style="padding: 3%;">
                        <div class="row" style="align-items: center;">
                            <div class="col-33 padleft0">
                                <h5 style="color:red;"><em><span>{{branch.name}}</span></em></h5>
                            </div>
                            <div class="col-33 padleft0">
                                <p><span><i class="f7-icons size-15">navigation_fill</i></span>&nbsp;&nbsp;{{branch.distance}}&nbsp;Km</p>
                            </div>
                            <div class="col-33 padleft0">
                                <p style="text-align: right; cursor:pointer;" v-on:click="ShowBranch(branch)"><span><i class="f7-icons size-15">compass</i></span>&nbsp;Show on Map</p>
                            </div>
                        </div>


                        <div><i style="float: left; width:8%;" class="f7-icons size-15">home</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.street}}, {{branch.city}}, {{branch.country}}</p></div>
                        <br>
                        <div><i style="float: left; width:8%;" class="f7-icons size-15">email</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.email_address}}</p></div>
                        <br>
                        <div><i style="float: left; width:8%;" class="f7-icons size-15">phone</i><p style="float: left; margin-left: 1%; width:90%;">{{branch.number}}</p></div>
                        <div style="clear: both;"></div>
                        <hr>
                        <div class="schedStyle"><i style="color: red;" class="fa" aria-hidden="true" v-bind:class="[branch.showSchedule ? 'fa-caret-down' : 'fa-caret-right']"></i>
                            <p style="color: red;" v-on:click="ShowSchedule(idx)"><em>Branch Schedule</em></p>
                        </div>
                        <div v-show="branch.showSchedule">
                            <ul>
                                <li v-for="sch in branch.schedule">
                                    <p><span class="schDay">{{ sch.day }}</span>
                                        <span style="width: 70%; float: right; text-align: right;" v-show="sch.status === '1'">From  <span style="color: red;">{{ sch.time_start }}</span>  to  <span style="color: red;">{{ sch.time_end }}</span></span>
                                        <span style="width: 70%; float: right; text-align: right;" v-show="sch.status === '0'">Closed</span>
                                    </p>
                                </li>
                                <li style="clear: both;"></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li style="clear: both;"></li>
            </ul>

            <div>
                <branch-map></branch-map>
            </div>

        </div>
    </div>
</template>

<script>


    import branchMap from "../generic/map/branchMap.vue";

    export default {
        name: 'branches',
        data: function () {
            return {
                branches: []
            }
        },
        mounted: function () {
            this.List();
        },
        methods: {
            List: function () {
                this.$http.post('https://sprypizza.com/api/branches', {
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
                Events.$emit('branchMapInfo-ev', data);
            },
            ShowSchedule: function (idx) {
                this.branches[idx].showSchedule = !this.branches[idx].showSchedule;
            }
        },
        components: {
            branchMap
        }
    }
</script>

<style scoped>


    ul {
        padding-left: 0px;
    }

    ul li {
        list-style: none;
        background-color: #f4f4f4;
        margin-bottom: 10px;
    }

    .schDay {
        width: 30%;
        float: left;
    }

    p {
        font-size: 0.8rem;
        color: #818181;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    h5{
        color: #F9A153;
        font-size: 1rem;
    }

    h5 span {
        font-size: 1rem;
    }

    .padleft0 {
        padding-left: 0;
    }

    .schedStyle {
        height: 20px;
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

    hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    a, a:hover, a:focus {
        text-decoration: none;
        font-size: 2rem;
        color: #818181;
        display: block;
    }

</style>
<template>
    <div class="menu-listing">

        <div class="swiper-container swiper-3">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(group, index) in groups" v-on:click="ListItems(group.id)"><span>{{ group.name }}</span></div>
            </div>
            <div class="swiper-pagination"></div>
        </div>

        <!--<ul>-->
            <!--<li v-for="(group, index) in groups"><a v-on:click="ListItems(group.id)" role="tab"-->
                                                    <!--data-toggle="tab">{{ group.name }}</a></li>-->
        <!--</ul>-->
    </div>
</template>

<script>

    import {mapState} from 'vuex';

    export default {
        name: 'groupscontainer',
        data: function () {
            return {
                groups: []
            }
        },
        methods: {
            Read_groups: function () {
                axios({
                    method: 'POST',
                    url: 'https://sprypizza.com/api/items-groups',
                    data: {

                    },
                    responseType: 'json'
                }).then(data => {
                    var groupsresponse = _.toArray(data.data.response);
                    this.groups = groupsresponse;
                });
            },
            ListItems: function (group_id) {
                Store.commit('setGroupId', group_id);
                Events.$emit("listitemesvent");
            }
        },
        mounted: function () {
            this.Read_groups();

            // 3 Slides Per View, 10px Between
//            var mySwiper3 = myApp.swiper('.swiper-3', {
//                pagination: '.swiper-pagination',
//                speed: 400,
//                autoplay: 2000,
//                spaceBetween: 10,
//                slidesPerView: 3
//            });
        }
    }

</script>

<style scoped>
    .swiper-slide {
        padding: 3px;
    }
    .menu-listing .nav-tabs > li.active > a,
    .menu-listing .nav-tabs > li > a:hover {
        border: none;
        color: #F9A153 !important;
        background: #f4f4f4;
        cursor: pointer;
        border: 0px;
    }

    a, p {
        font-family: "Open Sans", sans-serif;
        font-size: 1.6rem;
        line-height: 2.2rem;
        font-weight: 400;
    }

</style>
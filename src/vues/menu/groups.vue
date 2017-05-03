<template>
    <div class="menu-listing">
        <div style="display: flex; flex-direction: row;">
            <div v-for="(group, index) in groups" v-on:click="ListItems(group.id)" style="width: 32%; text-align: center;">
                <span>{{ group.name }}</span></div>
        </div>
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
                    data: {},
                    responseType: 'json'
                }).then(function (data) {
                    var groupsresponse = _.toArray(data.data.response);
                    this.groups = groupsresponse;
                }.bind(this));
            },
            ListItems: function (group_id) {
                Store.commit('setGroupId', group_id);
                Events.$emit("listitemesvent");
            }
        },
        mounted: function () {
            this.Read_groups();
        }
    }

</script>

<style scoped>

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
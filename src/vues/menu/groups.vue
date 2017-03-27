<template>
    <div class="menu-listing">
        <ul class="nav nav-tabs" role="tablist">
            <li v-for="(group, index) in groups"><a v-on:click="ListItems(group.id)" role="tab"
                    data-toggle="tab">{{ group.name }}</a></li>
        </ul>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'groupscontainer',
        data: function() {
            return {
                groups: []
            }
        },
        methods: {
            Read_groups: function() {
                this.$http.post('https://sprypizza.com/api/items-groups', {}).then(function(data) {
                    var groupsresponse = _.toArray(data.body.response);
                    this.groups = groupsresponse;
                }.bind(this));
            },
            ListItems: function(group_id) {
                Store.commit('setGroupId', group_id);
                Events.$emit("listitemesvent");
            }
        },
        mounted: function() {
            this.Read_groups();
        }
    }

</script>

<style>

    .menu-listing .nav-tabs > li.active > a,
    .menu-listing .nav-tabs > li > a:hover {
        border: none;
        color: #F9A153 !important;
        background: #f4f4f4;
        cursor: pointer;
        border: 0px;
    }
    a, p {
        font-family: "Open Sans",sans-serif;
        font-size: 1.6rem;
        line-height: 2.2rem;
        font-weight: 400;
    }
    .nav-tabs {
        border-bottom: 2px solid #ddd;
    }
</style>
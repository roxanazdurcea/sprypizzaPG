<template>
    <ul class="nav nav-tabs">
        <li v-for="(tab, idx) in tabs" v-bind:class="{ active: tab.active}" v-on:click="Activate(idx)">
            <a>{{ tab.title }}</a></li>
    </ul>
</template>

<script>
    export default {
        name: "navTabs",
        props: ['tabs'],
        methods: {
            Activate: function (idx) {
                this.tabs.forEach(function (tab, index) {
                    if (index === idx) {
                        this.tabs[index]['active'] = true;
                        document.getElementById(this.tabs[index]['href']).style.display = 'none';
                    } else {
                        this.tabs[index]['active'] = false;
                        document.getElementById(this.tabs[index]['href']).style.display = 'block';
                    }

                }.bind(this));
            }
        }
    }
</script>
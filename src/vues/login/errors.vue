<template>
    <div>
        <div class="loginError" v-if="pin">
            <p style='font-size:11px;'>
                <i class='fa fa-check' style='color:green;'></i>
                <span style='margin-left:10px;'>{{ pin }}</span>
            </p>
        </div>
        <div class="loginError" v-if="error">
            <p style='font-size:11px;'>
                <i class='fa fa-exclamation-circle' style='color:red;'></i>
                <span style='color: darkred; margin-left:10px;'>{{ error }}</span>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loginErrors',
        props: ['pin','error']
    }
</script>

<style>
    .loginError {
        color: darkred;
        font-size:11px !important;
        margin-top:15px;
    }
</style>
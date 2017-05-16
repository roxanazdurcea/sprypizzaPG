<template>
    <div>
        <div class="loginError" v-if="pin">
            <p style='font-size:11px;'>
                <i class="f7-icons size-15" style='color:green;'>check_round_fill</i>
                <span style='margin-left:5px;'>{{ pin }}</span>
            </p>
        </div>
        <div class="loginError" v-if="error">
            <p style='font-size:11px;'>
                <i class="f7-icons size-15" style='color:red;'>info_fill</i>
                <span style='color: darkred; margin-left:5px;'>{{ error }}</span>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'loginErrors',
        props: ['pin', 'error']
    }
</script>

<style>
    .loginError {
        color: darkred;
        font-size: 11px !important;
        margin-top: 5px;
    }
</style>
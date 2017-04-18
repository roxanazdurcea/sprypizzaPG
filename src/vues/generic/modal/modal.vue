<template>
    <transition name="modal" v-if="showModal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header"><h1>{{ modalTitle }}</h1></div>
                    <div class="modal-body"><p style="color: #F9A153;" v-html="modalMessage"></p></div>
                    <br />
                    <div class="modal-footer">{{ modalFooter }}
                        <button class="button-yellow center-block" @click="hideModal()">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'modalAlert',
        data: function() {
            return {
                showModal: false,
                modalTitle: '',
                modalMessage: '',
                modalFooter: ''
            }
        },
        methods: {
            hideModal: function() {
                this.showModal = false;
            }
        },
        mounted: function() {
            Events.$on('modalPopup-ev', function(modalData) {
                this.showModal = modalData.showModal;
                this.modalTitle = modalData.modalTitle;
                this.modalMessage = modalData.modalMessage;
            }.bind(this));
        }
    }
</script>

<style lang="less" scoped>

    /*----- vue modal component -----*/
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        margin: 0px auto;
        padding: 10% 30px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;

        @media (max-width: 768px) {
            width: 90%;
        }
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        margin: 20px 0;
    }

    .modal-footer {
        button {
            width:30%;
            @media (max-width: 768px) {
                font-size: 1.2rem;
            }
        }
    }

</style>
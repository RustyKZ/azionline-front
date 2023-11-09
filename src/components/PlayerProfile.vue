<script>
import axios from 'axios';

import { tokenTransfer } from './token.js'

export default {
    name: 'PlayerProfile',
    data() {
        return {
            userInfo: {},
            baseUrl: this.$root.serverUrl,
            userId: null,
            thisUserID: null,
            user: { user_id: '' },
            userNewInfo: {
                nickname: "", // Замените на ваше начальное значение
                // Другие данные пользователя            
            },

            newName: "",
            editing: false,
            refilling: false,
            goldValue: 0,
        };
    },
    created() {
        this.userId = this.$route.params.user_id;
        this.thisUserID = Number(localStorage.getItem('user_id'));
        this.user.user_id = this.thisUserID = Number(localStorage.getItem('user_id'));
        // console.log(this.user)
    },
    methods: {
        startEditing() {
            this.newName = this.userNewInfo.nickname;
            this.editing = true;
        },        
        cancelEditing() {
            this.editing = false;
        },
        startRefill() {            
            this.refilling = true;
        },        
        cancelRefill() {
            this.refilling = false;
        },
        submitChange() {
            // Отправьте данные на сервер и обновите userInfo
            const dataToSend = {
                user_id: this.userInfo.id,
                new_name: this.newName,
                editor_id: this.thisUserID
            };
            // console.log(dataToSend)
            axios.post(`${this.baseUrl}/API/change_name`, dataToSend)
                .then(response => {
                    const data = response.data; // Получаем данные с сервера
                    console.log(data.message);
                    this.userInfo.nickname = this.newName;
                    localStorage.setItem('current_user_nickname', this.newName);
                    this.$store.commit('incrementStatusHeader');
                })
                .catch(error => {
                    console.error('Ошибка при получении данных:', error);
                });    
            this.editing = false;
        },

        async requestToken(value) {
            this.refilling = false;
            // console.log('Refilling ', value)
            if (Number.isInteger(value) && value > 0) {
                try {
                    await tokenTransfer(value);
                    await this.addGoldcoin(value);
                    this.getUser();
                } catch (error) {
                    const errorMessage = error.response.data.message;
                    alert(errorMessage);
                    // console.log('Token transfer failed');
                }
            } else {
                alert('Incorrect tokens value')
            }            
        },

        confirmEmail() {
            alert('This option does not work yet');
        },

        addFreecoin() {
            alert('This option does not work yet');
        },
        
        addGoldcoin(value) {
            const dataToSend = {
                user_id: this.thisUserID,
                gold: value,
            }
            // console.log(dataToSend)
            axios.post(`${this.baseUrl}/API/add_goldcoin`, dataToSend)
            .then(response => {
                const data = response.data; // Получаем данные с сервера
                console.log(data.message)                
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            })
            this.refilling = false
        },

        getUser() {
        axios.post(`${this.baseUrl}/API/profile/${this.userId}`, this.user)
            .then(response => {
                const data = response.data; // Получаем данные с сервера
                // Проверяем, что данные существуют и содержат необходимую информацию
                if (data && data.length > 0) {
                    // Преобразуем второй словарь из данных в объект user_Info
                    this.userInfo = {
                        id: data[1].id,
                        email: data[1].email,
                        nickname: data[1].nickname,
                        freecoin: data[1].freecoin,
                        goldcoin: data[1].goldcoin,
                        ip_address: data[1].ip_address,
                        reg_date: data[1].reg_date,
                        active_table: data[1].active_table,
                        reputation: data[1].reputation,
                        rating: data[1].rating,
                        wallet: data[1].wallet,
                    };
                    this.userNewInfo.nickname = data[1].nickname
                    // console.log(this.userInfo);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            })
        },
    },
    mounted() {
        this.getUser();        
    },
}
</script>

<template>
    <div class="content">
        <div class="mainbox">
            <div class="container my-3">
                <div class="container mt-5; height: 100% ">
                    <div v-if="userInfo.nickname" class="alert alert-info" style="background: #F0FFF0; border: solid 1px green">
                        <h3><b> {{ userInfo.nickname }} </b> - player profile</h3>
                        <hr>

                        <div class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Username:</h5>
                            </div>
                            <div v-if="!editing" class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.nickname }} </b></h5><br>
                            </div>
                            <div v-else class="col-md-7 align-items-center d-flex">
                                <input v-model="newName" placeholder="Enter new name" class="form-control" />
                            </div>

                            <div v-if="!editing && this.thisUserID == this.userId" class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                <button @click="startEditing" class="btn btn-outline-secondary btn-sm w-100">Change username</button>                                
                            </div>
                            <div v-if="editing && this.thisUserID == this.userId" class="col-md-2 align-items-center d-flex flex-wrap justify-content-between">                               
                                <button @click="cancelEditing" class="btn btn-outline-danger btn-sm w-45">Cancel</button>
                                <button @click="submitChange" class="btn btn-success btn-sm w-50">Submit</button>
                            </div>

                        </div>

                        <div v-if="this.userInfo.email" class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Email address:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.email }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                <div @click="confirmEmail" class="btn btn-outline-secondary btn-sm w-100"> Comfirm email</div>
                            </div>
                        </div>

                        <div v-if="userInfo.freecoin !== null && userInfo.freecoin !== undefined" class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Free coins balance:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.freecoin }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                <div @click="addFreecoin" class="btn btn-outline-secondary btn-sm w-100"> Add freecoin </div>
                            </div>
                        </div>

                        <div v-if="userInfo.goldcoin !== null && userInfo.goldcoin !== undefined" class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Gold coins balance:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <span><h5><b> {{ userInfo.goldcoin }} </b></h5></span>
                                <span v-if="refilling" class="input-group input-group-sm ms-5 align-items-center d-flex">
                                    <span class="input-group-text">Tokens for replenishment: </span>                                        
                                    <input type="number" class="form-control" v-model="goldValue">
                                    <span class="col-md-2 ms-5 align-items-center d-flex flex-wrap justify-content-center">
                                        <button @click="requestToken(goldValue)" class="btn btn-warning btn-sm w-100" title="To replenish your account, you must have AZI-b tokens in your connected Metamask"> Refill </button>                                        
                                    </span>
                                </span>
                                <br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                <button v-if="!refilling" @click="startRefill" class="btn btn-warning btn-sm w-100" title="To replenish your account, you must have AZI-b tokens in your connected Metamask"> Add GOLDCOIN </button>
                                <button v-else @click="cancelRefill" class="btn btn-outline-warning btn-sm w-100"> Cancel </button>
                            </div>
                        </div>

                        <div v-if="this.userInfo.wallet" class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Web3 wallet:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.wallet }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                
                            </div>
                        </div>

                        <div class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Registaration date:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.reg_date }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                
                            </div>
                        </div>

                        <div class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Reputation:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.reputation }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                
                            </div>
                        </div>

                        <div class="row align-items-center d-flex" style="height: 44px;">
                            <div class="col-md-3">                            
                                <h5 class="me-3">Rating:</h5>
                            </div>
                            <div class="col-md-7 align-items-center d-flex">
                                <h5><b> {{ userInfo.rating }} </b></h5><br>
                            </div>
                            <div class="col-md-2 align-items-center d-flex flex-wrap justify-content-center">
                                
                            </div>
                        </div>
                    </div>
                    <div v-if="!userInfo.nickname" class="alert alert-info" style="background: #F0FFF0; border: solid 1px green">
                        <h3><b> Bad request </b> - no user information</h3>
                        <hr>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

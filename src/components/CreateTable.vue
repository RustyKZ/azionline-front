<script>
import axios from 'axios';
export default {
    name: 'Create_Table',
    data() {
        return {
            userInfo: [],
            baseUrl: this.$root.serverUrl,
            thisUserID: null,
            userNickname: '',
            activeTable: 0,
            createTable: {
                user_id: 0,
                max_players: 6,
                min_bet: 1,
                drop_suit: 0,
                cointype: 0,
                blind_game: true,
                interval: 20,
                password: ''
            },
            max_players: 6,
            min_bet: 1,
            drop_suit: 0,
            cointype: 0,
            blind_game: 1,
            interval: 20,
            password: ''            
        };
    },
    created() {
        this.thisUserID = Number(localStorage.getItem('user_id'));
        this.createTable.user_id = Number(localStorage.getItem('user_id'));
    },
    mounted() {      
        this.get404()          
    },
    methods: {
        goToHomePage() {
            this.$router.replace('/');
        },
        createNewTable() {
            this.createTable.max_players = Number(this.max_players)
            this.createTable.min_bet = Number(this.min_bet);
            this.createTable.drop_suit = Number(this.drop_suit);
            this.createTable.cointype = Number(this.cointype);
            if (Number(this.blind_game) == 1) {
                this.createTable.blind_game = true
            } else {
                this.createTable.blind_game = false
            }
            
            this.createTable.interval = Number(this.interval);
            this.createTable.password = this.password;
            console.log('CREATE TABLE', this.createTable);
            axios.post(`${this.baseUrl}/API/create_table`, this.createTable)
            .then(response=> {
                const tableId = response.data[1].table_id
                console.log('SUCCESSFUL',response);
                this.$router.replace(`/table/${tableId}`);
            })
            .catch(error => {
                const errorMessage = error.response.data.message;
                console.error(`Create table error `, error);
                alert(errorMessage);
            });
        },
        get404() {
            const request404 = {
                user_id: this.thisUserID,            
            }
            console.log('GET 404 | AXIOS:', request404)
            axios.post(`${this.baseUrl}/API/get_404`, request404)
            .then(response=> {
                this.userNickname = response.data[1].user_nickname;
                this.activeTable = response.data[1].table_id;
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
        }
    }
}
</script>

<template>
    <div class="content">
        <div class="mainbox">
            <div class="container my-5">
                <div class="bg-body-tertiary p-5 rounded">
                    <h2>Creating a new table</h2>
                    <hr>
                    <form v-if="activeTable == 0" @submit.prevent="createNewTable">
                        <div class="container">
                            <div class="row">
                                <div class="col-3">
                                    <label for="maxplayers">Maximum players</label>
                                    <select class="form-select" type="maxplayers" v-model="max_players">
                                        <option selected value= 6 >6</option>                                        
                                        <option value= 5 >5</option>
                                        <option value= 4 >4</option>
                                        <option value= 3 >3</option>
                                        <option value= 2 >2</option>
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label for="dropped">Dropped suit</label>
                                    <select class="form-select" type="dropped" v-model="drop_suit">
                                        <option selected value = 0 >None</option>                                        
                                        <option value = 1 >Spades</option>
                                        <option value = 2 >Clubs</option>
                                        <option value = 3 >Diamonds</option>
                                        <option value = 4 >Hearts</option>
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label for="cointype">Coin type</label>
                                    <select class="form-select" type="cointype" v-model="cointype">
                                        <option selected value = 0 >Freecoin</option>
                                        <option value = 1 >Goldcoin</option>                                        
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label for="blind">Blind game</label>
                                    <select class="form-select" aria-label="Default select example" v-model="blind_game">
                                        <option selected value = 1>Enabled</option>
                                        <option value = 0>Disabled</option>                                        
                                    </select>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-4">                                    
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Minimal bet: </span>                                        
                                        <input type="number" class="form-control" v-model="min_bet">
                                    </div>
                                    <input type="range" class="form-range" min="1" max="1000" id="customRange2" v-model="min_bet">
                                    Maximal bet: {{ min_bet*10 }}
                                </div>
                                <div class="col-4">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Move interval (sec): </span>                                        
                                        <input type="number" class="form-control" v-model="interval">
                                    </div>
                                    <input type="range" class="form-range" min="10" max="60" id="customRange2" v-model="interval">
                                    Maximal time for thinking
                                </div>
                                <div class="col-4">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="floatingPassword" placeholder="Not required" v-model="password">
                                        <label for="floatingPassword">Game password (not required)</label>                                        
                                    </div>
                                </div>
                            </div>                            
                        </div>
                        <hr>
                        <button type="submit" class="btn btn-success">Create table</button>
                    </form>
                    <div v-if="activeTable !=0">                        
                        <h4>You can't create a new table, you are on the table {{ activeTable }} now!</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

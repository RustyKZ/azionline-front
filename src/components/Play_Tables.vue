<script>
    import axios from 'axios';
    import TableCard from './Table_card.vue'
    import { mapGetters, mapMutations } from 'vuex';
    import { checkAuth } from './auth.js';
    import { checkMetaMaskConnection } from './wallet_connect.js'
    import { checkLogin } from './auth.js';
    import { checkWeb3 } from './wallet_connect.js'


    export default {
        name: 'TablesPage',
        components: {
            TableCard,
        },
        data() {
            return {
                tables: [],
                playerNames: [],
                playerReputation: [],
                playerRating: [],
                playerMatrix: [],
                baseUrl: this.$root.serverUrl,
                playerNumber: 0,
                joinData:{
                    user_id: 0,
                    table_id: 0,
                    table_password: '',
                },
                tableRequest: {
                    user_id: 0
                },
                thisUserID: 0,
                roomId: 'tables',
                tableKyes: {},
                isAuth: false,
                isWeb3Auth: false,
                playerActiveTable: 0
            };
        },
        created() {
            this.thisUserID = Number(localStorage.getItem('user_id'));
            this.tableRequest.user_id = this.thisUserID;
            this.checkWeb3connection();                        
        },
        async mounted() {
            this.isAuth = checkLogin();
            this.isWeb3Auth = checkWeb3();
            await this.getTables();
            console.log('LOGIN ', this.isAuth,'WEB3', this.isWeb3Auth);
            if (this.isAuth == false && this.isWeb3Auth == false) {
                this.$router.push('/access_denied');
            }                        
            this.$socket.on('update_tables', this.handleUpdateTables) 
            console.log('ACTIVE TABLE IS ', this.playerActiveTable)
        },
        methods: {
            ...mapMutations(['setIsLogin', 'setIsWeb3Login']),
            async checkAuthorization() {
                try {
                    this.isAuth = await checkAuth(this.baseUrl); // Проверяйте авторизацию
                    console.log('CHECK AUTH', this.isAuth)
                    if (this.isAuth) {
                        // Пользователь авторизован, выполните нужные действия
                        this.userId = localStorage.getItem('user_id');
                        // this.userActiveTable = localStorage.getItem('user_active_table');
                    } else {
                        // Пользователь не авторизован, выполните нужные действия
                        this.isAuth = false;
                        console.log('User is not authenticated');            
                    }
                } catch (error) {       
                console.error('Error checking authorization:', error);
                // Обработка ошибок при проверке авторизации
                }
            },
            async checkWeb3connection(){
                try {
                    this.isWeb3Auth = await checkMetaMaskConnection(); // Проверяйте авторизацию
                    if (this.isWeb3Auth) {
                        // Пользователь авторизован, выполните нужные действия
                        this.userAddress = localStorage.getItem('user_wallet');
                        this.userId = localStorage.getItem('user_id');
                        // this.userActiveTable = localStorage.getItem('user_active_table');
                        // this.setIsWeb3Login(true);
                    } else {
                        // Пользователь не авторизован, выполните нужные действия
                        this.isWeb3Auth = false;
                        console.log('User is not authenticated with Web3');
                    }
                } catch (error) {       
                console.error('Error checking authorization:', error);
                // Обработка ошибок при проверке авторизации
                }
            },
            getTables() {
                // Здесь мы делаем GET-запрос к нашему Flask API, чтобы получить данные
                axios.post(`${this.baseUrl}/API/tables`, this.tableRequest)
                .then(response => {
                    this.tables = response.data.tables_data;
                    this.playerNames = response.data.player_names;
                    this.playerReputation = response.data.player_reputation;
                    this.playerRating = response.data.player_rating;
                    this.playerMatrix = response.data.player_matrix;
                    this.tableKeys = this.updateTablesDict(this.tables);
                    this.playerActiveTable = response.data.player_active_table;
                    console.log('AXIOS GET TABLES - AT is ', this.playerActiveTable);
                    this.joinRoom(this.roomId);
                })
                .catch(error => {
                    console.error('Ошибка при получении данных:', error);
                });
            },
            /*joinTable(tableId) {
                console.log('Join to table ', tableId);
                this.joinData.user_id = this.thisUserID;
                this.joinData.table_id = tableId;
                this.joinData.table_password = '';
                axios.post(`${this.baseUrl}/API/join_table`,this.joinData)
                .then(response => {
                    this.$router.replace(`/table/${tableId}`);
                    console.log(response)
                })
                .catch(error => {
                    console.error(`Join table ${tableId} error `, error);
                });
            },*/
            stringToArray(str) {
                // Разбиваем строку на массив, используя запятую как разделитель
                return str.split(',').map(item => parseInt(item.trim()));
            },

            joinRoom(roomId) {
                // Вызываем событие 'join_room' и передаем данные с идентификатором комнаты
                this.$socket.emit('join_room', { room_id: roomId, user_id: this.thisUserID });
                console.log(`User ${this.thisUserID} joined to room ${roomId}`)
            },
            handleUpdateTables() {
                this.getTables();
                console.log('Received new data about tables from server');

                // Далее вы можете выполнять необходимые действия при получении события
            },
            updateTablesDict(tables) {
                const tableDict = {};
                for (const table of tables) {
                    tableDict['tablekey_' + table.id] = table.players_now;
                }
            return tableDict;
            }

        },
        computed: {
            ...mapGetters(['isLogin', 'isWeb3Login']),
        // Функция для вычисления ключа для компонента
        tableKey() {
            return (tableId) => {
                // Здесь вы можете выполнить дополнительную обработку tableId, если это необходимо
                return `tablekey_${tableId}`
            };
            
        },
    },
    }
</script>

<template>
    <div class="mainbox">
        <div class="container">
            <div class="row">
                <!--Левая панель со столами-->
                <div class="col-9">
                    <div class="container mt-3">
                        <div>
                            <div v-for="(table) in tables" :key="table.id" class="alert alert-info" style="background: Honeydew; border: solid 1px green; margin-top: 10px">
                                <TableCard
                                    :key = "tableKey(table.id)"
                                    :table="table"
                                    :playerNames="playerNames"
                                    :playerReputation="playerReputation"
                                    :playerRating="playerRating"
                                    :playerActiveTable = "playerActiveTable"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!--Правая панель с выбором сопсоба сортировки столов-->
                <div class="col-3">
                    <div class="rounded-3 my-3 d-flex justify-content-center"
                        style="background: Honeydew; border: solid 1px green;">
                        <div class="container justify-content-center" style="width: 100%;">
                            <div class="my-3 d-flex justify-content-center" style="justify-content: center; width: 100%;">
                                <h5>Sort tables by:</h5>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="d-flex justify-content-center" style="width: 80%;">
                                    <input type="submit" class="btn btn-success flex-grow-1" value="Table #ID">
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="d-flex justify-content-center" style="width: 80%;">
                                    <input type="submit" class="btn btn-success flex-grow-1" value="Minimal bet">
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="d-flex justify-content-center" style="width: 80%;">
                                    <input type="submit" class="btn btn-success flex-grow-1" value="Max players">
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="d-flex justify-content-center" style="width: 80%;">
                                    <input type="submit" class="btn btn-success flex-grow-1" value="Players now">
                                </div>
                            </div>
                            <hr style="color: green">
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="row" style="width: 90%">
                                    <div class="col-9" style="">
                                        Hide empty
                                    </div>
                                    <div class="col-3 d-flex justify-content-end" style="">
                                        <div class="form-check d-flex justify-content-end">
                                            <input class="form-check-input" type="checkbox" value="" id="cb_hide_empty"
                                                style="border-color: green">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="row" style="width: 90%">
                                    <div class="col-9" style="">
                                        Hide Free Coin
                                    </div>
                                    <div class="col-3 d-flex justify-content-end" style="">
                                        <div class="form-check d-flex justify-content-end">
                                            <input class="form-check-input" type="checkbox" value="" id="cb_hide_free"
                                                style="border-color: green">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="row" style="width: 90%">
                                    <div class="col-9" style="">
                                        Hide Gold Coin
                                    </div>
                                    <div class="col-3 d-flex justify-content-end" style="">
                                        <div class="form-check d-flex justify-content-end">
                                            <input class="form-check-input" type="checkbox" value="" id="cb_hide_gold"
                                                style="border-color: green">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="row" style="width: 90%">
                                    <div class="col-9" style="">
                                        Hide 36's deck
                                    </div>
                                    <div class="col-3 d-flex justify-content-end" style="">
                                        <div class="form-check d-flex justify-content-end">
                                            <input class="form-check-input" type="checkbox" value="" id="cb_hide_36cards"
                                                style="border-color: green">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-2 d-flex justify-content-center" style="width: 100%;">
                                <div class="row" style="width: 90%">
                                    <div class="col-9" style="">
                                        Hide 27's deck
                                    </div>
                                    <div class="col-3 d-flex justify-content-end" style="">
                                        <div class="form-check d-flex justify-content-end">
                                            <input class="form-check-input" type="checkbox" value="" id="cb_hide_27cards"
                                                style="border-color: green">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style="color: green">
                            <div class="my-2 mb-3 d-flex justify-content-center" style="width: 100%;">
                                <div class="d-flex justify-content-center" style="width: 80%;">
                                    <input type="submit" class="btn btn-success flex-grow-1" value="Create table">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    {{this.tableKeys}}
</template>

<style scoped>
.mainbox {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 100%;
    margin: 0;
    padding: 0;
}
/* .container {
    width: 1280px;
    justify-content: center;
    align-items: center;
    padding: 5px;
} */

.img-container {
    width: 100%; /* Масштабировать изображение по ширине родительского контейнера */
    height: auto; /* Масштабировать высоту пропорционально */
}
</style>

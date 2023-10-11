<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';


export default {
    name: 'TableCard',
    data() {
        return {
            baseUrl: this.$root.serverUrl,
            playerNumber: 0,
            joinData: {
                user_id: 0,
                table_id: 0,
                table_password: '',
            },
            thisUserID: 0,
            roomId: 'tables',
            activeTable: 0,
            leaveData: {
                user_id: 0,
                table_id: 0,
            }
            
        };
    },
    props: {
        table: Object, // Объект таблицы
        playerNames: Object, // Словарь имен игроков
        playerReputation: Object, // Словарь репутации игроков
        playerRating: Object, // Словарь рейтинга игроков
    },
    created() {
        this.thisUserID = localStorage.getItem('user_id');
        this.setActiveTable(localStorage.getItem('user_active_table'))
        this.activeTable = this.$store.getters.getUserActiveTable;
        console.log('TABLE CARD: User table', this.activeTable)
    },
    methods: {
        ...mapMutations(['setActiveTable']),
        joinTable(tableId) {
            console.log('Join to table ', tableId);
            this.joinData.user_id = this.thisUserID;
            this.joinData.table_id = tableId;
            this.joinData.table_password = '';
            axios.post(`${this.baseUrl}/API/join_table`, this.joinData)
                .then(response => {
                    this.$router.replace(`/table/${tableId}`);
                    console.log(response)
                })
                .catch(error => {
                    console.error(`Join table ${tableId} error `, error);
                });
        },

        leaveTable(TableId) {
            this.thisUserID = localStorage.getItem('user_id');
            this.leaveData.user_id = this.thisUserID;
            this.leaveData.table_id = TableId;
            axios.post(`${this.baseUrl}/API/leave_table`,this.leaveData)
            .then(response => {      
                this.updateTablesHall();
                this.leaveRoom(this.roomId);
                this.setActiveTable(0);
                localStorage.removeItem('user_active_table');
                console.log('METHOD leaveTable: ', response)
                this.$store.commit('incrementStatusHeader');
                this.activeTable = 0;
                console.log('TABLE CARD: User active table = ', this.activeTable)

            })
            .catch(error => {
                console.error(`Leave table ${this.tableId} error `, error);
            });
        },
        stringToArray(str) {
            // Разбиваем строку на массив, используя запятую как разделитель
            return str.split(',').map(item => parseInt(item.trim()));
        },
        joinRoom(roomId) {
            // Вызываем событие 'join_room' и передаем данные с идентификатором комнаты
            this.$socket.emit('join_room', { room_id: roomId, user_id: this.thisUserID });
            console.log(`User ${this.thisUserID} joined to room ${roomId}`)
        },
        leaveRoom(roomId) {
            // Вызываем событие 'join_room' и передаем данные с идентификатором комнаты
            this.$socket.emit('leave_room', { room_id: roomId, user_id: this.thisUserID });
            console.log(`User ${this.thisUserID} left room ${roomId}`)
        },
        updateTablesHall() {
            console.log('UpdateTableHall activated');
            this.$socket.emit('update_tables_hall');
            
        }

    },
    computed: {
        ...mapGetters(['userActiveTable']),
    }
};
</script>

<template>
    <div class="row">
        <!--Информация по столу-->
        <div class="col-9">
            <div class="row">

                <div class="col-4 d-flex justify-content-center align-items-center">
                    <div class="container">
                        <h5>Table <b>#{{ table.id }}</b></h5>
                        <div>
                            <h6>Max Players: <b>{{ table.max_players }}</b></h6>
                            <h6>Ante: <b>{{ table.min_bet }}</b></h6>
                            <h6>Blind Game: <b>{{ table.blind_game }}</b></h6>
                            <h6>Coin Type: <b>{{ table.cointype }}</b></h6>
                            <h6>Card Deck: <b>{{ table.drop_suit }}</b></h6>
                        </div>
                    </div>
                </div>

                <div class="col-8 d-flex justify-content-center align-items-center">
                    <div class="container" style="height: 100%">

                        <div class="row">
                            <div class="col-6 d-flex justify-content-center align-items-center">
                                <h6>Player</h6>
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                <h6>Reputation</h6>
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                <h6>Rating</h6>
                            </div>
                        </div>

                        <div v-for="playerNumber in table.max_players" :key="playerNumber" class="row">
                            <div class="col-6 d-flex">
                                <!-- <a href="/profile/{{ player_id }}" class="text-decoration-none"><b>{{ player_names[player_id] }}</b></a> -->
                                <b style="color: darkblue"> {{ playerNames[stringToArray(table.players)[playerNumber - 1]]
                                }} </b>
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                {{ playerReputation[stringToArray(table.players)[playerNumber - 1]] }}
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                {{ playerRating[stringToArray(table.players)[playerNumber - 1]] }}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        <!--Кнопки присоединения к столу и выхода-->
        <div class="col-3 d-flex justify-content-center">
            <div class="container d-flex justify-content-center align-items-end" style="width: 100%;">
                <div class="container" style="width: 100%">
                    <div v-if="activeTable == table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="leaveTable(table.id)" class="btn btn-danger flex-grow-1 w-100">Leave</button>
                    </div>
                    <div v-if="activeTable == table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="joinTable(table.id)" class="btn btn-outline-success flex-grow-1 w-100">Return</button>
                    </div>
                    <div v-if="activeTable != table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="joinTable(table.id)" class="btn btn-success flex-grow-1 w-100">Join</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
<script>
import axios from 'axios';



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
            },
            deckStatus: ['36 cards', '27 cards', '27 cards', '27 cards', '27 cards'],
            coinStatus: ['FreeCoin', 'GoldCoin']
            
        };
    },
    props: {
        table: Object, // Объект таблицы
        playerNames: Object, // Словарь имен игроков
        playerReputation: Object, // Словарь репутации игроков
        playerRating: Object, // Словарь рейтинга игроков
        playerActiveTable: Number,
    },
    created() {
        this.thisUserID = Number(localStorage.getItem('user_id'));        
        console.log('TABLE CARD: User table', this.playerActiveTable, this.tableId);
    },
    methods: {
        joinTable(tableId) {
            console.log('Join to the table ', this.playerActiveTable);
            this.joinData.user_id = this.thisUserID;
            this.joinData.table_id = tableId;
            this.joinData.table_password = '';
            axios.post(`${this.baseUrl}/API/join_table`, this.joinData)
                .then(response => {
                    if (response.status === 200) {
                        // Успешный ответ сервера, перенаправьте пользователя на другую страницу
                        this.joinRoom(`table-${this.playerActiveTable}`)
                        this.$router.replace(`/table/${tableId}`);
                    } else {
                        // Сервер вернул ошибку, выведите сообщение из ответа
                        alert(`Server Error: ${response.data.message}`);
                    }
                    console.log(response)
                })
                .catch(error => {                    
                    const errorMessage = error.response.data.message;
                    console.error(`Join table ${tableId} error `, error);
                    alert(errorMessage);
                });
        },

        leaveTable(tableId) {            
            this.leaveData.user_id = this.thisUserID;
            this.leaveData.table_id = tableId;
            axios.post(`${this.baseUrl}/API/leave_table`,this.leaveData)
            .then(response => {      
                this.updateTablesHall();
                this.leaveRoom(this.roomId);                
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
            
        },
        truncatedNickname24(nicknameText) {
            try {
                // const buttonText = this.userList[this.userId] || '';
                const buttonText = nicknameText || '';
                if (buttonText.length > 24) {
                    return buttonText.slice(0, 18) + '...' + buttonText.slice(-3);
                } else {                        
                    return buttonText;
                }
            }
            catch {
                console.error('truncatedNicknameText Error')
                return ''; // Вернуть пустую строку или другое значение по умолчанию
            }
        },

    },
    computed: {
        getBlindStatus() {
            return this.table.blind_game ? 'Enabled' : 'Disabled';
    }
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
                            <h6>Blind Game: <b>  {{ getBlindStatus }} </b></h6>
                            <h6>Coin Type: <b>{{ coinStatus[table.cointype] }}</b></h6>
                            <h6>Card Deck: <b>{{ deckStatus[table.drop_suit] }}</b></h6>
                        </div>
                    </div>
                </div>

                <div class="col-8 d-flex justify-content-center align-items-center">
                    <div class="container" style="height: 100%">

                        <div class="row">
                            <div class="col-7 d-flex justify-content-center align-items-center">
                                <h6>Player</h6>
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                <h6>Reputation</h6>
                            </div>
                            <div class="col-2 d-flex justify-content-center align-items-center">
                                <h6>Rating</h6>
                            </div>
                        </div>

                        <div v-for="playerNumber in table.max_players" :key="playerNumber" class="row">
                            <div class="col-7 d-flex">
                                <!-- <a href="/profile/{{ player_id }}" class="text-decoration-none"><b>{{ player_names[player_id] }}</b></a> -->
                                <b style="color: darkblue"> {{ truncatedNickname24(playerNames[stringToArray(table.players)[playerNumber - 1]]) }} </b>
                            </div>
                            <div class="col-3 d-flex justify-content-center align-items-center">
                                {{ playerReputation[stringToArray(table.players)[playerNumber - 1]] }}
                            </div>
                            <div class="col-2 d-flex justify-content-center align-items-center">
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
                <!--
                    <div v-if="playerActiveTable == table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="leaveTable(table.id)" class="btn btn-danger flex-grow-1 w-100">Leave</button>
                    </div>
                -->
                    <div v-if="playerActiveTable == table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="joinTable(playerActiveTable)" class="btn btn-outline-success flex-grow-1 w-100">Return</button>
                    </div>
                    <div v-if="playerActiveTable != table.id" class="d-flex justify-content-center my-1" style="width: 100%;">
                        <button @click="joinTable(table.id)" class="btn btn-success flex-grow-1 w-100">Join</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
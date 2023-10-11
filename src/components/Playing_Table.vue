<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';
import { checkLogin } from './auth.js';
import { checkWeb3 } from './wallet_connect.js'


export default {
    name: 'PlayingTablePage',
    data() {
        return {
            playerNames: [],
            playerReputation: [],
            playerRating: [],
            baseUrl: this.$root.serverUrl,
            playerNumber: 0,
            rivalNumber: 0,
            thisUserID: 0,
            tableID: null,
            tableRequest:{
                    user_id: 0,
                    table_id: 0,
                    table_password: '',
                },
            table:{
                id: 0,
                max_players: 0,
                drop_suit: 0,
                cointype: 0,
                min_bet: 0,
                max_bet: 0,
                table_password: '',
                players: [0,0,0,0,0,0],
                blind_game: false,
                dealind: 0,
                currentgame: 0,
                players_now: 0,
                sort_index: 0,
                time_stop: 0
            },
            game:{
                id: 0,
                start_game: null,
                table_id: 0,
                players: [0,0,0,0,0,0],
                min_bet: 0,
                drop_suit: 0,
                trump_suit: 0,
                pot: 0,
                betting: null,
                gaming: null,
                end_game: null,
                winner: 0,
                lastgame: 0,
                card_deck: ['1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1'],
                card_players: ['0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0'],
                card_place1: ['0, 0, 0, 0, 0, 0'],
                card_place2: ['0, 0, 0, 0, 0, 0'],
                card_place3: ['0, 0, 0, 0, 0, 0'],
                card_place: ['0, 0, 0, 0, 0, 0'],
                cards_now: ['0, 0, 0, 0, 0, 0'],
                speaker: 0,
                speaker_id: 0,
                stage: 0,
            },
            leaveData:{
                user_id: 0,
                table_id: 0,
            },
            cardImagePath:[
                '/images/220-cads-deck01.png', 
                '/images/220-cads-deck02.png', 
                '/images/220-cads-deck03.png', 
                '/images/220-cads-deck04.png', 
                '/images/220-cads-deck05.png', 
                '/images/220-cads-deck06.png', 
                '/images/220-cads-deck07.png', 
                '/images/220-cads-deck08.png', 
                '/images/220-cads-deck09.png', 
                '/images/220-cads-deck10.png', 
                '/images/220-cads-deck11.png',
                '/images/220-cads-deck12.png', 
                '/images/220-cads-deck13.png', 
                '/images/220-cads-deck14.png', 
                '/images/220-cads-deck15.png', 
                '/images/220-cads-deck16.png', 
                '/images/220-cads-deck17.png', 
                '/images/220-cads-deck18.png', 
                '/images/220-cads-deck19.png', 
                '/images/220-cads-deck20.png', 
                '/images/220-cads-deck21.png',
                '/images/220-cads-deck22.png', 
                '/images/220-cads-deck23.png', 
                '/images/220-cads-deck24.png', 
                '/images/220-cads-deck25.png', 
                '/images/220-cads-deck26.png', 
                '/images/220-cads-deck27.png', 
                '/images/220-cads-deck28.png', 
                '/images/220-cads-deck29.png', 
                '/images/220-cads-deck30.png', 
                '/images/220-cads-deck31.png',
                '/images/220-cads-deck32.png', 
                '/images/220-cads-deck33.png', 
                '/images/220-cads-deck34.png', 
                '/images/220-cads-deck35.png', 
                '/images/220-cads-deck36.png',
                '/images/220-empty.png'],
            roomId: '',
            isAuth: false,
            isWeb3Auth: false,
            rivalsQuantity: 0,
            rivals: [],
            rivStr: [],
            playerPos: 0,
            playerBalance: 0,
            dropsuit: ['/images/192-spades.png','/images/192-clubs.png','/images/192-diamonds.png','/images/192-hearts.png'],
            cardHeight: 110,
            droppedSuit: ['None','Spades','Clubs','Diamonds','Hearts']
        };
    },

    created() {
        this.tableId = this.$route.params.table_id;
        this.thisUserID = localStorage.getItem('user_id');
        this.roomId = 'table-'+ this.$route.params.table_id;
        console.log('tableID = ', this.tableID, 'userID = ', this.thisUserID, ' Room ID = ', this.roomId)
    },

    mounted() {
        this.isAuth = checkLogin();
        this.isWeb3Auth = checkWeb3();
        if (this.isAuth == false && this.isWeb3Auth == false) {
            this.$router.push('/access_denied');
        }
        this.tableRequest.user_id = this.thisUserID;
        this.tableRequest.table_id = this.tableId;
        this.tableRequest.table_password = '';
        this.getTable()
        this.joinRoom(this.roomId);
        this.updateTablesHall();
        this.$socket.on('update_room', this.handleUpdateRoom); 
        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
        const divElement = this.$refs.userCardDiv;
        this.cardHeight = Math.floor(divElement.getBoundingClientRect().height);
        console.log(`Высота div: ${this.cardHeight}px`);
    },

    methods: {
        ...mapMutations(['setActiveTable']),
        getTable() {
            axios.post(`${this.baseUrl}/API/get_table`, this.tableRequest)
        .then(response => {
            const data = response.data;
            this.table = {
                id: data[1].table.id,
                max_players: data[1].table.max_players,
                drop_suit: data[1].table.drop_suit,
                cointype: data[1].table.cointype,
                min_bet: data[1].table.min_bet,
                max_bet: data[1].table.max_bet,
                table_password: data[1].table.table_password,
                players: data[1].table.players,
                blind_game: data[1].table.blind_game,
                dealing: data[1].table.dealing,
                currentgame: data[1].table.currentgame,
                players_now: data[1].table.players_now,
                sort_index: data[1].table.sort_index,
                time_stop: data[1].table.time_stop
            }
            this.game = {
                id: data[1].game.id,
                start_game: data[1].game.start_game,
                table_id: data[1].game.table_id,
                players: data[1].game.players,
                min_bet: data[1].game.min_bet,
                drop_suit: data[1].game.drop_suit,
                trump_suit: data[1].game.trump_suit,
                pot: data[1].game.pot,
                betting: data[1].game.betting,
                gaming: data[1].game.gaming,
                end_game: data[1].game.end_game,
                winner: data[1].game.winner,
                lastgame: data[1].game.lastgame,
                card_deck: data[1].game.card_deck,
                card_players: data[1].game.card_players,
                card_place1: data[1].game.card_place1,
                card_place2: data[1].game.card_place2,
                card_place3: data[1].game.card_place3,
                card_place: data[1].game.card_place,
                cards_now: data[1].game.cards_now,
                speaker: data[1].game.speaker,
                speaker_id: data[1].game.speaker_id,
                stage: data[1].game.stage
            }
            this.playerBalance = data[1].balance;
            // Определение позиции пользователя за чтолом
            this.playerPos = 0;
            for (let i = 0; i < this.table.max_players; i++) {
                if (this.table.players[i] == this.thisUserID) {
                    this.playerPos = i + 1;
                    break;
                }
            }
            // Определение соперников
            this.rivalsQuantity = 0;
            this.rivStr = [];
            for (let i = 0; i < this.table.max_players - 1; i++) {
                let el = (i + this.playerPos + 1) % this.table.max_players;
                if (el == 0) {
                    el = this.table.max_players;
                }
                if (this.table.players[el - 1] != 0) {
                    this.rivStr.push(this.table.players[el - 1]);
                } 
                if (this.table.players[el - 1] != 0) {
                    this.rivalsQuantity++;
                }
            }
            this.rivals = this.rivStr.map((element) => {
                return parseInt(element, 10); // Второй аргумент - система счисления (десятичная)
            });

            this.playerNames = data[1].player_names;
            localStorage.setItem('user_active_table', this.table.id);
            this.setActiveTable(this.table.id);
            this.$store.commit('incrementStatusHeader');
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
        },

        leaveTable() {
            this.thisUserID = localStorage.getItem('user_id');
            this.leaveData.user_id = this.thisUserID;
            this.leaveData.table_id = this.tableId;
            axios.post(`${this.baseUrl}/API/leave_table`,this.leaveData)
            .then(response => {
                this.updateTablesHall();
                
                this.leaveRoom(this.roomId);
                this.setActiveTable(0);
                localStorage.removeItem('user_active_table');
                this.$router.replace(`/tables`);
                console.log('METHOD leaveTable: ', response)
                this.$store.commit('incrementStatusHeader');

                this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
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

        handleUpdateRoom() {
            this.getTable();
            console.log('Received new data about tables from server');
        },

        truncatedNicknameText(nicknameText) {
            try {
                // const buttonText = this.userList[this.userId] || '';
                const buttonText = nicknameText || '';
                if (buttonText.length > 16) {
                    return buttonText.slice(0, 10) + '...' + buttonText.slice(-3);
                } else {                        
                    return buttonText;
                }
            }
            catch {
                console.error('truncatedNicknameText Error')
                return ''; 
                // Вернуть пустую строку или другое значение по умолчанию
            }
        },

        truncatedNickname22(nicknameText) {
            try {
                // const buttonText = this.userList[this.userId] || '';
                const buttonText = nicknameText || '';
                if (buttonText.length > 22) {
                    return buttonText.slice(0, 16) + '...' + buttonText.slice(-3);
                } else {                        
                    return buttonText;
                }
            }
            catch {
                console.error('truncatedNicknameText Error')
                return ''; // Вернуть пустую строку или другое значение по умолчанию
            }
        },

        textNumber(number) {
            if (typeof number !== 'number') {
                // Проверьте, является ли входной аргумент числом
                return '';
            }
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    },

    computed: {
        ...mapGetters(['userActiveTable']),
        isRivalsQuantityEven() {
            return this.rivalsQuantity % 2 === 0;
        }
    }
}

</script>

<template>

    <main>
    <div style="height: 95vh">
        <div class="row" style="height: 100%;">
<!--            Левый игровой блок-->
            <div class="col-9" style="height: 100%;">
                <div style="height: 100%; margin-left: 10px">

                    <!-- Верхний ряд 1 из 3  -->
                    <div class="row align-items-center mt-2" style="height: 25%">

                        <div class="container" style="height: 100%; background: #892FF1; margin-left: 10px">

                            <!-- Верхний ряд 1/3 из 3 - Имена соперников -->
                            <div class="row align-items-center, main" style="height: 15%; background: green;">
                                <div v-for="rival in this.rivals" :key="rival" class="col align-items-center" :style="{ background: `#${rival * 1333}` }">
                                    <div class="align-items-center">
                                        <div v-if="game.speaker_id == rival" class="main rounded-3" style=" background: blue; text-align: center; vertical-align: middle">
                                            <b style="color: aliceblue;">{{ rival }} - </b>
                                            <a :href="'/profile/' + rival" class="text-decoration-none" style="color: white"><b> {{ truncatedNicknameText(playerNames[rival]) }}</b></a>
                                        </div>
                                        <div v-else class="main rounded-3" style=" background: indigo; text-align: center; vertical-align: middle">
                                            <b style="color: aliceblue;">{{ rival }} - </b>
                                            <a :href="'/profile/' + rival" class="text-decoration-none" style="color: white"><b> {{ truncatedNicknameText(playerNames[rival]) }}</b></a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                            <!-- Верхний ряд 2/3 из 3 - карты соперников -->

                            <div class="row align-items-center, main" style="height: 45%; background: #a2fef3;">
                                
                            </div>

                            <div class="row align-items-center, main" style="height: 30%; background: #ef3;">
                                
                            </div>

                            <!-- Верхний ряд 3/3 из 3 -  строка прогресса времени соперников -->
                            <div class="row align-items-end, main" style="height: 10%; grid; place-items: center">

                            </div>
                        </div>

                    </div>

                    <!--    Центарльный ряд 3 из 4 -->
                    <div class="row align-items-center, main" style="height: 57%">
                    <!-- Игровой стол  -->
                        <div class="container rounded-5 my-1" style="place-items: center; background: darkgreen; heigth: 100%; border: solid 2px Maroon; margin-left: 12px">
                            <div class="row" style="height: 100%">
                                <!--    1 колонка центрального ряда - кон -->
                                <div class="col-1 align-items-center justify-content-center">
                                    <div class="row align-items-center justify-content-center" style="height: 33%">
                                    </div>
                                        <div class="row align-items-center justify-content-center" style="height: 34%;">
                                            <div class="d-flex align-items-center justify-content-center">
                                                
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                <h5 style="color: white">{{ textNumber(this.game.pot) }}</h5>
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                
                                            </div>
                                        </div>
                                    <div class="row d-flex align-items-start justify-content-center text-center" style="height: 33%">
                                        <h6 style="color: LimeGreen"><b>POT</b></h6>
                                    </div>
                                </div>

                                <!--    2 колонка центрального ряда - игровое поле -->
                                <div class="col-10" style="height: 100%;">

                                    <!--Взятки соперника-->
                                    <div class="row" style="height: 25%">
                                        <div v-for="rival in this.rivals" :key="rival" class="col align-items-center" :style="{ background: `#${rival * 112}` }">
                                            <div class="row" >
                                                <div class="col-1">                                         
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 0px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 15px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 30px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 45px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 60px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 75px; position: absolute;">                                                
                                                </div>
                                                <div class="col-1" style="margin-top: 35px">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 0px; margin-top: 20px; position: absolute;">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 15px; margin-top: 20px; position: absolute;">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 30px; margin-top: 20px; position: absolute;">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 45px; margin-top: 20px; position: absolute;">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 60px; margin-top: 20px; position: absolute;">
                                                    <img class="my-1 blurred-image" :src="cardImagePath[25]" style="height: 15vh; margin-left: 75px; margin-top: 20px; position: absolute;">
                                                </div>
                                                <div class="col-1" style="margin-top: 70px">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 0px; margin-top: 40px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 15px; margin-top: 40px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 30px; margin-top: 40px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 45px; margin-top: 40px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 60px; margin-top: 40px; position: absolute;">
                                                    <img class="my-1" :src="cardImagePath[25]" style="height: 15vh; margin-left: 75px; margin-top: 40px; position: absolute;">
                                                </div>
                                                <div class="col-9">
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                    <!--Ходы соперника и пользвоателя -->
                                    <div class="row" style="height: 50%">
                                        <div class="col-1" style="height: 100%"></div>
                                            <div class="col-10" style="height: 100%">
                                                <!--Ходы соперника  -->
                                                <div class="row" style="height: 50%">                                        
                                                    <div v-for="rival in this.rivals" :key="rival"  class="col" style="width: {{ col_width }}%; place-items: center;">
                                                        <img class="my-1" :src="cardImagePath[14]" style="height: 15vh; position: absolute;">
                                                    </div>
                                                </div>
                                                <!--Ходы пользователя  -->
                                                <div class="row" style="height: 50% place-items: center;">
                                                    <div class="col-5">
                                                    </div>
                                                    <div class="col-1">
                                                        <div v-if="isRivalsQuantityEven" style="position: relative;">
                                                            <img class="my-1" :src="cardImagePath[17]" style="height: 15vh; position: absolute; top: 0; right: 0;">
                                                        </div>
                                                    </div>
                                                    <div class="col-1">
                                                        <div v-if="!isRivalsQuantityEven" style="position: relative;">
                                                            <img class="my-1" :src="cardImagePath[19]" style="height: 15vh; position: absolute; top: 0; right: 0;">
                                                        </div>
                                                    </div>
                                                    <div class="col-5">
                                                    </div>
                                                </div>
                                            </div>
                                        <div class="col-1" style="height: 100%"></div>
                                    </div>
                                    <!--Взятки пользователя-->
                                    <div class="row" style="height: 25%">
                                        <div class="col-2" style="position: relative;">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 15px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[34]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[33]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[32]" style="height: 15vh; margin-left: 45px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[31]" style="height: 15vh; margin-left: 60px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[30]" style="height: 15vh; margin-left: 75px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[29]" style="height: 15vh; margin-left: 90px; position: absolute; bottom: 0; left: 0">
                                        </div>
                                        <div class="col-2" style="position: relative;">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 15px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 45px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 60px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 75px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 90px; position: absolute; bottom: 0; left: 0">
                                        </div>
                                        <div class="col-2" style="position: relative;">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 15px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 30px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 45px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 60px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 75px; position: absolute; bottom: 0; left: 0">
                                            <img class="my-1" :src="cardImagePath[35]" style="height: 15vh; margin-left: 90px; position: absolute; bottom: 0; left: 0">
                                        </div>
                                        <div class="col-6">
                                        </div>
                                    </div>
                                </div>
                                <!--    3 колонка центрального ряда - колода с козырем -->
                                <div class="col-1 align-items-center justify-content-center">
                                    <div class="row align-items-start text-center" style="height: 33%;">
                                    </div>
                                    <div class="row" style="height: 34%;">
                                        <div class="container">                                            
                                            <img class="" src="/images/1_1cards.png" style="height: 15vh; position: absolute;">
                                            <img class="m-1" src="/images/1_1cards.png" style="height: 15vh; position: absolute;">
                                            <img class="m-2" :src="cardImagePath[24]" style="height: 15vh; position: absolute;">
                                        </div>

                                    </div>
                                    <div class="row align-items-start text-center" style="height: 33%">
                                        <h6 style="color: LimeGreen"><b>TRUMP</b></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--    Нижний ряд 4 из 4 -->
                    <div class="row align-items-end, main" style="height: 18%">
                        <!--    1 колонка нижнего ряда - баланс пользователя -->
                        <div class="col" style="display: grid; place-items: center; height:100%">
                            <div class="container" style="margin:0; padding:0; height:100%">
                                <div class="row align-items-start" style="height: 33%">
                                    <div class="col-5 align-self-center">
                                        <div style="color: black"><h5>UserID: <b> {{ this.thisUserID }} </b></h5></div>
                                    </div>
                                    <div class="col-7 align-self-center">
                                        <div v-if="game.speaker_id != this.thisUserID" class="d-flex justify-content-center align-items-center rounded-3" style="background: indigo">
                                            <h5 style="color: white">{{ truncatedNicknameText( this.playerNames[this.thisUserID]) }}</h5>
                                        </div>
                                        <div v-else class="d-flex justify-content-center align-items-center rounded-3" style="background: blue">
                                            <h5 style="color: white">{{ truncatedNicknameText( this.playerNames[this.thisUserID]) }}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="row align-items-center" style="height: 34%">
                                    <div class="col-7 align-self-center">
                                        <div style="color: black">
                                            <h5 v-if="this.table.cointype == 0">Free coin Balance: </h5>
                                            <h5 v-else>Gold coin Balance: </h5>
                                        </div>
                                    </div>
                                    <div class="col-5 align-self-center">
                                        <div class="d-flex justify-content-center align-items-center rounded-3" style="background: Chocolate">
                                            <h5 style="color: white">{{ textNumber(this.playerBalance) }}</h5>
                                        </div>  
                                    </div>
                                </div>
                                <div class="row align-items-end" style="; height: 33%">
                                    <div class="align-self-center">
                                        <div class="d-flex justify-content-center align-items-center rounded-3" style="background:Honeydew">
                                            <h5 style="color: black">User says:</h5> {{ this.cardHeight }}
                                        </div>  
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <!--    2 колонка нижнего ряда - карты пользователя-->
                        <div class="col" style="display: grid; place-items: center">
                                <div ref="userCardDiv" class="row" style="height:100%; overflow: hidden;">
                                    <div v-for="myCard in [0, 1, 2, 3]" :key="myCard" class="col" style="padding: 0; margin:0; height:100%">
                                        <div v-if="(this.game.card_players[(playerPos-1)*4 + myCard]) !=0" style="padding: 0; margin:0; height: 100%;">
                                            <img :src="cardImagePath[this.game.card_players[(playerPos-1)*4 + myCard]-1]" :style="{ height: `${this.cardHeight}px` }">
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <!--    3 колонка нижнего ряда - кнопки пользователя-->
                        <div class="col" style="display: grid; place-items: center; height: 100%">
                            <div class="main" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%">
                                <div class="container" style="height: 100%; width: 100%;">
                                    <!-- 1/3 строка 3 колонки нижнего ряда - прогресс бар времени пользователя                     -->
                                    <div class="row align-items-start, main" style="height: 33%; display: grid; place-items: center;">
                                        <div style="height: 50%; display: flex; justify-content: center; align-items: center;">


                                        </div>
                                    </div>
                                    <!--                      Кнопки для ставок -->
                                    <div class="row align-items-center, main" style="height: 34%; display: grid; place-items: center;" >
                                        <div style="height: 50%; display: flex; justify-content: center; align-items: center;">
                                            <div class="d-flex flex-wrap align-items-center justify-content-center w-100">
                                                <!-- <input type="submit" class="btn btn-primary flex-grow-1 m-2" value="Bet">-->
                                                <!-- <input type="submit" class="btn btn-primary flex-grow-1 m-2" value="Raise">-->
                                                <div class="btn-group dropup flex-grow-1">
                                                    <button type="button" class="btn btn-primary dropdown-toggle flex-grow-1 m-2" data-bs-toggle="dropdown" aria-expanded="false">Bet</button>
                                                    <ul id="bet_button" class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">10</a></li>
                                                        <li><a class="dropdown-item" href="#">9</a></li>
                                                        <li><a class="dropdown-item" href="#">8</a></li>
                                                        <li><a class="dropdown-item" href="#">7</a></li>
                                                        <li><a class="dropdown-item" href="#">6</a></li>
                                                        <li><a class="dropdown-item" href="#">5</a></li>
                                                        <li><a class="dropdown-item" href="#">4</a></li>
                                                        <li><a class="dropdown-item" href="#">3</a></li>
                                                        <li><a class="dropdown-item" href="#">2</a></li>
                                                        <li><a class="dropdown-item" href="#">1</a></li>
                                                    </ul>
                                                </div>
                                                <div class="btn-group dropup flex-grow-1">
                                                    <button type="button" class="btn btn-primary dropdown-toggle flex-grow-1 m-2" data-bs-toggle="dropdown" aria-expanded="false">Raise</button>
                                                    <ul id="raise_button" class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#">10</a></li>
                                                        <li><a class="dropdown-item" href="#">9</a></li>
                                                        <li><a class="dropdown-item" href="#">8</a></li>
                                                        <li><a class="dropdown-item" href="#">7</a></li>
                                                        <li><a class="dropdown-item" href="#">6</a></li>
                                                        <li><a class="dropdown-item" href="#">5</a></li>
                                                        <li><a class="dropdown-item" href="#">4</a></li>
                                                        <li><a class="dropdown-item" href="#">3</a></li>
                                                        <li><a class="dropdown-item" href="#">2</a></li>
                                                        <li><a class="dropdown-item" href="#">1</a></li>
                                                    </ul>
                                                </div>
                                                <input type="submit" class="btn btn-dark flex-grow-1 m-2" value="Call">
                                            </div>
                                        </div>
                                    </div>
                                
                                    <!--  Кнопки для паса, поддержки и сбрасывания  -->
                                    <div class="row align-items-center, main" style="height: 34%; display: grid; place-items: center;" >
                                        <div style="height: 50%; display: flex; justify-content: center; align-items: center;">
                                            <div class="d-flex flex-wrap align-items-center justify-content-center w-100">
                                                <input type="submit" class="btn btn-secondary flex-grow-1 m-2" value="Pass">
                                                <input type="submit" id='drop_button' class="btn btn-warning flex-grow-1 m-2" value="Drop">
                                                <input type="submit" id='new_game_button' class="btn btn-danger flex-grow-1 m-2" value="New game">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

<!--            Правая панель с информацией-->
            <div class="col-3" style="height: 100%">

                <div class="rounded-3 m-2 d-flex justify-content-center" style="background: Honeydew; border: solid 1px darkgreen; height: 100%">

                    <div class="container">
                        <div class="row my-1">
                            <div class="col-8 d-flex align-items-center">
                                <div class="my-1" style="width: 100%;">
                                    <h5>Table #{{ table.id }}</h5>
                                    <h6>Game #{{ table.currentgame }}</h6>
                                </div>
                            </div>
                            <div class="col-4 d-flex justify-content-center align-items-center">
                                <div class="d-flex flex-grow-1" style="width: 100%; bsckground: #666">
                                    <button @click="leaveTable" class="btn btn-danger flex-grow-1 w-100">Leave Table</button>
                                </div>
                            </div>
                        </div>

                        <hr style="color: green">

                        <div class="row">
                            <div class="col-8">

                                <div class="d-flex justify-content-between align-items-center"> <h6>Ante:</h6> <h6 class="text-end"><b>{{ table.min_bet }}</b></h6> </div>
                                <div class="d-flex justify-content-between align-items-center"> <h6>Max Players:</h6> <h6 class="text-end"><b>{{ table.max_players }}</b></h6> </div>
                                <div v-if="table.blind_game" class="d-flex justify-content-between align-items-center"> <h6>Blind Game:</h6> <h6 class="text-end"><b>Enabled</b></h6></div>
                                <div v-else class="d-flex justify-content-between align-items-center"> <h6>Blind Game:</h6> <h6 class="text-end"><b>Disabled</b></h6></div>
                                <div v-if="table.cointype == 0" class="d-flex justify-content-between align-items-center"> <h6>Coin type:</h6> <h6 class="text-end"><b>Freecoin</b></h6> </div>
                                <div v-if="table.cointype == 1" class="d-flex justify-content-between align-items-center"> <h6>Coin type:</h6> <h6 class="text-end"><b>Goldcoin</b></h6> </div>
                                <div class="d-flex justify-content-between align-items-center"> <h6>Dropped:</h6> <h6 class="text-end"><b>{{ droppedSuit[table.drop_suit] }}</b></h6> </div>

                            </div>
                            
                            <!-- Сброшенная масть -->
                            <div v-if="table.drop_suit != 0" class="col-4 d-flex justify-content-center align-items-center">
                                <div style="width: 80%">
                                    <img :src="dropsuit[table.drop_suit]" style="width: 100%;">
                                </div>
                            </div>

                        </div>

                        <hr style="color: green">

                        <div v-if="this.game.speaker_id == this.thisUserID" class="d-flex justify-content-between align-items-center rounded-3 my-1" style="background: blue">
                            <h5 class="ms-2 mt-1 align-self-center text-white" style="color: aliceblue;"><b>{{ playerNames[this.thisUserID] }}</b></h5>                            
                        </div>
                        <div v-else class="d-flex justify-content-between align-items-center rounded-3 my-1" style="background: indigo">
                            <h5 class="ms-2 mt-1 align-self-center text-white" style="color: aliceblue;"><b>{{ playerNames[this.thisUserID] }}</b></h5>                            
                        </div>
                        
                        <hr style="color: green">
                        
                        <div class="container">
                            <div class="row">
                                <div v-for="playerN in [0, 1, 2, 3, 4, 5]" :key="playerN" style="padding: 0; margin: 0;">
                                    <div v-if="(this.game.speaker == playerN + 1) && (this.table.players[playerN] != 0)" class="d-flex justify-content-between align-items-center rounded-3 mb-1" style="background: blue;">
                                        <b class="ms-2" style="color: aliceblue;">{{ truncatedNickname22( playerNames[ this.table.players[playerN]] ) }}</b> 
                                        <b v-if="this.table.dealing == playerN + 1" class="me-2 text-end" style="color: aliceblue;"> - Dealer</b>
                                    </div>
                                    <div v-if="(this.game.speaker != playerN + 1) && (this.table.players[playerN] != 0)" class="d-flex justify-content-between align-items-center rounded-3 mb-1" style="background: darkgreen;">
                                        <b class="ms-2" style="color: aliceblue;">{{ truncatedNickname22( playerNames[ this.table.players[playerN]] ) }}</b>
                                        <b v-if="this.table.dealing == playerN + 1" class="me-2 text-end" style="color: aliceblue;"> - Dealer</b>
                                    </div>
                                </div>
                            </div>   
                        </div>
                        <hr style="color: green">

                    </div>
                </div>
            </div>
        </div>
    </div>
</main>



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

</style>

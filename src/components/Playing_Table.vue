<script>
import axios from 'axios';
import { checkLogin } from './auth.js';
import { checkWeb3 } from './wallet_connect.js';
// import { VueDraggableNext } from 'vue-draggable-next';


export default {
    name: 'PlayingTablePage',
    components: {
      //  VueDraggableNext,
    },
    data() {
        return {
            playerNames: [],
            playerReputation: [],
            playerRating: [],
            baseUrl: this.$root.serverUrl,
            playerNumber: 0,
            rivalNumber: 0,
            thisUserID: 0,
            tableId: null,
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
                time_stop: 0,
                interval: 0,
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
                card_deck: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                card_players: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                card_place1: [0, 0, 0, 0, 0, 0],
                card_place2: [0, 0, 0, 0, 0, 0],
                card_place3: [0, 0, 0, 0, 0, 0],
                card_place: [0, 0, 0, 0, 0, 0],
                cards_now: [0, 0, 0, 0, 0, 0],
                speaker: 0,
                speaker_id: 0,
                stage: 0,
                lastdeal: 0,
                players_bet: [0, 0, 0, 0, 0, 0],
                hodor: 0,
                usersays: ['','','','','',''],
                top_bet: false,
                check: [false, false, false, false, false, false],
                status: [0, 0, 0, 0, 0, 0],
                turn1win: 0,
                turn2win: 0,
                turn3win: 0,
                current_hodor: 0,
                azi_price: 0
            },
            leaveData:{
                user_id: 0,
                table_id: 0,
            },
            cardImagePath:[
                '/images/empty_card.png',
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
                '/images/220-empty.png'
            ],

            cards1: [
                { id: 1, name: 'Card 01', image: '/images/220-cads-deck01.png' },
                { id: 2, name: 'Card 02', image: '/images/220-cads-deck02.png' },
                { id: 3, name: 'Card 03', image: '/images/220-cads-deck03.png' },
                { id: 4, name: 'Card 04', image: '/images/220-cads-deck04.png' }
            ],
            myCards: [
                {pos: 1, card: 0, name: 'myCard1', image: '', type: 'card'},
                {pos: 2, card: 0, name: 'myCard2', image: '', type: 'card'},
                {pos: 3, card: 0, name: 'myCard3', image: '', type: 'card'},
                {pos: 4, card: 0, name: 'myCard4', image: '', type: 'card'},
            ],
            roomId: '',
            isAuth: false,
            isWeb3Auth: false,
            rivalsQuantity: 0,
            rivals: [],
            rivStr: [],
            playerPos: 0,
            playerBalance: 0,
            playerGameStatus: 0,
            dropsuit: ['/images/192-spades.png','/images/192-clubs.png','/images/192-diamonds.png','/images/192-hearts.png'],
            cardHeight: 110,
            droppedSuit: ['None','Spades','Clubs','Diamonds','Hearts'],
            cardRivalImagePath: ['/images/1_0cards.png', '/images/1_1cards.png', '/images/1_2cards.png', '/images/1_3cards.png', '/images/1_4cards.png'],
            progressValue: 0,
            progressWidth: 0,
            progressElapsed: 0,
            timer: null,
            statusColor: ['Silver', 'Maroon', 'indigo', 'indigo', 'indigo', 'indigo', 'indigo', 'indigo', 'indigo', 'indigo', '#ffc107', 'indigo', 'Silver', 'indigo', '#ffc107', 'indigo', 'indigo'],
            playerStatuses: [0, 0, 0, 0, 0, 0],
            gameStages: ['Ante betting', 'Blind betting', 'Dealing', 'First turn betting', 'Discard extra card', 'First turn', 'Second turn', 'Third turn', 'Winner checking','Waiting for players to AZI joining', 'All check - Re-dealing', 'End of the Game'],
        };
    },

    created() {
        this.thisUserID = Number(localStorage.getItem('user_id'));
        this.tableId = Number(this.$route.params.table_id);
        this.roomId = 'table-'+ this.$route.params.table_id;
        console.log('tableID = ', this.tableId, 'userID = ', this.thisUserID, ' Room ID = ', this.roomId)
    },

    async mounted() {
        this.isAuth = checkLogin();
        this.isWeb3Auth = checkWeb3();
        if (this.isAuth == false && this.isWeb3Auth == false) {
            this.$router.push('/access_denied');
        }        
        this.tableRequest.user_id = this.thisUserID;
        this.tableRequest.table_id = Number(this.$route.params.table_id);
        this.tableRequest.table_password = '';
        console.log('PLAYING TABLE GET TABLE :',this.tableRequest)
        await this.getTable()        
        this.$store.commit('incrementStatusHeader');        
        this.updateTablesHall();
        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
        const divElement = this.$refs.userCardDiv;
        this.cardHeight = Math.floor(divElement.getBoundingClientRect().height);
        // console.log(`Высота div: ${this.cardHeight}px`);
        this.startProgressBar()
        this.joinRoom(this.roomId);
        this.$socket.on('update_room', this.handleUpdateRoom);
    },

    methods: {
        getTable() {
            const requestT = {
                user_id: this.thisUserID,
                table_id: Number(this.$route.params.table_id),
                table_password: ''
            }
            console.log('PLAYING TABLE GET_TABLE | AXIOS:', requestT)
            axios.post(`${this.baseUrl}/API/get_table`, requestT)
        .then(response => {
            if (response.status === 200) {
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
                time_stop: data[1].table.time_stop,
                interval: data[1].table.interval
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
                stage: data[1].game.stage,
                lastdeal: data[1].game.lastdeal,
                players_bet: data[1].game.players_bet,
                hodor: data[1].game.hodor,
                usersays: data[1].game.usersays,
                top_bet: data[1].game.top_bet,
                check: data[1].game.check,
                status: data[1].game.status,
                turn1win: data[1].game.turn1win,
                turn2win: data[1].game.turn2win,
                turn3win: data[1].game.turn3win,
                current_hodor: data[1].game.current_hodor,
                azi_price: data[1].game.azi_price
            }
            this.playerBalance = data[1].balance;
            // Определение позиции пользователя за столом
            this.playerPos = 0;
            for (let i = 0; i < this.table.max_players; i++) {
                if (this.table.players[i] == this.thisUserID) {
                    this.playerPos = i + 1;
                    break;
                }            
            }
            this.playerGameStatus = this.game.status[this.playerPos - 1]
            // Определение карт игрока
            for (let i = 1; i <= 4; i++) {
                const card = this.myCards.find(item => item.pos === i);
                // Обновить свойства card внутри массива myCards
                this.myCards[this.myCards.indexOf(card)].card = this.game.card_players[(this.playerPos-1)*4 + i];
                this.myCards[this.myCards.indexOf(card)].image = this.cardImagePath[card.card];               
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
            this.playerStatuses = data[1].player_statuses;
            // this.joinRoom(this.roomId);

        } else if (response.status === 204) {
            this.$router.push('/404');  
        } else if (response.status === 206) {
            this.updateTablesHall();
            this.leaveRoom(this.roomId);                
            localStorage.removeItem('user_active_table');
            this.$router.replace(`/tables`);            
            this.$store.commit('incrementStatusHeader');
            this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
        }

        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
        },

        leaveTable() {            
            this.leaveData.user_id = this.thisUserID;
            this.leaveData.table_id = this.tableId;
            axios.post(`${this.baseUrl}/API/leave_table`,this.leaveData)
            .then(response => {
                this.updateTablesHall();
                this.leaveRoom(this.roomId);                
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
            this.$socket.emit('update_tables_hall');            
        },

        handleUpdateRoom(data) {
            let userBack = 0;
            if (data && data.user_id) {
                userBack = data.user_id;
            }
            console.log('HANDLE UPDATE ROOM User = ', userBack)
            if (userBack != this.thisUserID) {                
                this.getTable();
            }
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
        },
        getPosition(playerID) {
            let plPos = 0;
            for (let i = 0; i < this.table.max_players; i++) {
                if (this.table.players[i] == playerID) {
                    plPos = i + 1;
                    break
                }            
            }
            console.log('', this.table.players)
            return plPos;
        },
        startNewGame() {
            console.log('New game button pressed');
            const data = {table_id: this.table.id}
            axios.post(this.baseUrl + '/API/new_game', data)
                    .then(response => {
                        console.log('New game started', response);                
                    })
                    .catch(error => {
                    console.error('Error logout user:', error);
                })
        },
        readyForNewGame() {
            console.log('Player is ready for new game');
            const data = {table_id: this.table.id, user_id: this.thisUserID}
            axios.post(this.baseUrl + '/API/ready_for_new_game', data)
                    .then(response => {
                        console.log('/API/ready_for_new_game', response);
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: 0 });
                    })
                    .catch(error => {
                    console.error('/API/ready_for_new_game Error:', error);
                })
        },
        startProgressBar() {
            this.timer = setInterval(() => {             
                // Рассчитываем, сколько времени прошло с момента lastdeal до текущего момента
                const currentTime = Math.floor(new Date().getTime() / 1000); // Текущее время в секундах
                const elapsed = currentTime - this.game.lastdeal;
                // Рассчитываем прогресс в процентах
                const progress = (elapsed / this.table.interval) * 100;
                // Обновляем переменные в данных и шаблоне
                this.progressValue = Math.min(progress, 100);
                this.progressElapsed = elapsed;
                this.progressWidth = `${this.progressValue}%`;
                // Если прошло достаточно времени, останавливаем интервал и вызываем defaultAction()
                if (elapsed >= this.table.interval) {
                    console.log('CLEAR INTERVAL and DEFAULT ACTION');
                    this.defaultAction();
                    clearInterval(this.timer);                                                   
                }
            }, 1000); // Обновление каждую секунду
        },

        defaultAction() {
            const data = {table_id: this.table.id, game_id: this.game.id, user_id: this.thisUserID}
            console.log('TRY TO DEFAULT ACTION')
            axios.post(this.baseUrl + '/API/default_action', data)
            .then(response => {
                console.log('DEFAULT ACTION server response: ', response.data.message);
                    this.startProgressBar();
            })
            .catch(error => {
                console.error('Error logout user:', error);
            })
        },

        dropPoorCardDefault() {
            console.log('DROP DEFAULT CARD !!!')
        },

        bettingRaise(bet) {
            const call_bet = Math.max(...this.game.players_bet) - this.game.players_bet[this.playerPos - 1];
            const raise_bet = bet * this.table.min_bet
            const full_bet = call_bet + raise_bet;
            if (full_bet > this.playerBalance) {
                alert('You don’t have enough to bet on')
                console.log('BETTING BET: TOO POOR FOR BETTING');    
            } else {
                const playerRaise = {
                    user_id: this.thisUserID,
                    game_id: this.game.id,
                    bet: raise_bet,
                }
                axios.post(`${this.baseUrl}/API/raising`, playerRaise)
                    .then(response => {
                        console.log('BETTING CALL: PLAYER CALLS ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });
            }
        },

        bettingBet(bet) {
            if (bet * this.table.min_bet > this.playerBalance) {
                alert('You don’t have enough to bet on')
                console.log('BETTING BET: TOO POOR FOR BETTING');    
            } else {
                const playerBet = {
                    user_id: this.thisUserID,
                    game_id: this.game.id,
                    bet: bet * this.table.min_bet,
                }
                axios.post(`${this.baseUrl}/API/betting`, playerBet)
                    .then(response => {
                        console.log('BETTING BET: PLAYER BETS ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });
            }
        },

        bettingCall() {
            const bet = Math.max(...this.game.players_bet) - this.game.players_bet[this.playerPos - 1];
            if (bet > this.playerBalance) {
                alert('You don’t have enough to bet on')
                console.log('BETTING BET: TOO POOR FOR BETTING');    
            } else {
                const playerCall = {
                    user_id: this.thisUserID,
                    game_id: this.game.id,
                    bet: bet,
                }
                axios.post(`${this.baseUrl}/API/calling`, playerCall)
                    .then(response => {
                        console.log('BETTING CALL: PLAYER CALLS ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });
            }
            console.log('BETTING CALL ');
        },

        bettingFold() {
            const playerFold = {
                user_id: this.thisUserID,
                game_id: this.game.id
            }
            axios.post(`${this.baseUrl}/API/fold`, playerFold)
                    .then(response => {
                        console.log('BETTING FOLD: ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });            
        },

        bettingCheck() {
            const playerCheck = {
                user_id: this.thisUserID,
                game_id: this.game.id
            }
            axios.post(`${this.baseUrl}/API/check`, playerCheck)
                    .then(response => {
                        console.log('BETTING CHECK: ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });
        },

        bettingBlind(bet) {
            if (bet * this.table.min_bet > this.playerBalance) {
                alert('You don’t have enough to bet on')
                console.log('BETTING BET: TOO POOR FOR BETTING');    
            } else {
                console.log('BETTING BLIND trying', bet);
                const playerBet = {
                    user_id: this.thisUserID,
                    game_id: this.game.id,
                    bet: bet * this.table.min_bet,
                }
                axios.post(`${this.baseUrl}/API/blind`, playerBet)
                    .then(response => {
                        console.log('BETTING BLIND: PLAYER BETS ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });
            }            
        },

        bettingBlindCheck() {
            const playerBlindCheck = {
                user_id: this.thisUserID,
                game_id: this.game.id
            }
            axios.post(`${this.baseUrl}/API/blind_check`, playerBlindCheck)
                .then(response => {
                    console.log('BETTING BLIND CHECK: ', response);
                    this.getTable();
                    this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                })
                .catch(error => {
                    console.error('Ошибка при получении данных:', error);
                });
        },

        bettingAziHalfPot() {
            const playerAziIn = {
                user_id: this.thisUserID,
                game_id: this.game.id
            }
            axios.post(`${this.baseUrl}/API/azi_in`, playerAziIn)
                    .then(response => {
                        console.log('BETTING AZI HALF POT ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });              
        },

        bettingAziDecline() {
            const playerAziOut = {
                user_id: this.thisUserID,
                game_id: this.game.id
            }
            axios.post(`${this.baseUrl}/API/azi_out`, playerAziOut)
                    .then(response => {
                        console.log('BETTING AZI OUT ', response);
                        this.getTable();
                        this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                    })
                    .catch(error => {
                        console.error('Ошибка при получении данных:', error);
                    });  
        },

        dropThisPlayer() {
            console.log('DROPPED');
            alert('You are have not enough funds for playing!');
            this.updateTablesHall();
            this.leaveRoom(this.roomId);                
            localStorage.removeItem('user_active_table');
            this.$router.replace(`/tables`);
            this.$store.commit('incrementStatusHeader');
            this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
        },
        testWindow() {
            //this.$refs.CustomAlert.openAlert('Заголовок', 'Сообщение пользователю');
        },

        dragOver(event) {
            event.preventDefault();
        },
        dragEnter(event) {
            event.preventDefault();
        },
        startDrag(event, item) {
        // Начало перетаскивания
            event.dataTransfer.setData('text/plain', JSON.stringify(item));
            console.log('CARD DRAGGED:', item);
        },

        dropCard(event) {
            event.preventDefault();
            try {
                const item = JSON.parse(event.dataTransfer.getData('text/plain'));
                if (item.type === 'card') {
                    console.log('CARD VALID DROPPED:', item.pos, item.card);
                    const droppedCard = {
                        user_id: this.thisUserID,
                        game_id: this.game.id,
                        card_pos: item.pos,
                        card_value: item.card
                    }
                    if (this.game.stage == 4) {
                        axios.post(this.baseUrl + '/API/drop_extra_card', droppedCard)
                            .then(response => {
                                console.log('Card dropped', response.data.message);                                
                                this.getTable();
                                this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                            })
                            .catch(error => {
                            console.error('Error logout user:', error);
                        })
                    } else if (this.game.stage == 5) {
                        axios.post(this.baseUrl + '/API/turn_1', droppedCard)
                            .then(response => {
                                console.log('Turn 1 done', response.data.message);                                
                                this.getTable();
                                this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                            })
                            .catch(error => {
                            console.error('Error logout user:', error);
                        })
                    } else if (this.game.stage == 6) {
                        axios.post(this.baseUrl + '/API/turn_2', droppedCard)
                            .then(response => {
                                console.log('Turn 1 done', response.data.message);                                
                                this.getTable();
                                this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                            })
                            .catch(error => {
                            console.error('Error logout user:', error);
                        })
                    } else if (this.game.stage == 7) {
                        axios.post(this.baseUrl + '/API/turn_3', droppedCard)
                            .then(response => {
                                console.log('Turn 1 done', response.data.message);                                
                                this.getTable();
                                this.$socket.emit('update_room', { room_id: this.roomId, user_id: this.thisUserID });
                            })
                            .catch(error => {
                            console.error('Error logout user:', error);
                        })
                    } else {
                        console.error('Bad time for discarding !!!')
                    } 
                } 
            } catch (error) {   
                console.log('CARD INVALID DROPPED:');
            }
        },

        countZeros(playerIndex) {
            // Вычисляем начальный и конечный индексы для фрагмента
            const startIndex = playerIndex * 4 + 1;
            const endIndex = startIndex + 3;
            // Находим фрагмент массива game.card_players для данного игрока
            const playerCards = this.game.card_players.slice(startIndex, endIndex + 1);
            // Считаем количество нулей в этом фрагменте
            const zeroCount = playerCards.filter(card => card === 0).length;
            return zeroCount;
        },

        calculateMargin(arrayIndex,index) {
            let margin = 0;
            for (let i = 0; i < index; i++) {
                if ( arrayIndex == 1) {
                    if (this.game.card_place1[i] !== 0) {
                        margin += 15;
                    }
                }
                if (arrayIndex == 2) {
                    if (this.game.card_place2[i] !== 0) {
                        margin += 15;
                    }
                }
                if (arrayIndex == 3) {
                    if (this.game.card_place3[i] !== 0) {
                        margin += 15;
                    }
                }
            }
            return `${margin}px`;
        }

    },

    computed: {
        isRivalsQuantityEven() {
            return this.rivalsQuantity % 2 === 0;
        },
        currentPlayerStatus() {
            console.log('Computed GAME STATUS ', this.playerGameStatus)
            if (this.playerGameStatus == 1) {
                console.error('CURRENT PLAYERS STATUS IS 1')
            // this.dropThisPlayer();
            }
        // Мы возвращаем пустое значение, потому что computed свойства должны что-то возвращать
        return this.playerGameStatus;
        },
    },

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

                        <div class="container" style="height: 100%; margin-left: 10px">

                            <!-- Верхний ряд 1/4 из 3 - Имена соперников -->
                            <div class="row align-items-center, main" style="height: 15%;">
                                <div v-for="rival in this.rivals" :key="rival" class="col align-items-center">
                                    <div class="align-items-center">
                                        <div v-if="game.speaker_id == rival" class="main rounded-3" style=" background: blue; text-align: center; vertical-align: middle">
                                            <b style="color: aliceblue;">{{ rival }} - </b>
                                            <a :href="'/profile/' + rival" class="text-decoration-none" style="color: white"><b> {{ truncatedNicknameText(playerNames[rival]) }}</b></a>
                                        </div>
                                        <div v-else class="main rounded-3" :style="{ background: statusColor[playerStatuses[rival]] }" style="text-align: center; vertical-align: middle">
                                            <b style="color: aliceblue;">{{ rival }} - </b>
                                            <a :href="'/profile/' + rival" class="text-decoration-none" style="color: white"><b> {{ truncatedNicknameText(playerNames[rival]) }}</b></a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                            <!-- Верхний ряд 2/4 из 3 - карты соперников -->

                            <div class="row align-items-center, main" style="height: 54%;">
                                <div v-for="rival in this.rivals" :key="rival" class="col align-items-center">
                                    <div class="row">
                                        <div class="col-1"></div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage != 11) && (game.stage != 9)" class="col-10">
                                            <img v-if="countZeros(game.players.indexOf(rival)) == 0" class="my-1" :src="cardRivalImagePath[4]" style="height: 12vh; margin-left: 0px; position: absolute;" :draggable="false">
                                            <img v-if="countZeros(game.players.indexOf(rival)) == 1" class="my-1" :src="cardRivalImagePath[3]" style="height: 12vh; margin-left: 0px; position: absolute;" :draggable="false">
                                            <img v-if="countZeros(game.players.indexOf(rival)) == 2" class="my-1" :src="cardRivalImagePath[2]" style="height: 12vh; margin-left: 0px; position: absolute;" :draggable="false">
                                            <img v-if="countZeros(game.players.indexOf(rival)) == 3" class="my-1" :src="cardRivalImagePath[1]" style="height: 12vh; margin-left: 0px; position: absolute;" :draggable="false">                                            
                                        </div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage == 11) && (game.players.indexOf(rival) == game.winner - 1)" class="col-10 col align-items-center rounded-4 mt-2" style="background: ForestGreen; height: 16vh;">
                                            <div class="row align-items-center justify-content-center" style="height: 35%;"><h5 class="text-center align-middle mt-2" style="color: aliceblue;">game# <b>{{ game.id }}</b></h5></div>
                                            <div class="row align-items-center justify-content-center" style="height: 30%;"><h2 class="text-center align-middle" style="color: aliceblue;"><b>WINNER</b></h2></div>
                                            <div class="row align-items-center justify-content-center" style="height: 35%;"><h5 class="text-center align-middle" style="color: aliceblue;">pot: <b>{{ textNumber(this.game.pot) }}</b></h5></div>                                        
                                        </div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage == 9) && (game.status[game.players.indexOf(rival)] == 11)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: SlateBlue; height: 10vh;">
                                            <div class="align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI-in</b></h3></div>
                                        </div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage == 9) && (game.status[game.players.indexOf(rival)] == 12)" class="col-10 d-flex justify-content-center col align-items-center rounded-4 mt-2" style="height: 10vh;">
                                            <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI-out</b></h3></div>
                                        </div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage == 9) && (game.status[game.players.indexOf(rival)] == 13)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: SlateBlue; height: 10vh;">
                                            <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI burst in</b></h3></div>
                                        </div>
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.stage == 9) && (game.status[game.players.indexOf(rival)] == 14)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: #ffc107; height: 10vh;">
                                            <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>refuse burst in</b></h3></div>
                                        </div>
                                        <div class="col-1"></div>                                        
                                    </div>
                                </div>  
                            </div>

                            <!-- Верхний ряд 3/4 из 3 - Реплики соперников -->
                            <div  class="row align-items-center, main" style="height: 21%;">
                                <div v-for="rival in this.rivals" :key="rival" class="col align-items-center">
                                    <div class="row" style="height:100%">
                                        <div v-if="(game.players.indexOf(rival) != -1) && (game.usersays[game.players.indexOf(rival)] != '') && (game.stage != 11)" class="col-9">
                                            <div class="d-flex align-items-center rounded-3 mb-1 w-100" style="height:90%; background:white; white-space: pre-line;">
                                                <h6 class="ms-3 mt-1" style="color: black">{{ game.usersays[game.players.indexOf(rival)] }}</h6>
                                            </div>
                                        </div>
                                        <div v-if="game.players.indexOf(rival) != -1 && game.hodor == game.players.indexOf(rival) + 1 && (game.stage != 11)" class="col-3 align-middle" title="Attacker player">
                                            <h3 class="text-center align-middle" style="cursor: default;"><b>A</b></h3>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            <!-- Верхний ряд 4/4 из 3 -  строка прогресса времени соперников -->
                            <div class="row align-items-end, main" style="height: 10%; grid; place-items: center;">
                                <div v-for="rival in this.rivals" :key="rival" class="col align-items-center">                                    
                                    <div v-if="(((game.speaker_id == rival) && !((game.stage == 4) || (game.stage == 9) || (game.stage == 11))) || (game.stage == 4) || ((game.stage == 9) && (game.status[game.players.indexOf(rival)] == 12))) && 
                                                ((game.status[game.players.indexOf(rival)] !== 1) && (game.status[game.players.indexOf(rival)] !== 10)) || 
                                                ((game.stage == 11) && !(game.status[game.players.indexOf(rival)] == 15 || game.status[game.players.indexOf(rival)] == 16)) || 
                                                ((game.stage == 0) && !(game.status[game.players.indexOf(rival)] == 1 || game.status[game.players.indexOf(rival)] == 2 || game.status[game.players.indexOf(rival)] == 15 || game.status[game.players.indexOf(rival)] == 16))">
                                        <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="progressValue" aria-valuemin="0" aria-valuemax="100">                                            
                                            <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: progressWidth }">{{ this.table.interval - progressElapsed }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!--    Центарльный ряд 3 из 4 -->
                    <div class="row align-items-center, main" style="height: 57%">
                    <!-- Игровой стол  -->

                        <div class="container rounded-5 my-1" style="place-items: center; background: darkgreen; heigth: 100%; border: solid 2px Maroon; margin-left: 12px" @dragenter.prevent="dragEnter" @dragover.prevent="dragOver" @drop="dropCard">
                            <div class="row" style="height: 100%">
                                <!--    1 колонка центрального ряда - кон -->
                                <div class="col-1 align-items-center justify-content-center">
                                    <div class="row align-items-center justify-content-center" style="height: 33%">
                                    </div>
                                        <div class="row align-items-center justify-content-center" style="height: 34%;">
                                            <div class="d-flex align-items-center justify-content-center">
                                                
                                            </div>
                                            <div v-if="game.stage != 11" class="d-flex align-items-center justify-content-center">
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
                                        <div v-for="rival in this.rivals" :key="rival" class="col align-items-center">
                                            <div class="row" >                                                
                                                <div v-if="(game.players.indexOf(rival) == game.turn1win - 1)" class="col-1">                                         
                                                    <template v-for="(card, index) in game.card_place1">
                                                        <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(1,index), position: 'absolute' }">
                                                    </template>
                                                </div>
                                                <div v-if="(game.players.indexOf(rival) == game.turn2win - 1)" class="col-1" style="margin-top: 35px">                                                    
                                                    <template v-for="(card, index) in game.card_place2">
                                                        <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(2,index), position: 'absolute' }">
                                                    </template>
                                                </div>
                                                <div v-if="(game.players.indexOf(rival) == game.turn3win - 1)" class="col-1" style="margin-top: 70px">
                                                    <template v-for="(card, index) in game.card_place3">
                                                        <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(3,index), position: 'absolute' }">
                                                    </template>
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
                                                        <img v-if="(game.card_place[game.players.indexOf(rival)] != 0)" class="my-1" :src="cardImagePath[game.card_place[game.players.indexOf(rival)]]" style="height: 15vh; position: absolute;">
                                                    </div>
                                                </div>
                                                <!--Ходы пользователя  -->
                                                <div class="row" style="height: 50% place-items: center;">
                                                    <div class="col-5">
                                                    </div>
                                                    <div class="col-1">
                                                        <div v-if="isRivalsQuantityEven" style="position: relative;">
                                                            <img v-if= "(game.card_place[playerPos - 1] != 0)" class="my-1" :src="cardImagePath[game.card_place[playerPos - 1]]" style="height: 15vh; position: absolute; top: 0; right: 0;">
                                                        </div>
                                                    </div>
                                                    <div class="col-1">
                                                        <div v-if="!isRivalsQuantityEven" style="position: relative;">
                                                            <img v-if= "(game.card_place[playerPos - 1] != 0)" class="my-1" :src="cardImagePath[game.card_place[playerPos - 1]]" style="height: 15vh; position: absolute; top: 0; right: 0;">
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
                                        <div v-if="playerPos == game.turn1win" class="col-2" style="position: relative;">
                                            <template v-for="(card, index) in game.card_place1">
                                                <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(1,index), position: 'absolute',bottom: 0, left: 0}">
                                            </template>
                                        </div>
                                        <div v-if="playerPos == game.turn2win" class="col-2" style="position: relative;">
                                            <template v-for="(card, index) in game.card_place2">
                                                <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(2,index), position: 'absolute', bottom: 0, left: 0}">
                                            </template>
                                        </div>
                                        <div v-if="playerPos == game.turn3win" class="col-2" style="position: relative;">
                                            <template v-for="(card, index) in game.card_place3">
                                                <img v-if="card !== 0" :key="index" class="my-1" :src="cardImagePath[card]" :style="{ height: '15vh', marginLeft: calculateMargin(3,index), position: 'absolute', bottom: 0, left: 0}">
                                            </template>
                                        </div>

                                        <div class="col-6 d-flex align-items-center justify-content-center">                                        
                                        <!--  Тестовый прогрессбар -->
                                        {{ game.status[playerPos - 1] }}
                                        </div>
                                    </div>
                                </div>
                                <!--    3 колонка центрального ряда - колода с козырем -->
                                <div class="col-1 align-items-center justify-content-center">
                                    <div class="row align-items-start text-center" style="height: 33%;">
                                    </div>
                                    <div class="row" style="height: 34%;">
                                        <div v-if="this.game.stage != 0" class="container">                                            
                                            <img class="" src="/images/empty_card.png" style="height: 15vh; position: absolute;">
                                            <img class="m-1" src="/images/empty_card.png" style="height: 15vh; position: absolute;">
                                            <img class="m-2" :src="cardImagePath[this.game.card_players[0]]" style="height: 15vh; position: absolute;">
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
                                        <div v-if="game.speaker_id != this.thisUserID" class="d-flex justify-content-center align-items-center rounded-3" :style="{ background: statusColor[this.playerGameStatus] }">
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
                                <!--   Слово пользователя-->        
                                <div class="row align-items-end" style="; height: 33%">
                                    <div class="col-10 align-self-center">
                                        <div class="d-flex justify-content-center align-items-center rounded-3" style="background:Honeydew">
                                            <h5 style="color: black">{{ game.usersays[playerPos - 1] }}</h5>
                                        </div>  
                                    </div>
                                    <div v-if="game.hodor == playerPos" class="col-2 justify-content-center align-items-center" title="Attacker player">
                                        <div><h3 class="text-center align-middle" style="cursor: default;"><b>A</b></h3></div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <!--    2 колонка нижнего ряда - карты пользователя-->
                        <div class="col" style="display: grid; place-items: center">                    
                            <!--  Карты пользователя-->
                            <div v-if="(game.status[playerPos - 1] != 0) && (game.status[playerPos - 1] != 1) && (game.status[playerPos - 1] != 10) && (game.stage < 8)" ref="userCardDiv" class="row" style="height:100%; overflow: hidden;">        
                                <div v-for="item in myCards" :key="item.pos" class="col" style="padding: 0; margin:0; height:100%">
                                    <div v-if="(item.card !=0)" style="padding: 0; margin:0; height: 100%;">
                                        <img :src="item.image" :alt="item.name" class="draggable-item" :draggable="true" @dragstart="startDrag($event, item)">
                                    </div>
                                </div>
                            </div>
                            <!--  Не карты пользователя -->
                            <div v-if="(game.stage == 11) && (game.players.indexOf(thisUserID) == game.winner - 1)" class="container rounded-4 m-2" style="background: ForestGreen; height: 16vh;">
                                <div class="row align-items-center justify-content-center" style="height: 35%;"><h5 class="text-center align-middle mt-2" style="color: aliceblue;">game# <b>{{ game.id }}</b></h5></div>
                                <div class="row align-items-center justify-content-center" style="height: 30%;"><h2 class="text-center align-middle" style="color: aliceblue;"><b>WINNER</b></h2></div>
                                <div class="row align-items-center justify-content-center" style="height: 35%;"><h5 class="text-center align-middle" style="color: aliceblue;">pot: <b>{{ textNumber(this.game.pot) }}</b></h5></div>                                        
                            </div>
                            <div v-if="(game.stage == 9) && (game.status[game.players.indexOf(thisUserID)] == 11)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: SlateBlue; height: 10vh;">
                                <div class="align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI-in</b></h3></div>
                            </div>
                            <div v-if="(game.stage == 9) && (game.status[game.players.indexOf(thisUserID)] == 12)" class="col-10 d-flex justify-content-center col align-items-center rounded-4 mt-2" style="height: 10vh;">
                                <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI-out</b></h3></div>
                            </div>
                            <div v-if="(game.stage == 9) && (game.status[game.players.indexOf(thisUserID)] == 13)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: SlateBlue; height: 10vh;">
                                <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>AZI burst in</b></h3></div>
                            </div>
                            <div v-if="(game.stage == 9) && (game.status[game.players.indexOf(thisUserID)] == 14)" class="col-10 d-flex justify-content-center align-items-center rounded-4 mt-2" style="background: #ffc107; height: 10vh;">
                                <div class="row align-items-center justify-content-center"><h3 class="text-center align-middle" style="color: aliceblue;"><b>refuse burst in</b></h3></div>
                            </div>
                            
                        </div>
                        <!--    3 колонка нижнего ряда - прогрессбар  и кнопки -->
                        <div class="col" style="display: grid; place-items: center; height: 100%">
                            <div class="main" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%">
                                <div class="container" style="height: 100%; width: 100%;">
                                    <!-- 1/3 строка 3 колонки нижнего ряда - прогресс бар времени пользователя                     -->
                                    <div class="row align-items-center justify-content-center" style="height: 20%;">
                                        <div v-if="((game.speaker_id == this.thisUserID) && !((game.stage == 9) && (game.status[playerPos - 1] == 11)) && !(game.stage == 11)) || 
                                            (game.stage == 4) && !(game.status[playerPos - 1] == 6) || 
                                            (game.stage == 11) && (rivalsQuantity > 0) && !(game.status[playerPos - 1] == 15 || game.status[playerPos - 1] == 16) || 
                                            ((game.stage == 9) && (game.status[playerPos - 1] == 12)) ||
                                            ((game.stage == 0) && (rivalsQuantity > 0)) && !(game.status[playerPos - 1] == 1 || game.status[playerPos - 1] == 2 || game.status[playerPos - 1] == 15 || game.status[playerPos - 1] == 16)" class="justify-content-center" style="width: 80%">
                                            <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="progressValue" aria-valuemin="0" aria-valuemax="100">
                                                <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: progressWidth }">{{ this.table.interval - progressElapsed }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Блок для кнопок / полезных советов -->
                                    <div class="row align-items-center justify-content-center" style="height: 80%;">
                                        <div v-if="(game.stage == 3)" class="container" style="height: 100%; width: 100%;">
                                            <!--                      Кнопки для ставок -->
                                            <div class="row align-items-center, main" style="height: 50%; display: grid; place-items: center;" >
                                                <div style="height: 50%; display: flex; justify-content: center; align-items: center;">
                                                    <div v-if="this.game.speaker_id == this.thisUserID" class="d-flex flex-wrap align-items-center justify-content-center w-100">                                                        
                                                        <div v-if="(game.stage == 3) && (game.players_bet.every(item => item === 0)) && (!game.top_bet)" class="btn-group dropup flex-grow-1">
                                                            <button type="button" class="btn btn-primary dropdown-toggle flex-grow-1 m-1" data-bs-toggle="dropdown" aria-expanded="false">Bet</button>
                                                            <ul class="dropdown-menu">
                                                                <li v-for="myBet in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" :key="myBet" @click="bettingBet(myBet)"><a class="dropdown-item" href="#">{{ this.textNumber(this.table.min_bet * myBet) }}</a></li>
                                                            </ul>
                                                        </div>
                                                        <div v-if="(game.stage == 3) && (!game.players_bet.every(item => item === 0)) && (!game.top_bet)" class="btn-group dropup flex-grow-1">
                                                            <button type="button" class="btn btn-primary dropdown-toggle flex-grow-1 m-1" data-bs-toggle="dropdown" aria-expanded="false">Raise</button>
                                                            <ul class="dropdown-menu">
                                                                <li v-for="myRaise in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]" :key="myRaise" @click="bettingRaise(myRaise)"><a class="dropdown-item" href="#">{{ this.textNumber(this.table.min_bet * myRaise) }}</a></li>
                                                            </ul>
                                                        </div>
                                                        <div v-if="(game.stage == 3) && (Math.max(...game.players_bet) > game.players_bet[playerPos - 1])" class="btn-group dropup flex-grow-1">
                                                            <button type="button" @click="bettingCall" class="btn btn-dark flex-grow-1 m-1">Call: {{ textNumber(Math.max(...game.players_bet) - game.players_bet[playerPos - 1]) }}</button>                                
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                
                                            <!--  Кнопки для паса, поддержки и сбрасывания  -->
                                            <div class="row align-items-center, main" style="height: 50%; display: grid; place-items: center;" >
                                                <div style="height: 50%; display: flex; justify-content: center; align-items: center;">
                                                    <div v-if="(this.game.speaker_id == this.thisUserID) && (game.stage == 3)" class="d-flex flex-wrap align-items-center justify-content-center w-100">
                                                        <button v-if="(game.players_bet.every(item => item === 0))" type="button" @click="bettingCheck" class="btn btn-secondary flex-grow-1 m-1">Check</button>
                                                        <button type="button" @click="bettingFold" class="btn btn-warning flex-grow-1 m-1">Fold</button>
                                                    </div>                                            
                                                </div>
                                            </div>
                                        </div>
                                        <!--  Этап  сбрасывания карты -->
                                        <div v-if="(game.stage == 4) && (game.status[playerPos - 1] != 0) && (game.status[playerPos - 1] != 1) && (game.status[playerPos - 1] != 10)" class="container" style="height: 100%; width: 100%;">
                                            <div class="row align-items-center, main" style="height: 100%; display: grid; place-items: center;" >
                                                <h4 class="text-center"> Drop one of your cards </h4>
                                            </div>
                                        </div>
                                        <!--  Кнопка врезки в Ази -->
                                        <div v-if="(game.stage == 9) && (game.status[playerPos - 1] == 12)" class="container" style="height: 100%; width: 100%;">
                                            <div class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;" >
                                                <button type="button" @click="bettingAziHalfPot" class="btn btn-dark flex-grow-1 m-1 w-100">Half-pot AZI-in: {{ textNumber(game.azi_price) }}</button>
                                            </div>
                                            <div class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;" >
                                                <button type="button" @click="bettingAziDecline" class="btn btn-warning flex-grow-1 m-1 w-100">Refuse AZI</button>
                                            </div>
                                        </div>
                                        <!--  Кнопка для ставки в темную  -->
                                        <div v-if="(game.stage == 1) && (this.game.speaker_id == this.thisUserID)" class="container" style="height: 100%; width: 100%;">
                                            <div v-if="game.stage == 1" class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;">
                                                <button type="button" class="btn btn-primary dropdown-toggle flex-grow-1 m-1 w-100" data-bs-toggle="dropdown" aria-expanded="false">Blind</button>
                                                <ul class="dropdown-menu">
                                                    <li v-for="myBlindBet in [5, 4, 3, 2, 1]" :key="myBlindBet" @click="bettingBlind(myBlindBet)"><a class="dropdown-item" href="#">{{ this.textNumber(this.table.min_bet * myBlindBet) }} (call {{ this.textNumber(this.table.min_bet * myBlindBet * 2) }})</a></li>
                                                </ul>
                                            </div>
                                            <div class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;" >
                                                <button type="button" @click="bettingBlindCheck" class="btn btn-secondary flex-grow-1 m-1 w-100">Without blind bet</button>
                                            </div>                                            
                                        </div>

                                        <div v-if="((game.stage == 11 && rivalsQuantity > 0) || (game.stage == 0 && rivalsQuantity > 0)) && 
                                            !(game.status[playerPos - 1] == 1 || game.status[playerPos - 1] == 2 || game.status[playerPos - 1] == 15 || game.status[playerPos - 1] == 16)" 
                                            class="container" style="height: 100%; width: 100%;">
                                            <div v-if="this.playerBalance >= game.min_bet" class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;">
                                                <button type="button" @click="readyForNewGame" class="btn btn-primary flex-grow-1 m-1 w-100">Start new game</button>
                                            </div>
                                            <div class="btn-group dropup flex-grow-1 w-100" style="height: 50%; display: grid; place-items: center;" >
                                                <button type="button" @click="leaveTable" class="btn btn-danger flex-grow-1 m-1 w-100">Leave table</button>
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
                                <div v-if="(game.status[playerPos-1] == 0) || 
                                    (game.status[playerPos-1] == 1) || 
                                    (game.status[playerPos-1] == 10) || 
                                    (game.status[playerPos-1] == 12) || 
                                    (game.status[playerPos-1] == 14) ||
                                    (game.stage == 11)" class="d-flex flex-grow-1" style="width: 100%; bsckground: #666">
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
                                    <img :src="dropsuit[table.drop_suit-1]" style="width: 100%;" :draggable="false">
                                </div>
                            </div>

                        </div>

                        <hr style="color: green">

                        <!-- Никнейм игрока  -->

                        <div v-if="this.game.speaker_id == this.thisUserID" class="d-flex justify-content-between align-items-center rounded-3 my-1" style="background: blue">
                            <h5 class="ms-2 mt-1 align-self-center text-white" style="color: aliceblue;"><b>{{ playerNames[this.thisUserID] }} - {{ currentPlayerStatus }}</b></h5>                            
                        </div>
                        <div v-else class="d-flex justify-content-between align-items-center rounded-3 my-1" :style="{ background: statusColor[this.playerGameStatus] }">
                            <h5 class="ms-2 mt-1 align-self-center text-white" style="color: aliceblue;"><b>{{ playerNames[this.thisUserID] }} - {{ currentPlayerStatus }}</b></h5>                            
                        </div>
                        
                        <hr style="color: green">
                        
                        <!-- Никнеймы соперников  -->
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

                        <!-- Статус игры  -->
                        <div class="d-flex justify-content-center align-items-center rounded-3 my-1">
                            <div class="text-center">
                                <h4><b> {{ gameStages[game.stage] }}</b></h4>
                            </div>
                        </div>

                        <hr style="color: green">
                        <input type="submit" @click="startNewGame" class="btn btn-danger flex-grow-1 m-1" value="New game">
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
.draggable-item {
    height: 18vh;
    cursor: grab; /* Установите курсор grab для элементов, чтобы указать их перетаскиваемость */
    pointer-events:visibleStroke; /* Уберите прозрачность и разрешите взаимодействие с элементом */
    user-select: none; /* Запретите выделение текста внутри элемента */
    opacity: 1;
}

</style>

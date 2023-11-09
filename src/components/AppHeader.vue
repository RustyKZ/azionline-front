<script>
    import axios from 'axios';
    import { checkAuth } from './auth.js';
    import { walletConnect } from './wallet_connect.js'
    import { walletDisconnect } from './wallet_connect.js'
    import { checkMetaMaskConnection } from './wallet_connect.js'
    import { walletEmailConnect } from './wallet_connect.js'
    import { mapGetters, mapMutations } from 'vuex';
    import { checkLogin } from './auth.js';
    import { checkWeb3 } from './wallet_connect.js'
    // import { checkLogin } from './auth.js';


    export default {
        name: 'AppHeader',
        data() {
            return {
                baseUrl: this.$root.serverUrl,
                isAuth: false,
                isWeb3Auth: false,
                userId: 0,
                userList: [],
                userAddress: '',
                isHovered: false,
                headerUserNickname: '',
                userActiveTable: 0
            }
        },
        props: {
        },
        created() {
            if (!this.userId) {
                    this.userId = 0;
                }
            this.checkAuthorization(); // Вызывайте функцию проверки при создании компонента
            this.checkWeb3connection();
            // console.log('User auth? - ', this.isAuth)
            const userListString = localStorage.getItem('user_list')
            this.userList = JSON.parse(userListString) // Парсим строку JSON в объект
            this.headerUserNickname = localStorage.getItem('current_user_nickname')
            // console.log('Current user: ',this.headerUserNickname,'Users registered: ', this.userList)            
        },
        async mounted() {
            this.isAuth = checkLogin();
            this.isWeb3Auth = checkWeb3();           
            console.log('LOGIN ', this.isAuth,'WEB3', this.isWeb3Auth);
            if (!this.isAuth) {
                this.setIsLogin(false)
            }
            if (!this.isWeb3Auth) {
                this.setIsWeb3Login(false)
            }
        },
        methods: {
            ...mapMutations(['setIsLogin', 'setIsWeb3Login']),
            async checkAuthorization() {
                try {
                    this.isAuth = await checkAuth(this.baseUrl); // Проверяйте авторизацию
                    if (this.isAuth) {
                        // Пользователь авторизован, выполните нужные действия
                        this.userId = localStorage.getItem('user_id');
                        console.log('Header checkAuthorization: userId from storage is ', this.UserID)
                    } else {
                        // Пользователь не авторизован, выполните нужные действия
                        this.isAuth = false;
                        console.log('Header checkAuthorization: User is not authenticated');
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
                        this.setIsWeb3Login(true);
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

            goToAddPostPage() {
                this.$router.push('/addpost');
            },
            goToDeletePostPage() {
                this.$router.push('/deletepost');
            },
            goToHomePage() {
                this.$router.push('/');
            },
            goToRegisterPage() {
                this.$router.push('/signup');
            },
            goToLoginPage() {
                this.$router.push('/login');
            },
            goToGameRules(){
                this.$router.push('/rules');
            },
            goToTopList() {
                this.$router.push('/toplist');
            },       
            goToAbout() {
                this.$router.push('/about');
            },
            goToActiveTable() {
                this.$router.push(`/table/${this.userActiveTable}`);
            },
            goToLogoutPage() {
                axios.post(this.baseUrl + '/API/logout')
                    .then(response => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('user_list');
                        localStorage.removeItem('current_user_niackname');
                        localStorage.removeItem('user_active_table');
                        this.setIsLogin(false);
                        this.isAuth = checkAuth(this.baseUrl);
                        console.log(this.isAuth);
                        if (this.$route.path === '/') {
                            this.$store.commit('incrementStatusHeader');
                        } else {
                            this.$store.commit('incrementStatusHeader');
                            this.$router.replace('/'); // В противном случае перейти на главную
                        }
                        console.log(response)
                    })
                    .catch(error => {
                    console.error('Error logout user:', error);
                })
            },
            
            async walletConnectPage() {
                if (this.isAuth || this.$store.getters.getIsLogin) {
                    walletEmailConnect()
                        .then(() => {
                        // Задаем паузу в миллисекундах (например, 1000 миллисекунд = 1 секунда)
                        const pauseDuration = 1000;
                        // После заданной паузы выполняем incrementStatusHeader()
                        setTimeout(() => {
                        this.$store.commit('incrementStatusHeader');
                        }, pauseDuration);
                    })
                    .catch(error => {
                        console.error('Error in walletConnectAndIncrementStatusHeader:', error);
                        // Обработайте ошибку по вашему усмотрению
                    });
                } else {
                    walletConnect()
                        .then(() => {
                        // Задаем паузу в миллисекундах (например, 1000 миллисекунд = 1 секунда)
                        const pauseDuration = 1000;
                        // После заданной паузы выполняем incrementStatusHeader()
                        setTimeout(() => {
                        this.$store.commit('incrementStatusHeader');
                        }, pauseDuration);
                    })
                    .catch(error => {
                        console.error('Error in walletConnectAndIncrementStatusHeader:', error);
                        // Обработайте ошибку по вашему усмотрению
                    });
                }
            },
            disconnectPage() {
                console.log('disconnecting');
                walletDisconnect();
                this.setIsWeb3Login(false);
                if (this.$route.path === '/') {
                    // this.$router.go(0); // Если пользователь уже на главной, перезагрузить текущую страницу
                    this.$store.commit('incrementStatusHeader');
                } else {
                    this.$store.commit('incrementStatusHeader');
                    this.$router.replace('/'); // В противном случае перейти на главную
                }
                if (this.isAuth || this.$store.getters.getIsLogin) {
                    this.goToLogoutPage();
                }
            },
            goToProfilePage() {
                this.$router.push(`/profile/${this.userId}`);
            },
            goToTablesPage() {
                this.$router.push('/tables');
            },
        },
        computed: {
            ...mapGetters(['isLogin', 'isWeb3Login', 'isAuthenticated']),
            truncatedNicknameText() {
                try {
                    // const buttonText = this.userList[this.userId] || '';
                    const buttonText = this.headerUserNickname || '';
                    if (buttonText.length > 16) {
                        return buttonText.slice(0, 10) + '...' + buttonText.slice(-3);
                    } else {
                        return buttonText;
                    }
                }
                catch {
                    console.error('truncatedNicknameText Error')
                    return ''; // Вернуть пустую строку или другое значение по умолчанию
                }
            },
            truncatedAddressText() {
                try {
                    const buttonText = this.userAddress || '';
                    if (buttonText.length > 16) {
                        return buttonText.slice(0, 9) + '...' + buttonText.slice(-4);
                    } else {
                        return buttonText;
                    }
                }
                catch {
                    console.error('truncatedAddressText Error');
                    return ''; // Вернуть пустую строку или другое значение по умолчанию
                }
            },
        }
    }
</script>

<template>

    <header class="p-3 text-bg-dark">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

                <div class="d-flex align-items-center text-white text-decoration-none">                    
                    <img @click="goToHomePage" class="link_button mt-1 me-4" src="/images/logo.png" alt="AZI Online">
                </div>

                <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li @click="goToTablesPage" class="btn btn-success me-2">Play Now</li>
                    <li @click="goToGameRules" class="nav-link px-2 text-white link_button">Game Rules</li>                    
                    <li @click="goToTopList" class="nav-link px-2 text-white link_button">Top Players</li>
                    <li @click="goToAbout" class="nav-link px-2 text-white link_button">About</li>
                    <li v-if="isAuth && userId == 3" @click="goToAddPostPage" class="nav-link px-2 text-white link_button">Add Post</li>
                    <li v-if="isAuth && userId == 3" @click="goToDeletePostPage" class="nav-link px-2 text-white link_button">Delete post</li>
                </ul>

                <div class="text-end">
                    <button type="button" class="btn btn-primary me-2" v-if="(isAuth || isWeb3Auth) && (userActiveTable) && (userActiveTable != 0)" @click="goToActiveTable"> Table {{ userActiveTable }} </button>
                    <button type="button" class="btn btn-outline-primary me-2" v-if="isAuth || isWeb3Auth" @click="goToProfilePage"> {{ truncatedNicknameText }} </button>
                    <button type="button" class="btn btn-outline-light me-2" v-if="!isAuth && !isWeb3Auth" @click="goToRegisterPage">Sign-up</button>
                    <button type="button" class="btn btn-outline-light me-2" v-if="!isAuth && !isWeb3Auth" @click="goToLoginPage">Login</button>
                    <button type="button" class="btn btn-outline-light me-2" v-if="isAuth  && !isWeb3Auth" @click="goToLogoutPage">Logout</button>
                    <button type="button" class="btn btn-outline-warning" v-if="!isWeb3Auth" @click="walletConnectPage">Metamask</button>
                    <button type="button" class="btn btn-warning" v-if="isWeb3Auth && !isHovered" @mouseover="isHovered = true"> {{ truncatedAddressText }} </button>
                    <button type="button" class="btn btn-danger" v-if="isWeb3Auth && isHovered" @mouseout="isHovered = false" @click="disconnectPage"> Disconnect Wallet </button>
                </div>

            </div>
        </div>
    </header>

</template>

<style scoped>
.link_button {
    cursor: pointer;
}
</style>

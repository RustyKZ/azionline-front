import { createStore } from 'vuex';

export default createStore({
  state: {
    statusHeader: 0,
    isLogin: true,
    isWeb3Login: true,
    // userActiveTable: 0
  },
  mutations: {
    incrementStatusHeader(state) {
      state.statusHeader++;
      if (state.statusHeader >= 10) {
        state.statusHeader = 0;
      }
    },
    setIsLogin(state, value) {
      state.isLogin = value;
      console.log('SET LOGIN ', value)
    },
    setIsWeb3Login(state, value) {
      state.isWeb3Login = value;
      console.log('SET WEB3 LOGIN ', value)
    },
    // setActiveTable(state, value) {
    //  state.userActiveTable = value;
    //  console.log('SET ACTIVE TABLE: Active table is ', value)
    // },
  },
  actions: {
    // Можете добавить другие действия здесь, если это необходимо
  },
  getters: {
    getStatusHeader: (state) => state.statusHeader,
    getIsLogin: (state) => state.isLogin,
    getIsWeb3Login: (state) => state.isWeb3Login,
    // getUserActiveTable: (state) => state.userActiveTable,

    isAuthenticated(state) {
      return state.isLogin || state.isWeb3Login;
    },
    // Можете добавить геттеры здесь, если это необходимо
  },
});

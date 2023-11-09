import axios from 'axios';
// import { serverUrl } from '../main'

// Вход пользователя через email
export async function login(baseUrl, user) {
  try {
    const response = await axios.post(baseUrl + '/API/login', user);
    const accessToken = response.data.access_token;
    // Сохраните токен в localStorage или в куках
    localStorage.setItem('access_token', accessToken);
    return accessToken;
  } catch (error) {
      alert(error.response.data.message)    
    throw error;
  }
}

// Получение токена из хранилища
export function getAccessToken() {
  return localStorage.getItem('access_token');
}


// Проверка авторизации пользователя и получение данных о пользователях с сервера
export async function checkAuth(baseUrl) {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Если токен отсутствует, пользователь не авторизован
      // console.log('AUTH.JS CheckAuth: No token in storage')
      return false;
    } else {
      // console.log('AUTH.JS CheckAuth:', accessToken)
    }
    const response = await axios.get(baseUrl + '/API/check_auth', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const isAuthenticated = response.data.authenticated;
    // После получения current_user_id от сервера
    const userId = response.data.user_id;
    // Сохраните его в локальном хранилище (localStorage)
    localStorage.setItem('user_id', userId);
    const userList = response.data.users_info;
    localStorage.setItem('user_list', JSON.stringify(userList));
    const userListDict = JSON.stringify(userList);
    const userListArray = JSON.parse(userListDict);
    // const userActiveTable = response.data.user_table;
    // localStorage.setItem('user_active_table', userActiveTable);
    if (userId != 0) {
      try {
          const currentUserNickname = userListArray[userId];
          localStorage.setItem('current_user_nickname', currentUserNickname);
          // console.log('Localstorage: ', 'ID is ', userId, 'Nickname is ', currentUserNickname, userListDict);
      } catch (error) {
          // console.error('No user with userID ',this.userId);
      }                
    }

    return isAuthenticated;
  } catch (error) {
      console.error('Error checking authorization:', error);
    throw error;
  }
}


export function checkLogin() {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Если токен отсутствует, пользователь не авторизован
      return false;
    }             
    else {
      return true;
    }
  } catch (error) {
      console.error('Error checking authorization:', error);
    throw error;
  }
}

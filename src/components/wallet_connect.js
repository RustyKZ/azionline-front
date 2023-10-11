import Web3 from 'web3';
import { userTokenContract } from '../main'
import { serverUrl } from '../main'
import axios from 'axios';

export async function walletConnect() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
            // Запрос разрешения на доступ к аккаунту
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Проверяем, является ли сеть BSC
            const networkId = await web3.eth.net.getId();
            if (networkId == 56) {
                // Сеть BNB Smart Chain
                const userAddress = accounts[0];
                const tokenContractAddress = userTokenContract;
                // Здесь должно быть ABI вашего контракта
                // Пример:
                const tokenContractAbi = [{
                    constant: true,
                    inputs: [{ name: 'owner', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: '', type: 'uint256' }],
                    type: 'function',
                }];
                const tokenContract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
                const balance = await tokenContract.methods.balanceOf(userAddress).call();
                // Подписывание данных
                const dataToSign = 'User address: ' + userAddress
                const signature = await web3.eth.personal.sign(
                    JSON.stringify(dataToSign),
                    userAddress, // адрес для подписи
                    '' // пароль кошелька (может быть пустым, если кошелек разблокирован)
                );
                console.log('Signed:', dataToSign)
                const dataToSend = {
                    userAddress: userAddress,
                    tokenBalance: balance.toString(),
                    signature: signature,
                };
                console.log(dataToSend);
                console.log(serverUrl + '/API/wallet_connect', dataToSend)
                axios.post(serverUrl + '/API/wallet_connect', dataToSend)
                    .then(function (response) {
                        // Обработка успешного ответа сервера
                        console.log('Server response:', response.data.message);
                        localStorage.setItem('user_wallet', userAddress);
                        const isConnect = checkMetaMaskConnection();
                        console.log('Wallet connected: ', isConnect)
                    })
                    .catch(function (error) {
                        // Обработка ошибки
                        console.error('Error sending data to server:', error);
                    });
            } else {
                // Пользователь должен переключить Metamask для использования сети BSC
                console.error('Please switch Metamask to use BNB Smart Chain');
                alert('Please switch Metamask to use BNB Smart Chain');
            }
        } catch (error) {
            console.error('Error connecting to Metamask:', error);
        }
    } else {
        console.error('Metamask is not installed in your browser.');
        alert('Metamask is not installed in your browser.');
    }
}

export async function walletDisconnect() {
    console.log('Wallet disconnect function')
    try {
        if (typeof window.ethereum !== 'undefined') {
            // Проверяем доступность объекта ethereum
            // await window.ethereum.disconnect(); // Закрываем соединение с Метамаск
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_list');
            localStorage.removeItem('user_wallet');
            localStorage.removeItem('current_user_niackname');
            localStorage.removeItem('user_active_table');
            console.error('Local storage cleaned!');
        } else {
            console.error('MetaMask (ethereum) is not available.');
            // Обработайте ситуацию, когда MetaMask недоступен
        }
    } catch (error) {
        console.error('Error disconnecting from MetaMask:', error);
        // Обработайте ошибку по вашему усмотрению
    }
}

export async function checkMetaMaskConnection() {
    // Проверяем, доступен ли MetaMask
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            console.log('start Web3 checking');
            const wallet = localStorage.getItem('user_wallet');
            console.log('Local storage:', wallet)
            if (!localStorage.getItem('user_wallet')) {
                console.log('Local storage is empty');
                // В ЛС нет адреса кошелька
                return false;
            }
            // Запрашиваем разрешение на доступ к кошельку пользователя
            await window.ethereum.enable();
            // Получаем адрес кошелька, подключенного к MetaMask
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                console.log('Wallet is not connect');
                // Кошелек не подключен
                return false;
            }
            // Проверяем, что сеть BSC
            const networkId = await web3.eth.net.getId();
            if (networkId != 56) { // 56 - идентификатор сети BSC
                console.log('Network is not BNB SC');
                return false;
            }
            // Получаем ожидаемый адрес из localStorage
            const expectedAddress = localStorage.getItem('user_wallet');
            // Проверяем, что адрес подключения соответствует ожидаемому
            const connectedAddress = accounts[0].toLowerCase();
            if (connectedAddress !== expectedAddress.toLowerCase()) {
                console.log(expectedAddress, ' Address is bad');
                return false;
            }
            // Все проверки успешны, кошелек подключен и адрес верен
            const userdata = { userWallet: connectedAddress };
            console.log('ServerUrl is ', serverUrl, ' Responso is ', userdata);
            const response = await axios.post(serverUrl + '/API/check_web3_auth', userdata);

            const isWeb3auth = response.data.web3auth;
            console.log('Server says: Web3auth is ', isWeb3auth)
            // После получения current_user_id от сервера
            const userId = response.data.user_id;
            // Сохраните его в локальном хранилище (localStorage)
            localStorage.setItem('user_id', userId);

            const userList = response.data.users_info;
            localStorage.setItem('user_list', JSON.stringify(userList));
            const userActiveTable = response.data.user_table;
            localStorage.setItem('user_active_table', userActiveTable);

            const userListDict = JSON.stringify(userList);
            const userListArray = JSON.parse(userListDict);
            if (userId != 0) {
                try {
                    const currentUserNickname = userListArray[userId];
                    localStorage.setItem('current_user_nickname', currentUserNickname);
                    console.log('Localstorage: ', 'ID is ', userId, 'Nickname is ', currentUserNickname, userListDict);
                } catch (error) {
                    console.error('No user with userID ', this.userId);
                }
            }

            return true;
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
            return false;
        }
    } else {
        console.log('Metamask none');
        // MetaMask не доступен
        return false;
    }
}

export async function walletEmailConnect() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
            // Запрос разрешения на доступ к аккаунту
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Проверяем, является ли сеть BSC
            const networkId = await web3.eth.net.getId();
            if (networkId == 56) {
                // Сеть BNB Smart Chain
                const userAddress = accounts[0];
                const tokenContractAddress = userTokenContract;
                // Здесь должно быть ABI вашего контракта
                // Пример:
                const tokenContractAbi = [{
                    constant: true,
                    inputs: [{ name: 'owner', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: '', type: 'uint256' }],
                    type: 'function',
                }];
                const tokenContract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
                const balance = await tokenContract.methods.balanceOf(userAddress).call();
                // Подписывание данных
                const dataToSign = 'Do you want to link your account to your wallet ' + userAddress + ' ?'
                const signature = await web3.eth.personal.sign(
                    JSON.stringify(dataToSign),
                    userAddress, // адрес для подписи
                    '' // пароль кошелька (может быть пустым, если кошелек разблокирован)
                );
                console.log('Signed:', dataToSign)
                const accessToken = localStorage.getItem('access_token');
                const userId = localStorage.getItem('user_id');
                const dataToSend = {
                    userId: userId,
                    userAddress: userAddress,
                    tokenBalance: balance.toString(),
                    signature: signature,
                };
                console.log(dataToSend);
                console.log(serverUrl + '/API/wallet_email_connect', dataToSend)
                axios.post(serverUrl + '/API/wallet_email_connect', dataToSend, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then(function (response) {
                        // Обработка успешного ответа сервера
                        console.log('Server response:', response.data.message);
                        localStorage.setItem('user_wallet', userAddress);
                        const isConnect = checkMetaMaskConnection();
                        console.log('Wallet connected: ', isConnect)
                    })
                    .catch(function (error) {
                        // Обработка ошибки
                        console.error('Error sending data to server:', error);
                    });
            } else {
                // Пользователь должен переключить Metamask для использования сети BSC
                console.error('Please switch Metamask to use BNB Smart Chain');
                alert('Please switch Metamask to use BNB Smart Chain');
            }
        } catch (error) {
            console.error('Error connecting to Metamask:', error);
        }
    } else {
        console.error('Metamask is not installed in your browser.');
        alert('Metamask is not installed in your browser.');
    }
}

export function checkWeb3() {
    try {
      const web3Address = localStorage.getItem('user_wallet');
      if (!web3Address) {
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
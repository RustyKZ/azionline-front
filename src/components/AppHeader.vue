<script>
    export default {
        name: 'AppHeader',
        data() {
            return {
                username: ""
            }
        },
        methods: {
            goToAddPostPage() {
                // window.location.href = '/addpost.html';
                // this.$router.push('/addpost');
            },
            goToDeletePostPage() {
                window.location.href = '/deletepost.html';
            },
            goToHomePage() {
                window.location.href = '/';
            },
            // ... остальные методы
        },

    }
</script>

<template>
    <div class="mainbox">
        <div class="container">
            <div class="left">
                <div>
                    <img @click="goToHomePage" class="clickimage" src="/images/logo.png" alt="AZI Online">
                </div>
            </div>
            <div class="center">
                <ul class="nav">
                    <li>Play now</li>
                    <li>Game Rules</li>
                    <li>Top Players</li>
                    <li>About Us</li>
                    <li @click="goToAddPostPage">Add Post</li>
                    <li @click="goToDeletePostPage">Delete post</li>
                </ul>
            </div>
            <div class="right">
                <ul class="userbuttons">
                    <li>Table#</li>
                    <li>UserName</li>
                    <li>Login</li>
                    <li>Logout</li>
                    <li>Web3 Wallet</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

.mainbox {
    display: flex;
    padding: 0;
    margin: 0;
    justify-content: center;
    align-items: center;
    background: #222;
    color: aliceblue;
    font-size: 16px;
}
.container {
    display: flex;
    width: 1280px;
    justify-content: center;
    align-items: center;
    padding: 5px;
}

.left {
    display: flex;
    flex: 15%;
    justify-content: center;
    align-items: center;
}

.center {
    flex: 45%;
}

.right {
    flex: 40%;
}

.nav {
    list-style-type: none; /* Убираем маркеры (круглишки) */
    padding: 0; /* Убираем внутренний отступ */
    margin: 0; /* Убираем внешний отступ */
    display: flex; /* Устанавливаем flex-контейнер */
}

.nav li {
    margin-right: 20px; /* Добавляем небольшой отступ между элементами */
    cursor: pointer;
}

.userbuttons {
    list-style-type: none; /* Убираем маркеры (круглишки) */
    padding: 0; /* Убираем внутренний отступ */
    margin: 0; /* Убираем внешний отступ */
    display: flex; /* Устанавливаем flex-контейнер */
    justify-content: flex-end; /* Выравниваем элементы по правому краю */
}

.userbuttons li {
    margin-left: 10px; /* Добавляем небольшой отступ между элементами */
    cursor: pointer;
}

.clickimage {
    cursor: pointer;
}

</style>

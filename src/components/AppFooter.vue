<script>
    export default {
        name: 'AppFooter',
        data() {
            return {
                username: ""
            }
        }
    }
</script>

<template>
    <div class="mainbox">
        <div class="container">

            <div class="pre-left">
                <div>
                    <img src="/images/logo-footer.png" alt="AZI Online">
                </div>
            </div>

            <div class="left">
                <p> 2023 &copy; Company, Inc</p>
            </div>

            <div class="center">
                <ul class="links">
                    <li>Link 1</li>
                    <li>Link 2</li>
                    <li>Link 3</li>
                    <li>Link 4</li>
                </ul>
            </div>

            <div class="right">
                <ul class="social">
                    <li><img src="/images/36-discord.png"></li>
                    <li><img src="/images/36-facebook.png"></li>
                    <li><img src="/images/36-instagram.png"></li>
                    <li><img src="/images/36-reddit.png"></li>
                    <li><img src="/images/36-twitter.png"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

.mainbox {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f0fff0;
    font-size: 16px;
    width: 100%;
    height: 70px;
}
.container {
    display: flex;
    width: 1280px;
    justify-content: center;
    align-items: center;
    padding: 5px;
}

.pre-left {
    display: flex;
    flex: 15%;
    justify-content: center;
    align-items: center;
}

.left {
    display: flex;
    flex: 25%;
    justify-content: center;
    align-items: center;
}

.center {
    flex: 40%;
    justify-content: center;
}

.right {
    flex: 25%;
}

.links {
    list-style-type: none; /* Убираем маркеры (круглишки) */
    padding: 0; /* Убираем внутренний отступ */
    margin: 0; /* Убираем внешний отступ */
    display: flex; /* Устанавливаем flex-контейнер */
    justify-content: center;
    
}

.links li {
    margin-right: 50px; /* Добавляем небольшой отступ между элементами */
    cursor: pointer;
}

.social {
    list-style-type: none; /* Убираем маркеры (круглишки) */
    padding: 0; /* Убираем внутренний отступ */
    margin: 0; /* Убираем внешний отступ */
    display: flex; /* Устанавливаем flex-контейнер */
    justify-content: flex-end; /* Выравниваем элементы по правому краю */
}

.social li {
    margin-left: 10px;
    cursor: pointer;
}

</style>

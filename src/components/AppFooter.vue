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
    <div class="container">
          <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div class="col-md-5 d-flex align-items-center">
                <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                    <img src="/images/logo-footer.png" class="bi" height="36">
                </a>
                <span class="mb-3 mb-md-0 text-body-secondary">© 2023 SuperPuper Company, Inc</span>
            </div>
            <div>
                <a href="#" class="mb-3 me-4 mb-md-0 text-body-secondary text-decoration-none lh-1"><img src="/images/appstore.png" class="bi" height="44"></a>
                <a href="#" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"><img src="/images/googleplay.png" class="bi" height="44"></a>
                <!-- <button class="btn btn-outline-success me-2"> Partner Link 1 </button>
                <button class="btn btn-outline-success me-2"> Partner Link 2 </button> -->
            </div>

            <ul class="nav col-md-3 justify-content-end list-unstyled d-flex">
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-discord.png" class="bi" width="36" height="36"></a></li>
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-reddit.png" class="bi" width="36" height="36"></a></li>
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-telegram.png" class="bi" width="36" height="36"></a></li>
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-x.png" class="bi" width="36" height="36"></a></li>
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-facebook.png" class="bi" width="36" height="36"></a></li>
                <li class="me-2"><a class="text-body-secondary" href="#"><img src="/images/36-instagram.png" class="bi" width="36" height="36"></a></li>
            </ul>
          </footer>
        </div>

</template>

<style scoped>
</style>

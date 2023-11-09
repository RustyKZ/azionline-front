<script>
    import axios from 'axios';

    export default {
        name: 'Top_List',
        data() {
            return {
                topListServer: [],
                topList: [],
                sortBy: 1,
                baseUrl: this.$root.serverUrl,
            };
        },
        async mounted() {        
            await axios.get(`${this.baseUrl}/API/gettoplist`)
                .then(response => {
                this.topList = response.data;                
                })
                .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
        },

        methods: {
            textNumber(number) {
                if (typeof number !== 'number') {
                    return '';
                }
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },

        },

        computed: {
            sortedList() {
                let sortedArray = [];
                let sortMode = Number(this.sortBy);
                switch (sortMode) {
                    case 0:
                        sortedArray = this.topList.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                    case 1:
                        sortedArray = this.topList.slice().sort((a, b) => b.freegain - a.freegain);
                    break;
                    case 2:
                        sortedArray = this.topList.slice().sort((a, b) => b.goldgain - a.goldgain);
                    break;
                    default:
                        sortedArray = this.topList;
                    }        
                return sortedArray.slice(0, 100);
            },
        },
    };

</script>

<template>
    <div class="mainbox">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-6"><h3>List of top players</h3></div>
                <div class="col-3 text-end">
                    <span><b>sort by:</b></span>
                </div>
                <div class="col-3 align-items-end">
                    <select class="form-select" aria-label="Default select example" v-model="sortBy">                        
                        <option selected value="1">Freecoin gain</option>
                        <option value="2">Goldcoin gain</option>
                        <option value="0">Days in game</option>

                    </select>
                </div>
            </div>
            
            <hr>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col" class="text-center">Player</th>
                        <th scope="col" class="text-center">Days in game</th>
                        <th scope="col" class="text-center">Freecoin gain</th>
                        <th scope="col" class="text-center">Goldcoin gain</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(player, index) in sortedList" :key="player.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ player.nickname }}</td>
                        <td class="text-center">{{ player.date }}</td>
                        <td class="text-center">{{ textNumber(player.freegain) }}</td>
                        <td class="text-center">{{ textNumber(player.goldgain) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>        
    </div>
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
.container {
    width: 1280px;
    justify-content: center;
    align-items: center;
    padding: 30px;
    margin: 20px;
    background: white;
}

.img-container {
    width: 100%; /* Масштабировать изображение по ширине родительского контейнера */
    height: auto; /* Масштабировать высоту пропорционально */
}
</style>

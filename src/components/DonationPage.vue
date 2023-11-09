<script>
    export default {
        name: 'Donation_Page',
        data() {
            return {
                showCopyTooltip: false,
                baseUrl: this.$root.serverUrl,
            };
        },

        mounted() {        
        },

        methods: {
            copyToClipboard() {
                const address = "0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA";
                const tempInput = document.createElement("input");
                tempInput.value = address;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
                this.$emit("showAlert", "Address copied to clipboard!");
            },
        },

    };

</script>

<template>
    <div class="mainbox">
        <div class="container">
            <h3>You can support the project</h3>
            <img src="/images/donation_title.jpg" alt="Image" class="img-container rounded-3 mb-3">
            <p style="text-align: justify">We have released the beta token <b>AZI Online beta token (AZI-b)</b>, which can be exchanged for the in-game currency <b>Goldcoin</b>.</p>
            <p style="text-align: justify">We will distribute these tokens as part of a marketing campaign, as well as among users who support our project. Supporting the project will allow us to continue our work and release a full version of the application, as well as conduct exciting marketing campaigns to attract new users.</p>
            <p style="text-align: justify">In the event of the release of the alpha version of the game, we plan to exchange beta tokens AZI-b for new ones at a rate of 10 new tokens for 1 beta token. However, we strongly advise against considering support for the project as a secure investment.</p>
            <p style="text-align: justify">
                At the moment, we have not implemented a smart contract for the automatic exchange of your donations for our tokens, but you can support us by making a direct transfer of BNB or BUSD to our wallet on the BNB Smart Chain network at
                <span class="copy-address" @click="copyToClipboard" title="Copy to clipboard"><b>0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA</b></span>.                
                Within 24 hours of your donation, we will send you our AZI Online beta tokens (AZI-b) in response to your transaction at a rate of <b>1 BUSD = 10 AZI-b</b> or <b>1 BNB = 2500 AZI-b</b>.
            </p>
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

.copy-address {
  cursor: pointer; /* Изменение курсора при наведении */  
}
</style>

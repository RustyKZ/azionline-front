<script>
    export default {
        name: 'Addpost_content',
        data() {
            return {
                baseUrl: process.env.BASE_URL
            };
        },
};
</script>

<template>
    <div class="mainbox">
        <div class="container">
            <h1>Add new post</h1>
            <form id="postForm" :action="baseUrl+'/addpost'" method="POST" enctype="multipart/form-data">
                <label for="title">Title:</label><br>
                <input class="full" type="text" id="title" name="title" required><br><br>

                <label for="subTitle">Subtitle:</label><br>
                <textarea class="full" id="subTitle" name="subTitle" rows="4" required></textarea><br><br>

                <label for="text">Text:</label><br>
                <textarea class="full" id="text" name="text" rows="8" required></textarea><br><br>

                <label for="image">Picture:</label><br>
                <input type="file" id="image" name="image" accept="image/*" required><br><br>

                <input type="submit" value="Add post">
            </form>
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
    padding: 5px;
}

.full {
    width: 100%;
}

</style>

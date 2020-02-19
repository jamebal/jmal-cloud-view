<template>
    <!-- 背景图高斯模糊效果 -->
    <div class="bgFilter">
        <div class="box">
            <img src="http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1582723247&t=3060bfc4978e78d3accef89c1eb7dc8e" alt="img" class="bg">
            <div class="content">
                <!-- <img src="http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1582723247&t=3060bfc4978e78d3accef89c1eb7dc8e" alt="img"> -->
                <div class="text">我是文字我是文字我是文字</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "bgFilter"
};
</script>
<style lang="scss" scoped>
.bgFilter {
    width: 100%;
    height: 100%;
    background-color: #000;
    .box {
        width: 700px;
        height: 500px;
        position: relative;
        // 我是模糊的背景
        .bg {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
            -webkit-filter: blur(8px);
            -moz-filter: blur(8px);
            -o-filter: blur(8px);
            -ms-filter: blur(8px);
            filter: blur(8px);
        }
        // 我是图片和上面的文字
        .content {
            .text {
                width: 100%;
                padding: 30px;
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, 0.7);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                text-align: right;
            }
            img {
                position: absolute;
                top: 50%;
                left: 5%;
                transform: translate(0, -50%);
                z-index: 2;
            }
        }
    }
}
</style>
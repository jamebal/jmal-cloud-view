<template>
  <div class="container">
    <div class="process-area" id="drag-ball">
      <div class="process-anime">
        <div class="cube-a" style="top: -115%;"></div>
        <div class="cube-b" style="top: -115%;"></div>

        <div class="done">
          <svg xmlns="http://www.w3.org/2000/svg" class="done-icon checkmark">
            <!--"M 14.1 27.2 l 7.1 7.2 l 16.7 -16.8"-->
            <path d="M 13.1 21.2 l 5.1 5.2 l 12.7 -12.8" class="checkmark__check" style="fill: transparent;"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
  }
  .process-area {
    right: 2%;
    bottom: 2%;
    width: 92px;
    height: 92px;
    cursor: pointer;
    background: #eee;
    margin: auto;
    overflow: hidden;
    background-size: 100% 100%;
    border-radius: 50%;
    position: fixed;
    transition: .5s;
  }
  .process-anime {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 4px solid #fff;
    transform: translate(-50%,-50%);
    width: 90px;
    height: 90px;
    background: linear-gradient(45deg,#fde47c,#fdeca6);
    border-radius: 50%;
    overflow: hidden;
  }
  .process-anime .cube-a {
    position: absolute;
    left: 50%;
    background: rgba(53,53,53,.3);
    width: 130px;
    height: 130px;
    border-radius: 50px;
    animation: fx-rotate 15s infinite linear;
    transform-origin: 50% 50%;
    transition: .5s;
  }
  .process-anime .cube-b {
    position: absolute;
    left: 50%;
    background: #fff;
    width: 130px;
    height: 130px;
    border-radius: 50px;
    animation: fx-rotate 10s infinite reverse linear;
    transform-origin: 50% 50%;
    transition: .5s;
  }

  /**成功**/
  .process-anime .done {
    position: absolute;
    width: 45px;
    height: 45px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(2.25);
  }
  .process-anime .done .checkmark {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    box-shadow: inset 0 0 0 #fdda65;
    animation: fill-data .4s ease-in-out .4s forwards,scale-data .3s ease-in-out .9s both;
  }
  .process-anime .done .checkmark__check {
    transform: translate(2px,2px);
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke-data .3s cubic-bezier(.65,0,.45,1) .8s forwards;
  }

  @keyframes fx-rotate {
     0% {
       transform: translate(-50%) rotate(0);
     }
     100% {
       transform: translate(-50%,2px) rotate(365deg);
     }
   }

  @keyframes scale-data {
    0%, 100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1,1.1,1);
    }
  }
  @keyframes fill-data {
    100% {
       box-shadow: inset 0 0 0 30px #fdda65;
    }
  }

  @keyframes stroke-data {
    100% {
      stroke-dashoffset: 0;
    }
  }

</style>

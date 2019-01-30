<template>
   <section class="error_info">
      <!--<img src="../assets/images/error.jpg" alt="error" :style="{height:$store.state.winH+'px'}">-->
      <div class="error_info_bg" style="background: url('/qtservice/images/error.png') center/contain no-repeat;height:550px">
         <p> {{errorInfo}}</p>
      </div>
   </section>
</template>

<script>
   export default {
      name: "error",
      data() {
         return {
            errorInfo: ""
         }
      },

      created() {
         let urlParams = urlParse(window.location.href);
         this.errorInfo = decodeURIComponent(urlParams.errorInfo);
      }
   }
</script>

<style lang="scss" scoped>
   .error_info {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      word-break: break-all;
      position: relative;
      overflow: hidden;
      padding-top: 1px;
      /*display: flex;*/
      .error_info_bg {
         width: 250px;
         margin: 0 auto;
         padding-top: 1px;
      }
      p {
         width: 100px;
         height: 60px;
         padding: 10px;
         background-color: #23C36D;
         /*line-height: 20px;*/
         text-align: center;
         font-size: 12px;
         margin: 140px auto 0 50px;
         -webkit-transform: rotate(-9deg);
         transform: rotate(-9deg);
         color: #ffffff;
      }
   }
</style>

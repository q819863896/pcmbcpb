<template>
   <div class="login_box" style="background-image: url(./static/pc_bg.jpg)">
      <img src="../assets/long_logo.png" alt="logo" class="long_logo">
      <el-form :model="loginInfo" :rules="loginRules" ref="loginInfo" class="demo-ruleForm login-container">
         <h3 class="title">系统登录</h3>
         <el-form-item prop="account" style="position: relative">
            <el-input type="text" name="account" v-model.trim="loginInfo.account" placeholder="账号" autofocus>
               <!--<template slot="append">@xdf.cn</template>-->
            </el-input>
            <!--<div class="acc_suffix">@xdf.cn</div>-->
         </el-form-item>
         <el-form-item prop="password">
            <el-input type="password" name="password" v-model.trim="loginInfo.password" auto-complete="off" placeholder="密码"></el-input>
         </el-form-item>
         <el-checkbox v-model="isRememberPsw" class="remember">记住密码</el-checkbox>
         <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
         </el-form-item>
      </el-form>
   </div>
</template>
<script>
   import { requestUser, requestToken } from '../api/api';
   import ajax from 'axios';
   //import NProgress from 'nprogress'
   export default {
      data() {
         return {
            logining: false,
            loginInfo: {
               account: '',
               password: '',
            },
            verify: [],
            loginRules: {
               account: [
                  { required: true, message: '请输入账号', trigger: 'blur' },
               ],
               password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
               ],
               verify: [
                  { type: 'array', required: true, message: '请输入验证码', trigger: 'blur' },
               ],
            },
            isRememberPsw: localStorage.getItem('isRememberPsw') === 'true' ? true : false,
         };
      },
      methods: {
         handleReset2() {
            this.$refs.loginInfo.resetFields();
         },
         handleSubmit2(ev) {
            let _this = this;
            this.$refs.loginInfo.validate((valid) => {
               if (valid) {
                  if (this.rejectSubmit === true) return false;
                  //_this.$router.replace('/table');
                  this.logining = true;
                  let params = new URLSearchParams();
                  params.append('username', this.loginInfo.account);
                  params.append('password', this.loginInfo.password);
                  params.append('grant_type', 'password');
                  params.append('scope', 'read');
                  params.append('client_id', 'rajithapp');
                  params.append('client_secret', 'secret');
                  requestToken(params).then(res => {
                     let token = res.value;
                     this.logining = false;
                     if (token) {
                        sessionStorage.setItem('token', token);
                        let params = new URLSearchParams();
                        requestUser(params).then(res => {
                           this.logining = false;
                           //NProgress.done();
                           let { message, status, datas } = res;
                           if (status !== 0) {
                              if (status === '' || status === undefined || status === null) {
                                 this.$message({
                                    type: 'error',
                                    message: '系统登录超时！',
                                 });
                              } else {
                                 this.$message({
                                    duration: 5000,
                                    showClose: true,
                                    message: message,
                                    type: 'error',
                                 });
                              }
                           } else {
                              sessionStorage.setItem('user', JSON.stringify(datas));
                              this.$router.push({ path: '/dataTable' });
                           }
                        });
                     } else {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        this.$message.error('输入信息错误!');
                     }
                     // this.createCode();
                  });
                  this.rememberPsw();
               } else {
                  console.log('error submit!!');
                  return false;
               }
            });
         },
         //是否记住密码？？
         rememberPsw() {
            localStorage.setItem('isRememberPsw', this.isRememberPsw);
            if (this.isRememberPsw === true) {
               localStorage.setItem('loginInfo', JSON.stringify(this.loginInfo));
            } else {
               let loginInfo = {
                  account: '',
                  password: '',
               };
               localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            }
         },
         // 图片验证码
         createCode() {
            loginVerify().then(res => {
               let { message, status, datas } = res;
               if (status === 0) {
                  let { captcha, catoken } = datas;
                  this.verifyCode = captcha;
                  sessionStorage.setItem('catoken', catoken);
               } else if (status === '' || status === undefined || status === null) {
                  this.$message({
                     type: 'error',
                     message: '系统登录超时！',
                  });
               } else {
                  this.$message({
                     type: 'error',
                     message: message,
                  });
               }
            });
         },
      },
      mounted() {
         // let that = this;
         if (localStorage.getItem('loginInfo')) {
            let loginInfo = localStorage.getItem('loginInfo');
            let loginJSON = JSON.parse(loginInfo);
            // let {account, password} = loginJSON;
            this.$set(this.loginInfo, 'account', loginJSON.account);
            this.$set(this.loginInfo, 'password', loginJSON.password);
         }
         window.addEventListener('keydown', (e) => {
            if (e.keyCode === 13 || e.keyCode === 'enter') {
               this.handleSubmit2();
            }
         });
      },
   };
</script>

<style lang="scss">
   .login_box{
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      border-top: 1px solid transparent;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      position: relative;
      overflow: hidden;
      .long_logo{
         width: 210px;
         height: 34px;
         position: absolute;
         top: 80px;
         left: 50%;
         margin-left: -105px;
      }
      .login-container{
         -webkit-border-radius: 5px;
         border-radius: 5px;
         -moz-border-radius: 5px;
         background-clip: padding-box;
         margin: 180px auto;
         width: 350px;
         padding: 35px 35px 15px 35px;
         background: #fff;
         border: 1px solid #eaeaea;
         box-shadow: 0 0 40px 6px #cac6c6;
         .title{
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
         }
         .remember{
            margin: 0 0 35px 0;
         }
      }
      .el-input__inner{
         line-height: 1;
      }
   }

   .acc_suffix{
      width: auto;
      height: 100%;
      position: absolute;
      top: 0;
      right: 10px;
   }
</style>

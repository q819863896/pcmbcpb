import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import locale from 'element-ui/lib/locale/lang/zh-CN';
import 'url-search-params-polyfill';
import promise from 'es6-promise';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icon-fonts/iconfont.css';
import '@/assets/styles/main.scss';
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router';
import store from './vuex/store';
import Vuex from 'vuex';
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes';
//去掉引用的mock
// import Mock from './mock'
//Mock.bootstrap();
import axios from 'axios';

import Vuevalidator from 'vue-validator';
// import i18n from './common/js/i18n.js';
Vue.use(Vuevalidator);


promise.polyfill();
Vue.use(ElementUI, { locale });
Vue.use(VueRouter);
Vue.use(Vuex);

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
   routes,
});

// router.beforeEach((to, from, next) => {
//    //NProgress.start();
//    const nextRoute = ['/testlogin'];
//    if (to.path === '/login') {
//       sessionStorage.removeItem('user');
//    }
//
//    let user = JSON.parse(sessionStorage.getItem('user'));
//    if (nextRoute.indexOf(to.path) !== -1) {
//       next();
//    } else if (!user && to.path !== '/login') {
//       next({ path: '/login' });
//    } else {
//       next();
//    }
// });

//router.afterEach(transition => {
//NProgress.done();
//});

window.router = router;

new Vue({
   router,
   store,
   render: h => h(App),
   data: {
      Bus: new Vue(),
   },
}).$mount('#app');

// new Vue({
//   el: '#app',
//   template: '<App/>',
//   router,
//   store,
//   components: {App},
//   data: {
//     Bus: new Vue()
//   }
// });

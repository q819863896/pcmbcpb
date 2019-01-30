import Login from './views/Login.vue';
import NotFound from './views/exception/404.vue';

import Main from './views/Main.vue';

//测试登陆
import TestLogin from './views/TestLogin.vue';

import HOME from './views/Home.vue';
import SCHOOL from './views/school/School.vue';
import COMPANY from './views/company/company.vue';
import RESERVATION from './views/reservation/reservation.vue';
import WLUSER from './views/wluser/wluser.vue';
import COLLABORATE from './views/collaborate/collaborate.vue';
import ACADEMY from './views/academies/academy.vue';
import MANAGER from './views/manager/manager.vue';

import DataTable from "./views/dataTable/dataTable.vue";
import projieshao from "./views/projieshao/projieshao.vue";
import studentfeedback from "./views/studentfeedback/studentfeedback.vue";


//子级组件
// import stuLists from './views/childcomps/idx_stu_lists.vue'

let routes = [
   {
      path: '/login',
      component: Login,
      name: 'login',
      hidden: true,
   },
   {
      path: '/',
      component: Login,
      name: 'login',
      hidden: true,
   },
   {
      path: '/testlogin',
      component: TestLogin,
      name: 'testlogin',
      hidden: true,
   },
   {
      path: '/404',
      component: NotFound,
      name: '404',
      hidden: true,
   },
   // {
   //    path: '/',
   //    component: HOME,
   //    name: 'school',
   //    leaf: true,
   //    iconCls: 'iconfont icon-xuexiao',
   //    children: [
   //       { path: '/collaborate', component: COLLABORATE, name: '合作院校' },
   //    ],
   // },
   // {
   //    path: '/',
   //    component: HOME,
   //    name: 'company',
   //    leaf: true,
   //    iconCls: 'iconfont icon-gongsi',
   //    children: [
   //       { path: '/academy', component: ACADEMY, name: '全部院校' },
   //    ],
   // },
   // {
   //    path: '/',
   //    component: HOME,
   //    name: 'wluser',
   //    leaf: true,
   //    iconCls: 'iconfont icon-yonghu',
   //    children: [
   //       { path: '/manager', component: MANAGER, name: '用户管理' },
   //    ],
   // },
   {
      path: '/',
      component: HOME,
      name: 'MANAGER',
      leaf: true,
      iconCls: 'iconfont icon-yonghu',
      children: [
         { path: '/manager', component: MANAGER, name: '用户管理' },
      ],
   },
   {
      path: '/',
      component: HOME,
      name: 'projieshao',
      leaf: true,
      iconCls: 'iconfont icon-yonghu',
      children: [
         { path: '/projieshao', component: projieshao, name: '项目介绍' },
      ],
   },
   {
      path: '/',
      component: HOME,
      name: 'studentfeedback',
      leaf: true,
      iconCls: 'iconfont icon-xuexiao',
      children: [
         { path: '/studentfeedback', component: studentfeedback, name: '学生反馈' },
      ],
   },
   {
      path: '/',
      component: HOME,
      name: 'dataTable',
      leaf: true,
      iconCls: 'iconfont icon-gongsi',
      children: [
         { path: '/dataTable', component: DataTable, name: '上传数据' },
      ],
   },
   {
      path: '*',
      hidden: true,
      redirect: { path: '/404' },
   },
];

export default routes;

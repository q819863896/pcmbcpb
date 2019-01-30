<template lang="html">
   <section class="index_box" style="background-image:url(./static/bg_pic.jpg)">
      <div class="index_box_inner">
         <div class="index_box_inner2">
            <section class="cal_head">
               <div class="cal_sel">
                  <el-select v-model="courseId" placeholder="请选择课程" @change="selectCourse">
                     <el-option v-for="item in options" :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
                  </el-select>
               </div>
               <div class="time_sel">
                  <i class="el-icon-arrow-left" @click="indexToFront"></i><span>{{$store.state.timeYear}}年{{$store.state.timeMonth}}月</span><i class="el-icon-arrow-right" @click="indexToNext"></i>
               </div>
               <div class="cre_meeting">
                  <span>新建会议</span>
               </div>
            </section>

            <section class="cal_body" v-loading="pageLoading">
               <div class="cal_time">
                  <el-row>
                     <el-col :span="3"><span>&nbsp;</span></el-col>
                     <el-col :span="3" v-for="(item,index) in $store.state.dateList" :key="index"><span>{{item.value}}&nbsp;{{item.week}}</span></el-col>
                  </el-row>
               </div>

               <div class="cal_lists">
                  <el-row v-for="(item,index) in $store.state.courseLists" :key="index">
                     <el-col :span="3" :style="{height:maxListNum*30+'px'}">
                        <div>
                           <img :src="item.tea_picture" alt="image">
                           <p>{{item.tea_name}}</p>
                           <i class="pic_icon el-icon-caret-left"></i>
                        </div>
                     </el-col>
                     <el-col :span="3" :style="{height:maxListNum*30+'px'}" v-for="(itemChild,indexChild) in item.sevenList" :key="indexChild" class="course_list">
                        <ul>
                           <li v-for="(itemGrandson,indexGrandson) in itemChild.courseList">
                              {{toDouble(itemGrandson.tea_ch_time)}}:00 - {{toDouble(itemGrandson.tea_ch_time+1)}}:00&nbsp;&nbsp;<em>{{itemGrandson.stu_name}}</em>
                              <span style="opacity:0">{{itemGrandson.stu_id}}</span>
                           </li>
                        </ul>
                     </el-col>
                  </el-row>
               </div>
            </section>
            <stuComps ref="stuDialog" :dialogTableVisible="dialogTableVisible" :childPageLoading="childPageLoading" @stuDataChild="closeDialogTableVisible" @closeChildPageLoading="closeChildPageLoading"></stuComps>
         </div>
      </div>
   </section>
</template>

<script>
   import {indexGetNowDate, indexGetCourseInfo, indexGetCourseTable, indexGetStudentTable, getTeaPic} from '../../api/api';
   import stuComps from '../../components/stu_lists.vue';
   import axios from 'axios';

   export default {
      data() {
         return {
            childPageLoading: false,
            pageLoading: false,
            //课程信息
            courseId: '',
            courseList: [],
            options: [],
            //课程信息...
            //日历头部信息
            isToBackDate: {
               timeBaseDay: '',
               flag: '0',
               timeZone: ''
            },
            storeTimeBaseDay: '',
            weeks: [{
               value: '星期日',
            }, {
               value: '星期一',
            }, {
               value: '星期二',
            }, {
               value: '星期三',
            }, {
               value: '星期四',
            }, {
               value: '星期五',
            }, {
               value: '星期六',
            }],
            //日历头部信息...
            //学生课程列表
            dialogTableVisible: false,
            //学生课程列表...
            lengthArr: [],
            maxListNum: '',
         }
      },
      components: {
         stuComps,
      },
      methods: {
         closeDialogTableVisible(option) {
            this.dialogTableVisible = option;
         },
         closeChildPageLoading(option) {
            this.childPageLoading = option;
         },
         getStudentTable() {
            let params = {};
            params.stuId = this.$store.state.stuId;
            params.timeBaseDay = this.storeTimeBaseDay;
            indexGetStudentTable(params).then((res) => {
               let {message, status, datas} = res;
               // this.stuLists = res.datas;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     })
                  } else {
                     this.$message({
                        message: message,
                        type: 'error'
                     });
                  }
               } else {
                  this.$store.dispatch('getStuLists', datas);
               }
            })
         },
         getCourseInfo() {
            indexGetCourseInfo().then((res) => {
               let {message, status, datas} = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     })
                  } else {
                     this.$message({
                        message: message,
                        type: 'error'
                     });
                  }
               } else {
                  this.options = datas;
                  // this.initVal = datas[0].courseName;
                  this.courseId = datas[0].courseId;
               }
            })
         },
         selectCourse(value) {
            this.courseId = value;
            this.getCourseTable();
         },
         getCourseTable() {
            // let courseName = {};
            // courseName = this.options.find((item) => {
            //   return item.courseName === value;
            // });
            var toBackCouseInfo = {};
            toBackCouseInfo.timeBaseDay = this.storeTimeBaseDay;
            toBackCouseInfo.courId = this.courseId;
            let courseInfo = Object.assign({}, toBackCouseInfo);
            indexGetCourseTable(courseInfo).then((res) => {
               // this.courseList = res.datas;
               let {message, status, datas} = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     })
                  } else {
                     this.$message({
                        message: message,
                        type: 'error'
                     });
                  }
               } else {
                  datas.forEach((item, index) => {
                     item.tea_picture = `${axios.defaults.baseURL}/zxyy/upload/showImage?fileName=${item.tea_picture}`;
                     item.sevenList.forEach((itemChild, indexChild) => {
                        this.lengthArr.push(itemChild.courseList.length)
                     })
                  })
                  let lengthArr = this.lengthArr.map(n => parseInt(n))
                  this.maxListNum = Math.max(...lengthArr) || 3;
                  this.$store.dispatch('getCourseLists', datas);
               }
            })
         },
         getNowDate() {
            this.pageLoading = true;
            let nowDate = Object.assign({}, this.isToBackDate);
            indexGetNowDate(nowDate).then((res) => {
               let {message, status, datas} = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     })
                  } else {
                     this.$message({
                        message: message,
                        type: 'error'
                     });
                  }
               } else {
                  this.$store.dispatch('getDateList', datas.list);
                  this.storeTimeBaseDay = datas.timeBaseDay
                  this.$store.dispatch('getTimeYear', datas.timeYear);
                  this.$store.dispatch('getTimeMonth', this.toDouble(datas.timeMonth));
                  this.$store.dispatch('getTimeDay', datas.timeDay);
                  let _this = this;
                  datas.list.forEach(function (val, key) {
                     val.week = _this.weeks[key].value;
                  });
                  // status === 0 && (this.pageLoading = false);
                  this.pageLoading = false;
                  this.getCourseTable();
                  this.getStudentTable();
               }
            })
         },
         indexToFront() {
            this.isToBackDate.timeBaseDay = this.storeTimeBaseDay
            this.isToBackDate.flag = -1;
            this.getNowDate();
         },
         indexToNext() {
            this.isToBackDate.timeBaseDay = this.storeTimeBaseDay
            this.isToBackDate.flag = 1;
            this.getNowDate();
         },
         toDouble(num) {
            return num < 10 ? '0' + num : num;
         }
      },
      mounted() {
         this.getCourseInfo();
         this.getNowDate();
         var localZone = new Date().getTimezoneOffset() / 60;
         this.isToBackDate.timeZone = localZone;
      },
      updated() {
         let _this = this;
         let course_row = $('.cal_lists .el-row');
         let course_list = $('.cal_lists .el-row .course_list');
         let time_list = $('.time_list');
         course_list.each(function (index, ele) {
            if (course_list.eq(index).children('ul').html()) {
               $(this).children('ul').children('li').unbind('click').on('click', function (event) {
                  event.preventDefault();
                  let stuId = $(this).children('span').html();
                  let stuName = $(this).children('em').html();
                  _this.$store.dispatch('getStuId', stuId);
                  _this.$store.dispatch('getStudentName', stuName);
                  if (stuId !== '0') _this.dialogTableVisible = true;
                  _this.$refs.stuDialog.getStudentTable()
               })
            }
         });
      },
      watch: {
         courseId: 'getCourseTable'
      }
   }
</script>

<style lang="scss">
   @import "../../assets/styles/common.scss";
   @import "../../assets/styles/index.scss";
</style>

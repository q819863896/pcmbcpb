<template>
  <div class="stu_lists_page">
    <!--<el-dialog :title="$store.state.stuName+'的选课信息'" left :visible.sync="this.dialogTableVisible" :before-close="closeStuDialog">-->
    <el-dialog center :visible.sync="this.dialogTableVisible" :before-close="closeStuDialog">
      <div class="time_sel">
        <i class="el-icon-arrow-left" @click="indexToFront"></i><span>{{$store.state.timeYear}}年{{$store.state.timeMonth}}月</span><i
        class="el-icon-arrow-right" @click="indexToNext"></i>
      </div>

      <div class="cal_time">
        <el-row>
          <el-col :span="3"><span>&nbsp;</span></el-col>
          <el-col :span="3" v-for="(item,index) in $store.state.dateList" :key="index" class="time_list"><span><em>{{item.value}}</em>&nbsp;{{item.week}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="stu_lists" v-loading="this.childPageLoading">
        <el-row v-for="(item,index) in $store.state.stuLists" :key="index">
          <el-col :span="3" :style="{height:maxListNum*40+'px'}">
            <div>
              <p>{{toDouble(item.tableTime)}}:00&nbsp;</p>
            </div>
          </el-col>
          <el-col :span="3" :style="{height:maxListNum*40+'px'}" v-for="(itemChild,indexChild) in item.sevenList" :key="indexChild" class="course_list">
            <!--<i class="el-icon-circle-close-outline" v-show="itemChild.courseList.length"></i>-->
            <ul>
              <li v-for="(itemGrandson,indexGrandson) in itemChild.courseList" v-show="itemGrandson.stu_id!==0">
                {{itemGrandson.course_name}}&nbsp;&nbsp;{{itemGrandson.stu_name}}<span style="opacity: 0">{{itemGrandson.tool_id}}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <div class="no_message" v-show="$store.state.stuLists.length===0">暂无信息</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {indexGetNowDate, indexGetCourseInfo, indexGetCourseTable, indexGetStudentTable} from '../api/api';

  export default {
    name: "stu_lists",
    props: ['dialogTableVisible', 'childPageLoading'],
    data() {
      return {
        //课程信息
        courseId: '',
        courseList: [],
        options: [],
        // initVal: '',
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
        // timeYear: '',
        // timeMonth: '',
        // timeDay: '',
        //学生课程列表
        // stuId: '',
        // stuName: '',
        lengthArr: [],
        maxListNum: '',
      }
    },
    methods: {
      //向父级发送关闭课表命令
      closeStuDialog() {
        this.$emit('stuDataChild', false)
      },
      closePageLoading() {
        this.$emit('closeChildPageLoading', false)
      },
      //获取学生课程列表
      getStudentTable() {
        let params = {};
        params.stuId = this.$store.state.stuId;
        params.timeBaseDay = this.storeTimeBaseDay;
        indexGetStudentTable(params).then((res) => {
          // this.stuLists = res.datas;
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
            this.$store.dispatch('getStuLists', datas);

            datas.forEach((item, index) => {
              item.sevenList.forEach((itemChild, indexChild) => {
                this.lengthArr.push(itemChild.courseList.length)
              })
            });
            // status === 0 && this.closePageLoading()
            this.closePageLoading()
            let lengthArr = this.lengthArr.map(n => parseInt(n))
            this.maxListNum = Math.max(...lengthArr)
          }
        })
      },

      //获取学生课程名称
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
      getCourseTable(value) {
        // let courseName = {};
        // courseName = this.options.find((item) => {
        //   return item.courseName === value;
        // });
        // this.getCourseInfo(value)
        this.courseId = value;
        var toBackCouseInfo = {};
        toBackCouseInfo.timeBaseDay = this.storeTimeBaseDay;
        toBackCouseInfo.courId = this.courseId;
        let courseInfo = Object.assign({}, toBackCouseInfo);
        indexGetCourseTable(courseInfo).then((res) => {
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
            this.courseList = datas;
            this.$store.dispatch('getCourseLists', datas);
          }
        })
      },
      getNowDate() {
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
            // this.timeYear = res.datas.timeYear
            // this.timeMonth = this.toDouble(res.datas.timeMonth)
            // this.timeDay = res.datas.timeDay
            this.$store.dispatch('getTimeYear', datas.timeYear);
            this.$store.dispatch('getTimeMonth', this.toDouble(datas.timeMonth));
            this.$store.dispatch('getTimeDay', datas.timeDay);
            var _this = this;
            datas.list.forEach(function (val, key) {
              val.week = _this.weeks[key].value;
            });
            this.getCourseTable(this.courseId);
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
      // this.getNowDate();
      // this.getCourseInfo();
      var localZone = new Date().getTimezoneOffset() / 60;
      this.isToBackDate.timeZone = localZone;
    },
  }
</script>

<style lang="scss">
  .stu_lists_page {
    width: 100%;
    .el-dialog {
      .el-dialog__header {
        padding: 0;
      }
      width: 90%;
      .time_sel {
        width: 200px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        margin-left: calc(50% - 100px);
        margin-bottom: 30px;
        position: relative;
        text-align: center;
        i {
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 100%;
          display: inline-block;
          vertical-align: middle;
          cursor: pointer;
          color: #111111;
          background-color: rgba(255, 255, 255, .6);
          &:hover {
            background-color: rgba(234, 234, 234, .8);
          }
        }
        span {
          width: 125px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          display: inline-block;
          color: #111111;
        }
      }
    }
    .stu_lists {
      width: 100%;
      border: 1px solid #000;
      .el-row {
        /*min-height: 40px;*/
        text-align: center;
        &:hover {
          background-color: rgba(234, 234, 234, 0.8);
        }
        & + .el-row {
          border-top: 1px solid #000;
        }
        .el-col {
          position: relative;
          /*min-height: 40px;*/
          cursor: pointer;
          position: relative;
          & + .el-col {
            border-left: 1px solid #000;
          }
          i {
            width: 12px;
            height: 12px;
            display: inline-block;
            position: absolute;
            top: 50%;
            margin-top: -6px;
            right: 5px;
          }
          /*&:hover {
            background-color: rgba(201, 201, 201, 0.9);
          }*/
          ul {
            // width: 100%;
            // height: 100%;
            margin: 0;
            padding: 0;
            li {
              width: 99%;
              height: 40px;
              line-height: 40px;
              padding-left: 1%;
              color: #000;
              text-align: center;
              list-style: none;
            }
          }
          &:nth-of-type(1) {
            text-align: center;
            cursor: default;
            &:hover {
              background-color: transparent;
            }
            div {
              width: 100%;
              height: 100%;
              line-height: 1;
              p {
                width: 100%;
                height: 0;
                vertical-align: middle;
                line-height: 1;
                text-align: center;
                color: #000;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .no_message {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top: 10px;
    }
  }
</style>

<template>
  <el-dialog title="详细评分信息" center :visible.sync="this.scanScoreVisible" width="50%" :before-close="closeScanScoreVisible">
    <div class="score">
      <el-form ref="form" :model="form">
        <el-form-item :label="form.score_title_one">
          <el-radio-group disabled v-model="form.score_answer_one">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
            <!--<el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>-->
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="form.score_title_two" class="teacher_score" prop="teaArray">
          <div style="width: 100%;height: 40px"></div>
          <div v-for="(item,index) in teaList" :key="index">
            <span style="margin-left: 20px">{{item.tea_name}}:&nbsp;</span>
            <el-rate v-model="item.score" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
          </div>
        </el-form-item>

        <el-form-item :label="form.score_title_three">
          <el-input type="text" disabled v-model="form.score_answer_three"></el-input>
        </el-form-item>

        <el-form-item :label="form.score_title_four">
          <el-rate disabled v-model="form.score_answer_four" show-score text-color="#ff9900" score-template="{value}"></el-rate>
        </el-form-item>

        <el-form-item :label="form.score_title_five">
          <el-input type="text" disabled v-model="form.score_answer_five"></el-input>
        </el-form-item>

        <!--<el-form-item class="score_sub">
          <el-button type="primary" @click="onSubmit" :loading="this.submitLoading">提交</el-button>
        </el-form-item>-->
      </el-form>
    </div>
    <!--<span slot="footer" class="dialog-footer">
      <el-button @click="closeScanScoreVisible">取 消</el-button>
      <el-button type="primary" @click="closeScanScoreVisible">确 定</el-button>
    </span>-->
  </el-dialog>
</template>

<script>
  import util from '../common/js/util'
  //import NProgress from 'nprogress'
  import {getDetailScoreApi} from '../api/api';

  export default {
    name: "score",
    props: ['scanScoreVisible', 'scoreId'],
    data() {
      return {
        form: {
          scoreId: 0,
          scoreUUID: '',
          // score_title_one: '1、请问本课程是否对您有帮助？',
          // score_title_two: '2、您对老师的满意度为几分？',
          // score_title_three: '3、您会推荐课程中的哪位老师？',
          // score_title_four: '4、请您为课程内容安排的合理性打分？',
          // score_title_five: '5、如您有其他任何对于本课程的建议请在此填写？',
          score_title_one: '',
          score_title_two: '',
          score_title_three: '',
          score_title_four: '',
          score_title_five: '',
          score_answer_one: '',
          score_answer_two: 0,
          score_answer_three: '',
          score_answer_four: 0,
          score_answer_five: '',
          teaArray: '',
          teaIds: '',
          teaScores: '',
        },
        teaIdsTemporary: [],
        teaScoresTemporary: [],
        teaIdsTempStr: '',
        teaScoresTempStr: '',
        teaList: [],
        submitLoading: false,
      }
    },
    methods: {
      //向父级发送关闭课表命令
      closeScanScoreVisible() {
        this.$emit('closeScanScoreVisible', false)
      },
      getDetailScore(scoreId) {
        console.log('scoreId', this.$props.scoreId)
        let param = new URLSearchParams();
        param.append("scoreId", scoreId);
        getDetailScoreApi(param).then((res) => {
          let {message, status, datas} = res;
          console.log('res', res);
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
            this.form.score_title_one = datas.score_title_one;
            this.form.score_title_two = datas.score_title_two;
            this.form.score_title_three = datas.score_title_three;
            this.form.score_title_four = datas.score_title_four;
            this.form.score_title_five = datas.score_title_five;
            this.form.score_answer_one = datas.score_answer_one;
            this.form.score_answer_two = parseInt(datas.score_answer_two);
            this.form.score_answer_three = datas.score_answer_three;
            this.form.score_answer_four = parseInt(datas.score_answer_four);
            this.form.score_answer_five = datas.score_answer_five;
            this.teaList = datas.scoreTeaList;
          }
        });
      }
    },
    // mounted() {
    //   console.log('this.$props', this.$props)
    // },
    // watch: {
    //   scoreId: function () {
    //     console.log('watch.this.scoreId', this.scoreId)
    //   },
    // }
  }
</script>

<style lang="scss">
  .score {
    /*width: 100%;
    margin: 50px auto;
    padding: 0 80px 30px;
    border: 1px solid transparent;
    box-shadow: 0 0 40px 6px #cac6c6;*/
    p {
      width: 100%;
      line-height: 30px;
      margin: 60px auto 50px;
      text-indent: 2em;
      font-size: 16px;
      color: #333333;
    }
    .score_sub {
      text-align: center;
    }
    .el-form {
      .el-form-item {
        /*.teacher_score {
          .el-form-item__label {
            width: 100%;
            display: block;
            text-align: left;
          }
        }*/
        @media screen and (max-width: 767px) {
          .el-form-item__label {
            width: 100%;
            display: block;
            text-align: left;
          }
        }
        .el-form-item__content {
          .el-rate {
            width: 150px;
            display: inline-block;
          }
          button {
            width: 150px;
            height: 40px;
            margin-top: 20px;
            color: #fff;
            background-color: #409EFF;
            border-color: #409EFF;
          }
        }
      }
    }
    @media screen and(max-width: 767px) {
      width: 3rem;
      margin: 0.2rem auto;
      padding: 0 0.2rem 0.2rem;
      border: 1px solid transparent;
      -webkit-box-shadow: 0 0 40px 6px #cac6c6;
      box-shadow: 0 0 40px 6px #cac6c6;
      p {
        width: 100%;
        line-height: 25px;
        margin: 40px auto 50px;
        text-indent: 2em;
        font-size: 14px;
        color: #333333;
      }
      .score_sub {
        text-align: center;
      }
      .el-form {
        .el-form-item {
          .el-form-item__label {
            font-size: 12px;
            text-align: left;
          }
          .el-form-item__content {
            font-size: 12px;
            .el-rate {
              width: 150px;
              display: inline-block;
            }
            button {
              width: 150px;
              height: 40px;
              margin-top: 10px;
              color: #fff;
              background-color: #409EFF;
              border-color: #409EFF;
            }
          }
        }
      }
    }
  }
</style>

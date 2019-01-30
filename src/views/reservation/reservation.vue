<template>
   <section>
      <!--显示菜单路径-->
      <el-col :span="24" class="warp-breadcrum">
         <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item> -->
            <el-breadcrumb-item>预约信息</el-breadcrumb-item>
         </el-breadcrumb>
      </el-col>

      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
         <el-form :inline="true" :model="filters">
            <el-form-item>
               <el-input v-model.trim="filters.name" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" v-on:click="getOrderInfoPC">查询</el-button>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="outputExcel">导出excel</el-button>
            </el-form-item>
         </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="OrderInfos" highlight-current-row v-loading="listLoading" tooltip-effect="dark" @selection-change="selsChange" style="width: 100%;">
         <!--<el-table-column type="selection" width="50"></el-table-column>-->
         <el-table-column prop="info_id" label="ID" width="60" sortable></el-table-column>
         <el-table-column prop="company_name" label="公司名称" width="110" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="info_visitDate" label="访问日期" width="110" sortable></el-table-column>
         <el-table-column prop="info_visitingMatters" label="来访事务" width="110" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_name" label="来访单位" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="country_name" label="来访国家" min-width="120" sortable></el-table-column>
         <el-table-column prop="school_contacts" label="访问姓名" width="110" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_mobile" label="访问手机号" width="120" sortable></el-table-column>
         <el-table-column prop="info_status" label="预约状态" width="110" sortable></el-table-column>
         <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
               <!--<el-button size="small" type="primary" :style="[scope.row.info_status==='待审核'?{}:{display:'none'}]" @click="approve(scope.row.info_id)">通过</el-button>-->
               <!--<el-button size="small" type="danger" :style="[scope.row.info_status==='待审核'?{}:{display:'none'}]" @click="cancel(scope.row.info_id)">取消</el-button>-->
               <el-button size="small" :style="[scope.row.info_ComVisEve||scope.row.info_VisComEve?{}:{display:'none'}]" @click="seeEve(scope.$index, scope.row)">评价</el-button>
               <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
               <!-- <el-button type="danger" size="small" :disabled="scope.row.courseStatus===0" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
            </template>
         </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
         <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
         <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;"/>
      </el-col>

      <!--编辑界面-->
      <el-dialog title="详细信息" center :visible.sync="editFormVisible" :close-on-click-modal="false">
         <span>预约信息</span>
         <hr>
         <span>分公司名称: {{ seeForm.company_name }}</span><br>
         <span>访问日期: {{ seeForm.info_visitDate }}</span><br>
         <span>访问时间: {{ seeForm.info_visitTimes }}</span><br>
         <span>随行人数: {{ seeForm.info_visitCount }}</span><br>
         <span>来访事务: {{ seeForm.info_visitingMatters }}</span><br>
         <span>备注: {{ seeForm.info_remarks }}</span><br>
         <span>当前状态: {{ seeForm.info_status }}</span><br>
         <span>访者信息</span>
         <hr>
         <span>来访单位名称: {{ seeForm.school_name }}</span><br>
         <span>来访单位所属国家: {{ seeForm.country_name }}</span><br>
         <span>访者真实姓名: {{ seeForm.school_contacts }}</span><br>
         <span>访者职位/职务: {{ seeForm.school_post }}</span><br>
         <span>访者手机号: {{ seeForm.school_mobile }}</span><br>
         <span>访问状态</span>
         <hr>
         <ul id="example-1">
            <li v-for="(item,index) in seeForm.list" :key="index"> {{ item }}</li>
         </ul>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">关闭</el-button>
            <el-button v-if="seeForm.info_status==='待审核'" type="primary" @click="approve(seeForm.info_id),editFormVisible = false">通过</el-button>
            <el-button v-if="seeForm.info_status==='待审核'" type="danger" @click="cancel(seeForm.info_id),editFormVisible = false">拒绝</el-button>
         </div>
      </el-dialog>
      <!--查看分数界面-->
      <el-dialog title="评分" center :visible.sync="ScoreVisible" :close-on-click-modal="false">
         <el-form :model="Scoreform" label-width="150px" ref="Scoreform">
            <span>分公司评价</span>
            <hr>
            <div class="addTeaInfoList">
               <el-form-item label="对方专业度：" prop="Comones">
                  <el-rate disabled v-model="Scoreform.Comones" show-score text-color="#ff9900"></el-rate>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="对方信息更新度：" prop="Comtwos">
                  <el-rate disabled v-model="Scoreform.Comones" show-score text-color="#ff9900"></el-rate>
               </el-form-item>
            </div>
            <el-form-item label="对方态度：" prop="Comthrs">
               <el-rate disabled v-model="Scoreform.Comthrs" show-score text-color="#ff9900"></el-rate>
            </el-form-item>
            <div class="addTeaInfoList">
               <el-form-item label="对方是否准时：" prop="Comfors">
                  <el-radio-group disabled v-model="Scoreform.Comfors">
                     <el-radio class="radio" label="1">是</el-radio>
                     <el-radio class="radio" label="2">否</el-radio>
                  </el-radio-group>
               </el-form-item>
            </div>
            <el-form-item label="建议及意见：" prop="Comfivs">
               <el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="Scoreform.Comfivs"></el-input>
            </el-form-item>

            <span>院校评价</span>
            <hr>
            <div class="addTeaInfoList">
               <el-form-item label="对方专业度：" prop="Visones">
                  <el-rate disabled v-model="Scoreform.Visones" show-score text-color="#ff9900"></el-rate>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="对方信息更新度：" prop="Vistwos">
                  <el-rate disabled v-model="Scoreform.Visones" show-score text-color="#ff9900"></el-rate>
               </el-form-item>
            </div>
            <el-form-item label="对方态度：" prop="Visthrs">
               <el-rate disabled v-model="Scoreform.Visthrs" show-score text-color="#ff9900"></el-rate>
            </el-form-item>
            <div class="addTeaInfoList">
               <el-form-item label="对方是否准时：" prop="Visfors">
                  <el-radio-group disabled v-model="Scoreform.Visfors">
                     <el-radio class="radio" label="1">是</el-radio>
                     <el-radio class="radio" label="2">否</el-radio>
                  </el-radio-group>
               </el-form-item>
            </div>
            <el-form-item label="建议及意见：" prop="Visfivs">
               <el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="Scoreform.Visfivs"></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="ScoreVisible = false">关闭</el-button>
         </div>
      </el-dialog>
   </section>
</template>
<script>
   import {getOrderInfoPC, getOneOrderInfoPc, downloads, approval, cancel, moverRed} from "../../api/api";

   export default {
      data() {
         return {
            filters: {
               name: ""
            },
            OrderInfos: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [], //列表选中列

            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            ScoreVisible: false,
            editFormRules: {
               courseName: [
                  {required: true, message: "请输入课程名称", trigger: "blur"}
               ]
            },
            Scoreform: {
               Comones: 0,
               Comtwos: 0,
               Comthrs: 0,
               Comfors: '1',
               Comfivs: "",
               Visones: 0,
               Vistwos: 0,
               Visthrs: 0,
               Visfors: '0',
               Visfivs: ""
            },

            //编辑界面数据
            seeForm: {
               company_name: "",
               info_visitDate: "",
               info_visitTimes: "",
               info_visitCount: "",
               info_visitingMatters: "",
               info_remarks: "",
               info_status: "",
               school_name: "",
               country_name: "",
               school_contactsL: "",
               school_mobile: "",
               school_post: "",
               list: [],
            },
            pageSize: 20
         };
      },
      methods: {
         handleCurrentChange(val) {
            this.page = val;
            this.getOrderInfoPC();
         },
         //获取用户列表
         getOrderInfoPC() {
            // let param = new URLSearchParams();
            // param.append("str", "");
            // param.append("pageNo", 1);
            // param.append("pageSize", 20);
            let params = {};
            params.str = this.filters.name;
            params.pageNo = this.page;
            params.pageSize = this.pageSize;
            this.listLoading = true;
            //NProgress.start();
            getOrderInfoPC(params).then(res => {
               let {message, status, datas} = res;
               if (status !== 0) {
                  if (status === "" || status === undefined || status === null) {
                     this.$message({
                        type: "error",
                        message: "系统登录超时！"
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: "error"
                     });
                  }
                  this.listLoading = false;
               } else {
                  this.total = datas.total;
                  this.OrderInfos = datas.list;
                  this.listLoading = false;
               }
               //NProgress.done();/NProgress.done();
            });
         },
         outputExcel: function () {
            let param = new URLSearchParams();
            param.append("role", 3);
            downloads(param).then(res => {
               let blob = new Blob([res], {type: "application/vnd.ms-excel"});
               var link = document.createElement("a");
               link.href = window.URL.createObjectURL(blob);
               link.download = "reservation";
               link.click();
            });
         },
         seeEve: function (index, row) {
            this.Scoreform.Comones = row.Comone;
            this.Scoreform.Comtwos = row.Comtwo;
            this.Scoreform.Comthrs = row.Comthr;
            this.Scoreform.Comfors = row.Comfor;
            this.Scoreform.Comfivs = row.Comfiv;
            this.Scoreform.Visones = row.Visone;
            this.Scoreform.Vistwos = row.Vistwo;
            this.Scoreform.Visthrs = row.Visthr;
            this.Scoreform.Visfors = row.Visfor;
            this.Scoreform.Visfivs = row.Visfiv;
            this.ScoreVisible = true;
            console.log("this.Scoreform.Comfors", this.Scoreform.Comfors);
            console.log("row", row);
         },
         //显示编辑界面
         handleEdit: function (index, row) {
            let param = new URLSearchParams();
            param.append("infoId", row.info_id);
            //NProgress.start();
            getOneOrderInfoPc(param).then(res => {
               let {message, status, datas} = res;
               if (status !== 0) {
                  if (status === "" || status === undefined || status === null) {
                     this.$message({
                        type: "error",
                        message: "系统登录超时！"
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: "error"
                     });
                  }
               } else {
                  this.editFormVisible = true;
                  this.seeForm = datas;
               }
               //NProgress.done();
            });
         },
         selsChange: function (sels) {
            this.sels = sels;
         },
         /*审批通过*/
         approve(infoId) {
            this.$confirm('确定通过?', '审核信息', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning',
               // center: true
            }).then(() => {
               approval({infoId}).then(res => {
                  let {message, status} = res;
                  if (status !== 0) {
                     this.$message({type: 'error', message});
                  } else {
                     this.$message({type: 'success', message: '审核通过!'});
                     this.moverRed(infoId);
                  }
                  this.getOrderInfoPC();
               }).catch(() => {
                  this.$message({type: 'error', message: '网络超时!'});
               })
            }).catch(() => {
               this.$message({type: 'info', message: '已取消审核'});
            });

         },
         // 审批取消
         cancel(infoId) {
            this.$confirm('确定取消?', '取消预约', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning',
               // center: true
            }).then(() => {
               cancel({infoId, roleId: 2}).then(res => {
                  let {status, message} = res;
                  if (status !== 0) {
                     this.$message({type: 'error', message});
                  } else {
                     this.$message({type: 'success', message: '取消成功!'});
                     this.moverRed(infoId);
                  }
                  this.getOrderInfoPC();
               }).catch(() => {
                  this.$message({type: 'error', message: '网络超时!'});
               })
            }).catch(() => {
               this.$message({type: 'info', message: '已取消审核'});
            });
         },

         // 取消红点
         moverRed(infoId) {
            moverRed({infoId, roleId: 2})
         }
      },
      mounted() {
         this.getOrderInfoPC();
      }
   };
</script>

<style scoped>
   .addTeaInfoList{
      width: calc(50% - 5px);
      /*float: left;*/
      display: inline-block;
   }
</style>

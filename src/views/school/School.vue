<template>
   <section>
      <!--显示菜单路径-->
      <el-col :span="24" class="warp-breadcrum">
         <el-breadcrumb separator="/">
            <el-breadcrumb-item>学校信息</el-breadcrumb-item>
         </el-breadcrumb>
      </el-col>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
         <el-form :inline="true" :model="filters">
            <el-form-item>
               <el-input v-model.trim="filters.name" placeholder="学校名字"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" v-on:click="getSchoolPage">查询</el-button>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="outputExcel">导出excel</el-button>
            </el-form-item>
         </el-form>
      </el-col>

      <!--列表-->

      <el-table :data="school" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" tooltip-effect="dark">
         <el-table-column prop="school_id" label="编号" width="80" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_name" label="学校名称" min-width="200" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_contacts" label="联系人" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_weChat" label="联系人微信" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_mobile" label="手机号" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_mail" label="邮箱" min-width="150" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="country_name" label="负责国家" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="school_language" label="语言" @click="editAcademy(scope.row)" min-width="80" sortable>
            <template slot-scope="scope">
               <span style="cursor:pointer" @click="editAcademy(scope.row)">{{scope.row.school_language?'中文':'英文'}}</span>
            </template>
         </el-table-column>
         <el-table-column prop="school_status" label="状态" :formatter="formatStatus" min-width="80" sortable></el-table-column>

         <el-table-column label="操作" width="80">
            <template slot-scope="scope">
               <el-button size="small" :disabled="scope.row.school_status!==0" @click="handleTranslate(scope.row)">审批</el-button>
            </template>
         </el-table-column>
      </el-table>
      <!--弹框-->
      <el-dialog title="审批" :visible.sync="dialogFormVisible">
         <el-form :model="form">
            <el-form-item label="审批" prop="schStatus">
               <el-radio-group v-model="form.schStatus">
                  <el-radio class="radio" :label="1">通过</el-radio>
                  <el-radio class="radio" :label="2">驳回</el-radio>
               </el-radio-group>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确 定</el-button>
         </div>
      </el-dialog>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
         <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
         <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
         </el-pagination>
      </el-col>
   </section>
</template>

<script>
   import util from "../../common/js/util";
   import {
      getSchoolPage,
      updateStatus,
      downloads,
      updateLanguage
   } from "../../api/api";

   export default {
      data() {
         return {
            school: [],
            total: 0,
            page: 1,
            schId: 0,
            schName: "",
            schContacts: "",
            schWeChat: "",
            schMobile: "",
            countryId: "",
            schStatus: "",
            listLoading: false,
            editLoading: false,
            dialogFormVisible: false,
            //编辑界面数据
            form: {
               schId: 0,
               schStatus: 0
            },
            filters: {
               name: ""
            },

            formLabelWidth: "120px",
            pageSize: 20
         };
      },

      methods: {
         formatStatus: function (row, column) {
            return row.school_status === 0 ? "待审批" : row.school_status === 1 ? "审批通过" : row.school_status === 2 ? "审批驳回" : "未知";
         },

         //编辑
         editSubmit: function () {
            this.editLoading = true;
            // this.$message("schId: " + this.form.schId);
            let param = new URLSearchParams();
            param.append("schId", this.form.schId);
            param.append("schStatus", this.form.schStatus);
            updateStatus(param).then(res => {
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
                  this.editLoading = false;
                  this.dialogFormVisible = false;
                  //this.editForm.res;
                  this.getSchoolPage();
               }
            });
         },

         //编辑语言
         //编辑
         editAcademy: function (row) {
            this.editLoading = true;
            console.log("editAcademy", row);
            // this.$message("schId: " + this.form.schId);
            let param = new URLSearchParams();
            param.append("schId", row.school_id);
            if (row.school_language == 1) {
               param.append("language", false);
            } else {
               param.append("language", true);
            }

            updateLanguage(param).then(res => {
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
                  this.editLoading = false;
                  this.dialogLanguageVisible = false;
                  //this.editForm.res;
                  this.getSchoolPage();
               }
            });
         },

         selsChange: function (sels) {
            this.sels = sels;
         },

         handleTranslate: function (row) {
            this.dialogFormVisible = true;
            console.log("handleTranslate", row);
            this.form.schId = row.school_id;
            this.form.schStatus = row.schStatus;
         },

         handleCurrentChange(val) {
            this.page = val;
            this.getSchoolPage();
         },

         //字段类型转换
         formatlanguage: function (row, column) {
            if (row.school_language === 1) return "中文";
            if (row.school_language === 0) return "英文";
         },

         //获取用户列表
         getSchoolPage() {
            let param = new URLSearchParams();
            param.append("str", this.filters.name);
            param.append("pageNo", this.page);
            param.append("pageSize", this.pageSize);
            this.listLoading = true;
            //NProgress.start();
            getSchoolPage(param).then(res => {
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
                  this.school = datas.list;
                  this.listLoading = false;
               }
               //NProgress.done();
            });
         },
         outputExcel: function () {
            let param = new URLSearchParams();
            param.append("role", 1);
            downloads(param).then(res => {
               let blob = new Blob([res], {type: "application/vnd.ms-excel"});
               var link = document.createElement("a");
               link.href = window.URL.createObjectURL(blob);
               link.download = "SchoolAudit";
               link.click();
            });
         }
      },
      mounted() {
         this.getSchoolPage();
      }
   };
</script>

<style scoped>
</style>

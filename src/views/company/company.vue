<template>
   <section>
      <!--显示菜单路径-->
      <el-col :span="24" class="warp-breadcrum">
         <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item> -->
            <el-breadcrumb-item>公司信息</el-breadcrumb-item>
         </el-breadcrumb>
      </el-col>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
         <el-form :inline="true" :model="filters">
            <el-form-item>
               <el-input v-model.trim="filters.name" placeholder="公司名字"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" v-on:click="getAllCompanyPage">查询</el-button>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="outputExcel">导出excel</el-button>
            </el-form-item>
         </el-form>
      </el-col>

      <!--列表-->
      <el-table class="master_table" :data="teas" highlight-current-row tooltip-effect="dark" v-loading="listLoading" style="width: 100%;">
         <!--<el-table-column type="selection" width="50"></el-table-column>-->
         <el-table-column type="index" width="50"></el-table-column>
         <el-table-column prop="company_id" label="分公司Id" min-width="80" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="dept_id" label="条线Id" min-width="80" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="company_name" label="分公司名称" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="dept_name" label="所属条线" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="user_realname" label="联系人" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="user_ename" label="名字拼音" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="user_jobTit" label="职位" min-width="80" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="user_email" label="邮箱" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="user_mobile" label="手机号" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="company_addr_cn" label="地址" min-width="200" sortable show-overflow-tooltip></el-table-column>
         <el-table-column label="操作" width="120">
            <template slot-scope="scope">
               <el-button size="small" :style="[scope.row.user_id?{}:{display:'none'}]" @click="transferPerson(scope.$index, scope.row)">修改对接人</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
         <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;"></el-pagination>
      </el-col>

      <!--编辑界面-->
      <el-dialog title="修改联系人" center :visible.sync="editFormVisible" :close-on-click-modal="false">
         <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
            <div class="addTeaInfoList">
               <el-form-item label="公司名称" prop="companyName">
                  <el-input v-model.trim="editForm.companyName" :disabled="true" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="所属条线" prop="deptName">
                  <el-input v-model.trim="editForm.deptName" :disabled="true" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户微信" prop="openId">
                  <el-select v-model="editForm.openId" @change="findWxUser" filterable placeholder="请选择微信账号" style="width: 100%;">
                     <el-option v-for="item in WXList" :key="Math.random()" :label="item.wxUserInfo" :value="item.openId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="对接人名" prop="userRealname">
                  <el-input v-model.trim="editForm.userRealname" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="名字拼音" prop="userEName">
                  <el-input v-model.trim="editForm.userEName" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="电话" prop="userMobile">
                  <el-input v-model.trim="editForm.userMobile" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model.trim="editForm.userEmail" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="职位" prop="userJobTit">
                  <el-input v-model.trim="editForm.userJobTit" auto-complete="off"></el-input>
               </el-form-item>
            </div>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
         </div>
      </el-dialog>

      <!-- 新增界面 -->
      <el-dialog title="新增联系人" center :visible.sync="addFormVisible" :close-on-click-modal="false">
         <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
            <div class="addTeaInfoList">
               <el-form-item label="公司名称" prop="companyId">
                  <el-select v-model="addForm.companyId" @change="findtx" filterable placeholder="请选择公司" style="width: 100%;">
                     <el-option v-for="item in CompanyList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="条线" prop="deptId">
                  <el-select v-model="addForm.deptId" placeholder="请选择条线" style="width: 100%;">
                     <el-option v-for="item in DeptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户微信" prop="openId">
                  <el-select v-model="addForm.openId" @change="findWxUseradd" filterable placeholder="请选择微信账号" style="width: 100%;">
                     <el-option v-for="item in WXListadd" :key="Math.random()" :label="item.wxUserInfo" :value="item.openId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="对接人名" prop="userRealname">
                  <el-input v-model.trim="addForm.userRealname" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="名字拼音" prop="userEName">
                  <el-input v-model.trim="addForm.userEName" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="电话" prop="userMobile">
                  <el-input v-model.trim="addForm.userMobile" auto-complete="off"></el-input>
               </el-form-item>
            </div>

            <div class="addTeaInfoList">
               <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model.trim="addForm.userEmail" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="职位" prop="userJobTit">
                  <el-input v-model.trim="addForm.userJobTit" auto-complete="off"></el-input>
               </el-form-item>
            </div>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
         </div>
      </el-dialog>
   </section>
</template>
<script>
   import util from "../../common/js/util";
   import axios from "axios";
   //import NProgress from 'nprogress'
   import {
      getAllCompanyPage,
      getCompanyById,
      getAllWXUserPC,
      getUserByOpenIdPC,
      updateContactPC,
      getUserCompanyPC,
      getUserDeptPC,
      insertContactPC,
      downloads
   } from "../../api/api";

   export default {
      data() {
         return {
            filters: {
               name: ""
            },
            show: false,
            teas: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [], //列表选中列

            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            addLoading: false,
            addFormVisible: false,

            //编辑界面数据
            editForm: {
               companyName: "",
               deptName: "",
               openId: "",
               userRealname: "",
               userEName: "",
               userEmail: "",
               userMobile: "",
               userJobTit: "",
               companyId: 0,
               userId: 0
            },
            addForm: {
               companyId: "",
               companyName: "",
               deptName: "",
               openId: "",
               userRealname: "",
               userEName: "",
               userEmail: "",
               userMobile: "",
               userJobTit: "",
               userId: ""
            },

            WXList: [],
            WXListadd: [],
            CompanyList: [],
            DeptList: [],
            addFormRules: {
               companyId: [
                  {required: true, message: '请选择公司', trigger: 'blur'}
               ]
               , deptId: [
                  {required: true, message: '请选择条线', trigger: 'blur'}
               ]
               , openId: [
                  {required: true, message: '请选择对接人微信', trigger: 'blur'}
               ]
               ,
               userRealname: [
                  {required: true, message: '请输入对接人名字', trigger: 'blur'}
               ],
               userEName: [
                  {required: true, message: '请输入对接人名字拼音', trigger: 'blur'}
               ],
               userEmail: [
                  {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                  {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
               ],
               // userMobile: [
               //   {required: true, message: '请输入对接人联系方式', trigger: 'blur'},
               //   {min: 11, max: 11, message: '长度11个数字', trigger: 'blur'}
               // ],
               userJobTit: [
                  {required: true, message: '请输入对接人职位', trigger: 'blur'}
               ]
            },
            pageSize: 20
         };
      },
      methods: {
         handleCurrentChange(val) {
            this.page = val;
            this.getAllCompanyPage();
         },
         //分页查询全部数据
         getAllCompanyPage() {
            let param = new URLSearchParams();
            param.append("str", this.filters.name);
            param.append("pageNo", this.page);
            param.append("pageSize", this.pageSize);
            this.listLoading = true;
            //NProgress.start();
            getAllCompanyPage(param).then(res => {
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
                  this.teas = datas.list;
                  this.listLoading = false;
               }
               //NProgress.done();
            });
         },
         //显示修改对接人
         transferPerson: function (index, row) {
            //this.transForm.teaId = row.teaId;
            let param = new URLSearchParams();
            param.append("companyID", row.company_id);
            param.append("deptId", row.dept_id);
            getCompanyById(param).then(res => {
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
                  this.editForm = datas;
               }
            });
            //获取全部微信用户的方法
            getAllWXUserPC(param).then(res => {
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
                  this.WXList = datas;
                  //console.log('WXList', datas)
               }
               // console.log('getZoneList', res.datas)
            });
            this.editFormVisible = true;
         },
         //查找微信用户的方法
         findWxUser: function (e) {
            let param = new URLSearchParams();
            param.append("openId", this.editForm.openId);
            //根据openId 查一次是否有用户信息
            getUserByOpenIdPC(param).then(res => {
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
                  if (datas) {
                     this.editForm.userId = datas.userId;
                     this.editForm.userEmail = datas.userEmail;
                     this.editForm.userMobile = datas.userMobile;
                     this.editForm.userJobTit = datas.userJobTit;
                     this.editForm.userRealname = datas.userRealname;
                     this.editForm.userEName = datas.userEName;
                  } else {
                     this.editForm.userId = 0;
                     this.editForm.userEmail = "";
                     this.editForm.userMobile = "";
                     this.editForm.userJobTit = "";
                     this.editForm.userRealname = "";
                     this.editForm.userEName = "";
                  }
               }
            });
         },
         findtx: function (e) {
            let param = new URLSearchParams();
            param.append("companyId", this.addForm.companyId);
            getUserDeptPC(param).then(res => {
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
                  this.DeptList = datas;
               }
            });

            //根据openId 查一次是否有用户信息
         }
         ,
         //查找微信用户的方法 新增用
         findWxUseradd: function (e) {
            let param = new URLSearchParams();
            param.append("openId", this.addForm.openId);
            //根据openId 查一次是否有用户信息
            getUserByOpenIdPC(param).then(res => {
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
                  if (datas) {
                     this.addForm.userId = datas.userId;
                     this.addForm.userEmail = datas.userEmail;
                     this.addForm.userMobile = datas.userMobile;
                     this.addForm.userJobTit = datas.userJobTit;
                     this.addForm.userRealname = datas.userRealname;
                     this.addForm.userEName = datas.userEName;
                  } else {
                     this.addForm.userId = 0;
                     this.addForm.userEmail = "";
                     this.addForm.userMobile = "";
                     this.addForm.userJobTit = "";
                     this.addForm.userRealname = "";
                     this.addForm.userEName = "";
                  }
               }
            });
         },
         //编辑
         editSubmit: function () {
            this.$refs.editForm.validate(valid => {
               if (valid) {
                  this.$confirm("确认提交吗？", "提示", {}).then(() => {
                     this.editLoading = true;
                     //NProgress.start();
                     //this.editForm.courseIds = this.editForm.courseIdsArray.toString();
                     let para = Object.assign({}, this.editForm);

                     updateContactPC(para).then(res => {
                        this.editLoading = false;
                        let {message, status, datas} = res;
                        if (status !== 0) {
                           if (status === "" || status === undefined || status === null) {
                              this.$message({
                                 type: "error",
                                 message: "系统登录超时！"
                              });
                           } else {
                              this.$message({
                                 showClose: true,
                                 duration: 0,
                                 message: message,
                                 type: "error"
                              });
                           }
                        } else {
                           this.$refs["editForm"].resetFields();
                           this.editFormVisible = false;
                           this.getAllCompanyPage();
                        }
                     });
                  });
               }
            });
         },
         //显示新增界面
         handleAdd: function () {
            let param = new URLSearchParams();
            //需要查3个值 放在三个下拉内
            //1.先根据当前用户查询她所有的公司
            getUserCompanyPC(param).then(res => {
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
                  this.CompanyList = datas;
               }
            });
            // //2.先根据当前用户查询她所有的条线
            // let params = new URLSearchParams();
            // params.append("companyId", this.addForm.openId);
            // getUserDeptPC(params).then(res => {
            //   let { message, status, datas } = res;
            //   if (status !== 0) {
            //     if (status === "" || status === undefined || status === null) {
            //       this.$message({
            //         type: "error",
            //         message: "系统登录超时！"
            //       });
            //     } else {
            //       this.$message({
            //         message: message,
            //         type: "error"
            //       });
            //     }
            //   } else {
            //     this.DeptList = datas;
            //   }
            // });
            //获取全部微信用户的方法
            getAllWXUserPC(param).then(res => {
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
                  this.WXListadd = datas;
                  //console.log('WXList', datas)
               }
               // console.log('getZoneList', res.datas)
            });
            this.addFormVisible = true;
         },
         //编辑
         addSubmit: function () {
            this.$refs.addForm.validate(valid => {
               if (valid) {
                  this.$confirm("确认提交吗？", "提示", {}).then(() => {
                     this.addLoading = true;
                     let para = Object.assign({}, this.addForm);
                     insertContactPC(para).then(res => {
                        this.addLoading = false;
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
                           this.$refs["addForm"].resetFields();
                           this.addFormVisible = false;
                           this.getAllCompanyPage();
                        }
                     });
                  });
               }
            });
         },
         outputExcel: function () {
            let param = new URLSearchParams();
            param.append("role", 2);
            downloads(param).then(res => {
               let blob = new Blob([res], {type: "application/vnd.ms-excel"});
               let link = document.createElement("a");
               link.href = window.URL.createObjectURL(blob);
               link.download = "Company";
               link.click();
            });
         }
      },
      mounted() {
         this.getAllCompanyPage();
      }
   };
</script>

<style lang="scss">
   .master_table{
      .cell{
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
      }
   }

   .addTeaInfoList{
      width: calc(50% - 5px);
      /*float: left;*/
      display: inline-block;
   }

   .el-upload__edit{
      margin-left: 10px;
      width: 150px;
      height: auto;
      line-height: 20px;
      /*margin-top: 31px;*/
      position: absolute;
      left: auto;
      top: auto;
   }
</style>

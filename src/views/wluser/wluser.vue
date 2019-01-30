<template>
   <section>
      <!--显示菜单路径-->
      <el-col :span="24" class="warp-breadcrum">
         <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item> -->
            <el-breadcrumb-item>用户信息</el-breadcrumb-item>
         </el-breadcrumb>
      </el-col>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
         <el-form :inline="true" :model="filters">
            <el-form-item>
               <el-input v-model.trim="filters.name" placeholder="名字"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" v-on:click="getSysUserPC">查询</el-button>
            </el-form-item>
            <el-form-item>
               <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
            <!-- <el-form-item>
             <el-button type="primary" @click="outputExcel" >导出excel</el-button>
           </el-form-item> -->
         </el-form>
      </el-col>

      <!--列表-->
      <el-table class="master_table" :data="users" highlight-current-row tooltip-effect="dark" v-loading="listLoading" style="width: 100%;">
         <el-table-column type="selection" width="50"></el-table-column>
         <!-- <el-table-column type="index" width="50"></el-table-column> -->
         <el-table-column prop="userId" label="用户ID" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userUUID" label="用户UUID" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userEmail" label="用户邮箱" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userPassword" label="用户密码" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userRealName" label="用户真实名" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userCompany" label="公司" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userDept" label="部门" min-width="100" v-if='show' show-overflow-tooltip></el-table-column>
         <el-table-column prop="userLine" label="条线" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="createPerson" label="创建人" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="createTime" label="创建时间" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="updataPerson" label="修改人" min-width="100" sortable show-overflow-tooltip></el-table-column>
         <el-table-column prop="updataTime" label="修改时间" min-width="120" sortable show-overflow-tooltip></el-table-column>
         <!--<el-table-column label="操作" width="220">-->
         <el-table-column label="操作" width="150">
            <template slot-scope="scope">
               <el-button size="small" @click="transferPerson(scope.$index, scope.row)">修改</el-button>
               <el-button size="small" @click="transferUser(scope.$index, scope.row)">分配</el-button>
               <el-button style="display: none" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
         <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;"></el-pagination>
      </el-col>

      <!--编辑界面-->
      <el-dialog title="修改外联用户" center :visible.sync="editFormVisible" :close-on-click-modal="false">
         <el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">

            <div class="addTeaInfoList">
               <el-form-item label="名字" prop="userRealname">
                  <el-input v-model.trim="editForm.userRealname" auto-complete="off"></el-input>
               </el-form-item>
            </div>

            <div class="addTeaInfoList">
               <el-form-item label="登录邮箱" prop="userLoginName">
                  <el-input v-model.trim="editForm.userLoginName" :disabled="true" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户微信" prop="openId">
                  <el-select v-model="editForm.openId" filterable placeholder="请选择微信账号" style="width: 100%;">
                     <el-option v-for="item in WXList" :key="item.openId" :label="item.wxUserInfo" :value="item.openId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="名字拼音" prop="userEName">
                  <el-input v-model.trim="editForm.userEName" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="联系电话" prop="userMobile">
                  <el-input v-model.trim="editForm.userMobile" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="职位" prop="userJobTit">
                  <el-input v-model.trim="editForm.userJobTit" auto-complete="off"></el-input>
               </el-form-item>
            </div>

            <div class="addTeaInfoList">
               <el-form-item label="收件邮箱" prop="userEmail">
                  <el-input v-model.trim="editForm.userEmail" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户地址" prop="userAddresss">
                  <el-input v-model.trim="editForm.userAddresss" auto-complete="off"></el-input>
               </el-form-item>
            </div>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
         </div>
      </el-dialog>
      <!-- 新增界面 -->
      <el-dialog title="新增外联用户" center :visible.sync="addFormVisible" :close-on-click-modal="false">
         <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
            <div class="addTeaInfoList">
               <el-form-item label="名字" prop="userRealname">
                  <el-input v-model.trim="addForm.userRealname" auto-complete="off"></el-input>
               </el-form-item>
            </div>

            <div class="addTeaInfoList">
               <el-form-item label="登录邮箱" prop="userLoginName">
                  <el-input v-model.trim="addForm.userLoginName" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户微信" prop="openId">
                  <el-select v-model="addForm.openId" filterable placeholder="请选择微信账号" style="width: 100%">
                     <el-option v-for="item in WXListadd" :key="item.openId" :label="item.wxUserInfo" :value="item.openId"></el-option>
                  </el-select>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="名字拼音" prop="userEName">
                  <el-input v-model.trim="addForm.userEName" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="联系电话" prop="userMobile">
                  <el-input v-model.trim="addForm.userMobile" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="职位" prop="userJobTit">
                  <el-input v-model.trim="addForm.userJobTit" auto-complete="off"></el-input>
               </el-form-item>
            </div>

            <div class="addTeaInfoList">
               <el-form-item label="收件邮箱" prop="userEmail">
                  <el-input v-model.trim="addForm.userEmail" auto-complete="off"></el-input>
               </el-form-item>
            </div>
            <div class="addTeaInfoList">
               <el-form-item label="用户地址" prop="userAddresss">
                  <el-input v-model.trim="addForm.userAddresss" auto-complete="off"></el-input>
               </el-form-item>
            </div>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
         </div>
      </el-dialog>
      <!--权限分配-->
      <el-dialog title="权限分配" center :visible.sync="transFormVisible" :close-on-click-modal="false">
         <el-form :model="transForm" label-width="80px" ref="transForm">
            <el-form-item label="条线" prop="deptId">
               <el-select v-model="transForm.deptId" placeholder="请选择条线" @change="transAuth">
                  <el-option v-for="item in DeptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="分配公司" prop="comIdsArray">
               <el-transfer :titles="['可分公司', '已分公司']" filterable filter-placeholder="请输入公司名字" v-model="transForm.comIdsArray" :data="allComapnyList"></el-transfer>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click.native="transFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="transferSubmit" :loading="transferLoading">提交</el-button>
         </div>
      </el-dialog>
   </section>
</template>
<script>
   import util from '../../common/js/util';
   import axios from 'axios';
   //import NProgress from 'nprogress'
   import {
      getSysUserPC,
      getWXUsersWLPC,
      addSysUserPC,
      getSysUserByIdPC,
      getWxUserPC,
      updateSysUserPC,
      deleteSysUserPC,
      getWLUserCompanyPC,
      WLgetCompanyPC,
      changeCompanyPC,
      selectAllDeptPC,
   } from '../../api/api';

   export default {
      data() {
         return {
            filters: {
               name: '',
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
            transFormVisible: false,
            companyIds: '',
            transferLoading: false,

            //编辑界面数据
            editForm: {
               userId: 0,
               userRealname: '',
               userEName: '',
               userLoginName: '',
               userEmail: '',
               userMobile: '',
               userAddresss: '',
               userJobTit: '',
               wxName: '',
               openId: '',
            },
            addForm: {
               userId: 0,
               userRealname: '',
               userEName: '',
               userLoginName: '',
               userEmail: '',
               userMobile: '',
               userAddresss: '',
               userJobTit: '',
               wxName: '',
               openId: '',
            },
            transForm: {
               deptId: '',
               userId: '',
               comIdsArray: [],
            },
            users: [],
            WXList: [],
            WXListadd: [],
            CompanyList: [],
            DeptList: [],
            allComapnyList: [],
            addFormRules: {
               companyId: [{ required: true, message: '请选择公司', trigger: 'blur' }],
               deptId: [{ required: true, message: '请选择条线', trigger: 'blur' }],
               openId: [
                  { required: true, message: '请选择对接人微信', trigger: 'blur' },
               ],
               userRealname: [
                  { required: true, message: '请输入对接人名字', trigger: 'blur' },
               ],
               userEName: [
                  { required: true, message: '请输入对接人名字拼音', trigger: 'blur' },
               ],
               userEmail: [
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
               ],
               // userMobile: [
               //   { required: true, message: "请输入对接人联系方式", trigger: "blur" },
               //   { min: 11, max: 11, message: "长度11个数字", trigger: "blur" }
               // ],
               userJobTit: [
                  { required: true, message: '请输入对接人职位', trigger: 'blur' },
               ],
               userLoginName: [
                  { required: true, message: '请输入登录邮箱', trigger: 'blur' },
                  { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
               ],
            },
            pageSize: 20,
         };
      },
      methods: {
         handleCurrentChange(val) {
            this.page = val;
            this.getSysUserPC();
         },
         //分页查询全部数据
         getSysUserPC() {
            let param = new URLSearchParams();
            param.append('str', this.filters.name);
            param.append('pageNo', this.page);
            param.append('pageSize', this.pageSize);
            this.listLoading = true;
            //NProgress.start();
            getSysUserPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
                  this.listLoading = false;
               } else {
                  this.total = datas.total;
                  this.users = datas.list;
                  this.listLoading = false;
               }
               //NProgress.done();
            });
         },
         //显示修改对接人
         transferPerson: function(index, row) {
            let param = new URLSearchParams();
            param.append('userId', row.userId);
            getSysUserByIdPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  this.editForm = datas;
               }
            });
            //获取全部微信用户的方法
            getWxUserPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  this.WXList = datas;
               }
               // console.log('getZoneList', res.datas)
            });
            this.editFormVisible = true;
         },
         //显示分配权限
         transferUser: function(index, row) {
            this.transForm.userId = row.userId;
            let param = new URLSearchParams();
            selectAllDeptPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  this.DeptList = datas;
                  this.transForm.deptId = datas[0].deptId;
                  this.transAuth();
               }
            });
         },
         transAuth: function() {
            let param = new URLSearchParams();
            //查所有分公司
            WLgetCompanyPC(param).then(res => {
               let { message, status, datas } = res;
               var _this = this;
               this.allComapnyList = [];
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  // this.transForm.stuIdsArray = [];
                  datas.forEach(function(dept) {
                     _this.allComapnyList.push({
                        key: dept.companyId,
                        label: dept.companyName,
                     });
                  });
               }
            });
            //根据用户ID 和条线Id 查已分配的
            param.append('userId', this.transForm.userId);
            param.append('deptId', this.transForm.deptId);
            getWLUserCompanyPC(param).then(res => {
               this.transForm.comIdsArray = [];
               let { message, status, datas } = res;
               let _this = this;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  // console.log('datas',datas)
                  // this.transForm.comIdsArray = datas;
                  datas.forEach(function(dept) {
                     _this.transForm.comIdsArray.push(dept.companyId);
                  });
                  // let comIdsArray = this.transForm.comIdsArray;
                  // this.comIdsStr = comIdsArray.join(",");
               }
            });
            this.transFormVisible = true;
         },
         //提交公司分配
         transferSubmit: function() {
            this.$refs.transForm.validate(valid => {
               if (valid) {
                  this.$confirm('确认提交吗？', '提示', {}).then(() => {
                     let comIdsArray = this.transForm.comIdsArray;
                     this.companyIds = comIdsArray.join(',');
                     //NProgress.start();
                     //this.transForm.stuIds = this.transForm.stuIdsArray.toString();
                     //let param = Object.assign({}, this.transForm);
                     let param = new URLSearchParams();
                     param.append('companyIds', this.companyIds);
                     param.append('deptId', this.transForm.deptId);
                     param.append('userId', this.transForm.userId);
                     changeCompanyPC(param).then(res => {
                        this.addLoading = false;
                        let { message, status, datas } = res;
                        if (status !== 0) {
                           if (status === '' || status === undefined || status === null) {
                              this.$message({
                                 type: 'error',
                                 message: '系统登录超时！',
                              });
                           } else {
                              this.$message({
                                 message: message,
                                 type: 'error',
                              });
                           }
                        } else {
                           this.$message({
                              message: '分配成功！',
                              type: 'success',
                           });
                           // this.$refs['transForm'].resetFields();
                           this.transFormVisible = false;
                           this.getSysUserPC();
                        }
                     });
                  });
               }
            });
         },

         findtx: function(e) {
            let param = new URLSearchParams();
            param.append('companyId', this.addForm.companyId);
            getUserDeptPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  this.DeptList = datas;
               }
            });
         },
         //编辑
         editSubmit: function() {
            this.$refs.editForm.validate(valid => {
               if (valid) {
                  this.$confirm('确认提交吗？', '提示', {}).then(() => {
                     this.editLoading = true;
                     delete this.editForm.createTime;
                     delete this.editForm.updateTime;
                     let para = Object.assign({}, this.editForm);
                     updateSysUserPC(para).then(res => {
                        this.editLoading = false;
                        let { message, status, datas } = res;
                        if (status !== 0) {
                           if (status === '' || status === undefined || status === null) {
                              this.$message({
                                 type: 'error',
                                 message: '系统登录超时！',
                              });
                           } else {
                              this.$message({
                                 showClose: true,
                                 duration: 0,
                                 message: message,
                                 type: 'error',
                              });
                           }
                        } else {
                           this.$refs['editForm'].resetFields();
                           this.editFormVisible = false;
                           this.getSysUserPC();
                        }
                     });
                  });
               }
            });
         },
         //显示新增界面
         handleAdd: function() {
            let param = new URLSearchParams();

            //获取全部微信用户的方法
            getWXUsersWLPC(param).then(res => {
               let { message, status, datas } = res;
               if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                     this.$message({
                        type: 'error',
                        message: '系统登录超时！',
                     });
                  } else {
                     this.$message({
                        message: message,
                        type: 'error',
                     });
                  }
               } else {
                  this.WXListadd = datas;
               }
               // console.log('getZoneList', res.datas)
            });
            this.addFormVisible = true;
         },
         //编辑
         addSubmit: function() {
            this.$refs.addForm.validate(valid => {
               if (valid) {
                  this.$confirm('确认提交吗？', '提示', {}).then(() => {
                     this.addLoading = true;
                     let para = Object.assign({}, this.addForm);
                     addSysUserPC(para).then(res => {
                        this.addLoading = false;
                        let { message, status, datas } = res;
                        if (status !== 0) {
                           if (status === '' || status === undefined || status === null) {
                              this.$message({
                                 type: 'error',
                                 message: '系统登录超时！',
                              });
                           } else {
                              this.$message({
                                 message: message,
                                 type: 'error',
                              });
                           }
                        } else {
                           this.$refs['addForm'].resetFields();
                           this.addFormVisible = false;
                           this.getSysUserPC();
                        }
                     });
                  });
               }
            });
         },
         handleDel: function(index, row) {
            console.log('index', index);
            console.log('row', row);
            this.$confirm('确认删除该记录吗?', '提示', {
               type: 'warning',
            })
               .then(() => {
                  this.listLoading = true;

                  let param = new URLSearchParams();
                  param.append('userId', row.userId);
                  param.append('openId', row.openId);
                  deleteSysUserPC(param).then(res => {
                     this.listLoading = false;
                     let { message, status, datas } = res;
                     if (status !== 0) {
                        if (status === '' || status === undefined || status === null) {
                           this.$message({
                              type: 'error',
                              message: '系统登录超时！',
                           });
                        } else {
                           this.$message({
                              message: message,
                              type: 'error',
                           });
                        }
                     } else {
                        this.getSysUserPC();
                     }
                  });
               })
               .catch(() => {
               });
         },

         outputExcel: function() {
            let param = new URLSearchParams();
            param.append('role', 2);
            downloads(param).then(res => {
               let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
               var link = document.createElement('a');
               link.href = window.URL.createObjectURL(blob);
               link.download = 'Company';
               link.click();
            });
         },
      },
      mounted() {
         this.getSysUserPC();
      },
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

<template>
    <div class="cpb">
        <!-- <div class="logo">
            <img src="../../assets/logocpb.png" alt="">
        </div> -->
        <div class="cen">
            <div class="left">
                <el-input type="text" v-model="str" style="width: 180px;"></el-input>
                <el-button round icon="el-icon-search" type="primary" @click="search" style="display:inline-block;margin-bottom:10px;">
                    查找用户
                </el-button>
                <el-button round icon="el-icon-plus" @click="addUser" style="margin-bottom:10px;">添加用户</el-button>
            </div>
        </div>
        
        <!-- 表格 -->
        <el-table
            :data="tableData"
            style="width:100%;height:88%">
            <el-table-column
                label="姓名"
                width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="用户名">
                <template slot-scope="scope">
                    <span>{{ scope.row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="邮箱">
                <template slot-scope="scope">
                    <span>{{ scope.row.email }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="公司">
                <template slot-scope="scope">
                    <span>{{ scope.row.company }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="条线">
                <template slot-scope="scope">
                    <span>{{ scope.row.line }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.creatime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="前台">
                <template slot-scope="scope">
                    <span>{{ scope.row.adminFront == "1" ? "有" : "无" }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="后台">
                <template slot-scope="scope">
                    <span>{{ scope.row.adminBack == "1" ? "有" : "无" }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="角色">
                <template slot-scope="scope">
                    <span>{{ scope.row.type == "1" ? "分管" : "业务" }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.status == "1" ? "启用" : "禁用" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button
                        size="mini"
                        :type="scope.row.status == '1' ? 'danger' : 'primary'"
                        @click="handleAbled(scope.$index, scope.row)">{{ scope.row.status == "1" ? "禁用" : "启用" }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center;">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="current_change">
            </el-pagination>
            
        </div>
        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="addFormVisible">
            <el-form :model="addsForm">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="addsForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="addsForm.username" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="addsForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="公司" :label-width="formLabelWidth">
                    <el-input v-model="addsForm.company" ></el-input>
                </el-form-item>
                <el-form-item label="条线" :label-width="formLabelWidth">
                    <el-input v-model="addsForm.line" ></el-input>
                </el-form-item>
                <el-form-item label="前台" :label-width="formLabelWidth">
                    <el-radio v-model="addsForm.adminFront" label="1">有</el-radio>
                    <el-radio v-model="addsForm.adminFront" label="0">无</el-radio>
                </el-form-item>
                <el-form-item label="后台" :label-width="formLabelWidth">
                    <el-radio v-model="addsForm.adminBack" label="1">有</el-radio>
                    <el-radio v-model="addsForm.adminBack" label="0">无</el-radio>
                </el-form-item>
                <el-form-item label="职业" :label-width="formLabelWidth">
                    <el-radio v-model="addsForm.type" label="1">分管</el-radio>
                    <el-radio v-model="addsForm.type" label="0">业务</el-radio>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio v-model="addsForm.status" label="1">启用</el-radio>
                    <el-radio v-model="addsForm.status" label="0">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addcancel">取 消</el-button>
                <el-button type="primary" @click="addUserBtn">添 加</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户 -->
        <el-dialog title="修改用户" :visible.sync="editFormVisible">
            <el-form :model="editsForm">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="editsForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="editsForm.username" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editsForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="公司" :label-width="formLabelWidth">
                    <el-input v-model="editsForm.company" ></el-input>
                </el-form-item>
                <el-form-item label="条线" :label-width="formLabelWidth">
                    <el-input v-model="editsForm.line" ></el-input>
                </el-form-item>
                <el-form-item label="前台" :label-width="formLabelWidth">
                    <el-radio v-model="editsForm.adminFront" label="有">有</el-radio>
                    <el-radio v-model="editsForm.adminFront" label="无">无</el-radio>
                </el-form-item>
                <el-form-item label="后台" :label-width="formLabelWidth">
                    <el-radio v-model="editsForm.adminBack" label="有">有</el-radio>
                    <el-radio v-model="editsForm.adminBack" label="无">无</el-radio>
                </el-form-item>
                <el-form-item label="职业" :label-width="formLabelWidth">
                    <el-radio v-model="editsForm.type" label="分管">分管</el-radio>
                    <el-radio v-model="editsForm.type" label="业务">业务</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editcancel">取 消</el-button>
                <el-button type="primary" @click="editUserBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { cpbuserrList, cpbinsert, cpbfindUserById, cpbupdate, cpbdelete, cpbopen } from "../../api/api.js";
export default {
    name: "cpb",
    data() {
        return {
            str: "",
            tableData: [],
            addFormVisible: false,
            editFormVisible: false,
            addsForm: {
                name: "",
                username: "",
                email: "",
                company: "",
                line: "",
                adminFront: "",
                adminBack: "",
                type: "",
                status: ""
            },
            editsForm: {
                name: "",
                username: "",
                email: "",
                company: "",
                line: "",
                adminFront: "",
                adminBack: "",
                type: ""
            },
            formLabelWidth: "120px",
            total: 0,
            pageNum: 1,
            pageSize: 10
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        // 查询
        search () {
            this.init();
            if (this.str != "") {
                this.tableData = [];
                let params = {
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                    str: this.str
                };
                cpbuserrList(params).then((res) => {
                    if (res.status == 0) {          // 成功
                        this.tableData = res.datas.list;
                        this.total = res.datas.total;
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                        this.tableData = [];
                        this.total = 0;
                    }
                })
            } else {
                this.$message.error("请输入用户名");
            }
        },
        // 添加用户
        addUser () {
            this.addFormVisible = true;
        },
        // 添加用户----取消
        addcancel () {
            this.addFormVisible = false;
        },
        // 添加用户----确定
        addUserBtn () {
            if (this.addsForm.name == "" || this.addsForm.username == "" || this.addsForm.email == "" || this.addsForm.company == "" || this.addsForm.line == "" || this.addsForm.adminFront == "" || this.addsForm.adminBack == "" || this.addsForm.type == "" || this.addsForm.status == "") {
                this.$message.error("新增内容每一项都不准为空");
            } else {
                let params = {
                    name: this.addsForm.name,
                    username: this.addsForm.username,
                    email: this.addsForm.email,
                    company: this.addsForm.company,
                    line: this.addsForm.line,
                    adminFront: this.addsForm.adminFront,
                    adminBack: this.addsForm.adminBack,
                    type: this.addsForm.type,
                    status: this.addsForm.status
                };
                cpbinsert(params).then((res) => {
                    if (res.status == 0) {      // 保存成功
                        this.addFormVisible = false;
                        this.init();
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                })
            }
        },
        // 编辑
        handleEdit(index, row) {
            let params = {
                id: row.id
            };
            sessionStorage.setItem("idx", JSON.stringify(params));
            cpbfindUserById(params).then((res) => {
                sessionStorage.setItem("findUserById", JSON.stringify(res.datas));
                this.editsForm.name = res.datas.name;
                this.editsForm.username = res.datas.username;
                this.editsForm.email = res.datas.email;
                this.editsForm.company = res.datas.company;
                this.editsForm.line = res.datas.line;
                this.editsForm.adminFront = res.datas.adminFront == "1" ? "有" : "无";
                this.editsForm.adminBack = res.datas.adminBack == "1" ? "有" : "无";
                this.editsForm.type = res.datas.type == "1" ? "分管" : "业务";
                this.editFormVisible = true;
            })
        },
        // 编辑用户---取消
        editcancel () {
            this.editFormVisible = false;
        },
        // 编辑用户---确定
        editUserBtn () {
            if (this.editsForm.name == "" || this.editsForm.username == "" || this.editsForm.email == "" || this.editsForm.company == "" || this.editsForm.line == "" || this.editsForm.adminFront == "" || this.editsForm.adminBack == "" || this.editsForm.type == "") {
                this.$message.error("修改内容的每一项都不准为空");
            } else {
                let userById = JSON.parse(sessionStorage.getItem("findUserById"));
                if (this.editsForm.name == userById.name && this.editsForm.username == userById.username && this.editsForm.email == userById.email && this.editsForm.company == userById.company && this.editsForm.line == userById.line && this.editsForm.adminFront == (userById.adminFront == "1" ? "有" : "无") && this.editsForm.adminBack == (userById.adminBack == "1" ? "有": "无") && this.editsForm.type == (userById.type == "1" ? "分管" : "业务")) {
                    this.editFormVisible = false;
                    this.$message("没有修改");
                } else {
                    let idx = JSON.parse(sessionStorage.getItem("idx"));
                    let params = {
                        name: this.editsForm.name,
                        username: this.editsForm.username,
                        email: this.editsForm.email,
                        company: this.editsForm.company,
                        line: this.editsForm.line,
                        adminFront: this.editsForm.adminFront == "有" ? "1" : "0",
                        adminBack: this.editsForm.adminBack == "有" ? "1" : "0",
                        type: this.editsForm.type == "分管" ? "1" : "0",
                        id: idx.id
                    };
                    cpbupdate(params).then((res) => {
                        if (res.status == 0) {  // 成功
                            this.$message.success(res.message);
                            this.init();
                            this.editFormVisible = false;
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }
                
            }
        },
        // 启用/禁用
        handleAbled (index, row) {
            let params = {
                id: row.id
            };
            if (row.status == "1") {
                cpbdelete(params).then((res) => {
                    if (res.status == 0) {
                        this.init();
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                })
            } else {
                cpbopen(params).then((res) => {
                    if (res.status == 0) {
                        this.init();
                        this.$message.success(res.message);
                    } else {
                        this.$message.error(res.message);
                    }
                })
            }
        },
        init () {
            this.tableData = [];
            let params = {
                pageNo: this.pageNum,
                pageSize: this.pageSize
            };
            cpbuserrList(params).then((res) => {
                if (res.status == 0) {          // 成功
                    this.tableData = res.datas.list;
                    this.total = res.datas.total;
                } else {
                    this.$message.error(res.message);
                    this.tableData = [];
                    this.total = 0;
                }
            })
        },
        current_change (currentPage) {
            this.pageNum = currentPage;
            this.init();
        },
    }
}
</script>

<style lang="scss">
.cpb{
    width: 100%;
    height: 100%;
    // background: url(../../assets/bg.png) no-repeat;
    // background-size: 100% 100%;
    box-sizing: border-box;
    // overflow: hidden;
    // overflow-y: scroll;
    .logo{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0 0 0;
    }
    .cen{
        display: flex;
        .left{
            display: flex;
            width: 56%;
        }
    }
    .add{
        width: 60px;
        height: 30px;
        cursor: pointer;
        color: #ffffff;
    }
    .el-table{
        background: rgba(187, 184, 184, 0.3);
        // padding-bottom: 50px;
        z-index: inherit;
        .yc{
            display: none;
        }
    }
    .el-input{
        width: 190px;
    }
}
</style>

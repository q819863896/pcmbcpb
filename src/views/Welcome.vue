<template>
    <el-container>
      <el-header>预约管理系统</el-header>
      <el-main>
            <div id="school"><button @click = "funschool">学校信息</button></div>
            <div id="copmany"><button @click = "funccompany"> 分公司管理 </button></div>
            <div id="orderinfo"><button @click = "funorderinfo">预约信息管理 </button></div>
      </el-main>
    </el-container>  
</template>
<script>
export default {
  methods: {
    //学校信息审核
    funschool: function() {
      this.$router.push({ path: "/school" });
    },
    //公司信息管理
    funccompany: function() {
      this.$router.push({ path: "/company" });
    },
    funorderinfo: function() {
      this.$router.push({ path: "/reservation" });
    }
  }
};
</script>


<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

#copmany {
  line-height: 30px;
  background-color: #e91818;
  height: 300px;
  width: 500px;
  float: left;
  padding: 5px;
}

#school {
  line-height: 30px;
  background-color: #18e95e;
  height: 300px;
  width: 500px;
  margin-right: auto;
  margin-left: auto;
  float: none;
  padding: 5px;
}

#orderinfo {
  line-height: 30px;
  background-color: #2d18e9;
  height: 300px;
  width: 500px;
  float: right;
  padding: 5px;
}
</style>
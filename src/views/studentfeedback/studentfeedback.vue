<template>
    <section
        style="position: relative;"
        v-loading="loading2"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <div class="file-up-down">
        <el-upload
            class="upload-demo"
            ref="editTeaPic"
            :action="portraitUrl"
            :before-remove="beforeRemove"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="fileList"
            :before-upload="upBefore"
            :on-success="upSuccess"
            :on-error="upFail"
            :on-change="upChange">
            <el-button type="primary" size="larger">上传 pdf</el-button>
            <!--<img width="70" height="70" :src="teaPicture" alt="教师头像">-->
            <!--<em slot="tip" class="el-upload__tip el-upload__edit">点击上传,限制类型jpg/png,且小于1M</em>-->
        </el-upload>
        <!-- <el-button type="primary" size="larger" class="out-put" @click="outputExcel">导出 pdf</el-button> -->
        </div>
    </section>
</template>

<script>
import util from "../../common/js/util";
import axios from "axios";
import { importCooperateExcel, cooperateExcelDownloads } from "../../api/api";

export default {
    data() {
        return {
            fileList: [
                // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
                // { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
            ],
            portraitUrl: "",
            loading2: false,
            loadingText: ""
        };
    },

    methods: {
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },

        //教师图片上传
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        upChange(file, fileList) {
            console.log(file, fileList);
            this.loadingText = "正在上传...";
            this.loading2 = !this.loading2;
        },
        upSuccess(response, file, fileList) {
            console.log("response", response);
            this.$message.success("上传成功!");
            this.loading2 = !this.loading2;
            this._data.loading2 = !this._data.loading2;
            // status === 0 && this.$message.success('上传成功!');
        },
        upFail(response, file, fileList) {
            console.log(response, file, fileList);
            this.$message.error("上传失败!");
            this.loading2 = !this.loading2;
            this._data.loading2 = !this._data.loading2;
        },
        upBefore(file) {
            console.log({ "file.type": file.type });
            console.log({ "file.size": file.size });
            const isXLSX = file.type === "application/pdf";
            const isXLS = file.type === "application/pdf";
            const isLt1M = file.size / 1024 / 1024 < 10;
            if (!isXLSX && !isXLS) {
                this.$message.error("只能上传 pdf 文件!");
                this.loading2 = !this.loading2;
            }
            if (!isLt1M) {
                this.$message.error("上传文件大小不能超过 10MB!");
            }
            return isXLSX || (isXLS && isLt1M);
        },
        outputExcel: function() {
            // let param = new URLSearchParams();
            // param.append('role', 1);
            this.loadingText = "正在下载...";
            this.loading2 = !this.loading2;
            cooperateExcelDownloads({}).then(res => {
                let blob = new Blob([res], { type: "application/pdf" });
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                // link.download = 'SchoolAudit';
                link.click();
                this.loading2 = !this.loading2;
            });
        }
    },
    created() {
        this.portraitUrl = axios.defaults.baseURL + "/cpb/upload/fileUpload";
    }
};
</script>

<style lang="scss">
.file-up-down {
    width: 310px;
    margin-left: 50%;
    margin-top: 100px;
    text-align: center;
    transform: translateX(-150px);
    border: 1px solid #a19288;
    // background: #ffffff;
    background: rgba(105, 102, 102, 0.2);
    .el-upload-list__item-name {
        margin-right: 0;
        color: #ffffff;
        i{
            color: #ffffff;
        }
    }
}

.upload-demo {
    width: 310px;
    margin: 20px auto;
}

.out-put {
    margin: 20px auto;
}
</style>

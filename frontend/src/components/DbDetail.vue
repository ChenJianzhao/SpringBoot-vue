<template xmlns="http://www.w3.org/1999/html">
    <el-dialog title="流水线详情" v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false"  width="80%">
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple"><b>流水线名</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple">{{this.pipelineDetail.name}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple"><b>应用名</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple">{{this.pipelineDetail.appName}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple"><b>git仓库</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple">{{this.pipelineDetail.gitRepoURL}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple"><b>git分支</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple">{{this.pipelineDetail.gitBranch}}</div></el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple"><b>打包类型</b></div></el-col>
            <el-col :span="18"><div class="grid-content bg-purple">{{this.pipelineDetail.packType}}</div></el-col>
        </el-row>
        <el-table
            :data="this.pipelineDetail.stages"
            border
            style="width: 80%"
            class="table">
            <el-table-column
                prop="seq"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="阶段"
                width="200">
            </el-table-column>
            <el-table-column
                prop="displayName"
                label="阶段名"
                width="200">
            </el-table-column>
            <el-table-column
                prop="autoTrigger"
                label="自动触发"
                width="100"
                :formatter="boolFormatter">
            </el-table-column>
            <el-table-column
                prop="buildMachine"
                label="构建机器"
                width="150">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button :plain="true" type="danger" v-on:click="canclemodal">取消</el-button>
            <!--<el-button :plain="true" @click="updateForm(form)">Save</el-button>-->
        </div>
    </el-dialog>
</template>


<script>
    import common from "../../config/common";

    export default {
        data(){
            return {
                formLabelWidth: '120px',
                pipelineDetail: '',
            }
        },
        props: ['dialogFormVisible'],

        methods: {
            getPipelineDetail: function (pipelineName) {
                this.$axios.get( common.baseUrl + '/pipelines/' + pipelineName )
                    .then((response) => {
                        this.pipelineDetail = response.data;
                        console.log(this.pipelineDetail);
                    })
                    .catch(error => {
                        console.log(error.data);
                    });
            },
            canclemodal: function () {
                this.$emit('canclemodal');
            },
            boolFormatter: function (row, column) {
                return row.autoTrigger + '';
            }
        }

    }

</script>

<style>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 15px;
    }
</style>

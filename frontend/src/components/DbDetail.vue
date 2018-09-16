<template xmlns="http://www.w3.org/1999/html">
    <el-dialog title="流水线详情" v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false"  width="80%">
        <label><b>流水线名</b></label><p>{{this.pipelineDetail.name}}</p>
        <label><b>git仓库</b></label><p>{{this.pipelineDetail.gitRepoURL}}</p>
        <el-table
            :data="this.pipelineDetail.stages"
            border
            style="width: 100%"
            class="table">
            <el-table-column
                prop="seq"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="displayName"
                label="阶段"
                width="200">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button :plain="true" type="danger" v-on:click="canclemodal">Cancel</el-button>
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
                        console.log(response);
                        this.pipelineDetail = response.data;
                        console.log(this.pipelineDetail);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            canclemodal: function () {
                this.$emit('canclemodal');
            }
        }

    }

</script>

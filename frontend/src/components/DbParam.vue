<template>
    <el-dialog title="构建参数" v-model="dialogParamVisible" :close-on-click-modal="false" :show-close="false">
        <el-form v-for="(item, index) in buildParameters" :key="item.name" >
            <el-form-item :label="item.displayName" :label-width="formLabelWidth">
                <el-input v-if="item.dataType === 2" v-model='item.value' placeholder="请输入内容"></el-input>
                <el-select  v-if="item.dataType === 3" v-model='item.value' placeholder="请选择" value-key='item.value'>
                    <el-option
                        v-for="option in item.values"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :plain="true" type="danger" v-on:click="canclemodal">取消</el-button>
            <el-button  @click="executePipeline" type="primary">运行</el-button>
        </div>
    </el-dialog>
</template>


<script>
    import common from "../../config/common";

    export default {
        data(){
            return {
                formLabelWidth: '120px',
                // buildParameters: [],
                selectItem:''
            }
        },
        props: ['dialogParamVisible', 'buildParameters', 'currentPipeline'],

        methods: {
            // showParameters: function (buildParameters) {
            //     this.buildParameters = buildParameters;
            // },
            canclemodal: function () {
                this.$emit('canclemodal');
            },
            executePipeline: function () {
                // console.log(this.buildParameters);
                let paramObj = this.transferParam(this.buildParameters);
                this.$axios.post( common.baseUrl + "/pipelines/" + this.currentPipeline, {
                    params: {
                        paramObj
                    }
                }).then((response) => {
                    this.$emit('canclemodal');
                    this.$message({
                        message: "流水线运行开始",
                        type: 'success'
                    });
                    }).catch(error => {
                    let data = error.response.data;
                    if(data.code === 525){
                        this.$message({
                            message: data.message,
                            type: 'warning'
                        });
                    }
                });
            },
            transferParam: function(buildParameters) {
                let paramObj = new Map();
                buildParameters.forEach( param => {
                    paramObj.set(param.name, param.value);
                });
                console.log(paramObj);
                return paramObj;
            },
        }

    }

</script>

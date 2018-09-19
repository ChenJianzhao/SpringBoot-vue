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
                currentPipeline: '',
                buildParameters: [],
                selectItem:''
            }
        },
        props: ['dialogParamVisible', 'parameters'],

        methods: {
            showParameters: function (buildParameters) {
                this.buildParameters = buildParameters;
            },
            canclemodal: function () {
                this.$emit('canclemodal');
            },
            executePipeline: function () {
                console.log(this.buildParameters);
                let paramObj = this.transferParam(this.buildParameters);
                this.$axios.post( common.baseUrl + "/pipelines/" + this.currentPipeline, {
                    params: {
                        paramObj
                    }
                }).then((response) => {
                        console.log(response.data);
                    }).catch(error => {
                    console.log(error.date);
                });
            },
            transferParam: function(buildParameters) {
                let paramObj = new Map();
                for(let param in buildParameters) {
                    paramObj.put(param.name, param.value);
                }
                return paramObj;
            },
        }

    }

</script>

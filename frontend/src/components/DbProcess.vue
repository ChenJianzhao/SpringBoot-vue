<template>
    <div>
        <div id="nav">
        <!--<lable>执行进度</lable>-->
            <ul>
                <li v-for="item in lastExecuteState">
                <!--{{item.state}}-->
                    <el-button v-bind:disabled="item.state!==null" type="info" size="small" round>{{item.displayName}}</el-button>
                    <span class="el-icon-arrow-right"></span>
                </li>
            </ul>
            <el-button @click="showParamDialog" type="primary"  round >继续</el-button>
            <el-button @click="executePipeline(scope.$index, pipelineData)" type="primary"  round>停止</el-button>
        </div>

        <db-param ref="paramForm" :dialogParamVisible="dialogParamVisible" :buildParameters="buildParameters" :currentPipeline="currentPipeline"
                  v-on:canclemodal="dialogParamHide"> </db-param>
    </div>
</template>


<script>
    import common from "../../config/common";
    import DbParam from "./DbParam.vue";

    export default {
        data(){
            return {
                formLabelWidth: '120px',
                lastExecuteState: '',
                currentPipeline: '',
                buildParameters: [],
                dialogParamVisible: false,
            }
        },
        components: {
            DbParam
        },
        props: [],

        methods: {
            dialogParamHide: function () {
                this.dialogParamVisible = false;
            },
            canclemodal: function () {
                this.$emit('canclemodal');
            },
            getExecuteState: function(currentPipeline){
                this.currentPipeline = currentPipeline;
                this.$axios.get( common.baseUrl + "/pipelines/" + currentPipeline + "/state")
                    .then((response) => {
                        this.lastExecuteState = response.data;
                        // console.log("------getExecuteState------");
                        // console.log(this.lastExecuteState);
                    }).catch(function (response) {
                    console.log(response)
                });
            },
            showParamDialog: function () {
                console.log('------showParamDialog------');
                this.$axios.get( common.baseUrl + "/pipelines/" + this.currentPipeline + "/buildParameters")
                    .then((response) => {
                        this.buildParameters = response.data;
                        this.buildParameters.forEach(param => {
                            param.value = param.defaultValue  != null ? param.defaultValue: param.values != null ? param.values : '' ;
                            if(param.dataType === 3) {
                                let values = param.values.split(',');
                                let options = [];
                                values.forEach(value => {
                                    options.push({'label': value.toString(), 'value': value.toString()});
                                });
                                param.values = options;
                                param.value = options[0].value;
                            }
                        });
                        console.log(this.buildParameters);
                        if(this.buildParameters .length !==0) {
                            console.log("show dialogParamVisible");
                            this.dialogParamVisible = true;
                        }else {
                            this.dialogParamVisible = false;
                        }

                    }).catch(error => {
                        console.log(error.data);
                        let data = error.response.data;
                        if(data.code === 525){
                            this.$message({
                                message: data.message,
                                type: 'warning'
                            });
                        }
                });
            }
        }

    }

</script>

<style>

    #nav {
        height: 20px;
        margin-top: 10px;
    }

    #nav ul {
        list-style: none;
        line-height: 40px;
    }

    #nav li {
        display: block;
        float: left;
    }

</style>

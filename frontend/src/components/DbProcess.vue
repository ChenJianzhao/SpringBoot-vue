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

        <db-param ref="paramForm" :dialogParamVisible="dialogParamVisible" :parameters="buildParameters" v-on:canclemodal="dialogParamHide"> </db-param>
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
            updateForm: function (formName) {
                let itemId = formName.id;
                let phone = formName.phone;
                let zone = formName.zone;
                this.$axios.put('http://127.0.0.1:8000/api/persons/detail/' + itemId, {
                    phone: phone,
                    zone: zone
                })
                    .then(function (response) {
                        console.log(response);
                        this.form = response.data;

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                location.reload();
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
            getBuildParameters: function () {
                this.$axios.get( common.baseUrl + "/pipelines/" + this.currentPipeline + "/buildParameters")
                    .then((response) => {
                        this.buildParameters = response.data;
                        console.log(this.buildParameters);
                    }).catch(error => {
                        console.log(error.date);
                });
                return this.buildParameters;
            },
            showParamDialog: function () {
                // let buildParameters = this.getBuildParameters();
                this.$axios.get( common.baseUrl + "/pipelines/" + this.currentPipeline + "/buildParameters")
                    .then((response) => {
                        this.buildParameters = response.data;
                        console.log(this.buildParameters);
                        for(let i in this.buildParameters) {
                            let param = this.buildParameters[i];
                            param.value = param.defaultValue  != null ? param.defaultValue: param.values != null ? param.values : '' ;
                            console.log(param);
                            if(param.dataType === 3) {
                                let values = param.values.split(',');
                                let options = [];
                                for( let index in values) {
                                    options[index] = {'label': values[index].toString(), 'value': values[index].toString()};
                                }
                                param.values = options;
                                console.log(param.values);
                                param.value = options[0].value;
                            }
                        }
                        console.log(this.buildParameters);
                        if(this.buildParameters .length !==0) {
                            console.log("show dialogParamVisible");
                            this.$refs.paramForm.showParameters(this.buildParameters);
                            this.dialogParamVisible = true;
                        }else {
                            this.dialogParamVisible = false;
                        }

                    }).catch(error => {
                    console.log(error.date);
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

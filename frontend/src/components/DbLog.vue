<template>
    <div>
        <db-process ref="processBar"></db-process>

        <el-table v-model="currentPipeline"
                :data="executeLogData"
                border
                class="table">
          <el-table-column
            prop="pipelineName"
            label="流水线"
            width="200">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="150">
          </el-table-column>
          <el-table-column
            prop="buildId"
            label="运行"
            width="100">
          </el-table-column>
          <el-table-column
            prop="gitCommitId"
            label="commit_id"
            width="200">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="持续时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="开始"
            width="200"
            :formatter="formatter">
          </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template scope="scope">
                    <el-button @click="showExecuteEntry(scope.$index, executeLogData)" type="primary" size="small" round>详情</el-button>
                    <!--<el-button v-if="executeLogData[scope.$index].state==='BUILDING'" @click="abortExecute(scope.$index, executeLogData)"
                               type="primary" size="small" round>停止</el-button>-->
                </template>

            </el-table-column>
        </el-table>
        <el-pagination class="pagination" layout="prev, pager, next" :total="total" :page-size="pageSize"
                       v-on:current-change="changePage">
        </el-pagination>

        <db-modal ref="entryTable" :dialogFormVisible="dialogFormVisible" :executeLogData="executeLogData" v-on:canclemodal="dialogVisible"></db-modal>
    </div>

</template>

<script>
    import Bus from '../eventBus'
    import DbModal from './DbModal.vue'
    import DbProcess from './DbProcess.vue'
    import common from "../../config/common";

    export default {
        data(){
            return {
                tableData: [],
                apiUrl: 'http://127.0.0.1:8000/api/persons',
                total: 0,
                pageSize: 10,
                currentPage: 1,
                dialogFormVisible: false,
                executeEntryData: '',
                pipelineData: [],
                executeLogData: [],
                lastExecuteState: '',
            }
        },
        props: ['currentPipeline'],
        components: {
            DbModal,DbProcess
        },
        mounted () {
            Bus.$on('filterResultData', (data) => {
                this.total = data.total_pages;
                this.pageSize = data.count;
            });
        },

        methods: {

            dialogVisible: function () {
                this.dialogFormVisible = false;
            },

            changePage: function (currentPage) {
                this.currentPage = currentPage;
                // this.getCustomers()
            },

            formatter(row, column) {
              let data = this.$moment(row.createTime);
              return data.format('YYYY-MM-DD HH:mm:ss')
            },
            getPipelines: function(){
              this.$axios.get("./pipelines", {
                params: {
                  // page: this.currentPage,
                  // sex: this.sex,
                  // email: this.email
                }
              }).then((response) => {
                this.pipelineData = response.data;
                // this.tableData = response.data.data.results;
                // this.total = response.data.data.total;
                // this.pageSize = response.data.data.count;
                console.log(response.data);
                console.log(this.pipelineData);
              }).catch(function (response) {
                console.log(response)
              });
            }
            ,
            timeFormatter(row, column) {
              return (row.costTime / 1000) + ' s'
            },
            getExecuteLog: function (currentPipeline) {
                this.$axios.get( common.baseUrl + "/pipelines/" + currentPipeline + "/executeLogs")
                    .then((response) => {
                    this.executeLogData = response.data;
                    console.log("------getExecuteLog------");
                    for(let i in this.executeLogData) {
                      let log = this.executeLogData[i];
                      log.costTime = this.millSecondFormat(log.costTime);
                    }
                }).catch(function (response) {
                  console.log(response)
                });

                this.$refs.processBar.getExecuteState(currentPipeline);
            },
            millSecondFormat: function(time) {
                if (!time) {
                  return "";
                } else {
                    let date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    // let Y = date.getFullYear() + '-';
                    // let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    let D = date.getDate() - 1;
                    let h = date.getHours() - 8;
                    let m = date.getMinutes();
                    let s = date.getSeconds();
                    let timeStr = '';
                    if( D!==0 )
                      timeStr = timeStr + D + "天";
                    if( h!==0 )
                      timeStr = timeStr + h + "小时";
                    if( m!==0 )
                      timeStr = timeStr + m + "分";
                    timeStr = timeStr + s + "秒";
                    return timeStr;
                    // return D+ "天" + h + "小时" + m + "分" + s + "秒";
                }
            },
            showExecuteEntry: function (index, rows) {
                this.dialogFormVisible = true;
                const buildId = rows[index].buildId;
                const pipelineName = rows[index].pipelineName;
                this.$refs.entryTable.getExecuteEntry(pipelineName, buildId);
            },
            abortExecute: function (index, rows) {
                let pipelineName = rows[index].pipelineName;
                this.$axios.post( common.baseUrl + "/pipelines/" + pipelineName + "/abort")
                    .then((response) => {
                      console.log(response)
                    }).catch(error => {
                    let data = error.response.data;
                    if(data.code === 525) {
                      this.$message({
                        message: data.message,
                        type: 'warning'
                      });
                    }
                });
            },
        }
    }
</script>

<style>
    .table {
        margin-top: 30px;
    }

    .pagination {
        margin-top: 10px;
        float: right;
    }

</style>

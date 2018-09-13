<template>
    <div>
        <div></div>
        <el-table v-model="currentPipeline"
                :data="executeLogData"
                border
                style="width: 80%"
                class="table">
          <el-table-column
            prop="pipelineName"
            label="流水线"
            width="200">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="buildId"
            label="运行"
            width="100">
          </el-table-column>
          <el-table-column
            prop="gitCommitId"
            label="commit_id"
            width="300">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="持续时间"
            width="100"
            :formatter="timeFormatter">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="完成"
            width="100"
            :formatter="timeFormatter">
          </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template scope="scope">
                    <el-button @click="showExecuteEntry(scope.$index, executeLogData)" type="primary" size="small" round>详情</el-button>
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
            }
        },
        props: ['currentPipeline'],
        components: {
            DbModal
        },
        mounted () {
            console.log("DbLog mounted: " + this.currentPipeline);
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
              let data = this.$moment(row.create_datetime, this.$moment.ISO_8601);
              return data.format('YYYY-MM-DD')
            },

            dateformatter(row, column) {
              let data = this.$moment(row.createTime, this.$moment.ISO_8601);
              return data.format('YYYY-MM-DD')
            },

            getPipelines: function(){
              this.$axios.get("http://localhost:8088/pipelines", {
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
              // if(pipelineName===undefined)
              //   pipelineName = "product-service";
              console.log("getExecuteLog");
              console.log(currentPipeline);
              this.$axios.get("http://localhost:8088/pipelines/" + currentPipeline + "/executeLogs", {
                params: {
                  // page: this.currentPage,
                  // sex: this.sex,
                  // email: this.email
                }
              }).then((response) => {
                this.executeLogData = response.data;
                console.log("------getExecuteLog------");
                console.log(this.executeLogData);
              }).catch(function (response) {
                console.log(response)
              });
            },
            showExecuteEntry: function (index, rows) {
                this.dialogFormVisible = true;
                const buildId = rows[index].buildId;
                const pipelineName = rows[index].pipelineName;
                this.$refs.entryTable.getExecuteEntry(pipelineName, buildId);
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

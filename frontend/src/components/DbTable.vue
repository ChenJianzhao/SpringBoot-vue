<template>
    <div>
        <el-table
          ref="singleTable"
                :data="pipelineData"
                border
                style="width: 80%"
                highlight-current-row
                @current-change="handleCurrentChange"
                class="table">
          <el-table-column
            prop="name"
            label="流水线"
            width="300">
          </el-table-column>
          <el-table-column
            prop="lastSuccessTime"
            label="上次成功"
            width="200"
            :formatter="dateformatter">
          </el-table-column>
          <el-table-column
            prop="lastFailureTime"
            label="上次失败"
            width="200"
            :formatter="dateformatter">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="上次持续时间"
            width="200"
            :formatter="timeFormatter">
          </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template scope="scope">
                    <el-button @click="executePipeline(scope.$index, pipelineData)" type="primary" size="small" round>运行</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" layout="prev, pager, next" :total="total" :page-size="pageSize"
                       v-on:current-change="changePage" style="width: 80%">
        </el-pagination>

        <db-log ref="logTable" :currentPipeline="currentPipeline"></db-log>
    </div>

</template>

<script>
    import Bus from '../eventBus'
    import DbModal from './DbModal.vue'
    import DbLog from './DbLog.vue'

    export default {
        data(){
            return {
                tableData: [],
                apiUrl: 'http://127.0.0.1:8000/api/persons',
                total: 0,
                pageSize: 10,
                currentPage: 1,
                sex: '',
                email: '',
                dialogFormVisible: false,
                form: '',
                pipelineData: [],
                currentPipeline: '',
            }
        },
        components: {
            DbModal,
            DbLog
        },
        mounted () {
            // this.getCustomers();
            this.getPipelines();
            Bus.$on('filterResultData', (data) => {
                this.tableData = data.results;
                this.total = data.total_pages;
                this.pageSize = data.count;
                this.email = data.email;
                this.sex = data.sex;

            });
        },

        methods: {

            dialogVisible: function () {
                this.dialogFormVisible = false;
            },
            getCustomers: function () {
                this.$axios.get(this.apiUrl, {
                    params: {
                        page: this.currentPage,
                        sex: this.sex,
                        email: this.email
                    }
                }).then((response) => {
                    this.tableData = response.data.data.results;
                    this.total = response.data.data.total;
                    this.pageSize = response.data.data.count;
                    console.log(response.data.data);
                }).catch(function (response) {
                    console.log(response)
                });
            },
            changePage: function (currentPage) {
                this.currentPage = currentPage;
                this.getCustomers()
            },
            editItem: function (index, rows) {
                this.dialogFormVisible = true;
                const itemId = rows[index].id;
                const idurl = 'http://127.0.0.1:8000/api/persons/detail/' + itemId;
                this.$axios.get(idurl).then((response) => {
                    this.form = response.data;
                }).catch(function (response) {
                    console.log(response)
                });
            },
            formatter(row, column) {
              let data = this.$moment(row.create_datetime, this.$moment.ISO_8601);
              return data.format('YYYY-MM-DD')
            },
            executePipeline: function(index, rows){
              // this.dialogFormVisible = true;
              const pipelineName = rows[index].name;
              const exeUrl = "http://localhost:8088/pipelines/" + pipelineName;
              this.$axios.post(exeUrl).then((response) => {
                // this.form = response.data;
                console.log(response)
              }).catch(function (response) {
                console.log(response)
              });
            },
            dateformatter(row, column) {
              let data = this.$moment(row.createTime, this.$moment.ISO_8601);
              return data.format('YYYY-MM-DD')
            },
            getPipelines: function(){
              this.$axios.get("http://localhost:8088/pipelines", {
                params: {
                }
              }).then((response) => {
                this.pipelineData = response.data;
                // this.total = response.data.data.total;
                // this.pageSize = response.data.data.count;
                console.log(this.pipelineData);
                this.setCurrent(this.pipelineData[0]);
              }).catch(function (response) {
                console.log(response)
              });
            }
            ,
            timeFormatter(row, column) {
              return (row.costTime / 1000) + ' s'
            },
            setCurrent(row) {
              // console.log(row);
              this.$refs.singleTable.setCurrentRow(row);
            },
            handleCurrentChange(currentRow, oldCurrentRow) {
              this.currentPipeline = currentRow.name;
              console.log("handleCurrentChange: " + this.currentPipeline);
              this.$refs.logTable.getExecuteLog(this.currentPipeline);
            }
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

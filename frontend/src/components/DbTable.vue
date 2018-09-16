<template>
    <div>
        <el-table
          ref="singleTable"
                :data="pipelineData"
                border
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
            width="200">
              <template scope="prop">
                <p>{{ dateformatter(prop.row.lastSuccessTime)}}</p>
              </template>
          </el-table-column>
          <el-table-column
            prop="lastFailureTime"
            label="上次失败"
            width="200">
              <template scope="prop">
                <p>{{ dateformatter(prop.row.lastFailureTime)}}</p>
              </template>
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="上次持续时间"
            width="200">
          </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template scope="scope">
                    <el-button @click="executePipeline(scope.$index, pipelineData)" type="primary" size="small" round>运行</el-button>
                    <el-button @click="showDetail(scope.$index, pipelineData)" type="primary" size="small" round>流水线信息</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" layout="prev, pager, next" :total="total" :page-size="pageSize"
                       v-on:current-change="changePage" >
        </el-pagination>

        <db-log ref="logTable" :currentPipeline="currentPipeline"></db-log>
        <db-detail ref="detailTable" :dialogFormVisible="dialogFormVisible" v-on:canclemodal="dialogVisible"> </db-detail>
    </div>

</template>

<script>
    import Bus from '../eventBus'
    import DbModal from './DbModal.vue'
    import DbLog from './DbLog.vue'
    import DbDetail from './DbDetail.vue'
    import common from "../../config/common.js";

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
                pipelineDetail: '',
            }
        },
        components: {
            DbModal,
            DbLog,
            DbDetail
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
              const exeUrl = common.baseUrl + "/pipelines/" + pipelineName;
              this.$axios.post(exeUrl).then((response) => {
                // this.form = response.data;
                console.log(response);
                this.$message({
                  message: "流水线运行开始",
                  type: 'success'
                });
              }).catch(error => {
                console.log(error.response);
                let data = error.response.data;
                if(data.code === 525){
                  this.$message({
                    message: data.message,
                    type: 'warning'
                  });
                }

              });
            },
            dateformatter(time) {
              // console.log(time);
              if(time===null)
                return '';
              let data = this.$moment(time);
              return data.format('YYYY-MM-DD HH:mm:ss');
            },
            getPipelines: function(){
                console.log("config.baseUrl: " + common.baseUrl);
                this.$axios.get( common.baseUrl + "/pipelines", {
                  params: {
                  }
                }).then((response) => {
                    this.pipelineData = response.data;
                    // this.total = response.data.data.total;
                    // this.pageSize = response.data.data.count;
                    console.log(this.pipelineData);

                    for(let i in this.pipelineData) {
                      let log = this.pipelineData[i];
                      log.costTime = this.millSecondFormat(log.costTime);
                    }

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
                if( D!==0 )
                  timeStr = timeStr + h + "小时";
                if( D!==0 )
                  timeStr = timeStr + m + "分";
                timeStr = timeStr + s + "秒";
                return timeStr;
                // return D+ "天" + h + "小时" + m + "分" + s + "秒";
              }
            },
            showDetail: function (index, rows) {
                this.dialogFormVisible = true;
                const pipelineName = rows[index].name;
                this.$refs.detailTable.getPipelineDetail(pipelineName);
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

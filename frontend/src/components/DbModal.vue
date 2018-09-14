<template>
    <el-dialog title="执行记录详情" v-model="dialogFormVisible" :close-on-click-modal="false" :show-close="false"  width="80%">
        <el-table
        :data="executeEntryData"
        border
        style="width: 100%"
        class="table">stageSeq
          <el-table-column
            prop="stageSeq"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="stageDisplayName"
            label="阶段"
            width="200">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="150">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="耗时"
            width="100">
          </el-table-column>
          <el-table-column
            prop="jenkinsBuildURL"
            label="日志"
            width=400>
            <template scope="props">
              <a v-bind:href="''+props.row.jenkinsBuildURL+''">{{ props.row.jenkinsBuildURL }}</a>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button :plain="true" type="danger" v-on:click="canclemodal">Cancel</el-button>
            <!--<el-button :plain="true" @click="updateForm(form)">Save</el-button>-->
        </div>
    </el-dialog>
</template>


<script>
    export default {
        data(){
            return {
                formLabelWidth: '120px',
                executeEntryData: [],
            }
        },
        props: ['dialogFormVisible', 'executeLogData'],
      render: function (createElement) {
        return createElement(
          'h' + this.level,   // tag name 标签名称
          this.$slots.default // 子组件中的阵列
        )
      },
        methods: {
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
            timeFormatter(row, column) {
              return (row.costTime / 1000) + ' s'
            },
            getExecuteEntry: function (pipelineName, buildId) {
              const url = "http://localhost:8088/pipelines/" + pipelineName + "/" + buildId;
              console.log(url);
              this.$axios.get(url)
                .then((response) => {
                  this.executeEntryData = response.data;
                  console.log("------getExecuteEntry------");
                  console.log(this.executeEntryData);

                  for(let i in this.executeEntryData) {
                    let log = this.executeEntryData[i];
                    log.costTime = this.millSecondFormat(log.costTime);
                  }

                }).catch(function (response) {
                console.log(response)
              });

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
            urlFormatter: function (row, column) {
              return this.$createElement('a', row.jenkinsBuildURL);
               // return "<a href=\""+ url +"\">"+ url +"</a>"
            }
        }

    }

</script>

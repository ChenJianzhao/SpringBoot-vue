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
            width="100">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="耗时"
            width="100"
            :formatter="timeFormatter">
          </el-table-column>
          <el-table-column
            prop="jenkinsBuildURL"
            label="日志"
            width=400>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button :plain="true" type="danger" v-on:click="canclemodal">Cancel</el-button>
            <el-button :plain="true" @click="updateForm(form)">Save</el-button>
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
                }).catch(function (response) {
                console.log(response)
              });

            },
        }

    }

</script>

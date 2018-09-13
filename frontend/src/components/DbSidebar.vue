<template>
    <!--<li class="el-menu-item is-active" style="">{{msg}}</li>-->
  <el-menu
    class="el-menu-vertical-demo">
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>流水线</span>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>

    export default {
        name: 'db-sidebar',
        data() {
            return {
                // msg: 'Dashboard'
                msg: '流水线'
            }
        }
    }

</script>

<style>
    li {
        padding-left: 20px;
    }
</style>

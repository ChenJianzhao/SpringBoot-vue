<template>
    <!--<li class="el-menu-item is-active" style="">{{msg}}</li>-->
  <el-menu
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    default-active="1">
    <!--<el-submenu index="1">-->
      <!--<template slot="title">-->
        <!--<i class="el-icon-menu"></i>-->
        <!--<span>流水线</span>-->
      <!--</template>-->
    <!--</el-submenu>-->
        <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">流水线</span>
        </el-menu-item>
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

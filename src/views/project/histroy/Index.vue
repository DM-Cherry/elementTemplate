<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="float-left">历史报警数据</span>
                <div class="float-right">
                  <el-button @click="historyType = 'tdlas'">TDLAS</el-button>
                  <el-button @click="historyType = 'sonic'" type="primary">声波</el-button>
                </div>
              </div>
              <template>
                <section v-show="historyType === 'tdlas'">
                  <Tdlas />
                </section>
                <section v-show="historyType === 'sonic'">
                  <Sonic />
                </section>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>

<script>
import Tdlas from '@/views/project/histroy/components/Tdlas';
import Sonic from '@/views/project/histroy/components/Sonic';

export default {
  name: 'History',
  components: { Tdlas, Sonic },
  data() {
    return {
      historyType: 'tdlas',
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>

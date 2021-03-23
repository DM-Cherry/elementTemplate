<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>系统配置</span>
              </div>
              <template v-if="systemData.time">
                <h5 class="mb-4">
                  上次修改时间：
                  <span>{{ systemData.time[0].value }}</span>
                </h5>
                <el-form label-width="150px" class="system-form">
                  <h6>TDLAS</h6>
                  <el-row :gutter="12">
                    <el-col
                      :sm="12"
                      :md="12"
                      :lg="12"
                      v-for="item in systemData.tdlas"
                      :key="item.id"
                      class="filter-item"
                    >
                      <el-form-item :label="item.name">
                        <el-input
                          v-model="item.value"
                          @wheel.native.prevent="stopScrollFun($event)"
                          type="number"
                          min="0"
                        >
                          <template slot="append">ppm*m</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <h6>1号超声波设备</h6>
                  <el-row :gutter="12">
                    <el-col
                      :sm="12"
                      :md="12"
                      :lg="12"
                      v-for="item in systemData.voice1"
                      :key="item.id"
                      class="filter-item"
                    >
                      <el-form-item :label="item.name">
                        <el-input v-model="item.value" type="number">
                          <template slot="append">db</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <h6>2号超声波设备</h6>
                  <el-row :gutter="12">
                    <el-col
                      :sm="12"
                      :md="12"
                      :lg="12"
                      v-for="item in systemData.voice2"
                      :key="item.id"
                      class="filter-item"
                    >
                      <el-form-item :label="item.name">
                        <el-input v-model="item.value" type="number">
                          <template slot="append">db</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <h6>自定义导出字段</h6>
                  <el-row :gutter="12" class="mt-3">
                    <el-col :sm="24" :md="24" :lg="24">
                      <el-table
                        v-loading="loading"
                        ref="exportTable"
                        :data="systemData.exportField"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        border
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                          type="selection"
                          align="center"
                          width="100"
                        ></el-table-column>
                        <el-table-column
                          align="center"
                          type="index"
                          label="序号"
                          width="50"
                        ></el-table-column>
                        <el-table-column align="center" prop="name" label="字段"></el-table-column>
                        <el-table-column align="center" prop="creatertime" label="创建日期">
                          <template slot-scope="scope">
                            <div>
                              {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD') }}
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <el-row class="mt-3">
                    <el-col :gutter="12">
                      <el-form-item class="text-right">
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      loading: false,
      systemData: {},
      selectField: [],
    };
  },
  computed: {},
  created() {
    this.getSystem();
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.selectField = val.map(item => {
        return item.id;
      });
    },
    onSubmit() {
      this.loading = true;
      this.systemData.exportField = this.selectField;
      this.$axios
        .post('/tdDictionary/dictionaryUpdate', this.systemData)
        .then(res => {
          if (res.data.code !== 200) {
            this.$message.error('修改设备信息失败，请稍后重试');
          } else {
            this.$message.success('修改设备信息成功');
            this.getSystem();
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
          this.$message.error('服务请求失败，请稍后重试');
        });
    },
    getSystem() {
      this.loading = true;
      try {
        this.$axios
          .post('/tdDictionary/dictionaryInfo')
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error('获取设备信息失败，请稍后重试');
            } else {
              this.systemData = JSON.parse(JSON.stringify(res.data.data));
              this.loading = false;
              this.$nextTick(() => {
                if (this.systemData.exportField) {
                  this.systemData.exportField.forEach(item => {
                    if (item.state === '1') {
                      this.$refs.exportTable.toggleRowSelection(item);
                    }
                  });
                }
              });
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            console.error(err);
            this.$message.error('获取设备信息失败');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        this.loading = false;
        console.error(e);
      }
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.exportTable.toggleRowSelection(row);
      });
    },
    stopScrollFun(evt) {
      const event = evt || window.event;
      if (event.preventDefault) {
        // Firefox
        event.preventDefault();
        event.stopPropagation();
      } else {
        // IE
        event.cancelBubble = true;
        event.returnValue = false;
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
/*stylelint-disable */
.system-form input::-webkit-outer-spin-button,
.system-form input::-webkit-inner-spin-button {
  // property-no-vendor-prefix
  -webkit-appearance: textfield;
}
// selector-no-qualifying-type
.system-form input[type='number'] {
  // property-no-vendor-prefix
  -moz-appearance: textfield;
}
// no-duplicate-selectors
.system-form input::-webkit-outer-spin-button,
.system-form input::-webkit-inner-spin-button {
  // declaration-no-important
  // property-no-vendor-prefix
  -webkit-appearance: none !important;
}
// no-duplicate-selectors
.system-form input[type='number'] {
  // property-no-vendor-prefix
  -moz-appearance: textfield;
}
/* stylelint-enable */
</style>

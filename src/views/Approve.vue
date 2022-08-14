<template>
    <div class="leave-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="leave">
                <el-form-item label="审批状态" prop="applyState">
                    <el-select v-model="leave.applyState">
                        <el-option value="" label="所有"></el-option>
                        <el-option :value="1" label="待审批"></el-option>
                        <el-option :value="2" label="审批中"></el-option>
                        <el-option :value="3" label="已拒绝"></el-option>
                        <el-option :value="4" label="已通过"></el-option>
                        <el-option :value="5" label="作废"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getLeaveList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <el-table :data="leaveList">
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :formatter="item.formatter" :width="item.width" />
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />

        </div>
        <el-dialog title="休假审批" v-model="showDetail">
            <el-form ref="detailForm" :model="leaveDetail" label-width="auto" :rules="rule">
                <el-form-item label="申请人">
                    {{ leaveDetail.applyUser?.userName }}
                </el-form-item>
                <el-form-item label="休假类型">
                    {{ leaveDetail.type }}
                </el-form-item>
                <el-form-item label="休假时间">
                    {{ leaveDetail.leaveDate }}
                </el-form-item>
                <el-form-item label="休假时长">
                    {{ leaveDetail.leaveTime }}天
                </el-form-item>
                <el-form-item label="休假原因">
                    {{ leaveDetail.reason }}
                </el-form-item>
                <el-form-item label="审批状态">
                    {{ leaveDetail.state }}
                </el-form-item>
                <el-form-item label="审批人">
                    {{ leaveDetail.handler }}
                </el-form-item>
                <el-form-item label="审批意见" prop="remark" required v-if="leaveDetail.handler == userInfo.userName">
                    <el-input v-model="leaveDetail.remark" placeholder="请输入审批意见" type="textarea" :row="3" />
                </el-form-item>
                <el-form-item label="审批记录" v-else>
                    <div v-for="log in leaveDetail.auditLogs">
                        {{ log.userName }} - {{ log.action }} - {{ log.remark }}
                    </div>
                </el-form-item>
            </el-form>
            <template #footer v-if="leaveDetail.handler == userInfo.userName">
                <span class="dialog-footer">
                    <el-button @click="handleSubmit('refuse')">驳回</el-button>
                    <el-button type="primary" @click="handleSubmit('access')">通过</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from "./../utils/utils"

export default {
    name: 'approve',
    data() {
        return {
            userInfo: this.$store.state.userInfo,
            leave: {
                applyState: 1
            },
            leaveList: [],
            pager: {
                pageNum: 1,
                pageSize: 10
            },
            leaveDetail: {},
            showDetail: false,
            columns: [
                {
                    label: '审批单号',
                    prop: 'applyNo',
                    width: 100
                },
                {
                    label: '申请人',
                    prop: '',
                    formatter: (row, column, cellValue) => {
                        return row.applyUser.userName;
                    },
                },
                {
                    label: '休假时间',
                    prop: '',
                    width: 200,
                    formatter: (row, column, cellValue) => {
                        return (utils.formateDate(new Date(row.startTime), 'yyyy/MM/dd') + '-' + utils.formateDate(new Date(row.endTime), 'yyyy/MM/dd'));
                    },
                },
                {
                    label: '休假时长',
                    prop: 'leaveTime',
                },
                {
                    label: '休假类型',
                    prop: 'leaveType',
                    formatter(row, column, cellValue) {
                        return {
                            1: '事假',
                            2: '调休',
                            3: '年假'
                        }[cellValue]
                    }
                },
                {
                    label: '休假原因',
                    prop: 'reason',
                },
                {
                    label: '申请时间',
                    prop: 'createTime',
                    width: 140,
                    formatter: (row, column, cellValue) => {
                        if (cellValue)
                            return utils.formateDate(new Date(cellValue));
                    },
                },
                {
                    label: '审批人',
                    prop: 'auditUsers',
                    width: 120
                },
                {
                    label: '当前处理人',
                    prop: 'handler',
                },
                {
                    label: '审批状态',
                    prop: 'applyState',
                    formatter(row, column, cellValue) {
                        return {
                            1: '待审批',
                            2: '审批中',
                            3: '已拒绝',
                            4: '已通过',
                            5: '作废'
                        }[cellValue]
                    }
                },
            ],
            rule: {
                remark: [
                    {
                        required: true,
                        message: '请输入审批意见',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    mounted() {
        this.getLeaveList()
    },
    methods: {
        async getLeaveList() {
            try {
                const { list, page } = await this.$api.leaveList({ ...this.leave, ...this.pager, action: 'approve' });
                this.leaveList = list;
                this.pager = page;
            } catch (err) {
                throw err
            }
        },
        handleCurrentChange(current) {
            this.pager.pageNum = current;
            this.getLeaveList()
        },
        handleReset(form) {
            this.$refs[form].resetFields();     // resetFields：自带的表单重置函数，恢复到初始状态
        },
        handleDetail(row) {
            this.showDetail = true
            this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(this.leaveDetail, row)     // 继承，浅拷贝将 row 赋给 addLeave
                this.leaveDetail.type = {
                    1: '事假',
                    2: '调休',
                    3: '年假'
                }[row.leaveType]
                this.leaveDetail.state = {
                    1: '待审批',
                    2: '审批中',
                    3: '已拒绝',
                    4: '已通过',
                    5: '作废'
                }[row.applyState]
                this.leaveDetail.leaveDate = utils.formateDate(new Date(row.startTime), 'yyyy/MM/dd') + '-' + utils.formateDate(new Date(row.endTime), 'yyyy/MM/dd')
            })
        },
        handleClose() {
            this.showDetail = false
            this.handleReset('detailForm')
        },
        async handleSubmit(action) {
            this.$refs.detailForm.validate(async (valid) => {
                if (valid) {
                    this.leaveDetail.action = action

                    await this.$api.leaveOperate(this.leaveDetail)
                    this.$message.success('操作成功');
                    this.handleClose()
                    this.getLeaveList()
                }
            })
        },

    }
}
</script>

<style>
</style>














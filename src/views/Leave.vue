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
            <div class="action">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="leaveList">
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :formatter="item.formatter" :width="item.width" />
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row._id)"
                            v-if="[1, 2].includes(scope.row.applyState)">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />

        </div>
        <el-dialog title="休假新增" v-model="showAdd">
            <el-form ref="addForm" :model="addLeave" label-width="auto" :rules="addRule">
                <el-form-item label="休假类型" prop="leaveType" required>
                    <el-select v-model="addLeave.leaveType">
                        <el-option :value="1" label="事假"></el-option>
                        <el-option :value="2" label="调休"></el-option>
                        <el-option :value="3" label="年假"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="休假类型" prop="time" required> -->
                <!-- <el-date-picker v-model="addLeave.time" type="daterange" range-separator="-"
                        start-placeholder="选择开始日期" end-placeholder="选择结束日期" :size="size" /> -->
                <el-form-item label="休假类型" required>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="startTime" label-width="0" required>
                                <el-date-picker v-model="addLeave.startTime" type="date" placeholder="选择开始日期"
                                    @change="handleTime('startTime')" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="1"> - </el-col>
                        <el-col :span="8">
                            <el-form-item prop="endTime" label-width="0" required>
                                <el-date-picker v-model="addLeave.endTime" type="date" placeholder="选择结束日期"
                                    @change="handleTime('endTime')" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="休假时长" prop="leaveTime">
                    {{ addLeave.leaveTime }}天
                </el-form-item>
                <el-form-item label="休假原因" prop="reason" required>
                    <el-input v-model="addLeave.reason" placeholder="请输入休假原因" type="textarea" :row="3" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">{{ action == 'add' ? '添加' : '修改' }}</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="休假详情" v-model="showDetail">
            <el-steps :active="leaveDetail.applyState > 2 ? 3 : leaveDetail.applyState" align-center>
                <el-step title="待审批" />
                <el-step title="审批中" />
                <el-step title="审批完成" />
            </el-steps>
            <el-form ref="detailForm" :model="leaveDetail" label-width="auto" :rules="addRule">
                <el-form-item label="休假类型">
                    {{ leaveDetail.leaveType }}
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
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import utils from "./../utils/utils"

export default {
    name: 'leave',
    data() {
        return {
            leave: {
                applyState: ''
            },
            leaveList: [],
            pager: {
                pageNum: 1,
                pageSize: 10
            },
            addLeave: {
                leaveType: 1,
                leaveTime: 0
            },
            leaveDetail: {},
            showAdd: false,
            showDetail: false,
            action: 'add',
            columns: [
                {
                    label: '审批单号',
                    prop: 'applyNo',
                    width: 100
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
            addRule: {
                menuName: [
                    {
                        required: true,
                        message: '请输入菜单名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '菜单名称过长/短',
                        trigger: 'blur'
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
                const { list, page } = await this.$api.leaveList({ ...this.leave, ...this.pager });
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
        handleAdd() {
            this.showAdd = true
            this.action = 'add'
        },
        handleDetail(row) {
            this.showDetail = true
            this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(this.leaveDetail, row)     // 继承，浅拷贝将 row 赋给 addLeave
                this.leaveDetail.leaveType = {
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
        async handleDelete(_id) {
            await this.$api.leaveOperate({ _id, action: 'delete' })
            this.$message.success('删除成功');
            this.getLeaveList()
        },
        handleClose() {
            this.showAdd = false
            this.handleReset('addForm')
        },
        async handleSubmit() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addLeave.action = this.action

                    await this.$api.leaveOperate(this.addLeave)
                    this.$message.success('操作成功');
                    this.handleClose()
                    this.getLeaveList()
                }
            })
        },

        handleTime(key) {
            let { startTime, endTime } = this.addLeave
            if (!startTime || !endTime) return
            if (startTime > endTime) {
                this.$message.error('起始日期不能晚于结束日期')
                this.addLeave.leaveTime = 0
                this.addLeave[key] = ''
            } else {
                this.addLeave.leaveTime = (endTime - startTime) / (1000 * 3600 * 24) + 1
            }
        }
    }
}
</script>

<style>
</style>














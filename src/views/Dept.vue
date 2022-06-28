<template>
    <div class="dept-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="dept">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="dept.deptName" placeholder="请输入部门名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDeptList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleAdd('0')">新增</el-button>
            </div>
            <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
                <el-table-column v-for="item in columns" :key="item.prop" v-bind="item" />
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleAdd('1', scope.row)">添加</el-button>
                        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="部门新增" v-model="showAdd">
            <el-form ref="addForm" :model="addDept" label-width="auto" :rules="addRule">
                <el-form-item label="上级部门" prop="parentId">
                    <el-cascader v-model="addDept.parentId" placeholder="请选择上级部门" :options="deptList"
                        :props="{ checkStrictly: true, label: 'deptName', value: '_id' }" clearable
                        style="width: 100%" />
                    <span>不选则为一级部门</span>
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="addDept.deptName" placeholder="请输入部门名称" />
                </el-form-item>
                <el-form-item label="负责人" prop="leaderName">
                    <el-select v-model="addDept.leaderName" placeholder="请选择部门负责人" @change="handleUser">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="`${item.userId}/${item.userName}/${item.userEmail}`">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人邮箱" prop="leaderEmail">
                    <el-input v-model="addDept.leaderEmail" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">{{ action == 'add' ? '添加' : '修改' }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from "./../utils/utils"

export default {
    name: 'dept',
    data() {
        return {
            dept: {},
            deptList: [],
            userList: [],
            addDept: {
                parentId: [null],
            },
            showAdd: false,
            action: 'add',
            columns: [
                {
                    label: '部门名称',
                    prop: 'deptName',
                    width: 200
                },
                {
                    label: '负责人',
                    prop: 'leaderName'
                },
                {
                    label: '更新时间',
                    prop: 'updateTime',
                    width: 140,
                    formatter: (row, column, cellValue) => {
                        if (cellValue)
                            return utils.formateDate(new Date(cellValue));
                    },
                },
                {
                    label: '创建时间',
                    prop: 'createTime',
                    width: 140,
                    formatter: (row, column, cellValue) => {
                        if (cellValue)
                            return utils.formateDate(new Date(cellValue));
                    },
                }
            ],
            addRule: {
                deptName: [
                    {
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '部门名称过长/短',
                        trigger: 'blur'
                    }
                ],
                leaderName: [
                    {
                        required: true,
                        message: '请选择部门负责人',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.getDeptList()
        this.getUserList()
    },
    methods: {
        async getDeptList() {
            try {
                const list = await this.$api.deptList(this.dept);
                this.deptList = list;
            } catch (err) {
                throw err
            }
        },
        async getUserList() {
            try {
                const { list } = await this.$api.userList();
                this.userList = list;
            } catch (err) {
                throw err
            }
        },
        handleReset(form) {
            this.$refs[form].resetFields();     // resetFields：自带的表单重置函数，恢复到初始状态
        },
        handleUser(val) {
            // console.log(val)
            const [userId, userName, userEmail] = val.split('/');
            this.addDept.leaderName = userName;
            this.addDept.leaderEmail = userEmail;
        },
        handleAdd(type, row) {
            this.showAdd = true
            this.action = 'add'
            if (type == 1) {
                this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                    this.addDept.parentId = [...row.parentId, row._id].filter(item => item)
                })
            }
        },
        handleEdit(row) {
            console.log(row)
            this.showAdd = true
            this.action = 'edit'
            this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(this.addDept, row)     // 继承，浅拷贝将 row 赋给 addDept
            })
        },
        async handleDelete(_id) {
            await this.$api.deptOperate({ _id, action: 'delete' })
            this.$message.success('删除成功');
            this.getDeptList()
        },
        handleClose() {
            this.showAdd = false
            this.handleReset('addForm')
        },
        async handleSubmit() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addDept.action = this.action
                    await this.$api.deptOperate(this.addDept)
                    this.$message.success('操作成功');
                    this.handleClose()
                    this.getDeptList()
                }
            })
        }
    }
}
</script>

<style>
</style>














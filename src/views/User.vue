<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="user">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="user.userId" placeholder="请输入用户ID" />
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="user.userName" placeholder="请输入用户名称" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="user.state">
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getUserList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-button type="danger" @click="handlePatchDelete">批量删除</el-button>
            </div>
            <el-table :data="userList" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :formatter="item.formatter" :width="item.width" />
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>
        <el-dialog title="用户新增" v-model="showAdd">
            <el-form ref="addForm" :model="addUser" label-width="auto" :rules="addRule">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addUser.userName" placeholder="请输入用户名称" :disabled="action == 'edit'" />
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="addUser.userEmail" placeholder="请输入用户邮箱" />
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="addUser.mobile" placeholder="请输入用户手机号码" />
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="addUser.job" placeholder="请输入用户岗位" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="addUser.state" placeholder="请选择用户状态">
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select v-model="addUser.roleList" placeholder="请选择用户角色" multiple style="width: 100%">
                        <el-option v-for="item in roleList" :key="item._id" :value="item._id" :label="item.roleName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-cascader v-model="addUser.deptId" placeholder="请选择用户部门" :options="deptList"
                        :props="{ checkStrictly: true, label: 'deptName', value: '_id' }" clearable
                        style="width: 100%" />
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
// 使用 Vue3 Composition API
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import utils from "./../utils/utils"

export default {
    name: 'user',
    setup() {
        // 通过 getCurrentInstance 获取 proxy 代理，得到全局挂载属性
        const { proxy } = getCurrentInstance();
        // 初始化值，reactive 用来创建引用类型，ref 创建数字等基本类型
        const user = reactive({
            state: 1
        });
        const userList = ref([]);
        const pager = reactive({
            pageNum: 1,
            pageSize: 10
        })
        const checkedUsers = ref([])
        const addUser = reactive({
            state: 3
        })
        const action = ref('add')
        const showAdd = ref(false)
        const roleList = ref([])
        const deptList = ref([])
        const columns = reactive([
            {
                label: '用户编号',
                prop: 'userId'
            },
            {
                label: '用户名称',
                prop: 'userName'
            },
            {
                label: '用户邮箱',
                prop: 'userEmail'
            },
            {
                label: '用户角色',
                prop: 'role',
                formatter(row, column, cellValue) {
                    return {
                        0: '管理员',
                        1: '普通用户',
                    }[cellValue]
                }
            },
            {
                label: '用户状态',
                prop: 'state',
                formatter(row, column, cellValue) {
                    return {
                        1: '在职',
                        2: '离职',
                        3: '试用期',
                    }[cellValue]
                }
            },
            {
                label: '注册时间',
                prop: 'createTime',
                formatter: (row, column, cellValue) => {
                    return utils.formateDate(new Date(cellValue));
                },
            },
            {
                label: '最后登陆时间',
                prop: 'lastLoginTime',
                formatter: (row, column, cellValue) => {
                    return utils.formateDate(new Date(cellValue));
                },
            },
        ])
        const addRule = reactive({
            userName: [
                {
                    required: true,
                    message: '请输入用户名称',
                    trigger: 'blur'
                }
            ],
            userEmail: [
                {
                    required: true,
                    message: '请输入用户邮箱',
                    trigger: 'blur'
                },
                {
                    type: 'string',
                    message: '邮箱格式错误',
                    trigger: 'blur'
                }
            ],
            mobile: [
                {
                    required: true,
                    message: '请输入手机号码',
                    trigger: 'blur'
                },
                {
                    pattern: /1\d{10}/,
                    message: '手机号码不合规',
                    trigger: 'blur'
                }
            ],
            deptId: [
                {
                    required: true,
                    message: '请选择所属部门',
                    trigger: 'blur'
                }
            ],
        })
        onMounted(() => {
            getUserList()
            getDeptList()
            getRoleList()
        })
        const getUserList = async () => {
            let params = { ...user, ...pager }
            try {
                const { list, page } = await proxy.$api.userList(params);
                userList.value = list;      // ref 初始化的数据，需通过 .value 来赋值
                pager.total = page.total;
            } catch (err) {
                throw err
            }
        }

        const handleReset = (form) => {
            proxy.$refs[form].resetFields();     // resetFields：自带的表单重置函数，恢复到初始状态
        }
        const handleCurrentChange = (current) => {
            pager.pageNum = current;
            getUserList()
        }
        const handleEdit = (row) => {
            showAdd.value = true
            action.value = 'edit'
            proxy.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(addUser, row)     // 继承，浅拷贝将 row 赋给 addUser
            })
        }
        const handleDelete = async (row) => {
            const data = await proxy.$api.userDelete({
                userIds: [row.userId]
            })
            if (data.modifiedCount > 0) {
                proxy.$message.success('删除成功');
                getUserList()
            } else {
                proxy.$message.error('删除失败');
            }
        }
        const handleSelectionChange = (rows) => {
            // rows 为选中的所有数据，是个数组
            console.log(rows)
            let arr = [];
            rows.map(item => {
                arr.push(item.userId)
            });
            checkedUsers.value = arr;
        }
        const handlePatchDelete = async () => {
            if (checkedUsers.value.length == 0) {
                proxy.$message.error('请选择删除数据')
                return
            }
            const data = await proxy.$api.userDelete({
                userIds: checkedUsers.value
            })
            if (data.modifiedCount > 0) {
                proxy.$message.success('删除成功');
                getUserList()
            } else {
                proxy.$message.error('删除失败');
            }
        }
        const handleAdd = () => {
            showAdd.value = true
            action.value = 'add'
        }
        const getDeptList = async () => {
            deptList.value = await proxy.$api.deptList()
        }
        const getRoleList = async () => {
            const data = await proxy.$api.roleList()
            roleList.value = data.list
        }
        const handleClose = () => {
            showAdd.value = false
            handleReset('addForm')
        }
        const handleSubmit = () => {
            proxy.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    // toRaw : 把响应式对象转换为普通对象，对转换后的对象再做数据修改操作，不会影响原值，网页视图不会改变
                    let params = toRaw(addUser);
                    if (params.userEmail.indexOf('@') == -1)
                        params.userEmail += '@hotmail.com'
                    params.action = action.value
                    let res = await proxy.$api.userOperate(params)
                    if (res) {
                        proxy.$message.success(action.value == 'add' ? '新增成功' : '编辑成功');
                        handleClose()
                        getUserList()
                    } else {
                        proxy.$message.error('新增失败');
                    }
                }
            })
        }

        return {
            user, userList, pager, checkedUsers, addUser, action, showAdd, roleList, deptList, columns, addRule, getUserList, handleReset, handleSelectionChange, handleEdit, handleCurrentChange, handleDelete, handlePatchDelete, handleAdd, getDeptList, getRoleList, handleClose, handleSubmit
        }
    }
}
</script>

<style>
</style>














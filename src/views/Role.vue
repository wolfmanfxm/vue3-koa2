<template>
    <div class="role-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="role">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="role.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRoleList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="roleList">
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :formatter="item.formatter" :width="item.width" />
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />

        </div>
        <el-dialog title="角色新增" v-model="showAdd">
            <el-form ref="addForm" :model="addRole" label-width="auto" :rules="addRule">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRole.roleName" placeholder="请输入角色名称" :disabled="action == 'edit'" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addRole.remark" />
                </el-form-item>
                <el-form-item label="权限列表" prop="accessAction">
                    <el-tree ref="authTree" :data="menuList" show-checkbox node-key="_id" default-expand-all
                        :props="{ label: 'menuName' }" />
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
    name: 'role',
    data() {
        return {
            role: {},
            roleList: [],
            pager: {
                pageNum: 1,
                pageSize: 10
            },
            addRole: {},
            menuList: [],
            showAdd: false,
            action: 'add',
            columns: [
                {
                    label: '角色名称',
                    prop: 'roleName',
                },
                {
                    label: '备注',
                    prop: 'remark',
                },
                {
                    label: '权限列表',
                    prop: 'halfAction',
                    formatter: (row, column, cellValue) => {
                        let actionName = []
                        cellValue.map(item => {
                            if (this.halfActionName[item])
                                actionName.push(this.halfActionName[item])
                        })
                        return actionName.join(',')
                    }
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
                roleName: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '角色名称过长/短',
                        trigger: 'blur'
                    }
                ]
            },
            halfActionName: {}
        }
    },
    mounted() {
        this.getRoleList()
        this.getmenuList()
    },
    methods: {
        async getRoleList() {
            try {
                const { list, page } = await this.$api.roleList({ ...this.role, ...this.pager });
                this.roleList = list;
                this.pager = page;
            } catch (err) {
                throw err
            }
        },
        async getmenuList() {
            try {
                const list = await this.$api.menuList(this.menu);
                this.menuList = list;
                this.getHalfActionName();
            } catch (err) {
                throw err
            }
        },
        handleCurrentChange(current) {
            this.pager.pageNum = current;
            this.getRoleList()
        },
        handleReset(form) {
            this.$refs[form].resetFields();     // resetFields：自带的表单重置函数，恢复到初始状态
        },
        handleAdd() {
            this.showAdd = true
            this.action = 'add'
        },
        handleEdit(row) {
            this.showAdd = true
            this.action = 'edit'
            this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(this.addRole, row)     // 继承，浅拷贝将 row 赋给 addRole
                this.$refs.authTree.setCheckedKeys(row.accessAction)
            })
        },
        async handleDelete(_id) {
            await this.$api.roleOperate({ _id, action: 'delete' })
            this.$message.success('删除成功');
            this.getRoleList()
        },
        handleClose() {
            this.showAdd = false
            this.handleReset('addForm')
            this.$refs.authTree.setCheckedKeys([])
        },
        async handleSubmit() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addRole.action = this.action
                    let checkedNodes = this.$refs.authTree.getCheckedNodes();   // 选中节点若是父级菜单，后续新添加的子级菜单，会默认勾选，但该角色可能没有权限；需取 nodes 遍历它的 children 保存具体功能
                    let halfCheckedKeys = this.$refs.authTree.getHalfCheckedKeys(); // 半选一定是父级菜单，权限不完全；可直接取菜单的 key 保存
                    // 对数据做处理，入库保存角色权限内的最下层的具体功能，避免保存父菜单导致增加新功能会默认拥有权限
                    this.addRole.accessAction = []
                    this.addRole.halfAction = []
                    checkedNodes.map(item => {
                        if (item.children) {
                            this.addRole.halfAction.push(item._id)
                        } else {
                            this.addRole.accessAction.push(item._id)
                        }
                    })
                    this.addRole.halfAction = this.addRole.halfAction.concat(halfCheckedKeys)

                    await this.$api.roleOperate(this.addRole)
                    this.$message.success('操作成功');
                    this.handleClose()
                    this.getRoleList()
                }
            })
        },
        getHalfActionName() {
            const deep = (menuList) => {
                menuList.map(item => {
                    if (item.children && item.action)
                        this.halfActionName[item._id] = item.menuName;
                    if (item.children && !item.action)
                        deep(item.children)
                })
            }
            deep(this.menuList)
        }
    }
}
</script>

<style>
</style>














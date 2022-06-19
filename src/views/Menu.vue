<template>
    <div class="menu-manage">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="menu">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="menu.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item label="状态" prop="menuState">
                    <el-select v-model="menu.menuState">
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="正常"></el-option>
                        <el-option :value="2" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getmenuList">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleAdd('0')">新增</el-button>
            </div>
            <el-table :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :formatter="item.formatter" :width="item.width" />
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleAdd('1', scope.row)">添加</el-button>
                        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="菜单新增" v-model="showAdd">
            <el-form ref="addForm" :model="addMenu" label-width="auto" :rules="addRule">
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader v-model="addMenu.parentId" placeholder="请选择菜单" :options="menuList"
                        :props="{ checkStrictly: true, label: 'menuName', value: '_id' }" clearable
                        style="width: 100%" />
                    <span>不选则为一级菜单</span>
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="addMenu.menuType">
                        <el-radio label="1">菜单</el-radio>
                        <el-radio label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="addMenu.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="addMenu.menuType == 1">
                    <el-input v-model="addMenu.icon" placeholder="请输入菜单图标" />
                </el-form-item>
                <el-form-item label="路由地址" prop="path" v-if="addMenu.menuType == 1">
                    <el-input v-model="addMenu.path" placeholder="请输入菜单路由" />
                </el-form-item>
                <el-form-item label="组件路径" prop="component" v-if="addMenu.menuType == 1">
                    <el-input v-model="addMenu.component" placeholder="请输入菜单组件路径" />
                </el-form-item>
                <el-form-item label="权限标识" prop="menuCode" v-if="addMenu.menuType == 2">
                    <el-input v-model="addMenu.menuCode" placeholder="请输入权限标识" />
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState" v-if="addMenu.menuType == 1">
                    <el-radio-group v-model="addMenu.menuState">
                        <el-radio label="1">正常</el-radio>
                        <el-radio label="2">停用</el-radio>
                    </el-radio-group>
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
    name: 'menu',
    data() {
        return {
            menu: {
                menuState: 0
            },
            menuList: [],
            addMenu: {
                parentId: [null],
                menuType: '1'
            },
            showAdd: false,
            action: 'add',
            columns: [
                {
                    label: '菜单名称',
                    prop: 'menuName',
                    width: 200
                },
                {
                    label: '图标',
                    prop: 'icon',
                    width: 120
                },
                {
                    label: '菜单类型',
                    prop: 'menuType',
                    formatter(row, column, cellValue) {
                        return {
                            1: '菜单',
                            2: '按钮'
                        }[cellValue]
                    }
                },
                {
                    label: '权限标识',
                    prop: 'menuCode'
                },
                {
                    label: '路由地址',
                    prop: 'path'
                },
                {
                    label: '组件路径',
                    prop: 'component'
                },
                {
                    label: '菜单状态',
                    prop: 'menuState',
                    formatter(row, column, cellValue) {
                        return {
                            1: '正常',
                            2: '停用',
                        }[cellValue]
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
        this.getmenuList()
    },
    methods: {
        async getmenuList() {
            try {
                const list = await this.$api.menuList();
                this.menuList = list;
            } catch (err) {
                throw err
            }
        },

        handleReset(form) {
            this.$refs[form].resetFields();     // resetFields：自带的表单重置函数，恢复到初始状态
        },
        handleCurrentChange(current) {
            pager.pageNum = current;
            this.getmenuList()
        },
        handleAdd(type, row) {
            this.showAdd = true
            this.action = 'add'
            if (type == 1) {
                this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                    this.addMenu.parentId = [...row.parentId, row._id].filter(item => item)
                })
            }
        },
        handleEdit(row) {
            console.log(row)
            this.showAdd = true
            this.action = 'edit'
            this.$nextTick(() => {             // 若不等渲染完再赋值，取消时会无法清空值，直接赋值太快，表单初始状态值改变
                Object.assign(this.addMenu, row)     // 继承，浅拷贝将 row 赋给 addMenu
            })
        },
        async handleDelete(_id) {
            await this.$api.menuOperate({ _id, action: 'delete' })
            this.$message.success('删除成功');
            this.getmenuList()
        },
        handleClose() {
            this.showAdd = false
            this.handleReset('addForm')
        },
        async handleSubmit() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addMenu.action = this.action
                    await this.$api.menuOperate(this.addMenu)
                    this.$message.success('操作成功');
                    this.handleClose()
                    this.getmenuList()
                }
            })
        }
    }
}
</script>

<style>
</style>














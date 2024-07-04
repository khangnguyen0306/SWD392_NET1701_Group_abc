import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalCreateSubcategory from './subcategorymanagement/ModalCreateSubcategory';
import ModalEditSubcategory from './subcategorymanagement/ModalEditSubcategory';
import { useCreateCategoryMutation, useCreateSubcategoryMutation, useDeleteCategoryMutation, useDeleteSubcategoryMutation, useEditCategoryMutation, useEditSubcategoryMutation } from '../../services/productAPI';
import ModalCreateCategory from './categorymanagement/ModalAddcategory';
import ModalEditCategory from './categorymanagement/ModalEditCategory';

const TableCategories = ({ categoryData, onDeleteCategory, refetchDataCategory }) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [isModalCreateSCVisible, setIsModalCreateSCVisible] = useState(false);
    const [isModalEditSCVisible, setIsModalEditSCVisible] = useState(false);
    const [isModalCategoryVisible, setIsModalCategoryVisible] = useState(false);
    const [isModalEditCategoryVisible, setIsModalEditCategoryVisible] = useState(false);
    const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    const [addCategory] = useCreateCategoryMutation();
    const [updateCategory] = useEditCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [addSubCategory] = useCreateSubcategoryMutation();
    const [updateSubcategory] = useEditSubcategoryMutation();
    const [deleteSubcategory] = useDeleteSubcategoryMutation();

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    //Create Category
    const openModalCreateCategory = () => {
        setIsModalCategoryVisible(true);
    };

    const closeModalCreateCategory = () => {
        setIsModalCategoryVisible(false);
    };

    const handleCreateCategory = () => {
        openModalCreateCategory();
    }

    const handleAddCategoryOk = async (value) => {
        try {
            const addSC = await addCategory(value);
            if (addSC.error.originalStatus === 200) {
                message.success("Add Category successfully!");
                closeModalCreateCategory();
                refetchDataCategory();
            } else {
                message.error("Add Category unsuccessfully!");
            }
        } catch (error) {
            message.error("Add Category unsuccessfully !");
        }
    };


    // Add Sub-category
    const openModalCreateSc = () => {
        setIsModalCreateSCVisible(true);
    };

    const closeModalCreateSc = () => {
        setIsModalCreateSCVisible(false);
    };

    const handleCreateSC = () => {
        openModalCreateSc();
    };

    const handleAddSubCategoryOk = async (value) => {
        try {
            const addSC = await addSubCategory(value);
            if (addSC.error.originalStatus === 200) {
                message.success("Add sub-Categories successfully!");
                closeModalCreateSc();
                refetchDataCategory();
            } else {
                message.error("Add sub-Categories unsuccessfully!");
            }
        } catch (error) {
            message.error("Add sub-Categories unsuccessfully !");
        }
    };

    // Edit Sub-category
    const openModalEditCategory = (categoryId) => {
        setCurrentCategoryId(categoryId);
        setIsModalEditCategoryVisible(true);
    };

    const closeModalEditcategory = () => {
        setIsModalEditCategoryVisible(false);
        setCurrentCategoryId(null);
    };

    const handleEditCategoryOk = async (value) => {
        try {
            const updateSC = await updateCategory({ id: currentCategoryId, body: value });
            if (updateSC.error.originalStatus === 200) {
                message.success("Edit sub-Category successfully!");
                closeModalEditcategory();
                refetchDataCategory();
            } else {
                message.error("Edit sub-Category unsuccessfully!");
            }
        } catch (error) {
            message.error("Edit sub-Category unsuccessfully !");
        }
    };

    //Delete Category
    const handleDeleteCategory = async (value) => {
        console.log(value);
        try {
            const deleteSC = await deleteCategory(value);
            if (deleteSC.error.originalStatus === 200) {
                message.success("Delete sub-Category successfully!");
                refetchDataCategory();
            } else {
                message.error("Delete sub-Category unsuccessfully!");
            }
        } catch (error) {
            message.error("Delete sub-Category unsuccessfully");
        }
    }

    // Edit Sub-category
    const openModalEditSc = (subcategoryId) => {
        setCurrentSubcategoryId(subcategoryId);
        setIsModalEditSCVisible(true);
    };

    const closeModalEditSc = () => {
        setIsModalEditSCVisible(false);
        setCurrentSubcategoryId(null);
    };

    const handleEditSubCategoryOk = async (value) => {
        try {
            const updateSC = await updateSubcategory({ id: currentSubcategoryId, body: value });
            if (updateSC.error.originalStatus === 200) {
                message.success("Edit sub-Category successfully!");
                closeModalEditSc();
                refetchDataCategory();
            } else {
                message.error("Edit sub-Category unsuccessfully!");
            }
        } catch (error) {
            message.error("Edit sub-Category unsuccessfully !");
        }
    };

    //Delete sub-Category
    const handleDeleteSubCategory = async (value) => {
        console.log(value);
        try {
            const deleteSC = await deleteSubcategory(value);
            if (deleteSC.error.originalStatus === 200) {
                message.success("Delete sub-Category successfully!");
                refetchDataCategory();
            } else {
                message.error("Delete sub-Category unsuccessfully!");
            }
        } catch (error) {
            message.error("Delete sub-Category unsuccessfully");
        }
    }

    const subcategoriesMenu = (record) => (
        <Menu>
            <Menu.Item key="add">
                <p style={{ display: 'flex', alignItems: 'center' }} onClick={handleCreateSC}>
                    <PlusCircleOutlined style={{ paddingRight: '0.5rem', color: '#1E90FF', fontSize: '18px' }} />
                    <span>Add Subcategory</span>
                </p>
            </Menu.Item>
            <Menu.Item key="edit-subcategory" onClick={() => openModalEditSc(record.id)}>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ paddingRight: '0.5rem', color: '#EEC900', fontSize: '18px' }} />
                    <span>Edit Subcategory</span>
                </p>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this subcategory?"
                    onConfirm={() => handleDeleteSubCategory(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteOutlined style={{ paddingRight: '0.5rem', color: '#EE2C2C', fontSize: '18px' }} />
                        <span>De-active Subcategory</span>
                    </p>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const CategoriesMenu = (record) => (
        <Menu>
            <Menu.Item key="add">
                <p style={{ display: 'flex', alignItems: 'center' }} onClick={handleCreateCategory}>
                    <PlusCircleOutlined style={{ paddingRight: '0.5rem', color: '#1E90FF', fontSize: '18px' }} />
                    <span>Add Category</span>
                </p>
            </Menu.Item>
            <Menu.Item key="edit-subcategory" onClick={() => openModalEditCategory(record.id)}>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ paddingRight: '0.5rem', color: '#EEC900', fontSize: '18px' }} />
                    <span>Edit Category</span>
                </p>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this subcategory?"
                    onConfirm={() => handleDeleteCategory(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteOutlined style={{ paddingRight: '0.5rem', color: '#EE2C2C', fontSize: '18px' }} />
                        <span>De-active Category</span>
                    </p>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        },

        {
            title: 'Category',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (status ? <Tag color='green'>Active</Tag> : <Tag color='red'>Inactive</Tag>),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Dropdown overlay={() => CategoriesMenu(record)} trigger={['click']}>
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const expandedRowRender = (category) => {
        const subcategoryColumns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Sub-Category',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (status ? <Tag color='green'>Active</Tag> : <Tag color='red'>Inactive</Tag>),
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (text, record) => (
                    <Dropdown overlay={() => subcategoriesMenu(record)} trigger={['click']}>
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                ),
            },
        ];

        return (
            <>
                <Button
                    style={{ marginBottom: '1rem' }}
                    onClick={handleCreateSC}
                    icon={<PlusCircleOutlined style={{ paddingRight: '0.5rem', color: '#1E90FF', fontSize: '18px' }} />}>
                    Add sub-Category
                </Button>
                <Table
                    columns={subcategoryColumns}
                    dataSource={category.subCategories}
                    rowKey="id"
                    pagination={false}
                />
            </>
        );
    };

    return (
        <>
            <Button
                style={{ marginBottom: '1rem' }}
                onClick={handleCreateCategory}
                icon={<PlusCircleOutlined
                    style={{ paddingRight: '0.5rem', color: '#1E90FF', fontSize: '18px' }} />}>
                Add Category
            </Button>
            <Table
                dataSource={categoryData}
                columns={columns}
                rowKey="id"
                expandable={{ expandedRowRender }}
                onChange={handleTableChange}
                pagination={{ pageSize: 10 }}
            />
            <ModalCreateSubcategory
                visible={isModalCreateSCVisible}
                onCreate={handleAddSubCategoryOk}
                onCancel={closeModalCreateSc}
            />
            <ModalEditSubcategory
                visible={isModalEditSCVisible}
                onEdit={handleEditSubCategoryOk}
                onCancel={closeModalEditSc}
                subcategoryId={currentSubcategoryId}

            />
            <ModalCreateCategory
                visible={isModalCategoryVisible}
                onCreate={handleAddCategoryOk}
                onCancel={closeModalCreateCategory}
            />
            <ModalEditCategory
                categoryId={currentCategoryId}
                onCancel={closeModalEditcategory}
                onEdit={handleEditCategoryOk}
                visible={isModalEditCategoryVisible}
            />
        </>
    );
};

export default TableCategories;

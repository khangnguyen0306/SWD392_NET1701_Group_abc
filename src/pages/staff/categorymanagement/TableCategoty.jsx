import React, { useState } from 'react';
import { Table, Button, Dropdown, Menu, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalCreateSubcategory from './ModalCreateSubcategory';
import ModalEditSubcategory from './ModalEditSubcategory';
import { useCreateSubcategoryMutation, useDeleteSubcategoryMutation, useEditSubcategoryMutation } from '../../../services/productAPI';

const TableCategories = ({ categoryData, onDeleteCategory, refetchDataCategory }) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [isModalCreateSCVisible, setIsModalCreateSCVisible] = useState(false);
    const [isModalEditSCVisible, setIsModalEditSCVisible] = useState(false);
    const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null);
    const [addSubCategory] = useCreateSubcategoryMutation();
    const [updateSubcategory] = useEditSubcategoryMutation();
    const [deleteSubcategory] = useDeleteSubcategoryMutation();

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
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
                        <span>Delete Subcategory</span>
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
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Dropdown overlay={() => subcategoriesMenu(record)} trigger={['click']}>
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
            <Table
                columns={subcategoryColumns}
                dataSource={category.subCategories}
                rowKey="id"
                pagination={false}
            />
        );
    };

    return (
        <>
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
        </>
    );
};

export default TableCategories;

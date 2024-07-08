import React, { useState } from 'react';
import { Table, Tag, Menu, Popconfirm, Dropdown, Button, Input, Space, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useDeleteProductMutation, useEditProductMutation } from '../../../services/productAPI';
import ModalEditProduct from '../../product/EditProductModal';

const TableProductForExchange = ({ productData, onEdit, onDelete, refetchProductData }) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isModalEditProductVisible, setIsModalEditProductVisible] = useState(false);

    const [editProduct] = useEditProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    let searchInput;

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    // Edit Product
    const openModalEditProduct = (productId) => {
        setCurrentProduct(productId);
        setIsModalEditProductVisible(true);
    };

    const closeModalEditProduct = () => {
        setIsModalEditProductVisible(false);
        setCurrentProduct(null);
    };

    const handleEditProductOk = async (value) => {
        try {
            const updateSC = await editProduct({ id: currentProduct, body: value });
            if (updateSC.error.originalStatus === 200) {
                message.success("Edit Product successfully!");
                closeModalEditProduct();
                refetchProductData();
            } else {
                message.error("Edit Product unsuccessfully!");
            }
        } catch (error) {
            message.error("Edit Product unsuccessfully !");
        }
    };

    //Delete Product
    const handleDeleteProduct = async (value) => {
        console.log(value);
        try {
            const deleteSC = await deleteProduct(value);
            console.log(deleteSC)
            if (deleteSC.error.originalStatus === 200) {
                message.success("Delete Product successfully!");
                refetchProductData();
            } else {
                message.error("Delete Product unsuccessfully!");
            }
        } catch (error) {
            message.error("Delete Product unsuccessfully");
        }
    }

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="edit-subcategory" onClick={() => openModalEditProduct(record.id)}>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ paddingRight: '0.5rem', color: '#EEC900', fontSize: '18px' }} />
                    <span>Edit Product</span>
                </p>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this subcategory?"
                    onConfirm={() => handleDeleteProduct(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteOutlined style={{ paddingRight: '0.5rem', color: '#EE2C2C', fontSize: '18px' }} />
                        <span>Delete Product</span>
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
            ...getColumnSearchProps('id'),
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            ...getColumnSearchProps('userId'),
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
            sortOrder: sortedInfo.columnKey === 'categoryName' && sortedInfo.order,
            ...getColumnSearchProps('categoryName'),
        },
        {
            title: 'Subcategory',
            dataIndex: 'subcategoryName',
            key: 'subcategoryName',
            sorter: (a, b) => a.subcategoryName.localeCompare(b.subcategoryName),
            sortOrder: sortedInfo.columnKey === 'subcategoryName' && sortedInfo.order,
            ...getColumnSearchProps('subcategoryName'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
            ...getColumnSearchProps('price'),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            sorter: (a, b) => a.location.localeCompare(b.location),
            sortOrder: sortedInfo.columnKey === 'location' && sortedInfo.order,
            ...getColumnSearchProps('location'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Dropdown overlay={() => actionsMenu(record)} trigger={['click']}>
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={productData}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{ pageSize: 10 }}
            />
            <ModalEditProduct
                onCancel={closeModalEditProduct}
                productData={currentProduct}
                visible={isModalEditProductVisible}
                refetchProductData={refetchProductData}
            />
        </>
    );
};

export default TableProductForExchange;

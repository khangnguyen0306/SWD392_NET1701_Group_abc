import React, { useState } from 'react';
import { Table, Tag, Menu, Popconfirm, Dropdown, Button, Input, Space } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const TableProduct = ({ productData, onEdit, onDelete }) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
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

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="edit" onClick={() => onEdit(record)}>
                <EditOutlined /> Edit
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure to delete this product?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined /> Delete
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
        <Table
            dataSource={productData}
            columns={columns}
            rowKey="id"
            onChange={handleTableChange}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default TableProduct;

import React, { useState } from 'react';
import { Table, Tag, Menu, Popconfirm, Dropdown, Button } from 'antd';
import { CloseSquareOutlined, DeleteOutlined, EditOutlined, ManOutlined, MoreOutlined, UserSwitchOutlined, WomanOutlined } from '@ant-design/icons';



// const UserType = ['Super Admin', 'Admin', 'Trainer'];

// const ChangeUserType = {
//   'Super Admin': 1,
//   'Admin': 2,
//   'Trainer': 3,
// };


const TableUser = ({ userData, onEdit, onDelete, onBan }) => {
    const [sortedInfo, setSortedInfo] = useState({});


    //   const permissionMenu = (record) => (
    //     <Menu
    //       mode='horizontal'
    //     >
    //       {UserType.map(UserType => (
    //         <Menu.Item key={UserType} onClick={() => ChangePermissionUser(record, ChangeUserType[UserType])}>
    //           {UserType}
    //         </Menu.Item>
    //       ))}
    //     </Menu>
    //   );


    const roleUser = {
        1: 'Administrator',
        2: "User",
        3: "Staff",
    }

    const actionsMenu = (record) => (
        <Menu>
            <Menu.Item key="edit" className='submenu-usertable' onClick={() => onEdit(record)}>
                <p><span style={{ color: "#1E90FF", paddingRight: ' 10px' }}><EditOutlined /></span><span>Edit User</span></p>
            </Menu.Item>
            {/* <Menu.Item key="changePermission">
                <Dropdown overlay={() => permissionMenu(record)} placement='bottomRight'>
                    <p className='submenu-usertable-dropdown' ><span><UserSwitchOutlined /></span> <span>Change Role</span></p>
                </Dropdown>
            </Menu.Item> */}
            <Menu.Item key="de-ActiveUSer" className='submenu-usertable' onClick={() => onBan(record.id)}>
                <p >
                    <span style={{ color: "#FFD700", paddingRight: ' 10px' }}>
                        <CloseSquareOutlined /></span>
                    <span>Ban user</span>
                </p>
            </Menu.Item>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <p ><span style={{ color: '#EE2C2C', paddingRight: ' 10px' }}><DeleteOutlined /></span><span>Delete user</span></p>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
        },
        {
            title: 'Full name',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
            sortOrder: sortedInfo.columnKey === 'dob' && sortedInfo.order,
            render: (dob) => (dob ? new Date(dob).toLocaleDateString() : '-'), // Display formatted date
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: (a, b) => a.gender - b.gender,
            sortOrder: sortedInfo.columnKey === 'gender' && sortedInfo.order,
            render: (gender) => (gender == "Male" ? <Tag color="blue">Male</Tag> : <Tag color="volcano">Female</Tag>),
        },
        {
            title: 'User Type',
            dataIndex: 'roleId',
            key: 'UserType',
            sorter: (a, b) => a.roleId - b.roleId,
            sortOrder: sortedInfo.columnKey === 'UserType' && sortedInfo.order,
            render: (UserType) => {
                const userRoleTag = roleUser[UserType] || roleUser['No Access'];

                return (
                    <span >{userRoleTag}</span>
                );
            },
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Status',
            sorter: (a, b) => a.status - b.status,
            sortOrder: sortedInfo.columnKey === 'Status' && sortedInfo.order,
            render: (status) => (status == 1 ? <Button type="primary" style={{ backgroundColor: 'green' }}>Active</Button> :
                <Button danger>Draff</Button>)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Dropdown placement="bottomRight" trigger={['click']} overlay={() => actionsMenu(record)}>
                    <span style={{ cursor: 'pointer' }}><MoreOutlined /></span>
                </Dropdown>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };
    return (
        <div
            style={{
                flex: 1,
                overflow: "auto",
                // marginTop: '6.5rem'

            }}
        >
            <Table
                dataSource={userData}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{
                    className: 'pagination',
                    pageSize: 10,
                }}
            />
        </div>
    );
};

export default TableUser;

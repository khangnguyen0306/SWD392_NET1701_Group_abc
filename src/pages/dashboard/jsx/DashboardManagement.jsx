import React, { useState } from 'react'
import { useAddUserMutation, useBanUserMutation, useDeleteUserMutation, useEditUserMutation, useGetAllUserQuery } from '../../../services/userAPI';
import TableUser from './TableUser';
import { Button, Form, Layout, message } from 'antd';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

const DashboardManagement = () => {
    const { data: userData, isLoadingUserData, refetch: refetchUserData } = useGetAllUserQuery();
    console.table(userData)
    const [form] = Form.useForm();
    const [userDataEdit, setUserDataEdit] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setisEditModalVisible] = useState(false);
    const [addUser] = useAddUserMutation();
    const [editUser] = useEditUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [BanUser] = useBanUserMutation();


    //  show/off Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleAddUser = async (user) => {
        try {
            console.log(user);
            const addedUser = await addUser(user);
            if (addedUser.message) {
                refetchUserData();
                const messageSucess = "Add User successfully!";
                handleOk(messageSucess);
                form.resetFields();

            }
            // console.log('User added successfully:', addedUser);
            // Refetch updated user data


            // Display success message


        } catch (error) {
            message.error("Add user unsuccessful. Please try again.");
            // Handle error, show message, etc.
        }
    };

    const handleOk = (values) => {
        message.success(values, [1.5]);
        setIsModalVisible(false);
    };

    //Edit Modal

    const showEditModal = (user) => {
        setisEditModalVisible(true);
        setUserDataEdit(user);
    };

    const handleEditCancel = () => {
        setisEditModalVisible(false);
    };

    //handle edit , edit sucessful
    const handleEditUser = async (user) => {
        console.table(user);
        try {
            await editUser({ id: userDataEdit.id, body: user });
            refetchUserData();
            const messageEdit = "User Edit successfully!";
            handleEditOk(messageEdit);
        } catch (error) {
            console.log(error);
        }
    };

    //HandleDelete
    const handleDeleteUser = async (user) => {
        try {
            const { deleteU } = await deleteUser(user);    // no return value
            refetchUserData();
            const messageEdit = "User Delete successfully!";
            handleEditOk(messageEdit);
        } catch (error) {
            message.error("User Delete unsuccessfully!");
            console.log(error);
        }
    };
    const handleBanUser = async (user) => {
        try {
            await BanUser(user);  //no return value
            refetchUserData();
            const messageReturn = "User Banned successfully!";
            handleEditOk(messageReturn);
        } catch (error) {
            message.error("User Banned unsuccessfully!");
            console.log(error);
        }
    };

    const handleEditOk = (values) => {
        message.success(values, [1.5]);
        setisEditModalVisible(false);
    };


    const addModalProps = {
        handleCancel: handleCancel,
        handleOk: handleAddUser,
        visible: isModalVisible,
        form: form,
    }
    const editModalProps = {
        handleCancel: handleEditCancel,
        handleEdit: handleEditUser,
        visible: isEditModalVisible,
        userData: userDataEdit,
        form: form,
    }
    const TableUserProps = {
        userData: userData,
        onEdit :showEditModal,
        onDelete: handleDeleteUser,
        onBan: handleBanUser
    }


    return (
        <Layout>
            <div style={{ display: "flex", justifyContent: 'end', marginTop: '6.5rem' }}>
                <Button onClick={showModal}>Add User</Button>
            </div>
            <TableUser {...TableUserProps}/>
            <AddUserModal {...addModalProps} />
            <EditUserModal {...editModalProps} />
        </Layout>
    )
}

export default DashboardManagement
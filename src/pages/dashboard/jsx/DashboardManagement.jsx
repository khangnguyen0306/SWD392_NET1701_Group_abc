import React, { useState } from 'react'
import { useAddUserMutation, useBanUserMutation, useDeleteUserMutation, useEditUserMutation, useGetAllUserQuery, useUnBanUserMutation } from '../../../services/userAPI';
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
    const [UnBanUser] = useUnBanUserMutation();


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
            console.log(addedUser);
            if (addedUser.data.code === 201) {
                refetchUserData();
                handleOk(addedUser.data.message);
                form.resetFields();
            }else{
                message.error(addedUser.data.message);
            }

        } catch (error) {
            message.error("Add user unsuccessful. Please try again.");
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
            const { deleteU } = await deleteUser(user.id);    // no return value
            refetchUserData();
            const messageEdit = "User Delete successfully!";
            handleEditOk(messageEdit);
        } catch (error) {
            message.error("User Delete unsuccessfully!");
            console.log(error);
        }
    };

    const handleBanUser = async (record, description) => {
        if (record.status == false) {
            message.error("User already banned");
            return;
        }
        try {
            await BanUser({ id: record.id, reason: description });
            refetchUserData();
            const messageReturn = "User Banned successfully!";
            handleEditOk(messageReturn);
        } catch (error) {
            message.error("User Banned unsuccessfully!");
            console.log(error);
        }
    };
    const handleUnBanUser = async (payload) => {
        console.log(payload);
        if (payload.status == true) {
            message.error("User still active!");
            return;
        }
        try {
            await UnBanUser(payload.id);
            refetchUserData();
            const messageReturn = "User Active successfully!";
            handleEditOk(messageReturn);
        } catch (error) {
            message.error("User Active unsuccessfully!");
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
        onEdit: showEditModal,
        onDelete: handleDeleteUser,
        onBan: handleBanUser,
        onUnBan:handleUnBanUser
    }


    return (
        <Layout>
            <div style={{ display: "flex", justifyContent: 'end', marginTop: '6.5rem' }}>
                <Button onClick={showModal}>Add User</Button>
            </div>
            <TableUser {...TableUserProps} />
            <AddUserModal {...addModalProps} />
            <EditUserModal {...editModalProps} />
        </Layout>
    )
}

export default DashboardManagement
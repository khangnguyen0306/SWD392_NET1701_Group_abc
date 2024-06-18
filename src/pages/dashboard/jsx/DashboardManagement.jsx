import React, { useState } from 'react'
import { useAddUserMutation, useEditUserMutation, useGetAllUserQuery } from '../../../services/userAPI';
import TableUser from './TableUser';
import { Button, Form, Layout, message } from 'antd';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

const DashboardManagement = () => {
    const { data: userData, isLoadingUserData, refetch: refetchUserData } = useGetAllUserQuery();
    console.log(userData)
    const [form] = Form.useForm();
    const [userDataEdit, setUserDataEdit] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setisEditModalVisible] = useState(false);
    const [addUser] = useAddUserMutation();
    const [editUser] = useEditUserMutation();


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

    //Edit 

    const showEditModal = (user) => {
        setisEditModalVisible(true);
        setUserDataEdit(user);
    };

    const handleEditCancel = () => {
        setisEditModalVisible(false);
    };

    //handle edit , edit sucessful
    const handleEditUser = async (user) => {
        try {
            await editUser({ id: userDataEdit.id, body: user });
            refetchUserData();
            const messageEdit = "User Edit successfully!";
            handleEditOk(messageEdit);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditOk = (values) => {
        message.success(values, [1.5]);
        setisEditModalVisible(false);
    };


    const addModalParams = {
        handleCancel: handleCancel,
        handleOk: handleAddUser,
        visible: isModalVisible,
        form: form,
    }
    const editModalParams = {
        handleCancel: handleEditCancel,
        handleEdit: handleEditUser,
        visible: isEditModalVisible,
        userData: userDataEdit,
        form: form,
    }


    return (
        <Layout>
            <div style={{ display: "flex", justifyContent: 'end', marginTop: '6.5rem' }}>
                <Button onClick={showModal}>Add User</Button>
            </div>
            <TableUser
                userData={userData}
                onEdit={showEditModal}
            />
            <AddUserModal {...addModalParams} />
            <EditUserModal {...editModalParams} />
        </Layout>
    )
}

export default DashboardManagement
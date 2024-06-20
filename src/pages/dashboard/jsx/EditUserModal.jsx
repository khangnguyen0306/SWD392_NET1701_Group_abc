import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { validationPatterns } from '../../../utils/utils';

const { Option } = Select;

const EditUserModal = ({ visible, handleEdit, handleCancel, userData }) => {
    console.log(userData)
    const [form] = Form.useForm();
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (userData) {
            const userDataWithMomentDOB = {
                ...userData,
                dob: moment(userData.DOB), // Convert DOB to a moment object
                // Status: userData.Status ? true : false, // Convert Status to a boolean value
            };
            form.setFieldsValue(userDataWithMomentDOB);
        }
    }, [userData, form]);
    const onFinish = (values) => {
        // const { email } = values;
        // const emailExists = existingEmails.includes(email && email !== userData.email);

        // if (emailExists) {
        //     setEmailError('Email already exists. Please choose a different email.');
        //     return;
        // }

        // const createDate = new Date().toISOString();
        // // Add the createDate to the values
        // const dataToSend = { ...values, createDate };

        form.resetFields();
        // setEmailError('');
        handleEdit(values);
    };


    return (
        <Modal
            open={visible}
            title="Edit User"
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Save Change"
        >
            <Form form={form} name="addUserForm" onFinish={onFinish}>
                <Form.Item
                    label="User Type"
                    name="roleId"
                    rules={[{ required: true, message: 'Please select user type!' }]}
                >
                    <Select>
                        <Option value="1">Super Admin</Option>
                        <Option value="2">Admin</Option>
                        <Option value="3">Trainer</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="userName"
                    rules={[
                        { required: true, message: 'Please enter full name!' },
                        {
                            pattern: validationPatterns.name.pattern,
                            message: validationPatterns.name.message,
                        },

                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            pattern: validationPatterns.email.pattern,
                            required: true,
                            message: validationPatterns.email.message,
                            type: 'email'
                        },
                    ]}
                // validateStatus={emailError ? 'error' : ''}
                // help={emailError}
                >
                    <Input readOnly style={{ border: 'none' }} />
                </Form.Item>
                <Form.Item
                    label="Address"
                    name="address"
                    // rules={[
                    //     {
                    //         pattern: validationPatterns.email.pattern,
                    //         required: true,
                    //         message: validationPatterns.email.message,
                    //         type: 'email'
                    //     },
                    // ]}
                // validateStatus={emailError ? 'error' : ''}
                // help={emailError}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            pattern: validationPatterns.password.pattern,
                            message: validationPatterns.password.message,
                        },

                    ]}
                >

                    <Input.Password
                        placeholder="new password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Please enter user phone number!' },
                        {
                            pattern: validationPatterns.phoneNumber.pattern,
                            message: validationPatterns.phoneNumber.message,
                        },

                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="DOB"
                    name="dob"
                    rules={[
                        { required: true, message: 'Please select user date of birth!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const selectedYear = value && value.year();

                                if (selectedYear && selectedYear > 1914) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('DOB year must be greater than 1914!'));
                            },
                        }),

                    ]}
                >
                    <DatePicker />
                </Form.Item>

                {/* <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select user gender!' }]}
                >
                    <Radio.Group>
                        <Radio value={"Male"}>Male</Radio>
                        <Radio value={"Female"}>Female</Radio>
                    </Radio.Group>
                </Form.Item> */}

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select user status!' }]}
                >
                    <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>Draft</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;

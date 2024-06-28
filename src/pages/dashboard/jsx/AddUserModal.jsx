
import React, { useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Radio } from 'antd';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { validationPatterns } from '../../../utils/utils';

const { Option } = Select;

const AddUserModal = ({ visible, handleOk, handleCancel, form }) => {


    const onFinish = (values) => {
        handleOk(values);
    };



    return (
        <Modal
            open={visible}
            title="Add User"
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Add User"
        >
            <Form form={form} name="addUserForm" initialValues={{ userType: 'Super Admin' }} onFinish={onFinish}>
                <Form.Item
                    label="User Type"
                    name="roleId"
                    rules={[{ required: true, message: 'Please select user type!' }]}
                >
                    <Select>
                        <Option value="1">Administrator</Option>
                        <Option value="2">User</Option>
                        <Option value="3">Staff</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="userName"
                    rules={[
                        { required: true, message: 'Please enter user name!' },
                        {
                            pattern: validationPatterns.name.pattern,
                            message: validationPatterns.name.message,
                        },

                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                        { required: true, message: 'Please enter adddress!' },
                        // {
                        //     pattern: validationPatterns.name.pattern,
                        //     message: validationPatterns.name.message,
                        // },

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
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter password !' },
                        {
                            pattern: validationPatterns.password.pattern,
                            message: validationPatterns.password.message,
                        },

                    ]}
                >

                    <Input.Password
                        placeholder="input password"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Form.Item
                    label="Re-Type Password"
                    name="retypePassword"
                    rules={[
                        { required: true, message: 'Please re-type the password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Re-type password"
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
                                return Promise.reject(new Error('you are new records of older human !'));
                            },
                        }),

                    ]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select user gender!' }]}
                >
                    <Radio.Group>
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                    </Radio.Group>
                </Form.Item>

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
        </Modal >
    );
};

export default AddUserModal;

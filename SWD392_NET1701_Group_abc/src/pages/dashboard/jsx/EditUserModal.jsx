import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button } from 'antd';
import moment from 'moment';
import { validationPatterns } from '../../../utils/utils';
import dayjs from 'dayjs';

const EditUserModal = ({ visible, handleEdit, handleCancel, userData }) => {
    console.log(userData);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && userData) {
            // Convert DOB to moment object
            const userDataWithMomentDOB = {
                ...userData,
                dob: dayjs(userData.dob),

            };
            // Set form values
            form.setFieldsValue(userDataWithMomentDOB);
        }
    }, [visible, userData, form]);

    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedValues = {
                    ...values,
                    imgUrl: userData.imgUrl,
                    fullname: values.userName
                };
                handleEdit(updatedValues);
                form.resetFields();
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const onCancel = () => {
        form.resetFields();
        handleCancel();
    };

    return (
        <Modal
            visible={visible}
            title="Edit User"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={onFinish}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form}>
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
                >
                    <Input readOnly />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input />
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

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select user gender!' }]}
                >
                    <Radio.Group>
                        <Radio value={"Male"}>Male</Radio>
                        <Radio value={"Female"}>Female</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;

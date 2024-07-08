import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Skeleton } from 'antd';
import { useGetCategoryByIdQuery } from '../../../services/productAPI';

const ModalEditCategory = ({ visible, onEdit, onCancel, categoryId }) => {
    const [form] = Form.useForm();
    const { data: categoryDetail, error, isLoading, refetch } = useGetCategoryByIdQuery(categoryId);

    useEffect(() => {
        refetch();
        if (visible && categoryDetail) {
            form.setFieldsValue({
                name: categoryDetail.name,
            });
        }
    }, [visible, categoryDetail, form, refetch]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                onEdit(values);
                console.log(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    if (isLoading) {
        return <Skeleton active />;
    }


    return (
        <Modal
            open={visible}
            title="Edit Category"
            okText="Update"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name of the category!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditCategory;

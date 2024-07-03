import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEditCommentMutation, useGetCommentByIdQuery } from '../../services/postAPI';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles của ReactQuill

const ModalEditComment = ({ commentId, visible, onCancel, refetch }) => {
    const { data: commentDetail, isLoading, error } = useGetCommentByIdQuery(commentId);
    const [form] = Form.useForm();
    const [submitting, { isLoading: isUpdate }] = useEditCommentMutation();

    useEffect(() => {
        if (visible && commentDetail) {
            form.setFieldsValue({
                content: commentDetail.content,
            });
        }
    }, [visible, commentDetail, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await submitting({ id: commentId, body: values });
            onCancel()
            form.resetFields();
            refetch();
            message.success('Comment added successfully.');
        } catch (error) {
            message.error('Failed to save comment. Please try again.');
        }
    };

    return (
        <Modal
            open={visible}
            title="Edit Comment"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isUpdate}
                    onClick={() => form.submit()}
                >
                    Update
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Form.Item
                    name="content"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the content!',
                        },
                    ]}
                >
                    <ReactQuill
                        theme="snow"
                        style={{ height: '200px' }} // Thiết lập chiều cao cho ReactQuill
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditComment;

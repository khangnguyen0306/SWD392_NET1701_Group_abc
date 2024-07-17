import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'antd/es/form/Form';
import { useCreateCommentMutation } from '../../services/postAPI';
import { SendOutlined } from '@ant-design/icons';

const CommentForm = ({ refetch, postId }) => {
    const [form] = useForm();
    const [addComment] = useCreateCommentMutation();
    const [loadingComment, setLoadingComment] = useState(false);
    const handleSubmit = async () => {
        try {
            setLoadingComment(true);
            const values = await form.validateFields();
            await addComment({ id: postId, body: values });
            form.resetFields();
            refetch();
            message.success('Comment added successfully.');
        } catch (error) {
            message.error('Failed to save comment. Please try again.');
        } finally {
            setLoadingComment(false); // Reset loading to false after the request
        }
    };

    return (
        <Form layout="vertical" form={form} style={{ margin: '0', width: '100%' }} >
            <Form.Item name="content" rules={[{ required: true, message: 'Please enter your comment.' }]} style={{ margin: '0' }}>
                <ReactQuill
                    style={{ backgroundColor: '#fff' }}
                    placeholder="Enter your comment"
                />

            </Form.Item>
            <Form.Item style={{ position: 'absolute', bottom: '-1rem', right: '20px' }}>

                <Button type="primary"
                    onClick={handleSubmit}
                    loading={loadingComment}
                    icon={<SendOutlined />}>
                    Send
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CommentForm;

import React from 'react';
import { Form, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'antd/es/form/Form';
import { useCreateCommentMutation } from '../../services/postAPI';

const CommentForm = ({ refetch, postId }) => {
    const [form] = useForm();
    const [addComment] = useCreateCommentMutation();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await addComment({ id: postId, body: values });
            form.resetFields();
            refetch();
            message.success('Comment added successfully.');
        } catch (error) {
            message.error('Failed to save comment. Please try again.');
        }
    };

    return (
        <Form layout="vertical" form={form}>
            <Form.Item name="content" rules={[{ required: true, message: 'Please enter your comment.' }]}>
                <ReactQuill
                    style={{ backgroundColor: '#fff' }}
                    placeholder="Enter your comment"
                />

            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CommentForm;

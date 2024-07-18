import React, { useState } from 'react';
import { Modal, Form, Input, Rate, Button, message } from 'antd';
import { useRatingMutation } from '../../services/exchangeAPI';

const RatingModal = ({ postId, visible, onCancel, refetchExchanges, refetchTransactions }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [Rating] = useRatingMutation();


    const handleRatingOk = async (value) => {
        try {
            await Rating(value).unwrap();
        } catch (error) {
            if (error.originalStatus == 200) {
                message.success(error.data)
                onCancel(false)
                refetchExchanges();
                refetchTransactions()
            } else {
                message.error(error.data)
                onCancel(false)
                refetchExchanges();
            }
        }
    };


    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                const body = {
                    postId,
                    ...values
                }
                form.resetFields();
                setLoading(true);
                handleRatingOk(body);
                setLoading(false);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title={`Rating for Post ID: ${postId}`}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    Submit
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="score"
                    label="Score"
                    rules={[{ required: true, message: 'Please select your rating!' }]}
                >
                    <Rate />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter your description!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Write your review here..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RatingModal;

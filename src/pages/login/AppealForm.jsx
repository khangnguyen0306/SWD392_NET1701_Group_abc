import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Alert } from 'antd';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAddAppealMutation } from '../../services/appealAPI';
import { useLocation } from 'react-router-dom';
import './AppealForm.scss';
import { resetState } from '../../slices/appeal.slice';

const AppealForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const appealState = useSelector((state) => state.appeal);
  const { loading, success, error } = appealState;
  const [addAppeal] = useAddAppealMutation();

  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({
        email: location.state.email,
      });
    }
  }, [location.state, form]);

  const handleSubmit = async (values) => {
    const appealData = {
      bannerAcountId: location.state.bannedAccountId,
      description: values.message,
    };

    console.log(appealData); // Log dữ liệu JSON trước khi gửi

    try {
      await addAppeal(appealData).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (success) {
      form.resetFields();
      dispatch(resetState());
    }
  }, [success, dispatch, form]);

  return (
    <div className="appeal-container">
      <Form form={form} onFinish={handleSubmit} className="appeal-form">
        <h2 className="appeal-title">Appeal Form</h2>
        {success && (
          <Alert
            message="Appeal Submitted"
            description="Your appeal has been submitted successfully. We will review it and get back to you soon."
            type="success"
            showIcon
            icon={<SmileOutlined />}
            closable
            onClose={() => dispatch(resetState())}
            style={{ marginBottom: '24px' }}
          />
        )}
        {error && (
          <Alert
            message="Submission Failed"
            description="There was an error submitting your appeal. Please try again later."
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
            closable
            onClose={() => dispatch(resetState())}
            style={{ marginBottom: '24px' }}
          />
        )}
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email' }]}
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item
          name="message"
          rules={[{ required: true, message: 'Please input your appeal message' }]}
        >
          <Input.TextArea placeholder="Appeal Message" rows={4} size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="submit-btn" block>
            Submit Appeal
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AppealForm;

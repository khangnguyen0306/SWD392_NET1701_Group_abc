import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, notification } from 'antd';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppealForm.scss';
import { useAddAppealMutation } from '../../services/appealAPI';
import { resetState } from '../../slices/appeal.slice';

const AppealForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
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
      userId: location.state.userId,
      bannerAcountId: location.state.bannedAccountId,
      description: values.message,
    };

    console.log("Sending appeal data:", appealData);

    try {
      const response = await addAppeal({
        userId: appealData.userId,
        bannerAcountId: appealData.bannerAcountId,
        description: appealData.description,
      }).unwrap();

      console.log("Response from server:", response);

      // Display success notification
      notification.success({
        message: 'Appeal Submitted',
        description: 'Your appeal has been submitted successfully. Redirecting to login page...',
        icon: <SmileOutlined />,
      });

      // Reset the form and state
      form.resetFields();
      dispatch(resetState());

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Handle errors
      console.error("Error submitting appeal:", err);
      notification.error({
        message: 'Submission Failed',
        description: 'An error occurred while submitting your appeal. Please try again later.',
        icon: <CloseCircleOutlined />,
      });
    }
  };

  return (
    <div className="appeal-container">
      <Form form={form} onFinish={handleSubmit} className="appeal-form">
        <h2 className="appeal-title">Appeal Form</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email' }]}
        >
          <Input placeholder="Email" size="large" readOnly />
        </Form.Item>
        <Form.Item
          name="message"
          rules={[{ required: true, message: 'Please input your appeal message' }]}
        >
          <Input.TextArea placeholder="Appeal Message" rows={4} size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-btn" block>
            Submit Appeal
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AppealForm;

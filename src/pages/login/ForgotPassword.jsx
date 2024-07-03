import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Alert, notification, Row, Col, Typography } from "antd";
import { CaretLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import { useSendResetEmailMutation } from "../../services/";
import { resetState } from "../../slices/forgotPassword.slice";

const { Title } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [sendResetEmail, { isLoading, isSuccess, isError, error }] = useSendResetEmailMutation();

  const handleSubmit = async (values) => {
    await sendResetEmail(values.email);
  };
  const handleNavigate = () => {
    navigate("/login");
  }

  // useEffect(() => {
  //   if (isSuccess) {
  //     notification.success({
  //       message: "Email Sent",
  //       description: "Password reset instructions have been sent to your email.",
  //     });
  //     navigate("/login");
  //   }

  //   if (isError) {
  //     notification.error({
  //       message: "Error",
  //       description: error.data || "Failed to send password reset email. Please try again.",
  //     });
  //   }

  //   return () => {
  //     dispatch(resetState());
  //   };
  // }, [isSuccess, isError, error, navigate, dispatch]);

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Button type="primary" icon={<CaretLeftOutlined />} style={{ position: 'absolute', top: '3rem', left: '2rem' }} onClick={handleNavigate}> Back</Button>
      <Col xs={22} sm={18} md={12} lg={8}>
        <div className="form-container" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
          <Title level={2} className="form-title" style={{ textAlign: 'center', marginBottom: '24px', height: '50px' }}>Forgot Password</Title>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            {/* {isError && ( */}
            {/* {isError && (
              <>
                <Alert message={error.data} type="error" showIcon />
                <br />
              </>
            )} */}
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid Email!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                size="large"
                prefix={<span style={{ marginRight: '1rem' }}><MailOutlined /></span>}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                // loading={isLoading}
                style={{ width: '100%', fontSize: '16px', padding: '10px 0', height: '50px' }} // Adjust the width here
              >
                Send Reset Instructions
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPassword;

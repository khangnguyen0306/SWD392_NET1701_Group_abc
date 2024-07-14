import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Alert, notification, message } from "antd";
import "./Login.scss";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { setUser } from "../../slices/auth.slice";
import { useLoginUserMutation } from "../../services/authAPI";

const LoginForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (values) => {
    const result = await loginUser({ email: values.email, password: values.password });
    console.log(result);
    if (result.data) {
      dispatch(setUser(result.data.data.user));

      notification.success({
        message: "Login successfully",
        description: (
          <div>
            Welcome {result.data.data.user.userName} <SmileOutlined />
          </div>
        ),
      });
      const from = location.state?.from || "/";
      navigate(from);
    } else {
      if (result.error) {
        console.log(result);
        message.error(result.error.data.message);
        if (result.error.data.isBanned === true) {
          navigate("/appeal", {
            state: {
              email: values.email,
              bannedAccountId: result.error.data.bannedAccountId
            },
          });
        }
        return;
      }
      notification.error({
        message: "Login error",
        description: "Invalid email or password. Try again!",
      });
      form.resetFields();
    }
  };

  return (
    <div className="form-container">
      <Form form={form} onFinish={handleSubmit}>
        {error && (
          <>
            <Alert message={error} type="error" showIcon />
            <br />
          </>
        )}
        <Form.Item
          style={{ marginBottom: '2rem' }}
          name="email"
          rules={[{ required: true, message: "Please input your Email" }]}
        >
          <Input placeholder="Email" size="large" className="form-input" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password" }]}
        >
          <Input.Password
            placeholder="Password"
            size="large"
            className="form-input"
            prefix={<LockOutlined />}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="submit-btn"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;

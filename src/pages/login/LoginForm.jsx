import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Alert, notification } from "antd";
import "./Login.scss";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone, LockFilled, LockOutlined, SmileFilled, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { setToken, setUser } from "../../slices/auth.slice";
import { useLoginUserMutation } from "../../services/authAPI";
// import cookieParser from "cookie-parser";

const LoginForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation()
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (values) => {
    try {
      const result = await loginUser({ username: values.email, password: values.password });                                                                 // missing user Data
      if (result.data.data.user && result.data.data.token) {
        dispatch(setUser(result.data.data.user));
        // console.log(result.data.roles)
        dispatch(setToken(result.data.data.token));
        localStorage.setItem("token", result.data.data.token);

        notification.success({
          message: "Login successfully",
          description:
            <div>
              Welcome   {result.data.data.user.userName}   <SmileOutlined />
            </div>,
        });
        const from = location.state?.from?.pathname || "/"; // Check for intended path
        navigate(from)
      } else {
        notification.error({
          message: "Login error",
          description: "Invalid email or password. Try again!",
        });
        form.resetFields(); // Xóa dữ liệu trong các ô input
      }
    } catch (error) {
      setError("An error occurred while attempting to log in");
    }
  };

  return (
    <div className="form-container">
      <Form form={form} onFinish={handleSubmit}>
        {/* <Form form={form}> */}
        {error && (
          <>
            <Alert message={error} type="error" showIcon />
            <br />
          </>
        )}
        <Form.Item
          style={{ marginBottom: '2rem' }}
          name="email"
        // rules={[
        //   {
        //     required: true,
        //     pattern: /^[\w-]+(\.[\w-]+)*@(gmail\.com|fpt\.edu\.vn)$/,
        //     message: "Please input valid Email!",
        //   },
        // ]}
        >
          <Input placeholder="   Email" size="large" className="form-input" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="new password"
            size="large" className="form-input"
            prefix={<LockOutlined />} 
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item>
          <button
            type="primary"
            htmlType="submit"
            onLoad={isLoading}
            className="submit-btn"
          >
            Login
          </button>
        </Form.Item>
        <Form.Item>
        <Link style={{ fontSize: '16px', color: '#222222' }} to={"/forgot-password"} > <u className="forgot-password">Forgot password</u></Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;

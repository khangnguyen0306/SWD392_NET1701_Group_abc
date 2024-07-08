import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Alert, notification, message } from "antd";
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
    // try {
    const result = await loginUser({ email: values.email, password: values.password });
    console.log(result);
    if (result.data) {
      dispatch(setUser(result.data.data.user));
      dispatch(setToken(result.data.data.token));
      localStorage.setItem("token", result.data.data.token);

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
        message.error(result.error.data.message)
        return
      }
      notification.error({
        message: "Login error",
        description: "Invalid email or password. Try again!",
      });
      form.resetFields();
    }
    // } catch (error) {
    //     console.log("Login error:", error);
    //     message.error("Username or Password incorrect");
    // }
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
          rules={[{ required: true, message: "Please input your Email" }]}
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
          rules={[{ required: true, message: "Please input your password" }]}
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;

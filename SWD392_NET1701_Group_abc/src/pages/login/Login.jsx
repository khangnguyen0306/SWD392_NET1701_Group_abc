import { Button, Col, Form, Input, Layout, Row, Space } from "antd";
import "./Login.scss";
import LoginForm from "./LoginForm.jsx";
import { useSelector } from "react-redux";
// import { selectCurrenToken } from "../../slices/auth.slice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import imager from '../../assets/signin-image.jpg';
function Login() {
  // const token = useSelector(selectCurrenToken);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (token) {
  //     navigate("/");
  //   }
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [token, navigate]);

  return (
    <>
      {isLoading ? (
        <div>
          <LoadingOutlined />
        </div>
      ) : (
        <>
          <Layout className="Layout-login">
            <div className="login-page">
              <Space>
                <Row>
                  <Col className="image-login">
                    <img src={imager} />
                    <Link style={{ fontSize: '16px', color: '#222222' }} to={"/register"} > <u className="Create-account-name">Create an account</u></Link>
                    <Link style={{ fontSize: '16px', color: '#222222' }} to={"/forgot-password"} > <u className="forgot-password">Forgot password</u></Link>
                  </Col>
                  <Col>
                    <h1 className="title-login">
                      Sign in
                    </h1>
                    <div className="form-login">
                      <LoginForm />
                    </div>
                  </Col>
                </Row>
              </Space>
            </div>
          </Layout>
        </>
      )}
    </>
  );
}

export default Login;

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
import { selectCurrentToken } from "../../slices/auth.slice.js";
function Login() {
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

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

                  </Col>
                  <Col>
                    <h1 className="title-login">
                      Sign in
                    </h1>
                    <div className="form-login">
                      <LoginForm />
                    </div>
                    <div style={{marginTop:'-4rem'}}>
                      <span>You don't have account? <Link style={{ fontSize: '16px',padding:'0.3rem' }} to={"/register"} > Create an account</Link> </span>

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

import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Layout,
  theme,
} from "antd";
import CustomHeader from "../components/Header/CustomHeader";
import CustomFooter from "../components/Footer/CustomFooter";


const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, ...other },
  } = theme.useToken();
  return (
    <Layout
      id="layout-body"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}

    >
      <CustomHeader />
      <Content
        style={{
          display: "flex",
          margin: "0px 16px",
          // padding: 50,
          minHeight: 500,
          // background: other.colorBorderSecondary,
          borderRadius: borderRadiusLG,
        }}
      >
        <Outlet />
      </Content>
      <CustomFooter />
    </Layout>

  );
};

export default MainLayout;

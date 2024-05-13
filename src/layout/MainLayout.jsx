import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Badge,
  Dropdown,
  Space,
} from "antd";
import useSider from "@/hooks/useSider";
import { Link, useLocation } from "react-router-dom";
import CustomHeader from "../components/Header/CustomHeader";
import CustomFooter from "../components/Footer/CustomFooter";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  // const dispatcher = useAppDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG, ...other },
  } = theme.useToken();
  const location = useLocation();

  const siderList = useSider();
  return (
    <Layout
    >
      <CustomHeader />
      <Content
        style={{
          display: "flex",
          margin: "75px 16px",
          padding: 50,
          minHeight: 500,
          background: other.colorBorderSecondary,
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

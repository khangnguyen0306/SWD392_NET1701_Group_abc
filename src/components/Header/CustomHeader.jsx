import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Drawer, Grid, Avatar, Badge, Dropdown, notification } from "antd";
import "./CustomHeader.scss";
import { BellOutlined, MenuOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import CartModal from "../../pages/product/cartModal";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalProducts } from "../../slices/product.slice";
import { logOut, selectCurrentUser } from "../../slices/auth.slice";
import { useGetAllNotificationQuery, useGetUserProfileForOtherQuery } from "../../services/userAPI";
import { markAllAsRead, selectNotifications, selectUnreadCount, setNotifications } from "../../slices/notification.slice";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = () => {
  const screens = useBreakpoint();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const totalProducts = useSelector(selectTotalProducts);
  // const [notifications, setNotifications] = useState([]);
  const notifications = useSelector(selectNotifications);
  const unreadNotiCount = useSelector(selectUnreadCount);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetUserProfileForOtherQuery(user?.id)
  const { data: notificationsData, isLoadingNoti, refetch: refetchNoti } = useGetAllNotificationQuery(user?.id);



  const toggleCartModal = () => {
    setCartVisible(!cartVisible);
  };

  const handleLogout = () => {
    dispatch(logOut());
    notification.success({
      message: "Logout successfully",
      description: "See you again!",
    });
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    if (notificationsData) {
      dispatch(setNotifications(notificationsData));
    }
  }, [notificationsData, dispatch]);

  const handleClearNotifications = () => {
    dispatch(markAllAsRead());
  };
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to="/user-profile" activeClassName="active">
          User Profile
        </NavLink>
      </Menu.Item>
      <Menu.Item key="history">
        <NavLink to="/transactionHistory" activeClassName="active">
          Transaction History
        </NavLink>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <p>Log out</p>
      </Menu.Item>
    </Menu>
  );
  const menuLoginForStaffAndAdmin = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to="/user-profile" activeClassName="active">
          User Profile
        </NavLink>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <p>Log out</p>
      </Menu.Item>
    </Menu>
  );

  const menuNologin = (
    <Menu>
      <Menu.Item key="login">
        <NavLink to="/login" activeClassName="active">
          Login
        </NavLink>
      </Menu.Item>
      <Menu.Item key="register">
        <NavLink to="/register" activeClassName="active">
          Register
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  const renderMenuItems = () => {
    if (user?.roleId === 1) {
      return (
        <>
          <Menu.Item key="/dashboard">
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/manage-products">
            <NavLink to="/manage-products" activeClassName="active">
              Manage Products
            </NavLink>
          </Menu.Item>
        </>
      );
    } else if (user?.roleId === 3) {
      return (
        <>
          <Menu.Item key="/">
            <NavLink to="/" activeClassName="active">
              Post
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/postmanager">
            <NavLink to="/postmanager" activeClassName="active">
              Report
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/manage-categories">
            <NavLink to="/manage-categories" activeClassName="active">
              Category
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/manage-products">
            <NavLink to="/manage-products" activeClassName="active">
              Product
            </NavLink>
          </Menu.Item>
        </>
      );
    } else {
      return (
        <>
          <Menu.Item key="/">
            <NavLink exact to="/" activeClassName="active">
              Home
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/about">
            <NavLink to="/about" activeClassName="active">
              About us
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/product">
            <NavLink to="/product" activeClassName="active">
              Buy Product
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/exchange">
            <NavLink to="/exchange" activeClassName="active">
              Exchange Product
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/activity">
            <NavLink to="/activity" activeClassName="active">
              Activity
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/chat">
            <NavLink to="/chat" activeClassName="active">
              Chat
            </NavLink>
          </Menu.Item>
        </>
      );
    }
  };
  const notificationsMenu = (
    <Menu>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {notifications.map((noti) => (
          <Menu.Item key={noti.id}>
            {noti.content}
          </Menu.Item>
        ))}
      </div>
    </Menu>
  );


  return (
    <Header id="header" className={visible ? "show" : "hidden"} style={{ zIndex: "1" }}>
      <NavLink to={"/"}>
        <div className="header-logo">
          <p >
            <span style={{ color: "black", fontFamily: 'DM Serif Display' }}>Exchange</span> <span style={{ fontFamily: 'DM Serif Display' }}>Web</span>
          </p>
        </div>
      </NavLink>
      {screens.md ? (
        <>
          <div>
            <Menu mode="horizontal" selectedKeys={[location.pathname]} style={{ width: "fit-content", backgroundColor: "none" }}>
              {renderMenuItems()}
            </Menu>
          </div>
          <div className="icon-header">
            {user?.roleId == 3 || user?.roleId == 1 ? null : (
              <>
                {user ? (
                  <Dropdown overlay={notificationsMenu} trigger={["click"]}>
                    <Badge count={unreadNotiCount} onClick={handleClearNotifications}>
                      <BellOutlined style={{ fontSize: "30px" }} />
                    </Badge>
                  </Dropdown>
                ) : null}
                <p className="cart-icon" onClick={toggleCartModal}>
                  <Badge count={totalProducts}>
                    <ShoppingCartOutlined style={{ fontSize: "30px" }} />
                  </Badge>
                </p>
              </>
            )}
            {user ? (
              (user?.roleId === 3 || user?.roleId === 1) ? (
                <Dropdown overlay={menuLoginForStaffAndAdmin} trigger={["hover"]}>
                  <Avatar style={{ marginRight: "1rem", display: "block", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }} size="large" src={data?.imgUrl} />
                </Dropdown>
              ) : (
                <Dropdown overlay={menu} trigger={["hover"]}>
                  <Avatar style={{ marginRight: "1rem", display: "block", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", marginLeft: '0.5rem' }} size="large" src={data?.imgUrl} />
                </Dropdown>
              )
            ) : (
              <Dropdown overlay={menuNologin} trigger={["hover"]}>
                <Avatar style={{ marginRight: "1rem", display: "block" }} size="large" icon={<UserOutlined />} />
              </Dropdown>
            )}
          </div>
        </>
      ) : (
        <Button className="menu-btn" onClick={() => setDrawerVisible(true)} style={{ marginRight: "40px" }}>
          <MenuOutlined />
        </Button>
      )}
      <Drawer title="Navigation" placement="right" closable={false} onClose={() => setDrawerVisible(false)} open={drawerVisible}>
        <Menu mode="vertical" selectedKeys={[location.pathname]} style={{ width: "100%" }} onClick={() => setDrawerVisible(false)}>
          {renderMenuItems()}
        </Menu>
      </Drawer>
      <CartModal visible={cartVisible} onClose={toggleCartModal} />

    </Header>
  );
};

export default CustomHeader;

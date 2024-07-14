import { Badge, Button, Card, Col, Form, Image, Input, Row, Select, Spin } from "antd";

import SlideShow from "./SlideShow";
import "../scss/Dashboard.scss";
import { Link } from "react-router-dom";
import { useGetAllProductQuery } from "../../../services/productAPI";
import reUseImage from "../../../assets/reuseImage.jpg"
import protectionIMG from "../../../assets/protect.webp"                                      //chua co icons
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../slices/auth.slice";
import CustomHeader from "../../../components/Header/CustomHeader";
import CustomFooter from "../../../components/Footer/CustomFooter";
import PostManagement from "../../Postmanager/PostManagement";
import DashboardManagement from "./DashboardManagement";
import { useState } from "react";
function Dashboard() {

  const { data: productData, isLoadingProduct } = useGetAllProductQuery();
  const productsToShow = productData?.slice(0, 4);
  const user = useSelector(selectCurrentUser);

  const Role = {
    "1": "Admin",
    "2": "User",
    "3": "staff",
  }


  const truncateName = (name, maxChars) => {
    if (name.length > maxChars) {
      return name.slice(0, maxChars) + '...';
    }
    return name;
  };

  const [position, setPosition] = useState(null);

  const savePosition = () => {
    if (position) {
      // Save the position to local storage or send it to your server
      // localStorage.setItem('selectedPosition', JSON.stringify(position));
      console.log('Position saved:', position);
    } else {
      console.log('No position selected');
    }
  };
  if (isLoadingProduct) {
    return <Spin tip="Loading products..." />;
  }

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",

      }}
    >
      <CustomHeader />
      {user?.roleId === 2 || user?.roleId == null ? (
        <>
          <Row justify="center" align="middle" className="Home-layout">
            <Col xs={24} md={12}>
              <Card style={{ height: "100%" }} className="Card-container-home">
                <div className="Bagde-card-container-home">
                  <p>Join With Us!</p>
                </div>
                <h1 className="title-card-container-home">Old Treasures  <span style={{ color: '#5c98f2' }}>New Beginnings</span></h1>
                <div className="content-card-container-home">
                  <p >Reduce, Reuse, Recycle</p>
                  <p style={{ marginBottom: '1rem' }}>
                    A Sustainable Choice for a Better Tomorrow.</p>
                  <p style={{ marginBottom: '3rem' }}>The website was created with the aim of minimizing the amount
                    of waste and underutilized utensils that can be exchanged for other
                    items that are more useful in the labor and production process.</p>
                </div>
                <div className="btn-homePage">
                  {/* change url diarec */}
                  <Link to={"/exchange"}>
                    <button className="btn-home">
                      Start Exchange
                    </button>
                  </Link>
                  <Link to={"/product"}>
                    <button className="btn-homeshop">
                      Shop now
                    </button>
                  </Link>
                </div>

              </Card>
            </Col>
            <Col xs={24} md={10} className="slide-show-container">
              <SlideShow />
            </Col>
          </Row>
          <Row justify="center" style={{ width: '100%' }}>
            <Card style={{ width: '100%' }}>
              <div className="product-related">
                <p>Featured Product</p>
              </div>
              <div
                style={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
                  {productsToShow?.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={6} lg={6}>
                      <Link to={`/productDetail/${product.id}`}>
                        <Card
                          style={{ margin: '1rem 0' }}
                          hoverable
                          cover={<Image alt={product.name} src={product.urlImg} preview={false} style={{ height: '200px' }} />}
                        >
                          <Card.Meta title={<span style={{ color: '#5c98f2' }}>{truncateName(product.name, 25)}</span>} description={
                            <div>
                              <p style={{ marginBottom: '0.5rem' }}>{truncateName(product.description, 30)}</p>
                              <p style={{ color: '#f05d40', paddingBottom: '0.7rem', fontWeight: 'bold' }}>₫ {product.price}</p>
                            </div>
                          } />
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
            <Card style={{ width: '100%', marginTop: '4rem' }}>
              <div className="why-choose-us">
                <p>Why Choose Us</p>
                <p style={{ fontFamily: 'DM Serif Display' }}>6 reasons to Choose us</p>
              </div>
              <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
                <Col span={24} md={8} className="left-col-container" >
                  <div className="whychooseus-home">
                    <div className="content-whychooseus">
                      <p>Environmental protection</p>
                      <p>Exchanging old items helps reduce the amount of waste that ends up in landfills and decreases the demand for new production.</p>
                    </div>
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                  </div>
                  <div className="whychooseus-home">
                    <div className="content-whychooseus">
                      <p>Cost Savings</p>
                      <p>Instead of buying new items,
                        exchanging old ones allows you to obtain necessary goods without spending much money.</p>
                    </div>
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                  </div>
                  <div className="whychooseus-home">
                    <div className="content-whychooseus">
                      <p>Resource Conservation</p>
                      <p>When old items are exchanged and reused,
                        natural resources are conserved because there is less need for extraction and new production. This helps sustain the planet's resources.</p>
                    </div>
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                  </div>


                </Col>
                <Col span={24} md={8} className="main-img-whychoous">
                  <img src={reUseImage} width={"100%"} height={"80%"} style={{ borderRadius: '20px' }} />
                </Col>
                <Col span={24} md={8} className="right-col-container" >
                  <div className="whychooseus-home">
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                    <div className="content-whychooseus">
                      <p>Discover Unique Items</p>
                      <p>Through exchanges, you can find unique, vintage, or rare items that may not be available in modern stores.</p>
                    </div>

                  </div>
                  <div className="whychooseus-home">
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                    <div className="content-whychooseus">
                      <p>Build Community and Social Connections</p>
                      <p>Participating in the exchange of old items helps you
                        connect with like-minded individuals and create a supportive community.</p>
                    </div>
                  </div>
                  <div className="whychooseus-home">
                    <div className="image-icon-whychooseus">
                      <img src={protectionIMG} />
                    </div>
                    <div className="content-whychooseus">
                      <p>Encourage Sustainable Consumption Habits</p>
                      <p>Exchanging old items encourages people to think and act more sustainably in their consumption habits.</p>
                    </div>
                  </div>


                </Col>
              </Row>
              <Row>

              </Row>
            </Card>
          </Row>
        </>

      ) : (
        user?.roleId == 3 ? (
          <PostManagement />
        ) : (
          <DashboardManagement />
        )
      )
      }
      <CustomFooter />
    </div>
  );
}

export default Dashboard;

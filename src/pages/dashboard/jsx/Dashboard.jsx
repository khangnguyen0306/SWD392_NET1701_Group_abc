import { Badge, Button, Card, Col, Form, Input, Row, Select, Spin } from "antd";

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
function Dashboard() {

  const { data: productData, isLoadingProduct } = useGetAllProductQuery();
  const productsToShow = productData?.slice(0, 4);
  const user = useSelector(selectCurrentUser);

  const Role = {
    "1": "Admin",
    "2": "User",
    "3": "staff",
  }



  console.log(user)
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
                  <Link to={"/"}>
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
              <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
                {productsToShow?.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <Link to={`/productDetail/${product.id}`}>
                      <Card
                        hoverable
                        cover={<img alt={product.name} src={product.imageURL} />}
                      >
                        <Card.Meta title={product.name} description={`$${product.price}`} />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Card>
            <Card style={{ width: '100%', marginTop: '4rem' }}>
              <div className="why-choose-us">
                <p>Why Choose Us</p>
                <p>6 reasons to Choose us</p>
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
            </Card>
          </Row>
        </>

      ) : (

        <div className="containerForAdmin" style={{ marginTop: "8rem" }}>
          <h1>Hien dang role {Role[user?.roleId]}</h1>
        </div>
        //  authorization more
      )
      }
      <CustomFooter />
    </div>
  );
}

export default Dashboard;

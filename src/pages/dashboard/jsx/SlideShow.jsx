import React from 'react';
import { Carousel, Col, Image } from 'antd';
import Image1 from "../../../assets/slider-home/img1.jpg";
import Image2 from "../../../assets/slider-home/img2.jpg";
import Image3 from "../../../assets/slider-home/img3.jpg";
import Image4 from "../../../assets/slider-home/img4.jpg";
import Image5 from "../../../assets/slider-home/img5.jpg";
import Image6 from "../../../assets/slider-home/img6.jpg";
import Image7 from "../../../assets/slider-home/img7.jpg";
import Image8 from "../../../assets/slider-home/img8.jpg";
import "../scss/SlideShow.scss";

const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8];

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
};

const SlideShow = () => {
    return (
  
            <Carousel {...settings} className='slide-show'>
                {images.map((image, index) => (
                    <div key={index} style={{borderRadius:'20px'}}>
                        <Image preview={false} src={image} alt={`Slide ${index + 1}`} className="slide-image"style={{borderRadius:'20px'}} />
                    </div>
                ))}
            </Carousel>
    );
};

export default SlideShow;

/* eslint-disable react/prop-types */
import Slider from 'react-slick';
import { urlFor } from '../../cms/sanityClient';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './slider.css';

function SliderComponent({ slideshow, schoolName }) {
  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            src={urlFor(slideshow[i]).width(1000).url()}
            className="thumbnail"
          />
        </a>
      );
    },
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slideshow.map((image, imgIndex) => (
          <div key={imgIndex}>
            <img
              src={urlFor(image).url()}
              alt={`${schoolName} image ${imgIndex + 1}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderComponent;

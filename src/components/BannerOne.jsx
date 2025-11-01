import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const BannerFPSection = () => {
  useEffect(() => {
    // Swiper auto-init handled by component
  }, []);

  return (
    <>
      <section className="fpcreative-bg--slider">
        <div className="fpcreative-slider--wrap">
          <Swiper
            spaceBetween={30}
            effect="fade"
            speed={1000}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            fadeEffect={{ crossFade: true }}
            modules={[Autoplay, EffectFade]}
            className="fpcreative-slider"
          >
            <SwiperSlide>
              <div
                className="fpcreative-slide-bg"
                style={{
                  backgroundImage: "url('/assets/images/home/banner4.jpeg')",
                }}
              ></div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="fpcreative-slide-bg"
                style={{
                  backgroundImage: "url('/assets/images/home/banner4.jpeg')",
                }}
              ></div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="fpcreative-slide-bg"
                style={{
                  backgroundImage: "url('/assets/images/home/bg.png')",
                }}
              ></div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="fpcreative-slider-content">
          <div className="fpcreative-content-row">
            <div className="fpcreative-content-column">
              <h2 className="fpcreative-slide-subheading">
                Effortless Comfort Meets Modern Design
              </h2>
              <h1 className="fpcreative-slide-heading">
                Experience ultra-light frames that feel as good as they look —
                the perfect blend of comfort, clarity, and class.
              </h1>
              <div className="fpcreative-btns--wrap">
                <a
                  href="https://www.fiverr.com/s/0bj1lBk"
                  className="fpcreative-btn"
                >
                  <span className="fpcreative-btn-animate-y">
                    <span className="fpcreative-btn-animate-y-1">
                      Learn More
                    </span>
                    <span
                      className="fpcreative-btn-animate-y-2"
                      aria-hidden="true"
                    >
                      Learn More
                    </span>
                  </span>
                </a>
                <a
                  href="/shop"
                  className="fpcreative-btn fpcreative-btn-fill"
                >
                  <span className="fpcreative-btn-animate-y">
                    <span className="fpcreative-btn-animate-y-1">
                      View Spectacles
                    </span>
                    <span
                      className="fpcreative-btn-animate-y-2"
                      aria-hidden="true"
                    >
                      View Spectacles
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scoped CSS */}
        <style>{`
          .fpcreative-bg--slider {
            position: relative;
            width: 100%;
            height: 88vh;
            display: block;
          }

          .fpcreative-slider--wrap {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: stretch;
            width: 100%;
            height: 100%;
          }

          .fpcreative-slider {
            width: 100%;
            height: 100%;
          }

          .fpcreative-slide-bg {
            background-position: center;
            background-size: cover;
            width: 100%;
            height: 100%;
            position: relative;
          }

          .fpcreative-slide-bg::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: rgba(204, 200, 200, 0.6);
          }

          .fpcreative-slider-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          }

          .fpcreative-content-row {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            text-align: center;
            height: 100%;
          }

          .fpcreative-content-column {
            max-width: 65%;
            margin: 0 auto;
          }

          .fpcreative-slide-subheading {
            margin-top: 0;
            font-size: 20px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            line-height: 1.2;
            color: #010101;
            opacity: 0;
            filter: blur(4px);
            animation: fpcreative-fadeInUp 1s ease forwards;
            animation-delay: 0.3s;
          }

          .fpcreative-slide-heading {
            font-size: 55px;
            font-weight: 500;
            line-height: 1.085;
            letter-spacing: -0.035em;
            margin-top: 0;
            margin-bottom: 50px;
            color: #010101;
            opacity: 0;
            filter: blur(4px);
            animation: fpcreative-fadeInUp 1s ease forwards;
            animation-delay: 0.5s;
          }

          .fpcreative-btns--wrap {
            margin-top: 20px;
            display: inline-flex;
            opacity: 0;
            filter: blur(4px);
            animation: fpcreative-fadeInUp 1s ease forwards;
            animation-delay: 0.7s;
          }

          .fpcreative-btn,
          .fpcreative-btn.fpcreative-btn-fill {
            margin: 0 10px;
            padding: 11px 32px 10px;
            font-size: 13px;
            letter-spacing: 0.085em;
            color: #010101;
            border: 1px solid #010101;
            background: transparent;
            border-radius: 4px;
            font-weight: 700;
            text-transform: uppercase;
            text-decoration: none;
            overflow: hidden;
            position: relative;
          }

          .fpcreative-btn.fpcreative-btn-fill {
            background-color: #010101;
            color: #fff;
          }

          .fpcreative-btn-animate-y {
            position: relative;
            display: block;
            overflow: hidden;
          }

          .fpcreative-btn-animate-y-1 {
            display: block;
            transition: all 0.37s cubic-bezier(0.15, 0.7, 0.78, 1),
              opacity 0.37s linear;
          }

          .fpcreative-btn-animate-y-2 {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            transform: translateY(100%);
            transition: all 0.37s cubic-bezier(0.15, 0.7, 0.78, 1),
              opacity 0.37s linear;
          }

          .fpcreative-btn:hover .fpcreative-btn-animate-y-1 {
            opacity: 0;
            transform: translateY(-100%);
          }

          .fpcreative-btn:hover .fpcreative-btn-animate-y-2 {
            opacity: 1;
            transform: translateY(0);
          }

          .fpcreative-status {
            position: absolute;
            bottom: 30px;
            width: 180px;
            font-size: 16px;
            line-height: 1.375;
            padding-left: 10px;
            color: black;
            border-left: 2px solid;
            left: 30px;
            opacity: 0;
            filter: blur(4px);
            animation: fpcreative-fadeInRight 1s ease forwards;
            animation-delay: 0.5s;
          }

          @keyframes fpcreative-fadeInUp {
            0% {
              opacity: 0;
              transform: translate3d(0, 37px, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
              filter: blur(0);
            }
          }

          @keyframes fpcreative-fadeInRight {
            0% {
              opacity: 0;
              transform: translateX(50px);
            }
            100% {
              opacity: 1;
              filter: blur(0);
              transform: translateX(0px);
            }
          }

          @media only screen and (max-width: 1366px) {
            .fpcreative-content-column {
              max-width: 100%;
              padding: 0px 30px;
            }
            .fpcreative-status {
              display: none;
            }
          }

          @media only screen and (max-width: 981px) {
            .fpcreative-slide-heading {
              font-size: 38px;
            }
          }

          @media only screen and (max-width: 575px) {
            .fpcreative-content-column {
              padding: 0px 10px;
            }
            .fpcreative-slide-heading {
              font-size: 29px;
              margin-bottom: 25px;
            }
            .fpcreative-btns--wrap {
              flex-direction: column;
            }
            .fpcreative-btn,
            .fpcreative-btn.fpcreative-btn-fill {
              margin-bottom: 15px;
            }
            .fpcreative-slide-subheading {
              font-size: 16px;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default BannerFPSection;

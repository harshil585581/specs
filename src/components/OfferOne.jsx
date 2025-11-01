import React, { useEffect, useRef } from "react";
import LiquidBackground from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js";

const OfferOne = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize liquid effect
    const app = LiquidBackground(canvas);
    app.liquidPlane.material.metalness = 0.7;
    app.liquidPlane.material.roughness = 0.25;
    app.liquidPlane.uniforms.displacementScale.value = 3;
    app.setRain(false);

    // Handle resizing
    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (app.dispose) app.dispose();
    };
  }, []);

  return (
    <>
      <style>{`
        .offerone-container {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background-image: url('assets/images/home/bg-banner1.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 60px 20px;
        }

        .offerone-liquid-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          opacity: 0.5;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 0;
          transition: opacity 1s ease-in-out;
        }

        .offerone-heading {
          color: #fff;
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 30px;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1.5s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .offerone-image {
          width: 100%;
          max-width: 750px;
          height: auto;
          object-fit: cover;
          border-radius: 16px;
          position: relative;
          z-index: 2;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          opacity: 0;
          transform: scale(0.95);
          animation: imageFadeIn 1.8s ease forwards;
        }

        @keyframes imageFadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsiveness */
        @media (max-width: 992px) {
          .offerone-heading {
            font-size: 1.5rem;
          }

          .offerone-image {
            max-width: 600px;
          }
        }

        @media (max-width: 768px) {
          .offerone-container {
            padding: 40px 15px;
          }

          .offerone-heading {
            font-size: 1.3rem;
          }

          .offerone-image {
            max-width: 450px;
          }
        }

        @media (max-width: 576px) {
          .offerone-heading {
            font-size: 1.1rem;
            line-height: 1.4;
          }

          .offerone-image {
            max-width: 333px;
          }
        }
      `}</style>

      <section className="offer pt-80 pb-80">
        <div
          className="container container-lg offerone-container"
          ref={containerRef}
        >
          {/* Liquid glass effect canvas */}
          <canvas ref={canvasRef} className="offerone-liquid-canvas"></canvas>

          {/* Content */}
          <div className="row gy-4 d-flex flex-column align-items-center text-center" style={{ position: "relative", zIndex: 1 }}>
            <h5 className="offerone-heading">
              GREAT LENSES AREN’T JUST MADE, THEY’RE CRAFTED.
              <br />
              TRUST YOUR VISION WITH US.
            </h5>

            <div className="col-sm-12 d-flex justify-content-center">
              <div className="offer-card position-relative rounded-16 overflow-hidden">
                <img
                  src="assets/images/home/r-s-image.png"
                  alt="Offer"
                  className="offerone-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OfferOne;

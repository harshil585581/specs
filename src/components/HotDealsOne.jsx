import React from "react";

const HotDealsOne = () => {
  return (
    <section className="pt-80" style={{paddingBottom:"80px"}}>
      <style>{`
        .specsk-wrap {
          position: relative;
          min-height: 100px;
          text-align: center;
        }

        .specsk-h1 {
          color: #001d3d;
          font-family: "Varela Round", sans-serif;
          text-transform: uppercase;
          animation: specsk-move linear 2000ms infinite;
          will-change: text-shadow;
          white-space: nowrap;
          font-size: 120px;
          letter-spacing: 5px;
          line-height: 120px;
          margin: 0;
        }

        .specsk-h2 {
          color: #001d3d;
          font-family: "Varela Round", sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          margin-top: 10px;
          text-transform: none;
          font-weight: 400;
          text-shadow: 1px 1px 2px rgba(0,0,66,0.4), -1px -1px 2px #d0e3ff;
        }

        @keyframes specsk-move {
          0% {
            text-shadow:
              4px -4px 0 #d0e3ff,
              3px -3px 0 #d0e3ff,
              2px -2px 0 #d0e3ff,
              1px -1px 0 #d0e3ff,
              -4px 4px 0 #001d3d,
              -3px 3px 0 #001d3d,
              -2px 2px 0 #001d3d,
              -1px 1px 0 #001d3d;
          }
          25% {
            text-shadow:
              -4px -4px 0 #001d3d,
              -3px -3px 0 #001d3d,
              -2px -2px 0 #001d3d,
              -1px -1px 0 #001d3d,
              4px 4px 0 #d0e3ff,
              3px 3px 0 #d0e3ff,
              2px 2px 0 #d0e3ff,
              1px 1px 0 #d0e3ff;
          }
          50% {
            text-shadow:
              -4px 4px 0 #d0e3ff,
              -3px 3px 0 #d0e3ff,
              -2px 2px 0 #d0e3ff,
              -1px 1px 0 #d0e3ff,
              4px -4px 0 #001d3d,
              3px -3px 0 #001d3d,
              2px -2px 0 #001d3d,
              1px -1px 0 #001d3d;
          }
          75% {
            text-shadow:
              4px 4px 0 #001d3d,
              3px 3px 0 #001d3d,
              2px 2px 0 #001d3d,
              1px 1px 0 #001d3d,
              -4px -4px 0 #d0e3ff,
              -3px -3px 0 #d0e3ff,
              -2px -2px 0 #d0e3ff,
              -1px -1px 0 #d0e3ff;
          }
          100% {
            text-shadow:
              4px -4px 0 #d0e3ff,
              3px -3px 0 #d0e3ff,
              2px -2px 0 #d0e3ff,
              1px -1px 0 #d0e3ff,
              -4px 4px 0 #001d3d,
              -3px 3px 0 #001d3d,
              -2px 2px 0 #001d3d,
              -1px 1px 0 #001d3d;
          }
        }

        @media (max-width: 992px) {
          .specsk-h1 { font-size: 80px; line-height: 90px; }
          .specsk-h2 { font-size: 20px; }
        }
        @media (max-width: 576px) {
          .specsk-h1 { font-size: 56px; line-height: 64px; letter-spacing: 3px; }
          .specsk-h2 { font-size: 16px; }
        }
      `}</style>

      <div className="specsk-wrap">
        <h1 className="specsk-h1">SpecsKraft</h1>
        <h2 className="specsk-h2">Where Vision Meets Craft</h2>
      </div>
    </section>
  );
};

export default HotDealsOne;

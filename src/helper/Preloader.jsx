import React, { useEffect, useState } from "react";

const Preloader = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 800); // ⏱ reduced loading time to 0.8s
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {active && (
        <div
          className="preloader"
          style={{
            margin: 0,
            height: "100vh",
            display: "grid",
            placeItems: "center",
            background: "white",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
          }}
        >
          <div className="specs"></div>

          {/* Inline CSS */}
          <style>{`
            .specs {
              height: 10px;
              width: 150px;
              background: #001d3d;
              position: relative;
              border-radius: 10px;
              animation: fadeIn 0.5s ease-in-out;
            }

            .specs::after,
            .specs::before {
              content: "";
              position: absolute;
              height: 50px;
              width: 60px;
              background: linear-gradient(
                45deg,
                rgba(125,186,187,1) 0%,
                rgba(125,186,187,1) 40%,
                rgba(255,255,255,1) 40%,
                rgba(255,255,255,1) 60%,
                rgba(139,194,195,1) 60%,
                rgba(125,186,187,1) 100%
              );
              box-sizing: border-box;
              border: 4px solid black;
              border-radius: 10px 10px 50% 50%;
              top: -8px;
              animation: bounce 0.8s ease-in-out infinite;
            }

            .specs::after {
              left: 9px;
              animation-delay: 0.1s;
            }

            .specs::before {
              right: 9px;
              animation-delay: 0.2s;
            }

            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Preloader;

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const goToRegister = () => {
    router.push("/register");
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Smart Task Manager</h1>
        <p className="subtitle">Organize. Track. Achieve.</p>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Boost Your Productivity</h2>
          <p>
            Manage tasks effortlessly with a clean, lightweight and intuitive
            interface.
          </p>
          <button className="btn" onClick={goToRegister}>
            Get Started
          </button>
        </div>
        <div className="hero-img">
          <img
            src="https://i.ibb.co/65tBT2x/austin-distel-w-D1-LRb9-Oe-Eo-unsplash.jpg"
            alt="hero-img"
            style={{
              width: "-webkit-fill-available",
              height: "220px",
              borderRadius: "16px",
            }}
          />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🚀 Fast & Lightweight</h3>
          <p>Designed for speed and smooth performance.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Smart Scheduling</h3>
          <p>Automatically adjust priorities and deadlines.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Clean Dashboard</h3>
          <p>Track tasks, progress and timelines efficiently.</p>
        </div>
      </section>

      <footer className="footer">© 2025 Smart Task Manager</footer>

      <style jsx>{`
        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 2.8rem;
          font-weight: 700;
          margin: 0;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #555;
        }

        .hero {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .hero-content {
          flex: 1;
          min-width: 280px;
        }

        .hero-content h2 {
          font-size: 2rem;
          margin: 0 0 10px;
        }

        .btn {
          margin-top: 8px;
          padding: 12px 24px;
          background: #2c7efb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn:hover {
          background: #185fd6;
        }

        .hero-img {
          flex: 1;
          min-width: 280px;
          height: 220px;
          background: linear-gradient(135deg, #e3f0ff, #d4e3ff);
          border-radius: 16px;
        }

        .features {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .feature-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .footer {
          margin-top: 40px;
          color: #777;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.2rem;
          }

          .hero-content h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { Target } from 'lucide-react';
import './Motto.css';

const Motto: React.FC = () => {
  return (
    <section className="motto-section" id="shior">
      <div className="container motto-container">
        <div className="motto-copy">
          <span className="motto-kicker">BIZNING SHIORIMIZ</span>
          <h2 className="motto-title">
            Bizning <span>shiorimiz</span>
          </h2>

          <div className="motto-card">
            <div className="motto-icon" aria-hidden="true">
              <Target size={42} strokeWidth={2.2} />
            </div>
            <p>
              Fan ko'kida qil parvoz,<br />
              Qancha bilsang, shuncha oz.
            </p>
          </div>
        </div>

        <div className="motto-image-wrap">
          <img src="/school.png" alt="Chiroqchi IM maktab binosi" />
        </div>
      </div>

      <div className="motto-pattern" aria-hidden="true"></div>
    </section>
  );
};

export default Motto;

import React from 'react';
import './Inspiration.css';

const Inspiration: React.FC = () => {
  return (
    <section className="inspiration-section" id="talim" data-aos="fade-up">
      <div className="container inspiration-container">
        <div className="inspiration-side-image">
          <img src="/pres.png" alt="O'zbekiston Respublikasi Prezidenti" />
        </div>

        <div className="inspiration-copy">
          <h2 className="inspiration-title">
            Kelajak uchun <span>sarmoya</span>
          </h2>

          <div className="inspiration-quote">
            <p>
              “Yangi O'zbekistonning asosiy ustuni – bilim,
              ta'lim va tarbiya bo'ladi!”
            </p>
          </div>

          <div className="inspiration-author">
            <strong>Shavkat Mirziyoyev</strong>
            <span>O'zbekiston Respublikasi Prezidenti</span>
          </div>
        </div>

        <div className="inspiration-campus">
          <img src="/school.png" alt="Chiroqchi IM kampusi" />
          <span>Chiroqchi IM kampusi</span>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;

import React from 'react';

export default function Welcome({ username }) {
  return (
    <section className="arrival" aria-labelledby="welcome-title">
      <section className="arrival-copy">
        <span className="eyebrow">TU HISTORIA CON ATELIER EMPIEZA AQUÍ</span>
        <div className="arrival-greeting">HOLA, <span>{username}</span> <span aria-hidden="true">✳</span></div>
        <h1 id="welcome-title">Bienvenido a<br/>tu nueva esencia.</h1>
        <p>Este es tu espacio para descubrir prendas que van contigo. Encuentra inspiración, combina a tu manera y dale un nuevo aire a tu estilo.</p>
        <a className="primary" href="#collection">Descubrir la tienda <span aria-hidden="true">↗</span></a>
        <a className="arrival-secondary" href="#collection">Ver la nueva colección <span aria-hidden="true">→</span></a>
        <div className="arrival-details">
          <div><span>01 / INSPÍRATE</span><p>Looks para tu día a día.</p></div>
          <div><span>02 / ENCUENTRA TU ESTILO</span><p>Esenciales con personalidad.</p></div>
        </div>
      </section>
      <section className="arrival-gallery" aria-label="Inspiración de la colección">
        <img className="arrival-main-photo" src="/images/shirt.jpg" alt="Look con top blanco y jeans de pierna ancha" fetchPriority="high" width="900" height="1350"/>
        <div className="arrival-photo-label"><span>ATELIER / ESENCIA</span><p>Hecho para ser tú.</p></div>
        <div className="arrival-inset"><img src="/images/sweater.jpg" alt="Suéter de punto verde oliva" width="800" height="1200"/><span>TEXTURAS QUE INSPIRAN</span></div>
      </section>
      
    </section>
  );
}

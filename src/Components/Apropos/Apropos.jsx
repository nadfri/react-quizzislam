import React from 'react';
import "./Apropos.scss";

function Apropos() {
    return (
        <div className="Apropos">
            <h1>À propos</h1>
            <fieldset>
                <p>QuizzIslam est une application pour apprendre l'Islam de manière ludique.</p>
                <p><b>Abdelhakim Richi</b>, imam de la mosquée de Savigny Le temple est à l'initiative de ce projet.</p>
                <p>Développé par <a href="mailto:nadfri@gmail.com">NadfriJS <i className="far fa-envelope"></i></a>.</p>
                <p>Version 1.0.20</p>
                <p>2021</p>
            </fieldset>
        </div>
    );
}

export default Apropos;
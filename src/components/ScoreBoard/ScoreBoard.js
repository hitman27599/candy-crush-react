import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({score}) => {
    return (
        <div className="scoreBoard">
            <h1> Score:{score} </h1>
        </div>
    )
}

export default ScoreBoard

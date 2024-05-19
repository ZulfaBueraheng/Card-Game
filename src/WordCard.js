import React, { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import _ from 'lodash';
import Modal from './Modal';

const prepareStateFromWord = (given_word) => {
    let word = given_word.toUpperCase();
    let chars = _.shuffle(Array.from(word));
    return {
        word,
        chars,
        attempt: 1,
        guess: '',
        completed: false,
    };
};

export default function WordCard(props) {
    const [state, setState] = useState(prepareStateFromWord(props.value));
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - 1);
                } else {
                    handleTimeOut();
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isPlaying, timeLeft]);

    const handleTimeOut = () => {
        setModalMessage('Time is up! Reset the game.');
        setShowModal(true);
        setState(prepareStateFromWord(props.value));
        setTimeLeft(60);
        setIsPlaying(false);
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setShowModal(false);
        setState(prepareStateFromWord(props.value));
        setTimeLeft(60);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setShowModal(false);
        setState(prepareStateFromWord(props.value));
        setTimeLeft(60);
    };

    const activationHandler = (c) => {
        if (!isPlaying) return;

        console.log(`${c} has been activated`)
        let guess = state.guess + c;
        setState({ ...state, guess });

        if (guess.length === state.word.length) {
            if (guess === state.word) {
                setModalMessage('yeah!');
                setShowModal(true);
                setState({ ...state, completed: true });
                setIsPlaying(false);
            } else {
                setModalMessage('reset, next attempt');
                setShowModal(true);
                setState({ ...state, guess: '', attempt: state.attempt + 1 });
            }
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div>
            <div className="card-container">
                {state.chars.map((c, i) => (
                    <CharacterCard value={c} key={i} activationHandler={activationHandler} attempt={state.attempt} />
                ))}
            </div>
            <div className="timeleft-container">
                {isPlaying && <div className="timeleft">Time Left: {timeLeft} seconds</div>}
            </div>
            <div className="button-container">
                {!isPlaying && !state.completed && <button onClick={handlePlay}>Play</button>}
                {isPlaying && !state.completed && <button onClick={handleReset}>Reset</button>}
            </div>
            {showModal && <Modal message={modalMessage} closeModal={toggleModal} />}
        </div>
    );
}
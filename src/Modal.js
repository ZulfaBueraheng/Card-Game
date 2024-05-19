import React from 'react';

export default function Modal(props) {
    return (
        <div className="modal show">
            <div className="modal-content">
                <span className="close" onClick={props.closeModal}>
                    &times;
                </span>
                <p>{props.message}</p>
            </div>
        </div>
    );
}
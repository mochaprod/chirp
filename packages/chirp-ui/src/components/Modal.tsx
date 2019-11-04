import React from "react";

import styles from "./Modal.module.scss";

interface ModalProps {
    show: boolean;
    onBackdropClick: () => void;
}

const Modal: React.FC<ModalProps> = ({
    children,
    show,
    onBackdropClick
}) => {
    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event.target === event.currentTarget) {
            onBackdropClick();
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div
            className={ styles.backdrop }
            onClick={ handleBackdropClick }
        >
            { children }
        </div>
    );
};

export default Modal;

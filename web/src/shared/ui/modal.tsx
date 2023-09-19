import React from "react";
import {createPortal} from "react-dom";

interface ModalProps {
    children?: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

export const Modal: React.FC<ModalProps> = ({children, onClose, isOpen}) => {
    React.useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (isOpen)
        return createPortal(
            <>
                <div
                    onClick={onClose}
                    className="absolute left-0 top-0 w-screen h-screen bg-paper-primary/80"
                />

                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {children}
                </div>
            </>,
            document.body,
        );
};

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Vortex: React.FC = ({ children }) => {
    const host = useRef<HTMLElement>(
        document.createElement("div")
    );

    useEffect(() => {
        const { current } = host;

        document.body.appendChild(current);

        return () => {
            document.body.removeChild(current);
        };
    });

    return ReactDOM.createPortal(
        children,
        host.current
    );
};

export default Vortex;

import React from "react";
import { Link } from "react-router-dom";

import styles from "./Layout.module.scss";

const Layout: React.FC = ({ children }) => {
    const links = [
        {
            to: "/",
            text: "Home"
        },
        {
            to: "/search",
            text: "Search"
        }
    ];

    return (
        <div>
            <nav
                className={ styles.nav }
            >
                { links.map(({ to, text }) => (
                    <Link
                        to={ to }
                    >
                        { text }
                    </Link>
                )) }
            </nav>
            <div>
                { children }
            </div>
        </div>
    );
};

export default Layout;

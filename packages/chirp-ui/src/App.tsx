import React from "react";
import { BrowserRouter } from "react-router-dom";

import StorageProvider from "./components/StorageProvider";
import UserProvider from "./components/UserProvider";
import ChirpRouter from "./components/ChirpRouter";
import LoadingFallback from "./components/LoadingFallback";

import routes from "./routes/chirp";

import styles from "./App.module.scss";
import "./App.css";
import Layout from "./components/views/Layout";

const App: React.FC = () => {
    const renderFallback = () => (
        <LoadingFallback />
    );

    return (
        <BrowserRouter>
            <StorageProvider>
                <UserProvider>
                    <React.Suspense
                        fallback={ renderFallback() }
                    >
                        <Layout>
                            <div
                                className={ styles.app }
                            >
                                <ChirpRouter
                                    routes={ routes }
                                />
                            </div>
                        </Layout>
                    </React.Suspense>
                </UserProvider>
            </StorageProvider>
        </BrowserRouter>
    );
};

export default App;

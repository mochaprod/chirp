import React from "react";
import { BrowserRouter } from "react-router-dom";

import StorageProvider from "./components/StorageProvider";
import UserProvider from "./components/UserProvider";
import ChirpRouter from "./components/ChirpRouter";
import LoadingFallback from "./components/LoadingFallback";

import routes from "./routes/chirp";

import "./App.css";

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
                        <ChirpRouter
                            routes={ routes }
                        />
                    </React.Suspense>
                </UserProvider>
            </StorageProvider>
        </BrowserRouter>
    );
};

export default App;

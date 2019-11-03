import React from "react";
import { Switch, Route as Goto, RouteComponentProps } from "react-router-dom";

import { Route } from "../models/router";

import NotFound from "./views/NotFound";

interface ChirpRouterProps {
    routes: Route[];
}

const ChirpRouter: React.FC<ChirpRouterProps> = ({
    routes
}) => {
    return (
        <Switch>
            { routes.map(({
                to, exact, component: Component, render
            }) => {
                let toRender: ((props: RouteComponentProps) => React.ReactNode) | (() => null);

                if (Component) {
                    toRender = () => (
                        <Component />
                    );
                } else if (render) {
                    toRender = render;
                } else {
                    toRender = () => null;
                }

                return (
                    <Goto
                        key={ to }
                        path={ to }
                        exact={ exact }
                        render={ toRender }
                    />
                );
            }) }
            <Goto
                component={ NotFound }
            />
        </Switch>
    );
};

export default ChirpRouter;

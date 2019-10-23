import React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface Route {
    to: string;
    exact?: boolean;
    component?: React.FC<any>;
    render?: (props?: RouteComponentProps) => React.ReactNode;
}

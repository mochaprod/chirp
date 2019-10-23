import React from "react";

import RequireAuthentication from "./RequireAuthentication";

const withRequireAuthentication = (not?: boolean, to?: string) => (Component: React.FC) => {
    const redirect = to || "/";

    const WithRequireAuth: React.FC = (props) => (
        <RequireAuthentication
            not={ not }
            redirectTo={ redirect }
        >
            <Component
                { ...props }
            />
        </RequireAuthentication>
    );

    const componentName = Component.name
        || Component.displayName
        || "Component";

    WithRequireAuth.displayName = `requireAuthentication(${componentName})`;

    return WithRequireAuth;
};

export default withRequireAuthentication;

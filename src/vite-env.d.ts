/// <reference types="vite/client" />

import { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?:User['role'][];
};






/// <reference types="vite/client" />

import { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?:User['role'][];
};


export interface UserType {
    userId: string;
    name: string;
    email: string;
    authToken?: string;
  }
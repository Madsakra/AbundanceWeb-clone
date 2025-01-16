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



export type ApprovedAccounts = {
    id:string,
    name:string,
    role:string,
    email:string,
}
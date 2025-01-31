
export type MembershipTier = { 
    id: string; 
    description: string; 
    unit_amount: number; 
    currency: string; 
    interval: string;
    management?:boolean; 
    selectedTierID?:string;
    fetchData?:()=>void;
  }; 


  export interface UserType {
    userId: string;
    name: string;
    email: string;
    authToken?: string;
  }


  export type ProfileType = {
  avatar:string,
  dob:string,
  title:string,
  gender:string,
}

export type AccountDetails = {
  name:string,
  email:string,
  role:string,
  image?:string,
  certificationURL?:string,
  resumeURL?:string,


}

export type ApprovedAccounts = {
    id:string,
    name:string,
    role:string,
    email:string,
};


export type PendingAccounts = {
    id: string;
    name:string,
    email: string;
    certificationURL: string;
    resumeURL: string;
  };
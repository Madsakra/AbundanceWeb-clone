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
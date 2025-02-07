export type ReviewType = {
    id:string,
    name:string,
    score:number,
    reasons:string[];
  };
  

  
  export type AppFeature = {
    id:string,
    name:string,
    description:string,
    image:string,
};


export type MET_Task_Type = {
    id:string,
    name:string,
    value:number
  };


export type PredefinedGoalsType = { 
    id:string,
    categoryID:string,
    min:number,
    max:number,
    unit:string,
  };
  
export type PredefinedGoalsCat = { 
  id:string,
  units:string [],
};

export type CompanyContactDetails = {
  address:string,
  openingTime:string,
  closingTime:string,
  embeddedLink:string,
  phone:string, 

};

export type WebsiteLinks = { 
  id: string; 
  name:string;
  link:string;
}; 

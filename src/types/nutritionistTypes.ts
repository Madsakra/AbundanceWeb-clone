import { Timestamp } from "firebase/firestore"
import { PredefinedGoalsType } from "./adminTypes"

export type ClientAccountType = {
    uid:string,
    avatar?:string,
    email:string,
    name:string,
    role:string,
}

export interface ProfileHealthConditions {
    id:string,
    name:string,
}


export type ClientProfileInfoType = {
    birthDate:string,
    gender:string,
    goals:PredefinedGoalsType[],
    height:number,
    weight:number
    image:string,
    profileDiet: ProfileHealthConditions[],
    profileHealthCondi:ProfileHealthConditions[],
}

export type CalorieLogType = {
    amount:number,
    category:string,
    food_info?:{
        carbs:number,
        fats:number,
        image_url:string,
        name:string,
        protein:string,
    },
    MET_task?:{
        id:string,
        name:string,
        value:number,
    },
    timestamp:Timestamp,
    type:string,
};

export type GlucoseLogType = {
    reading:number,
    timestamp:Timestamp,
    unit:string
};

export type LogEntry = {
    timestamp:Timestamp,
} & (CalorieLogType|GlucoseLogType)


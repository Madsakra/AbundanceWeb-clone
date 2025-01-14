const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app')


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { getAuth } = require("firebase-admin/auth");


const app = initializeApp();
const users = getAuth(app);


exports.viewAccounts = functions.https.onCall(async ()=>{
    const myData = await users.listUsers();
    return myData;
})

exports.createAccount = functions.https.onCall(async(data:any,context:any)=>{

  try{
   
          const user = await users.createUser({
            email:data.email,
            password:data.password
          })
          // Return USER ID
          const userID = user.uid;
          return userID;
  }

  catch(error)
  {
    console.log(error);
  }
})
const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app')

const {onCall} = require("firebase-functions/v2/https");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { getAuth } = require("firebase-admin/auth");


const app = initializeApp();
const users = getAuth(app);


exports.viewAccounts = functions.https.onCall(async ()=>{
    const myData = await users.listUsers();
    return myData;
})



exports.addAccount = onCall(async (request:any)=>{

  try{

    const email = request.data.email;
    const password = request.data.password;

    const user = await users.createUser({
      email:email,
      password:password
    })

    const userID = user.uid;
    if(userID)
    {
      return{ id:userID }
    }
    else{
      return null;
    }

  }

  catch(err)
  {
    console.log(err);
    return{err}
  }


})


exports.deleteAccount = onCall(async (request:any)=>{
 
  try{

    const myId = request.auth.uid;
    await users.deleteUser(request.data.uid);
    return { 
      data: "User deleted",
      by:myId,
    };

  }

  catch(err)
  {
    console.log("error")
    return{err}
  }



})
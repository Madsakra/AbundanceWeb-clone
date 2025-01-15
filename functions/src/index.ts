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




exports.createAccount = functions.https.onCall(async(data:any,context:any)=>{

  try{
   
        const {email,password} = data;

          const user = await users.createUser({
            email:email,
            password:password
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


exports.deleteUser = functions.https.onCall(async (data:any, context: any) => {
  try {
    // Access uid directly from the data object
 
    console.log({data});
    await users.deleteUser(data.uid);

    return { data: "User deleted" };
  } catch (error) {
    console.log("error deleting user", error);
    return { error };
  }
});


exports.addMessage = onCall(async (request:any)=>{
 
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
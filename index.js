const express = require("express");
const app = express();
const OAuthClient = require("intuit-oauth");
let oauthClient = null;
app.listen(4000, () => {
  console.log("server is running on 4000 port");
});

app.get("/test", (req, res) => {
  res.status(200).send("working fine");
});

app.get("/oauthclient", (req, res) => {
   oauthClient = new OAuthClient({
    clientId: "AB37BhSl182nsKJsESPgLTRpjYjTncD7TQ1KZFiOH6EfA0PzRO",
    clientSecret: "u4TUjuiM2HBBpsjwLl1eTMPlSIx14UgDxwxY4o5J",
    environment: "sandbox",
    redirectUri: "http://localhost:4000/callback",
  });

  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
    state: 'testState',
  }); // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
  
  console.log(authUri);
  // Redirect the authUri
  res.status(200).send(authUri);
});

app.get('/callback',(req,res)=>{
    const parseRedirect = req.url;

// Exchange the auth code retrieved from the **req.url** on the redirectUri
oauthClient
  .createToken(parseRedirect)
  .then(function (authResponse) {
    console.log('The Token is  ' + JSON.stringify(authResponse.getJson()));
    res.status(200).send({message:authResponse.getJson()})
  })
  .catch(function (e) {
    console.error('The error message is :' + e.originalMessage);
    console.error(e.intuit_tid);
    res.send(e.intuit_tid)
  });
});


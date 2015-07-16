//console.log(meteor_oauth_pendingCredentials);
var key = "6af5f1835de662abe13eaeca6258fbcb";
var secret = "21ff9e1258f0bbd6353aaaf10e509ee4235bbe00c7806da1c4496d9f3d36571b";
var loginCallback = "https://clocker-website-udisun.c9.io/trello-callback"

var OAuth = Package.oauth.OAuth;
var Trello = Meteor.npmRequire("node-trello");
var trelloOAuth = new Trello.OAuth(key, secret, loginCallback, 'Clocker');

Meteor.methods({
  trelloConnect: function() {
    var getRequestTokenSync = Meteor.wrapAsync(trelloOAuth.getRequestToken, trelloOAuth);

    var requestTokenBag = getRequestTokenSync();
    var urlParts = [requestTokenBag.redirect, 'expiration=never', 'scope=read,account'];

    OAuth._storePendingCredential(requestTokenBag.oauth_token, requestTokenBag.oauth_token_secret);

    return urlParts.join('&');
  },
  trelloAccessToken: function(oauth_token, oauth_verifier) {
    var oauth_token_secret = OAuth._retrievePendingCredential(oauth_token);
    var getAccessTokenSync = Meteor.wrapAsync(trelloOAuth.getAccessToken, trelloOAuth);

    var bag = {
      oauth_token: oauth_token,
      oauth_token_secret: oauth_token_secret,
      oauth_verifier: oauth_verifier
    };
    var trelloAccessBag = getAccessTokenSync(bag);

    // Update the current user
    if (!Meteor.userId()) {
      throw new Meteor.Error("logged-out", "The user must be logged in to connect to Trello.");
    }

    Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'trelloToken': trelloAccessBag }} );
    return true;
  },
  trelloGetMe: function() {
    var token = Meteor.users.find( { _id: Meteor.userId() }, { 'trelloToken.oauth_access_token': 1 } );
    var t = new Trello(key, token);
    t.get("/1/members/me", function(err, data) {
      if (err) throw err;
      console.log(data);
      return data
    });
  }
});
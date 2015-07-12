var key = "6af5f1835de662abe13eaeca6258fbcb";
var secret = "21ff9e1258f0bbd6353aaaf10e509ee4235bbe00c7806da1c4496d9f3d36571b";
var loginCallback = "https://clocker-website-udisun.c9.io/trello-callback"

var Trello = Meteor.npmRequire("node-trello");
var trelloOAuth = new Trello.OAuth(key, secret, loginCallback, 'Clocker');

Meteor.methods({
  trelloConnect: function () {
    var getRequestTokenSync = Meteor.wrapAsync(trelloOAuth.getRequestToken, trelloOAuth);

    var requestTokenBag = getRequestTokenSync();
    var urlParts = [requestTokenBag.redirect, 'expiration=never', 'scope=read,account'];
    return urlParts.join('&');
  },
  trelloAccessToken: function() {
// var token = bag.oauth_token;
//   var tokenSecret = bag.oauth_token_secret;
//   var verifier = bag.oauth_verifier;

    var getAccessTokenSync = Meteor.wrapAsync(trelloOAuth.getAccessToken, trelloOAuth);

    var accessToken = getAccessTokenSync();
    console.log(accessToken);

    return accessToken;
  }
});
//var t = new Trello(key);
  // },
  // getMe: function() {
  //   var Trello = Meteor.npmRequire('node-trello');
  //   var t = new Trello('6af5f1835de662abe13eaeca6258fbcb');
  //   t.get("/1/members/me", function(err, data) {
  //     if (err) throw err;
  //     console.log(data);
  //   });
  // }
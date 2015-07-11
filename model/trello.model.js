var Trello = Meteor.npmRequire('node-trello');
var t = new Trello('6af5f1835de662abe13eaeca6258fbcb');

Meteor.methods({
  connect: function () {
    var OAuth = Meteor.npmRequire('oauth');

    var requestURL = "https://trello.com/1/OAuthGetRequestToken";
    var accessURL = "https://trello.com/1/OAuthGetAccessToken";
    var authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
    var appName = "Trello OAuth Example";

    // Trello redirects the user here after authentication
    var loginCallback = "https://clocker-website-udisun.c9.io/cb"

    var key = "6af5f1835de662abe13eaeca6258fbcb";
    var secret = "21ff9e1258f0bbd6353aaaf10e509ee4235bbe00c7806da1c4496d9f3d36571b";

    var oauth = new OAuth.OAuth(requestURL, accessURL, key, secret, "1.0", loginCallback, "HMAC-SHA1");

    return oauth;
  },
  getMe: function() {
    t.get("/1/members/me", function(err, data) {
      if (err) throw err;
      console.log(data);
    });
  }
});
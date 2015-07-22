//console.log(meteor_oauth_pendingCredentials);
var key = Meteor.settings.trelloDevKey;
var secret = Meteor.settings.trelloDevSecret;
var loginCallback = Meteor.settings.public.trelloLoginCallback;

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

    console.log(bag);
    var trelloAccessBag = getAccessTokenSync(bag);

    // Update the current user
    if (!Meteor.userId()) {
      throw new Meteor.Error("logged-out", "The user must be logged in to connect to Trello.");
    }

    Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'trelloToken': trelloAccessBag }} );
    return true;
  },
  trelloGetToken: function() {
    return Meteor.users.find(
      {_id: Meteor.userId() }, 
      { 'trelloToken.oauth_access_token': 1, '_id': 0}
    ).map(
      function(u) { 
        return u.trelloToken.oauth_access_token; 
      }
    )[0];
  },
  trelloGet: function(url, batch) {
    var token = Meteor.call('trelloGetToken');
    var t = new Trello(key, token);

    var getSync = Meteor.wrapAsync(t.get, t);
    return getSync('/1' + (batch ? '/batch?urls=' : '') + url);
  },
  trelloGetMe: function() {
    var data = Meteor.call('trelloGet', '/members/me');
    var orgUrls = data.idOrganizations;
    var organizations = Meteor.call('trelloGetOrganizations', orgUrls);

    // _.each(organizations, function(organization) {
    //   var org = organization[200];
    //   //console.log(Meteor);
    //   //console.log(Mongo);
    //   Mongo.organization.upsert({ 'trello.id': org.id }, {
    //     'name': org.displayName,
    //     'trello.id': org.id,
    //     'trello.name': org.name,
    //     'trello.url': org.url
    //   });
    // });

    return organizations;
  },
  trelloGetOrganizations: function(idOrganizations) {
    var urls = _.map(idOrganizations, function(orgId) { return '/organizations/' + orgId }).join();
    var data = Meteor.call('trelloGet', urls, true);

    console.log(data);
    return data;
  }
});
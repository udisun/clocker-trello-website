//console.log(meteor_oauth_pendingCredentials);
var key = Meteor.settings.trelloDevKey;
var secret = Meteor.settings.trelloDevSecret;
var loginCallback = Meteor.settings.public.trelloLoginCallback;

var OAuth = Package.oauth.OAuth;
var Trello = Meteor.npmRequire('node-trello');
var crypto = Meteor.npmRequire('crypto');
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
  /************************* get user's trello stuff **************************/
  trelloGetMe: function() {
    var data = Meteor.call('trelloGet', '/members/me');
    var orgUrls = data.idOrganizations;
    var organizations = Meteor.call('trelloGetOrganizations', orgUrls);
    Meteor.call('trelloSetOrganizations', organizations);

    var boardsUrls = data.idBoards;
    var boards = Meteor.call('trelloGetBoards', boardsUrls);
    Meteor.call('trelloSetBoards', boards);

    // register a webhook for any user changes
    //Meteor.call('trelloRegisterWebhook', data.id, data.email + ' user webhook');

    return data;
  },
  trelloGetOrganizations: function(idOrganizations) {
    var urls = _.map(idOrganizations, function(orgId) { return '/organizations/' + orgId }).join();
    var data = Meteor.call('trelloGet', urls, true);

    return data;
  },
  trelloGetBoards: function(idBoards) {
    var urls = _.map(idBoards, function(boardId) { return '/boards/' + boardId }).join();
    var data = Meteor.call('trelloGet', urls, true);

    return data;
  },
  /************************ save trello stuff *********************************/
  trelloSetOrganizations: function(organizations) {
    _.each(organizations, function(value, key, list) {
      var org = value[200];

      Organizations.upsert({ "trello.id": org.id }, {
        'name': org.displayName,
        'trello': {
          'id': org.id,
          'name': org.name,
          'url': org.url
        }
      }, { 'validate': false });
    });
  },
  trelloSetBoards: function(boards) {
    _.each(boards, function(value, key, list) {
      var board = value[200];

      Boards.upsert({ "trello.id": board.id }, {
        'trello': {
          'id': board.id,
          'idOrganization': board.idOrganization,
          'name': board.name,
          'url': board.url
        }
      }, { 'validate': false });
    });
  },
  /************************* webhooks registration ****************************/
  didTrelloWebhookValidate: function(request) {
    var secret = Meteor.settings.trelloDevSecret;
    var callbackURL = Meteor.settings.public.trelloWebhookCallback;

    // Double-HMAC to blind any timing channel attacks
    // https://www.isecpartners.com/blog/2011/february/double-hmac-verification.asp
    var base64Digest = function (s) {
      return crypto.createHmac('sha1', secret).update(s).digest('base64');
    }
    var content = request.body + callbackURL;
    var doubleHash = base64Digest(base64Digest(content));
    var headerHash = base64Digest(request.headers['x-trello-webhook']);
    return doubleHash == headerHash;
  },
  trelloRegisterWebhook: function(modelId, description) {
    var token = Meteor.call('trelloGetToken');

    HTTP.post('https://trello.com/1/tokens/' + token + '/webhooks/?key=' + key, {
      data: {
        description: description,
        callbackURL: Meteor.settings.public.trelloWebhookCallback,
        idModel: modelId,
      }}
    );
  }
});

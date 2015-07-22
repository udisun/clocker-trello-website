Meteor.startup(function() {
  Accounts.loginServiceConfiguration.remove({
    service: "trello"
  });

  Accounts.loginServiceConfiguration.insert({
    "service"       : "trello",
    "consumerKey"   : Meteor.settings.trelloDevKey,
    "secret"        : Meteor.settings.trelloDevSecret,
    "name"          : "Clocker",
    "scope"         : "read,account",
    "expiration"    : "never",
    "loginStyle": "redirect"
  });
});
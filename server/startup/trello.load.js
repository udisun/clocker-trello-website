Meteor.startup(function() {
  Accounts.loginServiceConfiguration.remove({
    service: "trello"
  });

  Accounts.loginServiceConfiguration.insert({
    "service"       : "trello",
    "consumerKey"   : "6af5f1835de662abe13eaeca6258fbcb",
    "secret"        : "21ff9e1258f0bbd6353aaaf10e509ee4235bbe00c7806da1c4496d9f3d36571b",
    "name"          : "Clocker",
    "scope"         : "read,account",
    "expiration"    : "never"
  });
});
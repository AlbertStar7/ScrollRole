var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// Set the global variables
window.$ = $;
window._ = _;
window.Backbone = Backbone;

var AppView = require('./view/appView');
var RulesConfigModel = require('./model/rulesConfigModel');

(function() {
    // Render the app view to the page
    var appView = new AppView();
    $('.page-wrapper').html(appView.render().$el);

    // Start the router after the setup
    RulesConfigModel.setup().always(_.bind(Backbone.history.start, Backbone.history));
})();
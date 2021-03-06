var templates = require('./builderView.html');

var BuilderView = Backbone.View.extend({
    className: 'builder-view',

    render: function() {
        var html = templates.builderView();
        this.$el.html(html);

        return this;
    }
});

module.exports = BuilderView;
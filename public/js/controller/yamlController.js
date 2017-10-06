var yaml = require('js-yaml');

var AppStateModel = require('../model/appStateModel');
var ModelParser = require('./modelParser');

var YamlController = {
    setupConfig: function() {
        var deferred = $.Deferred();
        var remaining = 5;

        function updateCount() {
            remaining--;
            if (remaining == 0) {
                deferred.resolve();
                console.log(AppStateModel.getRulesConfig());
            }
        }
        setupBackgrounds()
            .done(_.bind(AppStateModel.updateRulesConfig, AppStateModel))
            .always(updateCount);
        setupClasses()
            .done(_.bind(AppStateModel.updateRulesConfig, AppStateModel))
            .always(updateCount);
        setupLists()
            .done(_.bind(AppStateModel.updateRulesConfig, AppStateModel))
            .always(updateCount);
        setupObjects()
            .done(_.bind(AppStateModel.updateRulesConfig, AppStateModel))
            .always(updateCount);
        setupRaces()
            .done(_.bind(AppStateModel.updateRulesConfig, AppStateModel))
            .always(updateCount);

        return deferred.promise();
    },

    parseYaml: function(text) {
        var deferred = $.Deferred();
        try {
            var json = yaml.safeLoad(text);
            deferred.resolve(json);
        } catch(e) {
            deferred.reject(e);
        }
        return deferred.promise();
    },

    parseYamlFromServer: function(text) {
        var deferred = $.Deferred();
        var data = {text: text};
        $.ajax({
            type: 'POST',
            url: '/api/yaml/parse',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(resp) {
                resp = _.isArray(resp) ? resp[0] : resp;
                deferred.resolve(resp);
            },
            error: function(e) {
                deferred.reject(e);
            }
        });
        return deferred.promise();
    }
};

function setupBackgrounds() {
    return loadAndParse('/resources/backgrounds.yaml')
        .then(_.bind(ModelParser.parseBackgrounds, ModelParser));
}

function setupClasses() {
    return loadAndParse('/resources/classes.yaml')
        .then(_.bind(ModelParser.parseClasses, ModelParser));
}

function setupLists() {
    return loadAndParse('/resources/lists.yaml');
}

function setupObjects() {
    return loadAndParse('/resources/objects.yaml');
}

function setupRaces() {
    return loadAndParse('/resources/races.yaml')
        .then(_.bind(ModelParser.parseRaces, ModelParser));
}

function loadAndParse(pathToFile) {
    var deferred = $.Deferred();
    $.get(pathToFile)
        .done(function(text) {
            YamlController.parseYaml(text).done(deferred.resolve).fail(deferred.reject);
        })
        .fail(function() {
            deferred.reject();
        });
    return deferred.promise();
}

module.exports = YamlController;
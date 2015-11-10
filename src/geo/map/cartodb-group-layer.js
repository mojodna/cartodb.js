var $ = require('jquery');
var Backbone = require('backbone');
var MapLayer = require('./map-layer');
var Layers = require('./layers');
var util = require('cdb/core/util');

var CartoDBGroupLayer = MapLayer.extend({

  defaults: {
    visible: true,
    type: 'layergroup'
  },

  initialize: function(attributes, options) {
    this.layers = new Backbone.Collection(options.layers);
  },

  isEqual: function() {
    return false;
  },

  getVisibleLayers: function() {
    return this.layers.filter(function(layer) {
      return layer.get('visible');
    });
  },

  getTileJSONFromTiles: function(layerIndex) {
    if (!this.get('urls')) {
      throw 'URLS not fetched yet';
    }

    // Layergroup
    var urls = this.get('urls');


    var index = this._getIndexOfVisibleLayer(layerIndex);

    // TODO: layerIndex should take into account the hidden layers.
    // For example, for a layergroup, if the layerIndex is 1 but layer 0 is hidden, this method should
    // use urls.grids[0]
    return {
      tilejson: '2.0.0',
      scheme: 'xyz',
      grids: urls.grids[index],
      tiles: urls.tiles,
      formatter: function(options, data) { return data; }
    };
  },

  // Returns the position of a visible layer in relation to all layers when the map is 
  // an "Anonymous Map". For example, if there are two CartoDB layers and layer #0 is
  // hidden, this method would return -1 for #0 and 0 for layer #1.
  _getIndexOfVisibleLayer: function(layerIndex) {
    if (this.get('namedMap') === true) {
      return layerIndex;
    } else {
      var layers = {};
      var i = 0;
      this.layers.each(function(layer, index) {
        if(layer.isVisible()) {
          layers[index] = i;
          i++;
        }
      });
      var index = layers[layerIndex];
      if (index === undefined) {
        index = -1;
      }

      return index;
    }
  },

  fetchAttributes: function(layer, featureID, callback) {
    var index = this._getIndexOfVisibleLayer(layer);
    var url = [
      this.get('baseURL'),
      index,
      'attributes',
      featureID
    ].join('/');

    $.ajax({
      dataType: 'jsonp',
      url: url,
      jsonpCallback: '_cdbi_layer_attributes_' + util.uniqueCallbackName(this.toJSON()),
      cache: true,
      success: function(data) {
        // loadingTime.end();
        callback(data);
      },
      error: function(data) {
        // loadingTime.end();
        // cartodb.core.Profiler.metric('cartodb-js.named_map.attributes.error').inc();
        callback(null);
      }
    });
  }
});

module.exports = CartoDBGroupLayer;

/**
 * @license
 * File: sigplot.plugin.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed to the LGS Innovations (LGS) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  LGS licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* global module */
/* global require */
/* global console */
/* global Class */
(function() {
    var common = require("./common");
    var jsface = require("jsface");
    var _ = require("lodash");
    
    var SigplotPlugin = jsface.Class({
        $const: {
          DEFAULTS: {
            refreshOnOptionChange: true
          }
        },
        constructor: function(options, extensionDefaults) {
	    this._events = {};
            this.options = _.defaultsDeep(options, extensionDefaults, SigplotPlugin.DEFAULTS); 
        },
        onAdd: function() {
            console.log("Abstract onAdd Method what to do when added to plot");
        },
        onRemove: function() {
            console.log("Abstract onRemove Method what to do when removed from plot");
        },
        refresh: function(canvas) {
            console.log("Abstract refresh Method what to do when asked to be redrawn");
        },
        despose: function() {
            console.log("Abstract destructor Method");
        },
        menu: function(){
            console.log("Abstract menu Method need to return either an mx.menu compatible object or a function that returns one");
        },
        /**
         * emit an event from this plugin
         */
	emit: function(type, data) {
	    var event = Object.assign({}, data, {
		type: type,
		target: this
	    });
	    if (this._events) {
		var listeners = this._events[type];
		if (listeners) {
		    for (var i = 0, len = listeners.length; i < len; i++) {
			var l = listeners[i];
			l.cb.call(l.ctx || this, event);
		    }
		}
	    }
	    return this;
	},
        /**
         * bind a function to an event
         */
        on: function(type, fn, context) {
	    if (!this._events) {
		this._events = {};
	    }
	    if (!this._events[type]) {
		this._events[type] = [];
	    }
	    if (context === this) {
		// Less memory footprint.
		context = undefined;
	    }
	    this._events[type].push({
		cb: fn,
		ctx: context
	    });
	},
        /**
         * unbind a function from an event
         */
	off: function(type, fn, context) {
	    var listeners,
		i,
		len;
	    if (!type) {
		// clear all listeners if called without arguments
		delete this._events;
	    }
	    if (!this._events) {
		return;
	    }
	    listeners = this._events[type];
	    if (!listeners) {
		return;
	    }
	    if (context === this) {
		context = undefined;
	    }
	    if (listeners) {
		// find fn and remove it
		for (i = 0, len = listeners.length; i < len; i++) {
		    var l = listeners[i];
		    if (l.ctx !== context) {
			continue;
		    }
		    if (l.fn === fn) {
			listeners.splice(i, 1);
			return;
		    }
		}
	    }
	    return this;
	},
        setPlot: function(plot) {
            // the plugin has been removed from it's current plot
            if (this.plot && this.plot !== plot) {
                this.onRemove(); 
                this.plot = null;
            }

            // Now set the current plot, if defined
            if (plot) {
              this.plot = plot;
              this.onAdd(plot);
            }
        },
        addTo: function(plot) {
            plot.add_plugin(this);
        },
        setOptions: function(options) {
            _.merge(this.options, options);
            if(this.options.refreshOnOptionChange && this.plot){
                this.plot.refresh();
            }
        },
        $static: {
          extend: function(Extension) {
            var _Plugin = jsface.Class(SigplotPlugin, Extension);
            return _Plugin;
          }
        }
    });
    module.exports = SigplotPlugin;
}());

/**
 * @license
 * File: sigplot.layerSDS.js
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
 * under the License
 */

/* global module */
/* global require */

(function() {

    var m = require("./m");
    var mx = require("./mx");

    /**
     * @constructor
     * @param plot
     */
    var LayerSDS = function(plot) {
        this.plot = plot;

        this.offset = 0.0;
        this.xstart = 0.0;
        this.xdelta = 0.0;
        this.ystart = 0.0;
        this.ydelta = 0.0;
        this.imin = 0;
        this.xmin = 0.0;
        this.xmax = 0.0;
        this.name = "";
        this.cx = false;
        this.hcb = undefined; // index in Gx.HCB

        this.display = true;
        this.color = 0;
        this.line = 3; // 0=none, 1-vertical, 2-horizontal, 3-connecting
        this.thick = 1; // negative for dashed
        this.symbol = 0;
        this.radius = 3;

        this.skip = 0; // number of elements between ord values
        this.xsub = 0;
        this.ysub = 0;
        this.xdata = false; // true if X data is data from file
        this.modified = false;

        this.preferred_origin = 4; // TODO Raster is normally 4
        this.opacity = 1;
        this.xcompression = plot._Gx.xcompression; // default is Gx.xcompression

        // LPB is kinda odd right now, since we read the entire file into memory anyways...
        // given that often we are loading from an HREF so there is no downside to this...
        // however, we keep LPB around (for now) so that the scaling behaves identical to
        // the original code
        this.lpb = undefined;

        this.yc = 1; // y-compression factor...not yet used

        this.options = {};
    };

    LayerSDS.prototype = {

        /**
         * Initializes the layer to display the provided data.
         *
         * @param hcb
         *            {BlueHeader} an opened BlueHeader file
         * @param lyrn
         *          the index of the added layer
         *
         * @memberOf LayerSDS
         * @private
         */
        init: function(hcb) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            // Get Header Params from URL 

            this.hcb = hcb;
            this.hcb.buf_type = "D";

            this.lps = this.hcb.lps || Math.ceil(hcb.size);

            this.cache = {};

            if (Gx.index) {
                this.xstart = 1.0;
                this.xdelta = 1.0;
                this.xmin = 1.0;
                this.xmax = hcb.subsize;
                this.ystart = 1.0;
                this.ydelta = 1.0;
                this.ymin = 1.0;
                this.ymax = this.size;
            } else {
                this.xstart = hcb.xstart;
                this.xdelta = hcb.xdelta;
                var d = hcb.xstart + (hcb.xdelta * hcb.subsize);
                this.xmin = this.hcb.xmin || Math.min(hcb.xstart, d);
                this.xmax = this.hcb.xmax || Math.max(hcb.xstart, d);
                this.ystart = hcb.ystart;
                this.ydelta = hcb.ydelta;
                var d = hcb.ystart + (hcb.ydelta * this.lps);
                this.ymin = this.hcb.ymin || Math.min(hcb.ystart, d);
                this.ymax = this.hcb.ymax || Math.max(hcb.ystart, d);
            }
        },

        get_data: function() {
           
        },

        /**
         * Provisional API
         *
         * @private
         * @param x
         * @param y
         */
        get_z: function(x, y) {
           
        },

        change_settings: function(settings) {
            var Gx = this.plot._Gx;
            if (settings.debugCanvas) {
                this.debugCanvas = settings.debugCanvas;
            }
            
            if (settings.cmode !== undefined) {
                this.img = undefined;
                if (((Gx.autoz & 1) !== 0)) {
                    Gx.zmin = undefined;
                }
                if (((Gx.autoz & 2) !== 0)) {
                    Gx.zmax = undefined;
                }
            }

            if (settings.xcmp !== undefined) {
                if (settings.xcmp === "smooth") {
                    this.xcompression = 0;
                } else if (settings.xcmp === "avg") {
                    this.xcompression = 1;
                } else if (settings.xcmp === "min") {
                    this.xcompression = 2;
                } else if (settings.xcmp === "max") {
                    this.xcompression = 3;
                } else if (settings.xcmp === "first") {
                    this.xcompression = 4;
                } else if (settings.xcmp === "maxabs") {
                    this.xcompression = 5;
                } else {
                    this.xcompression = settings.xcmp;
                }
            }
        },

        reload: function(data, hdrmod) {
            
        },

        prep: function(xmin, xmax) {
            var Gx = this.plot._Gx;
            var Mx = this.plot._Mx;

            var qmin = this.xmin;
            var qmax = this.xmax;

            if (Gx.panxmin > Gx.panxmax) {
                Gx.panxmin = qmin;
                Gx.panxmax = qmax;
            } else {
                Gx.panxmin = Math.min(Gx.panxmin, qmin);
                Gx.panxmax = Math.max(Gx.panxmax, qmax);
            }

            if (Gx.panymin > Gx.panymax) {
                Gx.panymin = this.ymin;
                Gx.panymax = this.ymax;
            } else {
                Gx.panymin = Math.min(Gx.panymin, this.ymin);
                Gx.panymax = Math.max(Gx.panymax, this.ymax);
            }

            return this.lps;
        },

        draw: function() {
            var Mx = this.plot._Mx;
            var Gx = this.plot._Gx;
            var HCB = this.hcb;

            var xmin = Math.max(this.xmin, Mx.stk[Mx.level].xmin);
            var xmax = Math.min(this.xmax, Mx.stk[Mx.level].xmax);
            if (xmin >= xmax) { // no data but do scaling
                Gx.panxmin = Math.min(Gx.panxmin, this.xmin);
                Gx.panxmax = Math.max(Gx.panxmax, this.xmax);
                return;
            }
            var ymin = Math.max(this.ymin, Mx.stk[Mx.level].ymin);
            var ymax = Math.min(this.ymax, Mx.stk[Mx.level].ymax);

            // Figure out width/height based on the real-world coordinates
            var w = Math.abs(xmax - xmin) + 1;
            var h = Math.abs(ymax - ymin) + 1;

            // Convert w/h to elements
            w = Math.floor(w / HCB.xdelta);
            h = Math.floor(h / HCB.ydelta);

            // Make sure w/h remain within limits
            w = Math.min(w, HCB.subsize);
            h = Math.min(h, HCB.size);

            // figure out the upper-left and lower-right pixel coordinates
            var ul = mx.real_to_pixel(Mx, xmin, ymin);
            var lr = mx.real_to_pixel(Mx, xmax, ymax);

            // Figure out the pixel width and height
            var iw = Math.abs(lr.x - ul.x);
            var ih = Math.abs(lr.y - ul.y);

            // Determine the pixel to real unit ratio
            var rx = iw / w;
            var ry = ih / h;

            // TODO
            Gx.xe = Math.max(1, Math.round(rx));
            Gx.ye = Math.max(1, Math.round(ry));

            var oReq = new XMLHttpRequest();

            var url = this.hcb.url + 
                "?mode=rds" +
                "&x1=" + Math.floor((xmin -HCB.xstart)/ HCB.xdelta) +
                "&y1=" + Math.ceil((ymin - HCB.ystart)/ HCB.ydelta) +
                "&x2=" + (Math.floor((xmax - HCB.xstart) / HCB.xdelta) -1) +
                "&y2=" + (Math.ceil((ymax - HCB.ystart) / HCB.ydelta) -1) +
                "&outxsize=" + iw +
                "&outysize=" + ih +
                "&outfmt=RGBA" +
                "&colormap=RampColormap";

            if (Gx.zmin !== undefined) {
                url = url+"&zmin=" + Gx.zmin;
            }
            if (Gx.zmax !== undefined) {
                url = url+"&zmax=" + Gx.zmax;
            }

            if (Gx.cmode !== undefined) {
                var cxm = ["Ma", "Ph", "Re", "Im", "IR", "Lo", "L2"];
                url = url+"&cxmode=" + cxm[Gx.cmode-1];
            }
            
            if (this.xcompression !== undefined) {
                var xcmp = ["first", "mean", "min", "max", "first", "absmax"];
                url = url + "&transform=" + xcmp[this.xcompression];
            }


            var img = this.cache[url];
            if (img) {
                mx.draw_image(Mx,
                    img,
                    xmin, // xmin
                    ymin, // ymin
                    xmax, // xmax
                    ymax, // ymax
                    1.0,
                    false,
                    true
                );
            } else {
                oReq.open("GET", url, true);
                oReq.responseType = "arraybuffer";
                oReq.overrideMimeType('text\/plain; charset=x-user-defined');
    
                var that = this;
                oReq.onload = function(oEvent) {
                    if (oReq.readyState === 4) {
                        if ((oReq.status === 200) || (oReq.status === 0)) { // status = 0 is necessary for file URL
                            var zmin = oReq.getResponseHeader("Zmin");
                            var zmax = oReq.getResponseHeader("Zmax");
                            
                            if ((Mx.level === 0) && (Gx.zmin === undefined)) {
                                if (((Gx.autoz & 1) !== 0)) {
                                    Gx.zmin = zmin;
                                }
                            }
                            if ((Mx.level === 0) && (Gx.zmax === undefined)) {
                                if (((Gx.autoz & 2) !== 0)) {
                                    Gx.zmax = zmax;
                                }
                            }
                            var arrayBuffer = null; // Note: not oReq.responseText
                            if (oReq.response) {
                                arrayBuffer = oReq.response;
                            }
    
                            //let imgd = new Uint8ClampedArray(arrayBuffer);
                            arrayBuffer.width = iw;
                            arrayBuffer.height = ih;
                            that.cache[url] = arrayBuffer;
                            mx.draw_image(Mx,
                                arrayBuffer,
                                xmin, // xmin
                                ymin, // ymin
                                xmax, // xmax
                                ymax, // ymax
                                1.0,
                                false,
                                true
                            );
                            return;
                        }
                    }
                };
                oReq.onerror = function(oEvent) {
                };
                oReq.send(null);

            }


        }
    };

    /**
     * Factory to overlay the given file onto the given plot.
     *
     * @private
     */
    LayerSDS.overlay = function(plot, hcb, layerOptions) {
        var Gx = plot._Gx;
        var Mx = plot._Mx;

        hcb.buf_type = "D";

        var layer = new LayerSDS(plot);
        layer.init(hcb);

        if (hcb.file_name) {
            layer.name = m.trim_name(hcb.file_name);
        } else {
            layer.name = "layer_" + Gx.lyr.length;
        }

        layer.change_settings(layerOptions);

        var layers = [];
        if (plot.add_layer(layer)) {
            layers.push(layer);
        }

        return layers;
    };

    module.exports = LayerSDS;

}());

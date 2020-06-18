/**
 * @license
 * File: tests.js
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

/* globals QUnit, sigplot, ColorMap, sigplot_plugins, assert, assert.strictEqual, QUnit.asyncTest, assert.notEqual, alert, BlueFileReader, start, ok, throws */

//////////////////////////////////////////////////////////////////////////////
// QUnit 'bluefile' module
//////////////////////////////////////////////////////////////////////////////
QUnit.module('bluefile', {
    setup: function() {},
    teardown: function() {}
});
QUnit.test('int data', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/ramp.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        assert.equal(hdr.buf.byteLength, 2560, "buf correct size");
        //assert.equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        assert.equal(hdr.dview.length, 1024, "dview correct size");
        assert.strictEqual(hdr.file_name, "ramp.tmp", "correct file name");
        assert.strictEqual(hdr.version, "BLUE", "correct version");
        assert.strictEqual(hdr.headrep, "EEEI", "correct header rep");
        assert.strictEqual(hdr.datarep, "EEEI", "correct data rep");
        assert.strictEqual(hdr.timecode, 0, "correct timecode");
        assert.strictEqual(hdr.type, 1000, "correct type");
        assert.strictEqual(hdr["class"], 1, "correct class");
        assert.strictEqual(hdr.format, "SI", "correct format");
        assert.strictEqual(hdr.spa, 1, "correct spa");
        assert.strictEqual(hdr.bps, 2, "correct bps");
        assert.strictEqual(hdr.bpa, 2, "correct bpa");
        assert.strictEqual(hdr.ape, 1, "correct ape");
        assert.strictEqual(hdr.bpe, 2, "correct bpe");
        assert.strictEqual(hdr.size, 1024, "correct size");
        assert.strictEqual(hdr.xstart, 0.0, "correct xstart");
        assert.strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        assert.strictEqual(hdr.xunits, 1, "correct xunits");
        assert.strictEqual(hdr.subsize, 1, "correct subsize");
        assert.equal(hdr.ystart, undefined);
        assert.equal(hdr.yelta, undefined);
        assert.equal(hdr.yunits, 0);
        assert.strictEqual(hdr.data_start, 512.0, "correct data_start");
        assert.strictEqual(hdr.data_size, 2048, "correct data_size");
        assert.equal(hdr.dview[0], 0);
        assert.equal(hdr.dview[1], 1);
        assert.equal(hdr.dview[2], 2);
        assert.equal(hdr.dview[1021], 1021);
        assert.equal(hdr.dview[1022], 1022);
        assert.equal(hdr.dview[1023], 1023);
        done();
    });
});
QUnit.test('Ascii Keywords', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/lots_of_keywords.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var i = 1;
        var strpad = "";
        while (i <= 100) {
            if (i <= 100) {
                strpad = "                                ";
            }
            if (i <= 30) {
                strpad = "                ";
            }
            if (i <= 20) {
                strpad = "";
            }
            var str = "" + i;
            var keypad = "000";
            var ans = keypad.substring(0, keypad.length - str.length) + str;
            var key = "KEYWORD_" + ans;
            var value = "[value___" + ans + strpad + "]";
            if ((i > 50) && (i <= 100)) {
                value += " ";
            }
            assert.equal(
                hdr.ext_header[key],
                value,
                key + " = " + hdr.ext_header[key]
            );
            i++;
        }
        done();
    });
});
QUnit.test('All Keywords as JSON (default)', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader(); //defaults are to use dict
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            assert.equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        done();
    });
});
QUnit.test('All Keywords as JSON (json)', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "json"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            assert.equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        done();
    });
});
QUnit.test('All Keywords as JSON (dict)', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "dict"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            assert.equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        done();
    });
});
QUnit.test('All Keywords as JSON ({})', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: {}
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = {
            B_TEST: 123,
            I_TEST: 1337,
            L_TEST: 113355,
            X_TEST: 987654321,
            F_TEST: 0.12345000356435776,
            D_TEST: 9.87654321,
            O_TEST: 255,
            STRING_TEST: "Hello World",
            B_TEST2: 99,
            STRING_TEST2: "Goodbye World"
        };
        for (var prop in keywords) {
            assert.equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        done();
    });
});
QUnit.test('All Keywords as Array (list)', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader({
        ext_header_type: "list"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = [{
            "tag": "B_TEST",
            "value": 123
        }, {
            "tag": "I_TEST",
            "value": 1337
        }, {
            "tag": "L_TEST",
            "value": 113355
        }, {
            "tag": "X_TEST",
            "value": 987654321
        }, {
            "tag": "F_TEST",
            "value": 0.12345000356435776
        }, {
            "tag": "D_TEST",
            "value": 9.87654321
        }, {
            "tag": "O_TEST",
            "value": 255
        }, {
            "tag": "STRING_TEST",
            "value": "Hello World"
        }, {
            "tag": "B_TEST2",
            "value": 99
        }, {
            "tag": "STRING_TEST2",
            "value": "Goodbye World"
        }];
        for (var i = 0; i < keywords.length; i++) {
            assert.equal(hdr.ext_header[i].tag, keywords[i].tag, "Keyword " + i + " tag " + hdr.ext_header[i].tag + " = " + keywords[i].tag);
            assert.equal(hdr.ext_header[i].value, keywords[i].value, "Keyword " + i + " value " + hdr.ext_header[i].value + " = " + keywords[i].value);
        }
        done();
    });
});
QUnit.test('double data', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/sin.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        assert.equal(hdr.buf.byteLength, 33280, "buf correct size");
        //assert.equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        assert.equal(hdr.dview.length, 4096, "dview correct size");
        assert.strictEqual(hdr.file_name, "sin.tmp", "correct file name");
        assert.strictEqual(hdr.version, "BLUE", "correct version");
        assert.strictEqual(hdr.headrep, "EEEI", "correct header rep");
        assert.strictEqual(hdr.datarep, "EEEI", "correct data rep");
        assert.strictEqual(hdr.timecode, 0, "correct timecode");
        assert.strictEqual(hdr.type, 1000, "correct type");
        assert.strictEqual(hdr["class"], 1, "correct class");
        assert.strictEqual(hdr.format, "SD", "correct format");
        assert.strictEqual(hdr.spa, 1, "correct spa");
        assert.strictEqual(hdr.bps, 8, "correct bps");
        assert.strictEqual(hdr.bpa, 8, "correct bpa");
        assert.strictEqual(hdr.ape, 1, "correct ape");
        assert.strictEqual(hdr.bpe, 8, "correct bpe");
        assert.strictEqual(hdr.size, 4096, "correct size");
        assert.strictEqual(hdr.xstart, 0.0, "correct xstart");
        assert.strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        assert.strictEqual(hdr.xunits, 0, "correct xunits");
        assert.strictEqual(hdr.subsize, 1, "correct subsize");
        assert.equal(hdr.ystart, undefined);
        assert.equal(hdr.yelta, undefined);
        assert.equal(hdr.yunits, 0);
        assert.strictEqual(hdr.data_start, 512.0, "correct data_start");
        assert.strictEqual(hdr.data_size, 32768, "correct data_size");
        assert.equal(hdr.dview[0], 1);
        assert.equal(hdr.dview[1], 0.9980267284282716);
        assert.equal(hdr.dview[2], 0.9921147013144778);
        assert.equal(hdr.dview[4093], 0.9048270524660175);
        assert.equal(hdr.dview[4094], 0.9297764858882493);
        assert.equal(hdr.dview[4095], 0.9510565162951516);
        done();
    });
});
QUnit.test('complex float data', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/pulse_cx.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        assert.equal(hdr.buf.byteLength, 131584, "buf correct size");
        //assert.equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        assert.equal(hdr.dview.length, 400, "dview correct size");
        assert.strictEqual(hdr.file_name, "pulse_cx.tmp", "correct file name");
        assert.strictEqual(hdr.version, "BLUE", "correct version");
        assert.strictEqual(hdr.headrep, "EEEI", "correct header rep");
        assert.strictEqual(hdr.datarep, "EEEI", "correct data rep");
        assert.strictEqual(hdr.timecode, 0, "correct timecode");
        assert.strictEqual(hdr.type, 1000, "correct type");
        assert.strictEqual(hdr["class"], 1, "correct class");
        assert.strictEqual(hdr.format, "CF", "correct format");
        assert.strictEqual(hdr.spa, 2, "correct spa");
        assert.strictEqual(hdr.bps, 4, "correct bps");
        assert.strictEqual(hdr.bpa, 8, "correct bpa");
        assert.strictEqual(hdr.ape, 1, "correct ape");
        assert.strictEqual(hdr.bpe, 8, "correct bpe");
        assert.strictEqual(hdr.size, 200, "correct size");
        assert.strictEqual(hdr.xstart, 0.0, "correct xstart");
        assert.strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        assert.strictEqual(hdr.xunits, 1, "correct xunits");
        assert.strictEqual(hdr.subsize, 1, "correct subsize");
        assert.equal(hdr.ystart, undefined);
        assert.equal(hdr.yelta, undefined);
        assert.equal(hdr.yunits, 0);
        assert.strictEqual(hdr.data_start, 512.0, "correct data_start");
        assert.strictEqual(hdr.data_size, 1600, "correct data_size");
        done();
    });
});
QUnit.test('scalar packed', function(assert) {
    var done = assert.async();

    var bfr = new sigplot.bluefile.BlueFileReader();
    bfr.read_http("dat/scalarpacked.tmp", function(hdr) {
        //assert.equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        assert.equal(hdr.buf.byteLength, 1024, "buf correct size");
        //assert.equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        assert.equal(hdr.dview.length, 1024, "dview correct size");
        assert.strictEqual(hdr.file_name, "scalarpacked.tmp", "correct file name");
        assert.strictEqual(hdr.version, "BLUE", "correct version");
        assert.strictEqual(hdr.headrep, "EEEI", "correct header rep");
        assert.strictEqual(hdr.datarep, "EEEI", "correct data rep");
        assert.strictEqual(hdr.timecode, 0, "correct timecode");
        assert.strictEqual(hdr.type, 1000, "correct type");
        assert.strictEqual(hdr["class"], 1, "correct class");
        assert.strictEqual(hdr.format, "SP", "correct format");
        assert.strictEqual(hdr.spa, 1, "correct spa");
        assert.strictEqual(hdr.bps, 0.125, "correct bps");
        assert.strictEqual(hdr.bpa, 0.125, "correct bpa");
        assert.strictEqual(hdr.ape, 1, "correct ape");
        assert.strictEqual(hdr.bpe, 0.125, "correct bpe");
        assert.strictEqual(hdr.size, 1024, "correct size");
        assert.strictEqual(hdr.xstart, 0.0, "correct xstart");
        assert.strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        assert.strictEqual(hdr.xunits, 1, "correct xunits");
        assert.strictEqual(hdr.subsize, 1, "correct subsize");
        assert.equal(hdr.ystart, undefined);
        assert.equal(hdr.yelta, undefined);
        assert.equal(hdr.yunits, 0);
        assert.strictEqual(hdr.data_start, 512.0, "correct data_start");
        assert.strictEqual(hdr.data_size, 128, "correct data_size");
        assert.equal(hdr.dview.getBit(0), 1);
        assert.equal(hdr.dview.getBit(1), 1);
        assert.equal(hdr.dview.getBit(2), 0);
        assert.equal(hdr.dview.getBit(3), 0);
        assert.equal(hdr.dview.getBit(4), 0);
        assert.equal(hdr.dview.getBit(5), 1);
        assert.equal(hdr.dview.getBit(6), 1);
        assert.equal(hdr.dview.getBit(7), 1);
        done();
    });
});
QUnit.test('create type1000', function(assert) {
    //var hcb = sigplot.m.initialize([1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0], {file_name :"newFile"});
    var rdbuf = new ArrayBuffer(64);
    var rdview = new Float32Array(rdbuf);
    var hcb = sigplot.m.initialize(rdview, {
        file_name: "newFile"
    });
    assert.notEqual(hcb.pipe, true); //#1
    assert.equal(hcb.file_name, "newFile"); //#2
    assert.equal(hcb.format, "SF"); //#3
    assert.equal(hcb.type, 1000); //#4
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4); //#5
    assert.equal(hcb.dview.length, 16); //#6
    hcb.dview = [1, 2, 3];
    //sigplot.m.filad(hcb, rdview);
    //assert.equal(hcb.data_free, 0);              //#7
    assert.equal(hcb.dview[0], 1.0); //#8
    assert.equal(hcb.dview[1], 2.0); //#8
    assert.equal(hcb.dview[2], 3.0); //#8
});
QUnit.test('create type1000 array', function(assert) {
    var data = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 0,
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 0
    ];
    var hcb = sigplot.m.initialize(data);
    assert.notEqual(hcb.pipe, true);
    assert.equal(hcb.format, "SF");
    assert.equal(hcb.type, 1000);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.equal(hcb.dview.length, 20);
    assert.equal(hcb.dview[0], 1);
    assert.equal(hcb.dview[4], 5);
    assert.equal(hcb.dview[5], 6);
    assert.equal(hcb.dview[9], 0);
    assert.equal(hcb.dview[10], 1);
    assert.equal(hcb.dview[14], 5);
    assert.equal(hcb.dview[15], 6);
    assert.equal(hcb.dview[19], 0);
});
QUnit.test('create type2000 array', function(assert) {
    var data = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 0],
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 0]
    ];
    var hcb = sigplot.m.initialize(data);
    assert.notEqual(hcb.pipe, true);
    assert.equal(hcb.format, "SF");
    assert.equal(hcb.type, 2000);
    assert.equal(hcb.subsize, 5);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.equal(hcb.dview.length, 20);
    assert.equal(hcb.dview[0], 1);
    assert.equal(hcb.dview[4], 5);
    assert.equal(hcb.dview[5], 6);
    assert.equal(hcb.dview[9], 0);
    assert.equal(hcb.dview[10], 1);
    assert.equal(hcb.dview[14], 5);
    assert.equal(hcb.dview[15], 6);
    assert.equal(hcb.dview[19], 0);
});
QUnit.test('bluefile pipe basics', function(assert) {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        pipesize: 16
    });
    assert.equal(hcb.pipe, true);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.format, "SF");
    assert.equal(hcb.type, 1000);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.notEqual(hcb.buf, undefined);
    assert.notEqual(hcb.dview, undefined);
    assert.equal(hcb.buf.byteLength, 16);
    var rdbuf = new ArrayBuffer(8);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [1.0, 2.0]);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.data_free, 2);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 2);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 1.0);
    assert.equal(rdview[1], 2.0);
    assert.equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [3.0, 4.0]);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.data_free, 2);
    sigplot.m.filad(hcb, [5.0, 6.0]);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.dview[0], 5.0);
    assert.equal(hcb.dview[1], 6.0);
    assert.equal(hcb.data_free, 0);
    rdbuf = new ArrayBuffer(16);
    rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 4);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 3.0);
    assert.equal(rdview[1], 4.0);
    assert.equal(rdview[2], 5.0);
    assert.equal(rdview[3], 6.0);
    assert.equal(hcb.data_free, 4);
    sigplot.m.filad(hcb, [7.0, 8.0, 9.0, 10.0]);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.dview[0], 9.0);
    assert.equal(hcb.dview[1], 10.0);
    assert.equal(hcb.dview[2], 7.0);
    assert.equal(hcb.dview[3], 8.0);
    assert.throws(function() {
        sigplot.m.filad(hcb, [11.0, 12.0]);
    }, "pipe full");
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 4);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 7.0);
    assert.equal(rdview[1], 8.0);
    assert.equal(rdview[2], 9.0);
    assert.equal(rdview[3], 10.0);
    assert.equal(hcb.data_free, 4);
});
QUnit.test('bluefile pipe basics (typed array)', function(assert) {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        pipesize: 16
    });
    assert.equal(hcb.pipe, true);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.format, "SF");
    assert.equal(hcb.type, 1000);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.notEqual(hcb.buf, undefined);
    assert.notEqual(hcb.dview, undefined);
    assert.equal(hcb.buf.byteLength, 16);
    var rdbuf = new ArrayBuffer(8);
    var rdview = new Float32Array(rdbuf);
    var wrbuf = new ArrayBuffer(8);
    var wrview = new Float32Array(wrbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 4);
    wrview[0] = 1.0;
    wrview[1] = 2.0;
    sigplot.m.filad(hcb, wrview);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.data_free, 2);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 2);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 1.0);
    assert.equal(rdview[1], 2.0);
    assert.equal(hcb.data_free, 4);
    wrview[0] = 3.0;
    wrview[1] = 4.0;
    sigplot.m.filad(hcb, wrview);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.data_free, 2);
    wrview[0] = 5.0;
    wrview[1] = 6.0;
    sigplot.m.filad(hcb, wrview);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.dview[0], 5.0);
    assert.equal(hcb.dview[1], 6.0);
    assert.equal(hcb.data_free, 0);
    rdbuf = new ArrayBuffer(16);
    rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 4);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 3.0);
    assert.equal(rdview[1], 4.0);
    assert.equal(rdview[2], 5.0);
    assert.equal(rdview[3], 6.0);
    assert.equal(hcb.data_free, 4);
    var wrbuf = new ArrayBuffer(16);
    var wrview = new Float32Array(wrbuf);
    wrview[0] = 7.0;
    wrview[1] = 8.0;
    wrview[2] = 9.0;
    wrview[3] = 10.0;
    sigplot.m.filad(hcb, wrview);
    assert.equal(hcb.in_byte, 8);
    assert.equal(hcb.dview[0], 9.0);
    assert.equal(hcb.dview[1], 10.0);
    assert.equal(hcb.dview[2], 7.0);
    assert.equal(hcb.dview[3], 8.0);
    var wrbuf = new ArrayBuffer(8);
    var wrview = new Float32Array(wrbuf);
    wrview[0] = 11.0;
    wrview[1] = 12.0;
    assert.throws(function() {
        sigplot.m.filad(hcb, wrview);
    }, "pipe full");
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 4);
    assert.equal(hcb.out_byte, 8);
    assert.equal(rdview[0], 7.0);
    assert.equal(rdview[1], 8.0);
    assert.equal(rdview[2], 9.0);
    assert.equal(rdview[3], 10.0);
    assert.equal(hcb.data_free, 4);
});
QUnit.test('bluefile pipe CF type 2000', function(assert) {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        format: "CF",
        type: 2000,
        subsize: 4,
        pipesize: 64
    });
    assert.equal(hcb.pipe, true);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.format, "CF");
    assert.equal(hcb.type, 2000);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.equal(hcb.spa, 2);
    assert.equal(hcb.bps, 4);
    assert.equal(hcb.bpa, 8);
    assert.equal(hcb.bpe, 32);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 16); // number of scalars available
    var rdbuf = new ArrayBuffer(32);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 16);
    sigplot.m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.dview[6], 7.0);
    assert.equal(hcb.dview[7], 8.0);
    assert.equal(hcb.data_free, 8);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 8);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 32);
    assert.equal(rdview.length, 8);
    assert.equal(rdview[0], 1.0);
    assert.equal(rdview[1], 2.0);
    assert.equal(rdview[2], 3.0);
    assert.equal(rdview[3], 4.0);
    assert.equal(rdview[6], 7.0);
    assert.equal(rdview[7], 8.0);
    assert.equal(hcb.data_free, 16);
    sigplot.m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.out_byte, 32);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.dview[6], 7.0);
    assert.equal(hcb.dview[7], 8.0);
    assert.equal(hcb.dview[8], 8.0);
    assert.equal(hcb.dview[9], 7.0);
    assert.equal(hcb.dview[10], 6.0);
    assert.equal(hcb.dview[11], 5.0);
    assert.equal(hcb.dview[14], 2.0);
    assert.equal(hcb.dview[15], 1.0);
    assert.equal(hcb.data_free, 8);
    sigplot.m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 32);
    assert.equal(hcb.dview[0], 0.0);
    assert.equal(hcb.dview[1], 1.0);
    assert.equal(hcb.dview[2], 0.0);
    assert.equal(hcb.dview[3], 1.0);
    assert.equal(hcb.dview[6], 0.0);
    assert.equal(hcb.dview[7], 1.0);
    assert.equal(hcb.dview[8], 8.0);
    assert.equal(hcb.dview[9], 7.0);
    assert.equal(hcb.dview[10], 6.0);
    assert.equal(hcb.dview[11], 5.0);
    assert.equal(hcb.dview[14], 2.0);
    assert.equal(hcb.dview[15], 1.0);
    assert.equal(hcb.data_free, 0);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 8);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 0);
    assert.equal(rdview.length, 8);
    assert.equal(rdview[0], 8.0);
    assert.equal(rdview[1], 7.0);
    assert.equal(rdview[2], 6.0);
    assert.equal(rdview[3], 5.0);
    assert.equal(rdview[6], 2.0);
    assert.equal(rdview[7], 1.0);
    assert.equal(hcb.data_free, 8);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 8);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 32);
    assert.equal(rdview.length, 8);
    assert.equal(rdview[0], 0.0);
    assert.equal(rdview[1], 1.0);
    assert.equal(rdview[2], 0.0);
    assert.equal(rdview[3], 1.0);
    assert.equal(rdview[6], 0.0);
    assert.equal(rdview[7], 1.0);
    assert.equal(hcb.data_free, 16);
});
QUnit.test('bluefile pipe CF type 2000 misaligned', function(assert) {
    var hcb = sigplot.m.initialize([], {
        pipe: true,
        format: "CF",
        type: 2000,
        subsize: 4,
        pipesize: 80
    });
    assert.equal(hcb.pipe, true);
    assert.equal(hcb.in_byte, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.format, "CF");
    assert.equal(hcb.type, 2000);
    assert.equal(hcb.dview.BYTES_PER_ELEMENT, 4);
    assert.equal(hcb.spa, 2);
    assert.equal(hcb.bps, 4);
    assert.equal(hcb.bpa, 8);
    assert.equal(hcb.bpe, 32);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 20); // number of scalars available
    var rdbuf = new ArrayBuffer(32);
    var rdview = new Float32Array(rdbuf);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 0);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.data_free, 20);
    sigplot.m.filad(hcb, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 0);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.dview[6], 7.0);
    assert.equal(hcb.dview[7], 8.0);
    assert.equal(hcb.data_free, 12);
    var ngot = sigplot.m.grabx(hcb, rdview);
    assert.equal(ngot, 8);
    assert.equal(hcb.in_byte, 32);
    assert.equal(hcb.out_byte, 32);
    assert.equal(rdview.length, 8);
    assert.equal(rdview[0], 1.0);
    assert.equal(rdview[1], 2.0);
    assert.equal(rdview[2], 3.0);
    assert.equal(rdview[3], 4.0);
    assert.equal(rdview[6], 7.0);
    assert.equal(rdview[7], 8.0);
    assert.equal(hcb.data_free, 20);
    sigplot.m.filad(hcb, [8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    assert.equal(hcb.in_byte, 64);
    assert.equal(hcb.out_byte, 32);
    assert.equal(hcb.dview[0], 1.0);
    assert.equal(hcb.dview[1], 2.0);
    assert.equal(hcb.dview[2], 3.0);
    assert.equal(hcb.dview[3], 4.0);
    assert.equal(hcb.dview[6], 7.0);
    assert.equal(hcb.dview[7], 8.0);
    assert.equal(hcb.dview[8], 8.0);
    assert.equal(hcb.dview[9], 7.0);
    assert.equal(hcb.dview[10], 6.0);
    assert.equal(hcb.dview[11], 5.0);
    assert.equal(hcb.dview[14], 2.0);
    assert.equal(hcb.dview[15], 1.0);
    assert.equal(hcb.data_free, 12);
    sigplot.m.filad(hcb, [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
    assert.equal(hcb.in_byte, 16);
    assert.equal(hcb.out_byte, 32);
    assert.equal(hcb.dview[0], 0.0);
    assert.equal(hcb.dview[1], 1.0);
    assert.equal(hcb.dview[2], 0.0);
    assert.equal(hcb.dview[3], 1.0);
    assert.equal(hcb.dview[6], 7.0);
    assert.equal(hcb.dview[7], 8.0);
    assert.equal(hcb.dview[8], 8.0);
    assert.equal(hcb.dview[9], 7.0);
    assert.equal(hcb.dview[10], 6.0);
    assert.equal(hcb.dview[11], 5.0);
    assert.equal(hcb.dview[14], 2.0);
    assert.equal(hcb.dview[15], 1.0);
    assert.equal(hcb.dview[16], 0.0);
    assert.equal(hcb.dview[17], 1.0);
    assert.equal(hcb.dview[18], 0.0);
    assert.equal(hcb.dview[19], 1.0);
    assert.equal(hcb.data_free, 4);
});
//test('bluefile pipe', function() {
// make a largeish pipe (i.e. 1MB)
// write X elements at a time
// read Y elements at a time
//});
//////////////////////////////////////////////////////////////////////////////
// QUnit 'sigplot-interactive-symbols' module
//
//////////////////////////////////////////////////////////////////////////////
QUnit.module('sigplot-interactive-symbols', {
    beforeEach: interactiveBeforeEach,
    afterEach: interactiveAfterEach
});

interactiveTest('sigplot triangle symbol', 'Do you see triangle symbols?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: 6,
        line: 0
    });
});

interactiveTest('sigplot custom symbol', 'Do you see custom symbols, alternating RGB?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: custom_symbol,
        line: 0
    });
});

interactiveTest('sigplot custom symbol complex', 'Do you see custom symbols in RGB order (groups of 3)?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {
        cmode: "RI"
    });
    assert.notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    // make it so the line is RRRGGGBBB
    var ramp = [1, 1, 4, 4, 7, 7, 2, 2, 5, 5, 8, 8, 3, 3, 6, 6, 9, 9];
    plot.overlay_array(ramp, {
        format: "CF"
    }, {
        name: "x",
        symbol: custom_symbol,
        line: 0
    });
});

interactiveTest('sigplot custom symbol-line', 'Do you see custom symbols?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);

    function custom_symbol(ctx, i, x, y) {
        var n = (i % 3);
        if (n === 0) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        } else if (n === 1) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
        } else if (n === 2) {
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 360);
        ctx.fill();
        ctx.stroke();
    }
    var ramp = [];
    for (var i = 0; i < 20; i++) {
        ramp.push(i);
    }
    plot.overlay_array(ramp, null, {
        name: "x",
        symbol: custom_symbol
    });
});
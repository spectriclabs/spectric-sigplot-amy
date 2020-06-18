QUnit.module('sigplot-interactive-menu', {
    beforeEach: interactiveBeforeEach,
    afterEach: interactiveAfterEach
});

interactiveTest('radius menu', 'Do you see a working radius option in the traces menu?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);

    var ramp = [];
    for (var i = 0; i < 25; i++) {
        ramp.push(i);
    }
    var layer = plot.overlay_array(ramp, {
        file_name: "ramp"
    }, {
        symbol: 3,
        line: 0
    });
});
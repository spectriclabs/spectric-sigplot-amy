QUnit.module('sigplot-interactive-boxes', {
    beforeEach: interactiveBeforeEach,
    afterEach: interactiveAfterEach
});

interactiveTest('boxes', 'Do you see a boxes?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);
    var boxes = new sigplot_plugins.BoxesPlugin();
    plot.add_plugin(boxes);
    boxes.add_box({
        x: 0,
        y: 0,
        w: 0.1,
        h: 0.1,
        text: "0,0"
    });
    boxes.add_box({
        x: 0.5,
        y: 0.5,
        w: 0.1,
        h: 0.1,
        text: "0.5,0.5",
        fill: true
    });
    boxes.add_box({
        x: -0.5,
        y: -0.5,
        w: 0.1,
        h: 0.1,
        text: "-0.5,-0.5",
        fillStyle: "green"
    });
    boxes.add_box({
        x: 0.5,
        y: -0.5,
        w: 0.1,
        h: 0.1,
        text: "0.5,-0.5",
        fillStyle: "red",
        alpha: 0.25
    });
});
interactiveTest('clear boxes', 'Do you see one box?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);
    var boxes = new sigplot_plugins.BoxesPlugin();
    plot.add_plugin(boxes);
    boxes.add_box({
        x: 0,
        y: 0,
        w: 0.1,
        h: 0.1,
        text: "I should be gone soon..."
    });
    window.setTimeout(function() {
        boxes.clear_boxes();
        boxes.add_box({
            x: 0.5,
            y: 0.5,
            w: 0.1,
            h: 0.1,
            text: "You should see me"
        });
    }, 1000);
});
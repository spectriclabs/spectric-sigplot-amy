QUnit.module('sigplot-interactive-slider', {
    beforeEach: interactiveBeforeEach,
    afterEach: interactiveAfterEach
});

interactiveTest('slider', 'Do you see a sliders?', function(assert) {
    var container = document.getElementById('plot');
    var plot = new sigplot.Plot(container, {});
    assert.notEqual(plot, null);
    var slider1 = new sigplot_plugins.SliderPlugin({
        name: "Slider 1"
    });
    plot.add_plugin(slider1);
    var slider2 = new sigplot_plugins.SliderPlugin({
        name: "Slider 2"
    });
    plot.add_plugin(slider2);
    slider1.pair(slider2);
    slider2.pair(slider1);
    slider1.set_position(0.5);
    slider2.set_position(-0.5);
    // slidertag events happen whenever a slider is moved
    // programatically or by the user
    plot.addListener("slidertag", function(evt) {});
    // sliderdrag events happen only when a slider is moved by
    // the user
    plot.addListener("sliderdrag", function(evt) {});
});
SigPlot
=======

SigPlot provides fast, interactive plotting for software defined radio
applications using HTML5.

Getting Started
=============
First include the SigPlot library in your webpage:

```html
<script src="sigplot-minimized.js" type="text/javascript"></script>
```

Then create a 'div' element to hold your plot:

```html    
<div id="plot"></div>
```

The size and position of the plot are controlled by regular CSS positioning
of the 'div' element.  For example:

```css
#plot {
        height: 400px;
        width: 600px;
}
```

Finally, invoke SigPlot:

```javascript
plot = new sigplot.Plot(document.getElementById('plot'), {autohide_panbars: true});
```

Additional [examples and demos](http://demo.axiosengineering.com/sigplot/) are
available along with [API](http://TODO) documentation. 

Building
=============

Using Grunt
-------------
[Grunt](http://gruntjs.com) is the primary mechanism for building SigPlot.  You
will need an installation of Node.js and the Grunt command line interface.

The first step is to install the build dependencies using `npm install`.

Run `grunt test` to run the unittests and JavaScript linting; run `grunt dist`
to build a distributable version of the project.

If you get an warning from jsbeautifer about files not being "beautified", you 
can use --force while doing development but prior to making your final commits
you should run `grunt jsbeautifier:cleanup`.  This will fix any of the formatting
issues.  It was an intentional decision to not automatically run cleanup because
it can be risky to make changes to the code as part of the build (even if the
beautifier is supposed to be 100% code-identical).

Using Make
-------------
Although Grunt is the canonical build system, a basic Makefile is provided for
environment where Grunt cannot be used.  You will need the following:

* GNU Make
* Java version 1.7+

If you wish to build the SigPlot API documention, you will need
[jsdoc](https://github.com/jsdoc3/jsdoc) installed.

License
=====================
SigPlot is free software; you can redistribute it and/or modify it under the
terms of the GNU Lesser General Public License as published by the Free
Software Foundation; either version 3.0 of the License, or (at your option) any
later version. This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU Lesser General Public
License](LICENSE) for more details. You should have received a copy of the GNU
Lesser General Public License along with SigPlot.

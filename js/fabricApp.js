
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
FabricApp = function (options) {
    var canvas = null;

    var drawApp = function (animateApp) {
        var apps = FabricApp.Apps;
        for (var keyMethod in apps) {
            var functionName = "Draw_" + animateApp.name;
            if (keyMethod == functionName) {
                var func = eval("FabricApp.Apps." + functionName);
                func(animateApp)
            }
        }
    }


    var init = function (options) {
        var _options = {
            canvas: "id",
            animateApp: {
                name: "CircleShow",//动画名称
            }
        };
        FabricApp.Common.extend(_options, options, true);
        console.log(_options)
        FabricApp.canvas = new fabric.StaticCanvas(_options.canvas);

        drawApp(_options.animateApp);
    }
    return {
        canvas: canvas,
        init: init
    }
} ();

FabricApp.Common = function () {
    var extend = function (o, n, override) {
        for (var p in n) if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p] = n[p];
    };

    return {
        extend: extend
    }
} ();

FabricApp.Apps = {};
FabricApp.Apps.Draw_CircleShow = function (animateApp) {
    var rate = animateApp.rate;
    var r = animateApp.radius;
    var i = 0;
    var circle = new fabric.Circle({
        radius: r,
        fill: '#fff',
        stroke: "#ff5500",
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
    });

    var arc = new fabric.Circle({
        radius: r,
        angle: -90,
        startAngle: 0,
        endAngle: 0,
        stroke: '#0094ff',
        strokeWidth: 3,
        fill: '',
        originX: 'center',
        originY: 'center',
    });

    var text = new fabric.Text('0%', {
        fontSize: 20,
        originX: 'center',
        originY: 'center'
    });

    var arry = [circle, arc, text];
    // var arr = fn_drawClock(r);
    // arry = arry.concat(arr);


    group = new fabric.Group(arry, {
        left: 150,
        top: 100,
        // angle: -10
    });
    var canvas = FabricApp.canvas;

    canvas.add(group);

    requestAnimFrame(fn_drawArc);

    var opcity = 1;
    function fn_drawArc() {
        arc.set({ endAngle: 2 * Math.PI * i });
        text.set("text", (i * 100).toFixed(0) + "%")
        canvas.renderAll();
        if (i < rate) {
            i += 0.02;
            window.requestAnimFrame(fn_drawArc);
        }
        else {
            group.animate('opacity', 0.3, {
                onChange: canvas.renderAll.bind(canvas),
                duration: 800,
                easing: fabric.util.ease.easeOutCubic,
                onComplete: function (param) {
                    group.set("opacity", 1);
                    canvas.renderAll();
                    var arr = fn_drawClock(r, group);
                    group.remove(arc);
                    group.remove(circle);
                    canvas.renderAll();
                    group.animate('opacity', 1, {
                        onChange: canvas.renderAll.bind(canvas)
                    })
                }
            });
        }
    }

    function fn_drawClock(r) {
        var x0 = 0;
        var y0 = 0;

        var ang = 0;

        var r0 = r - 4; // 时刻度长度 越小越长 
        var r1 = r - 4; //分刻度长度 越小越长
        var x00 = 0;
        var y00 = 0;

        var arry = [];

        for (var index = 0; index < 12; index++) {
            ang = -90 + 360 / 12 * index;
            // console.log(ang)
            x1 = x0 + r * Math.cos(ang * Math.PI / 180);
            y1 = y0 + r * Math.sin(ang * Math.PI / 180);
            // console.log(x1 + "," + y1)

            x01 = x00 + r0 * Math.cos(ang * Math.PI / 180);
            y01 = y00 + r0 * Math.sin(ang * Math.PI / 180);
            // console.log(x01 + "," + y01)

            var line = new fabric.Line([x1, y1, x01, y01], {
                // stroke: '#ff5500',
                originX: 'center',
                originY: 'center',
            });

            if ((ang + 90) / 360 > rate || (rate != 1 && index == 0)) {
                line.set("stroke", "#ff5500");
            } else {
                line.set("stroke", "#0094ff");
            }

            arry.push(line);
            group.add(line);
        }
        for (var index = 0; index < 60; index++) {
            ang = -90 + 360 / 60 * index;
            if (index % 5 == 0) {
                continue;//跳过时刻度
            }
            // console.log(ang)
            x1 = x0 + r * Math.cos(ang * Math.PI / 180);
            y1 = y0 + r * Math.sin(ang * Math.PI / 180);
            // console.log(x1 + "," + y1)

            x01 = x00 + r1 * Math.cos(ang * Math.PI / 180);
            y01 = y00 + r1 * Math.sin(ang * Math.PI / 180);
            // console.log(x01 + "," + y01)

            var line = new fabric.Line([x1, y1, x01, y01], {
                stroke: '#0094ff',
                originX: 'center',
                originY: 'center',
            });
            if ((ang + 90) / 360 > rate) {
                line.set("stroke", "#ff5500");
            }
            group.add(line);
            arry.push(line);
        }
        return arry;
    }
}
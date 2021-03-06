/**
 * yanhao
 * 2015-06-19
 */
(function() {
	
	var voronoiData = {
		initFn: function() {
			voronoiData.chartFn();
		},

		chartFn: function() {
			var width = 640,
				height = 640,
				scale = width / 2 - 4;

			var canvas = d3.select("#voronoi").append("canvas")
				.attr("width", width)
				.attr("height", height);

			var context = canvas.node().getContext("2d");

			var graticule = d3.geo.graticule()();

			d3.timer(function(elapsed) {
				var renderBack = d3.geo.pipeline()
					.source(d3.geo.jsonSource)
					.pipe(d3.geo.rotate, elapsed * .0002 + Math.PI, -elapsed * .0001, 0)
					.pipe(d3.geo.clipCircle, Math.PI / 2)
					.pipe(d3.geo.rotate, Math.PI, 0, 0)
					.pipe(d3.geo.project, d3.geo.orthographic, .3 / scale)
					.sink(d3.geom.contextSink, context)

				var renderFront = d3.geo.pipeline()
					.source(d3.geo.jsonSource)
					.pipe(d3.geo.rotate, elapsed * .0002, elapsed * .0001, 0)
					.pipe(d3.geo.clipCircle, Math.PI / 2)
					.pipe(d3.geo.project, d3.geo.orthographic, .3 / scale)
					.sink(d3.geom.contextSink, context);

				context.clearRect(0, 0, width, height);
				context.save();
				context.translate(width / 2, height / 2);
				context.scale(scale, -scale);

				context.beginPath();
				renderBack(graticule);
				context.lineWidth = 1 / scale;
				context.strokeStyle = "#999";
				context.stroke();

				context.beginPath();
				renderFront(graticule);
				context.lineWidth = 1.5 / scale;
				context.strokeStyle = "white";
				context.stroke();

				context.restore();
			});

			d3.select(self.frameElement).style("height", height + "px");
		}
	};

	voronoiData.initFn();
})();
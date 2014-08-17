ig.module(
	'plugins.cheese.cursor'
).requires(
).defines(function () {
window.ch = window.ch || {};

ch.Cursor = ig.Class.extend({
	image: null,
	offset: { x: 0, y: 0 },
	replace: false,

	init: function (settings) {
		ig.merge(this, settings || {});
	},

	draw: function (x, y) {
		if (this.replace) {
			ig.system.context.canvas.style.cursor = 'none';
		}
		this.image && this.image.draw(x - this.offset.x, y - this.offset.y);
	},

	click: 			function () { },
	doubleClick: 	function () { },
	mouseEnter: 	function () { },
	mouseLeave: 	function () { }
});

});
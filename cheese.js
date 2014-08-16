ig.module(
	'plugins.cheese.cheese'
).requires(
	'impact.input',
	'plugins.cheese.click-events'
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

ig.Input.inject({
	_customEvents: {},

	bind: function (key, name) {
		this.parent(key, name);
		// TODO Allow familiar syntax
	}
});

ig.Game.inject({
	_initialized: false,
	
	cursor: null,

	events: [
		new ch.ClickEventQueue({ key: ig.KEY.MOUSE1 }),
		//new ch.MouseUpEventQueue({ key: ig.KEY.MOUSE2 }),
		new ch.DoubleClickEventQueue({ key: ig.KEY.MOUSE1 }),
		//new ch.DoubleClickEventQueue({ key: ig.KEY.MOUSE2 })
	],

	_doEventInit: function () {
		this.events.forEach(function (e) { e.setup(); });
		this._initialized = true;
	},

	update: function () {
		this._initialized || this._doEventInit();
		this.events.forEach(function (e) { e.update(); });
		this.parent();
		this.events.forEach(function (e) { e.dispatch(); });
	},

	draw: function () {
		this.parent.apply(this, arguments);
		this.cursor && this.cursor.draw(ig.input.mouse.x, ig.input.mouse.y);
	}
});

});
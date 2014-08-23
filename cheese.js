ig.module(
	'plugins.cheese.cheese'
).requires(
	'plugins.cheese.click',
	'plugins.cheese.hover',
	'plugins.cheese.drag',
	'impact.game'
).defines(function () {
window.ch = window.ch || {};

ig.Game.inject({
	_eventsInitialized: false,
	_mouseInitialized: false,

	cursor: null,
	events: [],

	_doEventInit: function () {
		this.events.forEach(function (e) { e.setup(); });
		this._eventsInitialized = true;
	},

	_doMouseInit: function () {
		ig.input.initMouse();
		this._mouseInitialized = true;
	},

	update: function () {
		this._mouseInitialized || this._doMouseInit();
		this._eventsInitialized || this._doEventInit();
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
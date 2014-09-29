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
		this.cursor && this.cursor.update();
		this.parent();
		this.events.forEach(function (e) { e.dispatch(); });
	},

	// Kind of a hack... We want the cursor to ALWAYS be drawn after everything
	// else, so draw it after the parent's `run` implementation. This means
	// that any other injections into Game.draw, even after this plugin is
	// imported, will still be called before the cursor is drawn.
	run: function () {
		this.parent();
		this.cursor && this.cursor.draw(ig.input.mouse.x, ig.input.mouse.y);
	}
});

});
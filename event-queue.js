ig.module(
	'plugins.cheese.event-queue'
).requires(
	'impact.input',
	'impact.entity'
).defines(function () {
window.ch = window.ch || {};

var events = [];
ig.Entity.inject({
	_hover: false,
	update: function () {
		this.zIndex = -this.pos.y;
		var oldHover = this._hover;
		this._hover =
			(this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
			((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
			(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
			((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y);
		for (var i = 0; i < events.length; i++) {
			if (events[i].detect(this, this._hover, oldHover)) {
				events[i].queue.push(this);
			}
		}
		this.parent();
	}
});

ch.EventQueue = ig.Class.extend({
	_name: '',
	type: 'state',
	queue: [],
	handler: {},

	init: function (settings) {
		ig.merge(this, settings || {});

		// Inject any detection specifics into Entity
		events.push(this);
		this.doCursor && ch.Cursor.inject(this.handler);
		ig.Entity.inject(this.handler);
		this._name = Object.keys(this.handler)[0];
	},

	dispatch: function () {
		this.preDispatch();
		var event = null;
		if (ig.game.cursor && this.detectCursor() &&
			ig.game.cursor[this._name](event = this.getEvent()) === true) {
			this.queue = [];
		}
		if (this.queue.length > 0) {
			event = event || this.getEvent();
			for (var i = 0; i < this.queue.length; i++) {
				if (this.queue[i][this._name](event) === true) {
					break;
				}
			}
			this.queue = [];
		}
	},

	setup:        function () { },
	update:       function () { },
	preDispatch:  function () { },
	getEvent:     function () { return new ch.Event(); },
	detect:       function () { },
	detectCursor: function () { }
});

ch.Event = ig.Class.extend({
	init: function (settings) {
		ig.merge(this, settings || {});
	}
});

});
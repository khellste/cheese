ig.module(
	'plugins.cheese.event-queue'
).requires(
	'impact.input',
	'impact.entity',
	'plugins.cheese.cursor'
).defines(function () {
window.ch = window.ch || {};

var events = [];
ig.Entity.inject({
	hitbox: null,
	_hover: false,
	_event_data: {},

	init: function (x, y, settings) {
		this.parent(x, y, settings);
		if (!this.hitbox) {
			this.hitbox = {
				offset: { x: 0, y: 0 },
				size: { x: this.size.x, y: this.size.y }
			};
		}
	},

	update: function () {
		var oldHover = this._hover;
		var x = this.pos.x + this.hitbox.offset.x,
			y = this.pos.y + this.hitbox.offset.y,
			mx = ig.input.mouse.x + ig.game.screen.x,
			my = ig.input.mouse.y + ig.game.screen.y,
			w = this.hitbox.size.x, h = this.hitbox.size.y;
		this._hover = x <= mx && x + w >= mx && y <= my && y + h >= my;
		for (var i = 0; i < events.length; i++) {
			var data = events[i].getData(this);
			data.hover = this._hover;
			data.pHover = oldHover;
			if (events[i].detect(this, data)) {
				events[i].queue.push(this);
			}
		}
		this.parent();
	}
});

ch.EventQueue = ig.Class.extend({
	name: '',
	type: 'state',
	queue: [],
	handler: {},
	data: {},

	init: function (settings) {
		ig.merge(this, settings || {});

		// Inject any detection specifics into Entity
		events.push(this);
		ch.Cursor.inject(this.handler);
		ig.Entity.inject(this.handler);
		this.name = Object.keys(this.handler)[0];

		// Inject an event data object for this Queue into the Entity prototype
		var ed = ig.Entity.prototype._event_data;
		ig.merge(ed[this.name] = ed[this.name] || {}, this.data || {});
	},

	getData: function (ent) {
		return ent._event_data[this.name];
	},

	dispatch: function () {
		var event = null;
		if (ig.game.cursor && this.detectCursor() &&
			ig.game.cursor[this.name](event = this.getEvent()) === true) {
			this.queue = [];
		}
		if (this.queue.length > 0) {
			event = event || this.getEvent();
			this.queue.sort(ig.game.sortBy);
			for (var i = this.queue.length-1; i >= 0; i--) {
				if (this.queue[i][this.name](event) === true) {
					break;
				}
			}
			this.queue = [];
		}
	},

	setup:        function () { },
	update:       function () { },
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
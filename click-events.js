ig.module(
	'plugins.cheese.click-events'
).requires(
	'plugins.cheese.event-queue'
).defines(function () {
window.ch = window.ch || {};

ch.ClickEvent = ch.Event.extend({
	key: 0, items: [], type: '', pos: { x: 0, y: 0 }
});

var vkeys = {}, id = 0;
var getVkey = function (igKey) {
	return vkeys[igKey] || (function () {
		for (var key in ig.KEY) {
			if (ig.KEY[key] === igKey) {
				return key.toLowerCase();
			}
		}
		return 'unknown' + (id++);
	})();
};

ch.MouseEventQueue = ch.EventQueue.extend({
	handler: { mouse: function () { } },
	key: 0, vkey: '', type: '',

	init: function (settings) {
		this.parent(settings);
		this.vkey = getVkey(this.key);
	},

	setup: function () {
		ig.input.bind(this.key, this.vkey);
	},

	check: function (how) {
		return ig.input[how || this.type](this.vkey);
	},

	detect: function (entity, hover) {
		return hover && this.check();
	},

	detectCursor: function () {
		return this.check();
	},

	getEvent: function () {
		return new ch.ClickEvent({
			key: this.key, name: this.vkey, items: this.queue,
			type: this.type || this._name,
			pos: { x: ig.input.mouse.x, y: ig.input.mouse.y }
		});
	}
});

// Click event
ig.Entity.inject({ _click_down: false });
ch.ClickEventQueue = ch.MouseEventQueue.extend({
	type: 'click',
	handler: { click: function () { } },
	_targets: [],

	detect: function (entity, hover) {
		if (hover) {
			if (this.check('pressed')) {
				entity._click_down = true;
				this._targets.push(entity);
				return false;
			}
			else if (this.check('released')) {
				if (entity._click_down) {
					return true;
				}
			}
		}
		return false;
	},

	detectCursor: function () {
		// TODO Ensure that mouse has not moved significantly
		return this.check('released');
	}
});

// Double click event
ch.DoubleClickEventQueue = ch.MouseEventQueue.extend({
	handler: { doubleClick: function () { } },

	_prevMousePos: { x: 0, y: 0 },
	_timer: null,
	_threshold: 0.4,
	_triggered: false,

	_checkMouse: function () {
		var d2 =
			Math.pow(ig.input.mouse.x - this._prevMousePos.x, 2) +
			Math.pow(ig.input.mouse.y - this._prevMousePos.y, 2);
		return d2 < ig.system.scale;
	},

	update: function () {
		this.parent();
		this._triggered = false;
		if (this.check('released')) {
			if (this._timer && this._timer.delta() < 0 && this._checkMouse()) {
				this._triggered = true;
				this._timer = null;
			}
			else {
				this._timer = new ig.Timer(this._threshold);
			}
			this._prevMousePos.x = ig.input.mouse.x;
			this._prevMousePos.y = ig.input.mouse.y;
		}
		if (this._timer && this._timer.delta() > 0) {
			this._timer = null;
		}
	},

	detect: function (entity, hover) {
		return hover && this._triggered;
	},

	detectCursor: function () {
		return this._triggered;
	}
});

});
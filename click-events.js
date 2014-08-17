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
	key: 0,
	vkey: '',

	init: function (settings) {
		var data = this.data;
		this.data = {};
		this.parent(settings);
		this.vkey = getVkey(this.key);
		ig.Entity.prototype._event_data[this.name][this.vkey] = data || {};
	},

	getData: function (ent) {
		return this.parent(ent)[this.vkey];
	},

	setup: function () {
		ig.input.bind(this.key, this.vkey);
	},

	check: function (how) {
		return ig.input[how](this.vkey);
	},

	getEvent: function () {
		return new ch.ClickEvent({
			key: this.key, name: this.vkey,
			items: this.queue, type: this.name,
			pos: { x: ig.input.mouse.x, y: ig.input.mouse.y }
		});
	}
});

// Click event
ch.ClickEventQueue = ch.MouseEventQueue.extend({
	handler: { click: function () { } },
	data: { active: false },

	detect: function (ent, data) {
		if (data.hover) {
			if (this.check('released') && ent.active) {
				return true;
			}
			else if (this.check('pressed')) {
				ent.active = true;
			}
		}
		else if (data.pHover) {
			ent.active = false;
		}
		return false;
	},

	detectCursor: function () {
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

	detect: function (entity, data) {
		return data.hover && this._triggered;
	},

	detectCursor: function () {
		return this._triggered;
	}
});

});
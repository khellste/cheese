ig.module(
	'plugins.cheese.click'
).requires(
	'plugins.cheese.mouse-event-queue'
).defines(function () {
window.ch = window.ch || {};

ch._ClickEventBase = ch.MouseEventQueue.extend({
	_prevMousePos: { x: 0, y: 0 },

	_checkMouse: function () {
		var d2 =
			Math.pow(ig.input.mouse.x - this._prevMousePos.x, 2) +
			Math.pow(ig.input.mouse.y - this._prevMousePos.y, 2);
		return d2 < ig.system.scale;
	},

	update: function () {
		this.parent();
		this._prevMousePos.x = ig.input.mouse.x;
		this._prevMousePos.y = ig.input.mouse.y;
	}
});

// Click event
ch.ClickEventQueue = ch._ClickEventBase.extend({
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
		return this.check('released') && this._checkMouse();
	}
});

// Double click event
ch.DoubleClickEventQueue = ch._ClickEventBase.extend({
	handler: { doubleClick: function () { } },

	_timer: null,
	_threshold: 0.4,
	_triggered: false,

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
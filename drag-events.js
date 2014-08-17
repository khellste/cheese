ig.module(
	'plugins.cheese.drag-events'
).requires(
	'plugins.cheese.click-events'
).defines(function () {
window.ch = window.ch || {};

ch.DragEvent = ch.ClickEvent.extend({
	delta: { x: 0, y: 0 },
	start: { x: 0, y: 0 },
	state: null
});
ch.DragEvent.State = { NONE: -1, START: 0, DRAGGING: 1, DONE: 2 };
ch.DragEvent.prototype.state = ch.DragEvent.State.NONE;

// Drag events
ch.DragEventQueue = ch.MouseEventQueue.extend({
	handler: { drag: function () { } },
	data: { active: false },
	
	_prevMousePos: { x: 0, y: 0 },
	_start: { x: 0, y: 0 },
	_delta: { x: 0, y: 0 },
	_state: ch.DragEvent.State.NONE,

	update: function () {
		if (this.check('pressed')) {
			this._start.x = ig.input.mouse.x;
			this._start.y = ig.input.mouse.y;
			this._state = ch.DragEvent.State.START;
		}
		else if (this.check('state') && !this.check('released')) {
			this._delta.x = ig.input.mouse.x - this._prevMousePos.x;
			this._delta.y = ig.input.mouse.y - this._prevMousePos.y;
			this._state = ch.DragEvent.State.DRAGGING;
		}
		else if (this.check('released')) {
			this._state = ch.DragEvent.State.DONE;
		}
		else {
			this._state = ch.DragEvent.State.NONE;
		}
		this._prevMousePos.x = ig.input.mouse.x;
		this._prevMousePos.y = ig.input.mouse.y;
	},

	detect: function (ent, data) {
		if (data.hover && this._state === ch.DragEvent.State.START) {
			data.active = true;
		}
		else if (this._state === ch.DragEvent.State.NONE) {
			data.active = false;
		}
		return data.active;
	},

	detectCursor: function () {
		return this._state > ch.DragEvent.State.NONE;
	},

	getEvent: function () {
		return new ch.DragEvent({
			pos: { x: ig.input.mouse.x, y: ig.input.mouse.y },
			start: this._start,
			state: this._state,
			delta: this._delta,
			key: this.key
		});		
	}
});

});
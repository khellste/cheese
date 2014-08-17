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
ig.Entity.inject({ _drag_active: { } });
ch.DragEventQueue = ch.ClickEventQueue.extend({
	handler: { drag: function () { } },
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

	detect: function (ent, hov, oHov) {
		if (hov && this._state === ch.DragEvent.State.START) {
			ent._drag_active[this.vkey] = true;
		}
		else if (this._state === ch.DragEvent.State.NONE) {
			ent._drag_active[this.vkey] = false;
		}
		return ent._drag_active[this.vkey];
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
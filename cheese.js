ig.module(
	'plugins.cheese'
).requires(
	'impact.entity',
	'impact.input',
	'impact.game',
	'impact.system'
).defines(function () {

var initClick = function () {
	ig.input.bind(ig.KEY.MOUSE1, 'mouse1');
	initClick = null;
};

var ClickEvent = ig.Class.extend({
	key: 0,
	items: [],
	pos: { x: 0, y: 0 },
	init: function (settings) {
		ig.merge(this, settings || {});
	}
});

ig.Cursor = ig.Class.extend({
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

ig.Game.inject({
	_clickTimer: null,
	_doubleClickThresholdSec: 0.4,
	_clicked: false,
	_doubleClicked: false,
	_prevMousePos: { x: 0, y: 0 },

	_queue: {
		click: [],
		click2x: [],
		enter: [],
		leave: []
	},

	cursor: null,

	// Remember the mouse's position so that we can tell how much it moved
	// later on
	_captureMouse: function () {
		this._prevMousePos.x = ig.input.mouse.x;
		this._prevMousePos.y = ig.input.mouse.y;
	},

	// Check that the distance the mouse has moved since the last click is not
	// so much that this shouldn't count as a double click
	_checkMouse: function () {
		var d2 =
			Math.pow(ig.input.mouse.x - this._prevMousePos.x, 2) +
			Math.pow(ig.input.mouse.y - this._prevMousePos.y, 2);
		return d2 < ig.system.scale;
	},

	// Return true if this function is being called during a double click
	_isDoubleClick: function () {
		return (
			this._clickTimer &&
			this._clickTimer.delta() < 0 &&
			this._checkMouse()
		);
	},

	// Sort two entities by zIndex
	_zIndexSort: function (a, b) {
		return a.zIndex - b.zIndex;
	},

	// Before invoking parent, detect and dispatch click and double click
	// events.
	update: function () {
		initClick && initClick();

		// Handle click and double click events
		if (ig.input.pressed('mouse1')) {

			// Double click
			if (this._isDoubleClick()) { 
				this._doubleClicked = true;
				this._clickTimer = null;
			}

			// Click
			else {
				this._clicked = true;
				this._clickTimer = new ig.Timer(this._doubleClickThresholdSec);
			}

			// Remember mouse for next time
			this._captureMouse();
		}
		if (this._clickTimer && this._clickTimer.delta() > 0) {
			this._clickTimer = null
		}

		// Update child entities
		this.parent.apply(this, arguments);

		// Reuse the same event object
		var evt = new ClickEvent({
			pos: { x: ig.input.mouse.x, y: ig.input.mouse.y },
			key: ig.KEY.MOUSE1,
			items: []
		});

		// Process enter events
		if (this._queue.enter.length > 0) {
			this._queue.enter.sort(this._zIndexSort);
			evt.items = this._queue.enter;
			for (var i = 0; i < this._queue.enter.length; i++) {
				if (this._queue.enter[i].mouseEnter(evt) === true) {
					break;
				}
			}
			this._queue.enter = [];
		}

		// Process leave events
		if (this._queue.leave.length > 0) {
			this._queue.leave.sort(this._zIndexSort);
			evt.items = this._queue.leave;
			for (var i = 0; i < this._queue.leave.length; i++) {
				if (this._queue.leave[i].mouseLeave(evt) === true) {
					break;
				}
			}
			this._queue.leave = [];
		}

		// Process click events
		if (this._clicked) {
			this._queue.click.sort(this._zIndexSort);
			evt.items = this._queue.click;
			if (!(this.cursor && this.cursor.click(evt) === true)) {
				for (var i = 0; i < this._queue.click.length; i++) {
					if (this._queue.click[i].click(evt) === true) {
						break;
					}
				}
			}
			this._queue.click = [];
		}

		// Process double click event
		if (this._doubleClicked) {
			this._queue.click2x.sort(this._zIndexSort);
			evt.items = this._queue.click2x;
			if (!(this.cursor && this.cursor.doubleClick(evt) === true)) {
				for (var i = 0; i < this._queue.click2x.length; i++) {
					if (this._queue.click2x[i].doubleClick(evt) === true) {
						break;
					}
				}
			}
			this._queue.click2x = [];
		}

		// Reset
		this._clicked = this._doubleClicked = false;
	},

	draw: function () {
		this.parent.apply(this, arguments);
		this.cursor && this.cursor.draw(ig.input.mouse.x, ig.input.mouse.y);
	}
});

ig.Entity.inject({
	_hover: false,

	// Return true iff the mouse is within my bounding box
	_testMouse: function () {
		return (
			(this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
			((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
			(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
			((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		);
	},

	// Check for click, double click, mouse enter, and mouse leave events
	update: function () {
		this.zIndex = -this.pos.y;
		var hover = this._testMouse();
		if (hover !== this._hover) {
			ig.game._queue[this._hover ? 'leave' : 'enter'].push(this);
			//this._hover ? this.mouseLeave() : this.mouseEnter();
		}
		if (this._hover = hover) {
			ig.game._clicked && ig.game._queue.click.push(this);
			ig.game._doubleClicked && ig.game._queue.click2x.push(this);
		}

		this.parent.apply(this, arguments);
	},

	click: 			function () { },
	doubleClick: 	function () { },
	mouseEnter: 	function () { },
	mouseLeave: 	function () { }
});

});
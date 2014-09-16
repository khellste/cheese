ig.module(
	'plugins.cheese.cursor'
).requires(
).defines(function () {
window.ch = window.ch || {};

ch.Cursor = ig.Class.extend({
	anims: {},
	animSheet: null,
	currentAnim: null,
	offset: { x: 0, y: 0 },
	replace: false,
	_initReplace: false,

	init: function (settings) {
		ig.merge(this, settings || {});
	},

	_initCursorReplaceProperty: function () {
		var initReplace = this.replace || false;
		var replace = !initReplace;
		Object.defineProperty(this, 'replace', {
			enumerable: true,
			get: function () { return replace; },
			set: function (value) {
				if (value === replace) return;
				var cursor = (replace = value) ? 'none' : 'default';
				ig.system.context.canvas.style.cursor = cursor;
			}
		});
		this.replace = initReplace;
	},

	addAnim: function (name, frameTime, sequence, stop) {
		if (!this.animSheet) {
			throw "Can't call addAnim('" + name + "') without an animSheet!";
		}
		var a = new ig.Animation(this.animSheet, frameTime, sequence, stop);
		this.anims[name] = a;
		if (!this.currentAnim) {
			this.currentAnim = a;
		}
		return a;
	},

	update: function () {
		if (!this._initReplace) {
			this._initReplace = true;
			this._initCursorReplaceProperty();
		}
		if (this.currentAnim) {
			this.currentAnim.update();
		}
	},

	draw: function (x, y) {
		if (this.currentAnim) {
			var off = this.offset, rs = ig.game._rscreen;
			this.currentAnim.draw(x - off.x - rs.x, y - off.y - rs.y);
		}
	},

	click: 			function () { },
	doubleClick: 	function () { },
	mouseEnter: 	function () { },
	mouseLeave: 	function () { }
});

});
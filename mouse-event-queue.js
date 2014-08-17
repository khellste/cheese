ig.module(
	'plugins.cheese.mouse-event-queue'
).requires(
	'plugins.cheese.event-queue'
).defines(function () {

ch.MouseEvent = ch.Event.extend({
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
		return new ch.MouseEvent({
			key: this.key, name: this.vkey,
			items: this.queue, type: this.name,
			pos: { x: ig.input.mouse.x, y: ig.input.mouse.y }
		});
	}
});

});
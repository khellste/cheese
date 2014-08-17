ig.module(
	'plugins.cheese.hover'
).requires(
	'plugins.cheese.mouse-event-queue'
).defines(function () {
window.ch = window.ch || {};

// TODO better hover event?

// Hover events
ch.MouseEnterEventQueue = ch.EventQueue.extend({
	handler: { mouseEnter: function () { } },
	detect: function (entity, data) {
		return data.hover && !data.pHover;
	}
});
ch.MouseLeaveEventQueue = ch.EventQueue.extend({
	handler: { mouseLeave: function () { } },
	detect: function (entity, data) {
		return !data.hover && data.pHover;
	}
});
ch.MouseOverEventQueue = ch.EventQueue.extend({
	handler: { mouseOver: function () { } },
	detect: function (entity, data) {
		return data.hover;
	}
});

});
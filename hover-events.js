ig.module(
	'plugins.cheese.hover-events'
).requires(
	'plugins.cheese.event-queue'
).defines(function () {
window.ch = window.ch || {};

// TODO better hover event?

// Hover events
ch.MouseOverEventQueue = ch.EventQueue.extend({
	handler: { mouseOver: function () { } },
	detect: function (entity, hover, oldHover) {
		return hover && !oldHover;
	}
});
ch.MouseLeaveEventQueue = ch.EventQueue.extend({
	handler: { mouseLeave: function () { } },
	detect: function (entity, hover, oldHover) {
		return !hover && oldHover;
	}
});

});
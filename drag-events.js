ig.module(
	'plugins.cheese.drag-events'
).requires(
	'plugins.cheese.event-queue'
).defines(function () {
window.ch = window.ch || {};

// Drage events
ch.DragEventQueue = ch.EventQueue.extend({

});

});
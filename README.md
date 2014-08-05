cheese
======

A simple mouse event plugin for ImpactJS

Features
------
* Implements click, double click, mouse enter, and mouse leave events.
* Supports event cancelling (*e.g.*, one event handler for an event can cancel all other handlers for that event).
* Easily add custom mouse cursors to your game.

Installation
------
Simply copy "cheese.js" to your plugins/ folder and then include it in your main.js with `ig.module(...).requires('plugins.cheese').defines(...)`.

Usage
------
`ig.Entity` is extended with event handler functions. To respond to events, simply override the new functions:
* `click`. Called when this entity is clicked on.
* `doubleClick`. Called when this entity is double clicked on.
* `mouseEnter`. Called when the mouse enters this entity.
* `mouseLeave`. Called when the mouse leaves this entity.
All of these functions take a `MouseEvent` object as their parameter. This object has the form:
```javascript
{
    key: [number] Member of ig.KEYS,
    items: [Array] Other entities who were triggered,
    pos: [object] { x, y } Mouse position
}
```
If any event handler returns `true` no other event handlers for that event will be triggered for that game step.

To create a **cursor** simply set the `cursor` property of `ig.game` to a new `ig.Cursor` object. `ig.Cursor` has three settings:
* `replace`. True/false. Whether or not this cursor should replace the default cursor.
* `image`. An `ig.Image` to draw for the cursor.
* `offset`. The `{ x, y }` offset for the cursor drawing operation.
In addition to these, the cursor has `click` and `doubleClick` event handlers, which get called before any other handlers for those events.

Events are called in this order: mouseEnter, mouseLeave, click, doubleClick

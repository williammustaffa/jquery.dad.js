# jquery.dad.js

A simple and awesome Drag And Drop plugin!

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>iOS Safari |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last version| last version| last version| last version


## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)

  - [active](#active)
  - [draggable](#draggable)
  - [exchangeable](#exchangeable)
  - [transition](#transition)
  - [placeholderTarget](#placeholdertarget)
  - [placeholderTemplate](#placeholdertemplate)
  - [cloneClass](#cloneClass)
  - [targetClass](#targetClass)
  - [placeHolderClass](#placeHolderClass)

- [Methods](#methods)
  - [activate](#activate)
  - [deactivate](#deactivate)
- [Events](#events)
  - [dadDragStart](#dadDragStart)
  - [dadDragExchange](#dadDragExchange)
  - [dadDragUpdate](#dadDragUpdate)
  - [dadDragEnd](#dadDragEnd)
  - [dadDrop](#dadDrop)
- [Demos](#demos)

## Installation

Import dad plugin file after jquery.

```
<script src='jquery.min.js'></script>
<script src='jquery.dad.min.js'></script>
```

and that's it!

## Usage

Create a group of DOM elements that can be resorted via drag and drop inside the parent container 'demo'.

```

<div class="my-container">
  <div>...</div>
  <div>...</div>
  <div>...</div>
  <div>...</div>
</div>

```

and just call it:

```

$('.my-container').dad();

```

## Options

The options allow you to better customize your drag and drop implementation by passing a JSON object when calling `dad` plugin. See below all options in details:

### active

**Type:** `boolean`
**Default value:** `false`

**Description:**

Setting it to false prevents the containers to start dragging. You can check if a container is enabled or disabled by the attribute `data-dad-active` or using the instance like:

```

var instance = $(".my-container").dad({ active: false });
console.log(instance.active); // prints false

```

### draggable

**Type:** `string`_(selector)_ | `false`
**Default value:** `false`

**Description:**

Passing a selector restricts the drag to start only when the element from the given selector is clicked within the child element.
If `false` fallsback to the target child element.

```

// the drag will only start when mouse is hovering .my-drag-selector
var instance = $(".my-container").dad({
  draggable: ".my-drag-selector"
});

```

### exchangeable

**Type:** `boolean`
**Default value:** `true`

**Description:**

Allows containers of the same type _(called with the same `.dad` call)_ to exchange children.

### transition

**Type:** `number`
**Default value:** `200`

**Description:**

Transition time in ms of the drop animation

### placeholderTarget

**Type:** `string`_(selector)_ | `false`
**Default value:** `false`

**Description:**

The target element within the current child to be covered by the placeholder.

### placeholderTemplate

**Type:** `string`_(selector)_
**Default value:** `<div />`

**Description:**

Enable the full customization of the placeholder by passing a HTML string. E.g.

```

$(".my-container").dad({
  placeholderTemplate: "<div style=\"border: 1px dashed black\">i'm a placeholder</div>"
})

```

### cloneClass

**Type:** `string`_(selector)_
**Default value:** `dad-clone`

**Description:**

This is a helper class added to the _clone_ element.

```

$(".my-container").dad({
  cloneClass: "another-clone-class"
})

```

### targetClass

**Type:** `string`_(selector)_
**Default value:** `dad-target`

**Description:**

This is a helper class added to the _target_ element.

```
// javascript
$(".my-container").dad({
  targetClass: "another-target-class"
})

```

### placeholderClass

**Type:** `string`_(selector)_
**Default value:** `dad-placeholder`

**Description:**

This is a helpers class added to the _placeholder_ element.

```
$(".my-container").dad({
  targetClass: "another-target-class"
})
```

You can add those cool dashed borders like:

```
.dad-placeholder {
  border: 4px dashed #639bf6;
}

```

## Methods

Methods allow you to control your container from Dad's class instance. See below:

### activate

Set the container's `active` state to `true`

```

var instance = $('.my-container').dad();
instance.activate();

```

### deactivate

Set the container's `active` state to `false`

```

var instance = $('.my-container').dad();
instance.deactivate();

```

## Events

Events are provided to handle the drag and drop actions such as drag start, drag end, drop... See below:

### dadDragStart

Event triggered when user starts dragging an element.

```

$(".my-container").on("dadDragStart", function (e, targetElement) {
  // do your thing here
})

```

### dadDragStart

Event triggered when the current dragged element has its position updated.

```

$(".my-container").on("onDadUpdate", function (e, targetElement) {
  // do your thing here
})

```

### dadDragExchange

Event triggered when the containers exchange children.

```

$(".my-container").on("onDadUpdate", function (e, sourceContainer, targetContainer) {
  // do your thing here
})

```

### dadDragEnd

Event triggered when user drops an element, this event is triggered before the dropping animation.

```

$(".my-container").on("dadDragEnd", function (e, targetElement) {
  // do your thing here
})

```

### dadDrop

Event triggered when the element is dropped, this event is triggered after the dropping animation.

```

$(".my-container").on("dadDrop", function (e, droppedElement) {
  // do your thing here
})

```

## Demos

Check the demos at [plugin website](http://konsole.studio/dad)

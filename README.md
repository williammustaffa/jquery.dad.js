# jquery.dad.js

DAD: A simple and awesome Drag And Drop plugin!

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
  - [dadDropStart](#daddropstart)
  - [dadDropStart](#daddropstart-1)
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

You can call options width a JSON object.

### active

**Type:** `boolean`
**Default value:** `false`

**Description:**

Setting it to false prevents the containers to start dragging. You can check if a container is enabled or disabled by the attribute `dada-dat-active` or using the instance like:

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

Transition time in ms of the drag animation

### placeholderTarget

**Type:** `string`_(selector)_ | `false`
**Default value:** `false`

**Description:**

The target element within the current child to be covered by the placeholder.

### placeholderTemplate

**Type:** `string`_(selecor)_
**Default value:** `<div />`

**Description:**

Enable the full customization of the placeholder by passing a HTML string. E.g.

```

$(".my-container").dad({
  placeholderTemplate: "<div style=\"border: 1px dashed black\">i'm a placeholder</div>"
})

```

### cloneClass

**Type:** `string`_(selecor)_
**Default value:** `dad-clone`

**Description:**

This is a helper class added to the _clone_ element.

```

$(".my-container").dad({
  cloneClass: "another-clone-class"
})

```

### targetClass

**Type:** `string`_(selecor)_
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

**Type:** `string`_(selecor)_
**Default value:** `dad-placeholder`

**Description:**

This is a helpers class added to the _placeolder_ element.

```
$(".my-container").dad({
  targetClass: "another-target-class"
})
```

You can add those cool dashed borders lie:

```
.dad-placeholder {
  border: 4px dashed #639bf6;
}

```

## Methods

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

### dadDropStart

This event is triggered imediatelly after the user drops the element. The callback sends the dropped element (as DOM node) as the second argument.

```

$(".my-container").on("dadDropStart", function (e, droppedElement) {
  // do your thing here
})

```

### dadDropStart

This event is triggered when the dropping animation ends. The callback sends the dropped element (as DOM node) as the second argument as well.

```

$(".my-container").on("dadDropEnd", function (e, droppedElement) {
  // do your thing here
})

```

## Demos

Check the demos at [plugin website](http://konsole.studio/dad)

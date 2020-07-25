/*!
 * jquery.dad.js v1 (http://konsolestudio.com/dad)
 * Author William Lima
 */

(function ($) {
  "use strict";

  var supportsTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;

  /**
   * Mouse constructor
   */
  function DadMouse() {
    this.positionX = 0;
    this.positionY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * Mouse udpate event
   * @param {Event}
   */
  DadMouse.prototype.update = function (e) {
    // Check if it is touch
    if (supportsTouch && e.type == "touchmove") {
      var targetEvent = e.originalEvent.touches[0];
      var mouseTarget = document.elementFromPoint(
        targetEvent.clientX,
        targetEvent.clientY
      );
      $(mouseTarget).trigger("touchenter"); // TODO: check if this is necessary

      // update mouse coordinates from touch
      this.positionX = targetEvent.pageX;
      this.positionY = targetEvent.pageY;
    } else {
      this.positionX = e.pageX;
      this.positionY = e.pageY;
    }
  };

  /**
   * DAD class constructor
   * @param {element} element
   * @param {options} options
   */
  function Dad(element, options) {
    this.options = this.parseOptions(options);

    // jQuery elements
    this.$container = $(element);
    this.$current = null;
    this.$target = null;
    this.$clone = null;

    // Inner variables
    this.mouse = new DadMouse();
    this.holding = false;
    this.dragging = false;
    this.dropzones = [];

    // Configure and setup
    this.setActive(this.options.active);
    this.setup();
  }

  /**
   * Static attribute that stores default dad options
   */
  Dad.defaultOptions = {
    placeholder: {
      template: "<div style='border: 4px dashed #639bf6'></div>",
      target: false,
    },
    active: true,
    draggable: false,
    transition: 200,
    debug: false,
  };

  /**
   * Merge provided options with the defaults
   */
  Dad.prototype.parseOptions = function (options) {
    // Make defaults immutable
    var parsedOptions = $.extend(true, {}, Dad.defaultOptions);

    if (options) {
      $.each(parsedOptions, function (key, value) {
        var overrideValue = options[key];

        if (typeof overrideValue !== "undefined") {
          // Valid for arrays as well
          if (typeof overrideValue === "object") {
            parsedOptions[key] = $.extend(parsedOptions[key], overrideValue);
          } else {
            parsedOptions[key] = overrideValue;
          }
        }
      });
    }

    if (parsedOptions.debug) {
      console.info(
        "[jquery.dad.js] Created a new dad container with the following options:",
        parsedOptions
      );
    }

    return parsedOptions;
  };

  /**
   * Add all required listeners and
   * styles that prevents some issues when dragging
   */
  Dad.prototype.setup = function () {
    var self = this;

    // Prevent user from highlight text
    this.$container.css({
      position: "relative",
      "-webkit-touch-callout": "none",
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
    });

    // Prevent dragging images on IE
    this.$container.find("img").attr("ondragstart", "return false");

    // Create a callback for click event
    function onChildClick(e) {
      self.prepare(e, this);
    }

    // Create a callback for enter event
    function onChildEnter(e) {
      if (self.dragging) {
        self.updatePlaceholder(e, this);
      }
    }

    // Add element event listeners
    this.$container.on("mousedown touchstart", "> *", onChildClick);
    this.$container.on("mouseenter touchenter", "> *", onChildEnter);

    // Add window event listeners
    $("body").on("mousemove touchmove", this.update.bind(this));
    $("body").on("mouseup touchend", this.end.bind(this));

    // Cancelling drag due to browser native actions
    // Note: Using window on mouseleave causes a bug...
    $("body").on("mouseleave", this.end.bind(this));
    $(window).on("blur", this.end.bind(this));
  };

  /**
   * Prepare container to start dragging
   *
   * @param {*} event click/mousedown event
   * @param {*} element target element
   */
  Dad.prototype.prepare = function (e, element) {
    var draggable = this.options.draggable;
    var shouldStartDragging =
      this.active && (draggable ? $(draggable + ":hover").length : true);

    if (shouldStartDragging) {
      var $target = $(element);

      this.holding = true;
      this.$target = $target;
      this.$current = $target.closest(this.$container);
      this.mouse.update(e);
    }
  };

  /**
   * First step, occurs on mousedown
   * @param {Event}
   */
  Dad.prototype.start = function (e) {
    // Set target and get its metrics
    var $target = this.$target;

    // Add clone
    var $clone = $target.clone().css({
      position: "absolute",
      zIndex: 9999,
      pointerEvents: "none",
      height: $target.outerHeight(),
      width: $target.outerWidth(),
    });

    // Add placeholder
    var $placeholder = $(this.options.placeholder.template).css({
      position: "absolute",
      zIndex: 9998,
      pointerEvents: "none",
      margin: 0,
      height: $target.outerHeight(),
      width: $target.outerWidth(),
    });

    // Set mouse offset values
    this.mouse.offsetX = this.mouse.positionX - $target.offset().left;
    this.mouse.offsetY = this.mouse.positionY - $target.offset().top;

    $target.css("visibility", "hidden");
    $target.attr("data-dad-target", true);

    // Setting variables
    this.dragging = true;
    this.$target = $target;
    this.$clone = $clone;
    this.$placeholder = $placeholder;

    // Add elements to container
    this.$current.append($placeholder).append($clone);

    // Set clone and placeholder position
    this.updateClonePosition();
    this.updatePlaceholderPosition();
  };

  /**
   * Middle step, occurs on mousemove
   */
  Dad.prototype.update = function (e) {
    this.mouse.update(e);

    // If user is holding but not dragging
    // Call start method
    if (this.holding && !this.dragging) {
      this.start(e);
    }

    if (this.dragging) {
      this.updateClonePosition();
    }
  };

  /**
   * Final step, ocurrs on mouseup
   */
  Dad.prototype.end = function () {
    this.holding = false;

    // Finish dragging if is dragging
    if (this.dragging) {
      var $current = this.$current;
      var $target = this.$target;
      var $clone = this.$clone;
      var $placeholder = this.$placeholder;

      var animateToX = $target.offset().left - $current.offset().left;
      var animateToY = $target.offset().top - $current.offset().top;

      // Do transition from clone to target
      $clone.animate(
        { top: animateToY, left: animateToX },
        this.options.transition,
        function () {
          $clone.remove();
          $placeholder.remove();
          $target.removeAttr("data-dad-target");
          $target.css("visibility", "");
        }
      );

      // Reset variables
      this.dragging = false;

      // Reset elements
      this.$current = null;
      this.$target = null;
      this.$clone = null;
      this.$placeholder = null;
    }
  };

  /**
   * Dad update clone position based on the mouse position
   */
  Dad.prototype.updateClonePosition = function () {
    // Get positions
    var targetX =
      this.mouse.positionY - this.$current.offset().top - this.mouse.offsetY;
    var targetY =
      this.mouse.positionX - this.$current.offset().left - this.mouse.offsetX;

    // Update clone
    this.$clone.css({ top: targetX, left: targetY });
  };

  /**
   * Dad update placeholder position by
   * checking the current placeholder position
   */
  Dad.prototype.updatePlaceholder = function (e, element) {
    var $element = $(element);

    if ($element.index() > this.$target.index()) {
      $element.after(this.$target);
    } else {
      $element.before(this.$target);
    }

    this.updatePlaceholderPosition();
  };

  /**
   * Update placeholder position based on its options
   */
  Dad.prototype.updatePlaceholderPosition = function () {
    var placeholderOptions = this.options.placeholder;

    var $target = placeholderOptions.target
      ? this.$target.find(placeholderOptions.target)
      : this.$target;

    var targetTop = $target.offset().top - this.$current.offset().top;
    var targetLeft = $target.offset().left - this.$current.offset().left;
    var targetHeight = $target.outerHeight();
    var targetWidth = $target.outerWidth();

    this.$placeholder.css({
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
    });
  };

  /**
   * Update container active status which later
   * will prevent the dragging to start on the prepare function
   */
  Dad.prototype.setActive = function (isActive) {
    this.active = isActive;
    this.$container.attr("data-dad-active", isActive);
  };

  Dad.prototype.activate = function () {
    this.setActive(true);
  };

  Dad.prototype.deactivate = function () {
    this.setActive(false);
  };

  Dad.prototype.addDropzone = function () {};

  $.fn.dad = function (options) {
    return new Dad(this, options);
  };
})(jQuery);

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

  var mouse = new DadMouse();

  /**
   * DAD class constructor
   * @param {element} element
   * @param {options} options
   */
  function Dad(element, options) {
    this.options = options;

    // jQuery elements
    this.$container = $(element);
    this.$children = this.$container.children();
    this.$target = null;
    this.$clone = null;

    // General variables
    this.mouse = new DadMouse();
    this.active = true;
    this.holding = false;
    this.dragging = false;

    // Add event listeners, data attributes and etc
    this.setup();
  }

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

    // Add dad-id attribute to children
    this.$children.each(function (index) {
      $(this).data("dad-id", index);
    });

    // Add element event listeners
    this.$children.on("mousedown touchstart", function (e) {
      self.prepare(e, this);
    });

    // Add listener for placeholder
    this.$children.on("mouseenter touchenter", function (e) {
      if (self.dragging) {
        self.updatePlaceholderPosition(e, this);
      }
    });

    // Add window event listeners
    $("body").on("mousemove touchmove", this.update.bind(this));
    $("body").on("mouseup touchend", this.end.bind(this));

    // Cancelling drag due to browser native actions
    $("body").on("mouseleave", this.end.bind(this));
    $(window).on("blur", this.end.bind(this));
  };

  Dad.prototype.prepare = function (e, element) {
    var draggable = this.options.draggable;
    var shouldStartDragging = draggable ? $(draggable + ":hover").length : true;

    if (shouldStartDragging) {
      this.holding = true;
      this.$target = $(element);
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
    var targetTop = $target.offset().top - this.$container.offset().top;
    var targetLeft = $target.offset().left - this.$container.offset().left;
    var targetHeight = $target.outerHeight();
    var targetWidth = $target.outerWidth();

    // Add clone
    var $clone = $target.clone().css({
      position: "absolute",
      zIndex: 9999,
      pointerEvents: "none",
      height: targetHeight,
      width: targetWidth,
    });

    // Add placeholder
    var $placeholder = $(this.options.placeholder).css({
      position: "absolute",
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
    });

    // Set mouse offset values
    this.mouse.offsetX = this.mouse.positionX - $target.offset().left;
    this.mouse.offsetY = this.mouse.positionY - $target.offset().top;

    $target.data("dad-active", true);
    $target.css("visibility", "hidden");

    // Setting variables
    this.dragging = true;
    this.$target = $target;
    this.$clone = $clone;
    this.$placeholder = $placeholder;

    // Add elements to container
    this.$container.append($placeholder).append($clone);

    // Set clone position
    this.updateClonePosition();
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
      var $container = this.$container;
      var $target = this.$target;
      var $clone = this.$clone;
      var $placeholder = this.$placeholder;

      var animateToX = $target.offset().left - $container.offset().left;
      var animateToY = $target.offset().top - $container.offset().top;

      // Do transition from clone to target
      $clone.animate(
        { top: animateToY, left: animateToX },
        this.options.transition,
        function () {
          $clone.remove();
          $placeholder.remove();
          $target.removeData("dad-active");
          $target.css("visibility", "visible");
        }
      );

      // Reset variables
      this.dragging = false;
      this.$target = null;
      this.$clone = null;
      this.$placeholder = null;
    }
  };

  Dad.prototype.updateClonePosition = function () {
    // Get positions
    var containerX = this.$container.offset().top;
    var containerY = this.$container.offset().left;
    var targetX = this.mouse.positionY - containerX - this.mouse.offsetY;
    var targetY = this.mouse.positionX - containerY - this.mouse.offsetX;

    // Update clone positi
    this.$clone.css({ top: targetX, left: targetY });
  };

  /**
   * Dad update placeholder position by
   * checking the current placeholder position
   */
  Dad.prototype.updatePlaceholderPosition = function (e, element) {
    var $element = $(element);

    if ($element.index() > this.$target.index()) {
      $element.after(this.$target);
    } else {
      $element.before(this.$target);
    }

    var $target = this.$target;
    var targetTop = $target.offset().top - this.$container.offset().top;
    var targetLeft = $target.offset().left - this.$container.offset().left;
    var targetHeight = $target.outerHeight();
    var targetWidth = $target.outerWidth();

    this.$placeholder.css({
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
    });
  };

  Dad.prototype.activate = function () {
    // $daddy.addClass("dad-active"); do we really need to toggle this class?
    this.active = false;
  };

  Dad.prototype.deactivate = function () {
    this.active = false;
  };

  $.fn.dad = function (options) {
    var options = $.extend(
      {
        placeholder: "<div style='border: 4px dashed #706fd3'></div>",
        active: true,
        draggable: false,
        transition: 200,
      },
      options
    );

    $(this).each(function () {
      this.dad = new Dad(this, options);
    });

    return {
      addDropzone: function () {},
    };
  };
})(jQuery);

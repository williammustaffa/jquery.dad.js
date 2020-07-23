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
      var mouseTarget = document.elementFromPoint(ev.clientX, ev.clientY);
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
    this.dragging = false;

    // Add event listeners, data attributes and etc
    this.setup();
  }

  Dad.prototype.setup = function () {
    var self = this;

    // Add dad-id attribute to children
    this.$children.each(function (index) {
      var $this = $(this);
      $this.data("dad-id", index);
      $this.data("dad-position", index);

      $this.find("img").attr("ondragstart", "return false");
    });

    // Add element event listeners
    this.$children.on("mousedown touchstart", function (e) {
      if (self.dragging) return;
      self.start(e, this);
    });

    // Add window event listeners
    $("body").on("mousemove touchmove", this.update.bind(this));
    $("body").on("mouseup touchend", this.end.bind(this));
  };

  /**
   * First step, occurs on mousedown
   * @param {Event}
   */
  Dad.prototype.start = function (e, element) {
    // Update "mouse" position for touch devices
    if (e.type == "touchstart") {
      this.mouse.updatePosition(e.originalEvent.touches[0]);
    } else {
      this.mouse.update(e);
    }

    // Add clone
    var $target = $(element);
    var $clone = $target
      .clone()
      .css("position", "absolute")
      .css("height", $target.outerHeight())
      .css("width", $target.outerWidth());

    // Add placeholder
    var $placeholder = $("<div />")
      .css("top", $target.offset().top - this.$container.offset().top)
      .css("left", $target.offset().left - this.$container.offset().left)
      .css("width", $target.outerWidth())
      .css("height", $target.outerHeight());

    // Set mouse offset values
    this.mouse.offsetX = this.mouse.positionX - $target.offset().left;
    this.mouse.offsetY = this.mouse.positionY - $target.offset().top;

    $target.css("visibility", "hidden");

    // Setting variables
    this.dragging = true;
    this.$target = $target;
    this.$clone = $clone;
    this.$placeholder = $placeholder;

    // Add elements to container
    this.$container.append($clone).append($placeholder);

    // Set clone position
    this.updateClonePosition();

    $("html, body").addClass("dad-noSelect");
  };

  /**
   * Middle step, occurs on mousemove
   */
  Dad.prototype.update = function (e) {
    if (!this.dragging) return;

    // Check if it is touch
    if (supportsTouch && e.type == "touchmove") {
      var mouseTarget = document.elementFromPoint(ev.clientX, ev.clientY);
      $(mouseTarget).trigger("touchenter"); // TODO: check if this is necessary
      this.mouse.update(e.originalEvent.touches[0]);
    } else {
      this.mouse.update(e);
    }

    // Ipdate clone position
    this.updateClonePosition();
  };

  /**
   * Final step, ocurrs on mouseup
   */
  Dad.prototype.end = function () {
    if (!this.dragging) return;

    var $container = this.$container;
    var $target = this.$target;
    var $clone = this.$clone;
    var $placeholder = this.$placeholder;

    const targetX = $target.offset().left - $container.offset().left;
    const targetY = $target.offset().top - $container.offset().top;

    // Do transition from clone to target
    $clone.animate({ top: targetY, left: targetX }, 200, function () {
      $clone.remove();
      $placeholder.remove();
      $target.css("visibility", "visible");
    });

    // Update data-dad-id
    // updatePosition($daddy);

    // Reset variables
    this.dragging = false;
    this.$target = null;
    this.$clone = null;
    this.$placeholder = null;

    $("html, body").removeClass("dad-noSelect");
  };

  Dad.prototype.updateClonePosition = function () {
    if (!this.dragging) return;

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
  Dad.prototype.updatePlaceholderPosition = function () {
    if (!this.$target) return;

    var $origin = $('<span style="display:none"></span>');
    var $newplace = $('<span style="display:none"></span>');

    // TODO: check Who puts this active class
    if (obj.prevAll().hasClass("active")) {
      obj.after($newplace);
    } else {
      obj.before($newplace);
    }

    mouse.target.before($origin);
    $newplace.before(mouse.target);

    mouse.placeholder.css({
      top: this.$target.offset().top - $container.offset().top,
      left: this.$target.offset().left - $container.offset().left,
      width: this.$target.outerWidth() - 10,
      height: this.$target.outerHeight() - 10,
    });

    $origin.remove();
    $newplace.remove();
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
        target: ">div",
        placeholder: "",
        active: true,
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

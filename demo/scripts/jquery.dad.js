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
    // Update mouse coordinates
    this.positionX = e.pageX;
    this.positionY = e.pageY;
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

    // Add event listeners, data attributes and etc
    this.setup();
  }

  Dad.prototype.setup = function () {
    // Add dad-id attribute to children
    this.$children.each(function (index) {
      var $this = $(this);
      $this.data("dad-id", index);
      $this.data("dad-position", index);
    });
    // Add element event listeners
    this.$children.on("mousedown touchstart", this.start.bind(this));
    // Add window event listeners
    $(window).on("mousemove touchmove", this.update.bind(this));
    $(window).on("mouseup touchend", this.end.bind(this));
  };

  /**
   * First step, occurs on mousedown
   * @param {Event}
   */
  Dad.prototype.start = function (e) {
    // TODO: draggable
    // If already has a target, do nothing
    if (this.$target) return;

    // Update "mouse" position for touch devices
    if (e.type == "touchstart") {
      this.mouse.updatePosition(e.originalEvent.touches[0]);
    }

    this.$target = $(e.target);

    // Add clone
    this.$clone = this.$target.clone();
    this.$container.append(this.$clone);

    // Add placeholder
    this.$placeholder = $("<div />");
    this.$placeholder.css({
      top: this.$target.offset().top - this.$container.offset().top,
      left: this.$target.offset().left - this.$container.offset().left,
      width: this.$target.outerWidth() - 10,
      height: this.$target.outerHeight() - 10,
      lineHeight: this.$target.height() - 18 + "px",
      textAlign: "center",
    });

    this.$container.append(mouse.placeholder);

    // Update clone offset
    var borderLeft = Math.floor(
      parseFloat(this.$container.css("border-left-width"))
    );
    var borderTop = Math.floor(
      parseFloat(this.$container.css("border-top-width"))
    );

    this.mouse.offsetX =
      this.mouse.positionX +
      this.$target.offset().left +
      this.$container.offset().left +
      borderLeft;

    this.mouse.offsetY =
      this.mouse.positionY -
      this.$target.offset().top +
      this.$container.offset().top +
      borderTop;

    // Add styles
    this.$target.css("visibility", "hidden"); //.add-class active
    this.$clone.css("position", "absolute");

    // Set clone position
    this.updateClonePosition();

    // Disable item selection
    // TODO: add inline css
    $("html, body").addClass("dad-noSelect");
  };

  /**
   * Middle step, occurs on mousemove
   */
  Dad.prototype.update = function (e) {
    // Check if it is touch
    if (supportsTouch && e.type == "touchmove") {
      var mouseTarget = document.elementFromPoint(ev.clientX, ev.clientY);
      $(mouseTarget).trigger("touchenter"); // TODO: check if this is necessary
      // Update mouse using touch event
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
    if (!this.$target) return;

    var $target = this.$target;
    var $clone = this.$clone;
    var $container = this.$container;

    // Maybe we will use this in the future
    //Math.floor(parseFloat($daddy.css('border-left-width')));
    //Math.floor(parseFloat($daddy.css('border-top-width')));
    if ($.contains($container[0], $target[0])) {
      // Do transition from clone to target
      $clone.animate(
        {
          top: $target.offset().top - $container.offset().top,
          left: $target.offset().left - $container.offset().left,
        },
        300,
        this.reset.bind(this)
      );
    } else {
      $clone.fadeOut(300, this.reset.bind(this));
    }

    // updatePosition($daddy);

    $("html, body").removeClass("dad-noSelect");
  };

  Dad.prototype.reset = function () {
    // Reset target visibility
    if (this.$target) this.$target.css("visibility", "visible");
    // Remove elements if existent
    if (this.$clone) this.$clone.remove();
    if (this.$placeholder) this.$placeholder.remove();

    // Reset variables
    this.$target = null;
    this.$clone = null;
    this.$placeholder = null;
  };

  Dad.prototype.updateClonePosition = function () {
    if (!this.$clone) return;

    var mouse = this.mouse;

    this.$clone.css({
      top: mouse.positionY - mouse.offsetY,
      left: mouse.positionX - mouse.offsetX,
    });
  };

  /**
   * Dad update placeholder position by
   * checking the current placeholder position
   */
  Dad.prototype.updatePlaceholderPosition = function () {
    if (!this.$target) return;

    var $container = this.$container;
    var $target = this.target;
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
      top: $target.offset().top - $container.offset().top,
      left: $target.offset().left - $container.offset().left,
      width: $target.outerWidth() - 10,
      height: $target.outerHeight() - 10,
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

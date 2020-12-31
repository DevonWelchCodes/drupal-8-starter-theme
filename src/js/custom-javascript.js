document.addEventListener("DOMContentLoaded", function(event) {
  // beginning document ready


    // Initalize Lazy Load
      var lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy"
        // ... more custom settings?
      });

      if (lazyLoadInstance) {
        lazyLoadInstance.update();
      }



    // end document ready
});

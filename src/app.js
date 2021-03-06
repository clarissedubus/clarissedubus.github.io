/**
 * File:    app.js
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 */

// Google Analytics
// ================
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-22557714-6', 'auto');
ga('send', 'pageview');

import {
    centerVerticallyInElement,
    setMainSectionHeight,
    render
} from './utils';

$(document).ready(function() {
    render();
    var $grid = $('.grid'),
        $gallery = $('.gallery');

    imagesLoaded($grid, function() {

        // Shuffle images around.
        var imgs = $grid.children(),
            popups = $gallery.children(),
            newPopups = [];
        imgs = _.shuffle(imgs);

        // Ensure order of gallery stays the same.
        _.each(imgs, function(img) {
            var i = parseInt($(img).attr('data-index'));
            if (typeof(i) !== 'undefined') {
                newPopups.push(popups[i]);
            }
        });

        // Reinsert in new order.
        $grid.html(imgs);
        $gallery.html(newPopups);

        // Initialise Magnific Popup
        $gallery.magnificPopup({
            delegate: 'a',
            gallery: {
                enabled: true
            },
            type: 'image'
        });

        // Invert navigation functions for popup.
        $.magnificPopup.instance.next = function() {
            $.magnificPopup.proto.prev.call(this);
        };
        $.magnificPopup.instance.prev = function() {
            $.magnificPopup.proto.next.call(this);
        };

        // Initialise Masonry
        $grid.masonry({

            // set itemSelector so .grid-sizer is not used in layout
            itemSelector: '.grid-item',
            stamp: '.stamp',

            // use element for option
            columnWidth: '.grid-sizer',
            percentPosition: true,
            isOriginTop: false
        });

        // Hide loader.
        $('#loader').hide();

        // Ease in the grid.
        $grid.animate({
           "opacity": 1
        }, "slow");

        // Bind event handlers to each grid item.
        $('.grid-item.grid-img.grid-project').each(function() {
            $(this).hover(
                function() {
                    $(this).children('.project-hover').css({
                        visibility: 'visible'
                    });
                },
                function() {
                    $(this).children('.project-hover').css({
                        visibility: 'hidden'
                    });
                }
            );
            $(this).children('.project-hover').click(function() {
                window.location.href = $(this).attr('data-href');
            });
        });

        // Bind event handlers to each grid item.
        $('.grid-item.grid-img.grid-gallery').each(function(i) {
            $(this).click(function() {
                $('.gallery').magnificPopup('open', i);
            });
        });
    });

    // Toggle nav menu.
    $('.toggle-nav').click(function() {
        $('.nav-left').toggle();
    })

});

$(window).resize(function() {
    render();
});
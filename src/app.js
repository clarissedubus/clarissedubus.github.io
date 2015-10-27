/**
 * File:    app.js
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 */

var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));

try {
    var pageTracker = _gat._getTracker("UA-XXXXXXXX-X");
    pageTracker._trackPageview();
} catch(err) {}

function centerVerticallyInElement($element, $parent, $space) {
    var ph = $parent.height(),
        eoh = $element.outerHeight();

    $space.css({
        'height': (ph - eoh) / 2 + 'px'
    });
}

function setMainSectionHeight() {
    var $w = $(window),
        hoh = $('header').outerHeight(),
        fph = $('footer').outerHeight(),
        wh = $w.height(),
        noh = ($w.width() > 991) ? 0 : $('#nav-col').outerHeight();
    $('#main-section').css({
        'height': (wh - hoh - fph - noh) + 'px'
    });
}

function reset() {
    var space = '20px',
        $mainSpace = $('#main-space'),
        $navSpace = $('#nav-space');

    $mainSpace.css({
        'height': space
    });
    $navSpace.css({
        'height': space
    });
}

function render() {
    var $nav = $('#nav'),
        $navParent = $('#nav-parent'),
        $navSpace = $('#nav-space');
    var $mainContent = $('#main-content'),
        $main = $('main'),
        $mainSpace = $('#main-space');
    setMainSectionHeight();
    if ($(window).width() > 991) {
        centerVerticallyInElement($nav, $navParent, $navSpace);
        centerVerticallyInElement($mainContent, $main, $mainSpace);
    } else {
        reset();
    }
}

$(document).ready(function() {
    render();
    var $grid = $('.grid');
    imagesLoaded( $grid, function() {

        // Initialise Magnific Popup
        $('.gallery').magnificPopup({
            delegate: 'a',
            gallery: {
                enabled: true
            },
            type: 'image'
        });

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


});

$(window).resize(function() {
    render();
});
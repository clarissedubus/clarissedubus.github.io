/**
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
    $('.grid').masonry({
        // set itemSelector so .grid-sizer is not used in layout
        itemSelector: '.grid-item',

        // use element for option
        columnWidth: '.grid-sizer',
        percentPosition: true
    });
    $('.grid-item').hover(
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

});

$(window).resize(function() {
    render();
});
/**
 * File:    utils.js
 * Author:  @juancarlosfarah
 * Date:    05/03/2016
 */

/**
 * Centers an element vertically inside another element.
 */
export const centerVerticallyInElement = ($element, $parent, $space) => {
    if ($element && $parent && $space) {
        var ph = $parent.height(),
            eoh = $element.outerHeight();
        $space.css({
            'height': (ph - eoh) / 2 + 'px'
        });
        return true;
    }
    return false;
};

/**
 * Sets the height of the main section.
 */
export const setMainSectionHeight = () => {
    const sm = 991;
    var $w = $(window),
        hoh = $('header').outerHeight(),
        fph = $('footer').outerHeight(),
        wh = $w.height(),
        noh = ($w.width() > sm) ? 0 : $('#nav-col').outerHeight();
    $('#main-section').css({
        height: (wh - hoh - fph - noh) + 'px'
    });
};

/**
 * Resets the layout.
 */
function reset() {
    var space = '20px',
        $mainSpace = $('#main-space'),
        $navSpace = $('#nav-space');
    $mainSpace.css({
        height: space
    });
    $navSpace.css({
        height: space
    });
}

/**
 * Renders the page as required.
 */
export const render = () => {
    const xs = 768;
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

    // Show or hide nav menu.
    if ($(window).width() > xs) {
        $('.nav-left').show();
    } else {
        $('.nav-left').hide();
    }
};

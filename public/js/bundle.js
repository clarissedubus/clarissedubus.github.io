(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

/**
 * File:    app.js
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 */

// Google Analytics
// ================
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-22557714-6', 'auto');
ga('send', 'pageview');

$(document).ready(function () {
    (0, _utils.render)();
    var $grid = $('.grid'),
        $gallery = $('.gallery');

    imagesLoaded($grid, function () {

        // Shuffle images around.
        var imgs = $grid.children(),
            popups = $gallery.children(),
            newPopups = [];
        imgs = _.shuffle(imgs);

        // Ensure order of gallery stays the same.
        _.each(imgs, function (img) {
            var i = parseInt($(img).attr('data-index'));
            if (typeof i !== 'undefined') {
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
        $.magnificPopup.instance.next = function () {
            $.magnificPopup.proto.prev.call(this);
        };
        $.magnificPopup.instance.prev = function () {
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
        $('.grid-item.grid-img.grid-project').each(function () {
            $(this).hover(function () {
                $(this).children('.project-hover').css({
                    visibility: 'visible'
                });
            }, function () {
                $(this).children('.project-hover').css({
                    visibility: 'hidden'
                });
            });
            $(this).children('.project-hover').click(function () {
                window.location.href = $(this).attr('data-href');
            });
        });

        // Bind event handlers to each grid item.
        $('.grid-item.grid-img.grid-gallery').each(function (i) {
            $(this).click(function () {
                $('.gallery').magnificPopup('open', i);
            });
        });
    });

    // Toggle nav menu.
    $('.toggle-nav').click(function () {
        $('.nav-left').toggle();
    });
});

$(window).resize(function () {
    (0, _utils.render)();
});

},{"./utils":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * File:    utils.js
 * Author:  @juancarlosfarah
 * Date:    05/03/2016
 */

/**
 * Centers an element vertically inside another element.
 */
var centerVerticallyInElement = exports.centerVerticallyInElement = function centerVerticallyInElement($element, $parent, $space) {
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
var setMainSectionHeight = exports.setMainSectionHeight = function setMainSectionHeight() {
    var sm = 991;
    var $w = $(window),
        hoh = $('header').outerHeight(),
        fph = $('footer').outerHeight(),
        wh = $w.height(),
        noh = $w.width() > sm ? 0 : $('#nav-col').outerHeight();
    $('#main-section').css({
        height: wh - hoh - fph - noh + 'px'
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
var render = exports.render = function render() {
    var xs = 768;
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

},{}]},{},[1]);

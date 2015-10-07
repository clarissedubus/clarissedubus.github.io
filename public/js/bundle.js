(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 */

"use strict";

var gaJsHost = "https:" == document.location.protocol ? "https://ssl." : "http://www.";
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));

try {
    var pageTracker = _gat._getTracker("UA-XXXXXXXX-X");
    pageTracker._trackPageview();
} catch (err) {}

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
        noh = $w.width() > 991 ? 0 : $('#nav-col').outerHeight();
    $('#main-section').css({
        'height': wh - hoh - fph - noh + 'px'
    });
}

function reset() {
    var space = '20px',
        $mainSpace = $('#main-space'),
        $navSpace = $('#nav-space'),
        $footerSpace = $('#footer-space');

    $mainSpace.css({
        'height': space
    });
    $navSpace.css({
        'height': space
    });
    $footerSpace.css({
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
        $('footer').children('.row').children().each(function () {
            centerVerticallyInElement($(this), $('footer'), $('#footer-space'));
        });
    } else {
        reset();
    }
}

$(document).ready(function () {
    render();
});

$(window).resize(function () {
    render();
});

},{}]},{},[1]);

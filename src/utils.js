/**
 * File:    utils.js
 * Author:  @juancarlosfarah
 * Date:    05/03/2016
 */

export const centerVerticallyInElement = function ($element, $parent, $space) {

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
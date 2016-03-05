/**
 * File:    utils.spec.js
 * Author:  @juancarlosfarah
 * Date:    05/03/2016
 */

const expect = require('chai').expect;

import { centerVerticallyInElement } from '../src/utils';

describe("Center Vertically", function() {
    it("does not run if called without arguments", function() {
        expect(centerVerticallyInElement()).to.equal(false);
    });
});
/**
 * @fileoverview
 * General utilities to write js code
 * @author Dissegna Stefano
 */

/**
 * Define an abstract method
 * @param {String} name of the abstract method
 */
Function.prototype.abstractMethod = function (name) {
  this[name] = function () {
    throw "Can't call abstract method";
  };
};

/**
 * Define reader function getSlot
 * @param {String} name of the slot with first letter capitalized
 */
Function.prototype.reader = function (slot) {
  this.prototype['get' + slot] = function () {
    return this[slot];
  };
};

/**
 * Define writer function setSlot(x)
 * @param {String} name of the slot with first letter capitalized
 */
Function.prototype.writer = function (slot) {
  this.prototype['set' + slot] = function (x) {
    return (this[slot] = x);
  };
};

/**
 * Define accessors functions getSlot and setSlot(x)
 * @param {String} name of the slot with first letter capitalized
 */
Function.prototype.accessors = function (slot) {
  this.reader(slot);
  this.writer(slot);
};

/**
 * Apply a function to each element of an array
 * @param {Function} fn function to apply. fn should accept one argument
 */
Array.prototype.each = function (fn) {
  for (var i = 0; i < this.length; ++i) {
    fn.call(this, this[i]);
  }
};

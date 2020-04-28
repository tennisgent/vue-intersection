global.IntersectionObserver = function IntersectionObserver () {
  this.targets = [];
  this.observe = jest.fn(target => {
    this.targets.push(target);
  });
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
  this.takeRecords = jest.fn(() => this.targets);
}

module.exports = {
  preset: '@vue/cli-plugin-unit-jest'
}

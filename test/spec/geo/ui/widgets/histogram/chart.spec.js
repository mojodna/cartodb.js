describe('widgets/histogram/chart', function() {

  afterEach(function() {
    $('.js-chart').remove();
  });

  beforeEach(function() {
    d3.select("body").append("svg").attr('class', 'js-chart');

    this.width = 300;
    this.height = 100;

    d3.select($('.js-chart')[0])
    .attr('width',  this.width)
    .attr('height', this.height)
    .append('g')
    .attr('class', 'Canvas');

    this.data = genHistogramData(20);
    this.margin = { top: 4, right: 4, bottom: 20, left: 4 };

    this.view = new cdb.geo.ui.Widget.Histogram.Chart(({
      el: $('.js-chart'),
      y: 0,
      margin: this.margin,
      handles: true,
      width: this.width,
      height: 100,
      data: this.data
    }));
    window.chart = this.view;
  });

  it('should calculate the width of the bars', function() {
    this.view.render().show();
    expect(this.view.barWidth).toBe((this.width - this.margin.left - this.margin.right) / this.data.length);
  });

  it('should draw the bars', function() {
    this.view.render().show();
    expect(this.view.$el.find('.Bar').size()).toBe(this.data.length);
  });

  it('should draw the axis', function() {
    this.view.render().show();
    expect(this.view.$el.find('.Axis').size()).toBe(1);
  });

  it('should draw the handles', function() {
    this.view.render().show();
    expect(this.view.$el.find('.Handle').size()).toBe(2);
  });
});

function genHistogramData(n) {
  n = n || 1;
  var arr = [];
  _.times(n, function(i) {
    var start = (100 * i) + Math.round(Math.random() * 1000);
    var end = start + 100;
    var obj = {
      bin: i,
      freq: Math.round(Math.random() * 10),
      start: start,
      end: end,
      max: end,
      min: start
    };
    arr.push(obj);
  });
  return arr;
}
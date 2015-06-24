var should = require("should")
var bbb = require("babelsbergjs-core");
var bbb_cassowary = require("../cassowary_ext");

require('./test_harness')
console.log = require('./filtered_log')

function prepared_always(ctx,callback) {
  ctx = ctx || {};
  return bbb.always({
    solver: new bbb_cassowary.ClSimplexSolver(),
    ctx: ctx
  }, callback);
}

describe('bbb_cassowary', function() {
  describe('properties', function() {
    it('contain ClSimplexSolver.', function() {
      bbb_cassowary.should.have.property('ClSimplexSolver')
          .which.is.a.ClSimplexSolver;
    });

    it('contain ClAbstractVariable.', function() {
      bbb_cassowary.should.have.property('ClAbstractVariable')
          .which.is.a.ClAbstractVariable;
    });

    it('contain ClLinearExpression.', function() {
      bbb_cassowary.should.have.property('ClLinearExpression')
          .which.is.a.ClLinearExpression;
    });

    it('contain ClConstraint.', function() {
      bbb_cassowary.should.have.property('ClConstraint')
          .which.is.a.ClConstraint;
    });
  });


  it('solves variable b to stay smaller than a.', function() {
    obj = {a: 1, b: 2};
    prepared_always({obj: obj}, function () {
      return obj.a + 7 <= obj.b;
    });
    obj.a = 10;
    (obj.a + 7).should.not.be.greaterThan(obj.b);
  });

  it('keeps sum of variables constant.', function() {
    var obj = {a: 2, b: 3};
    prepared_always({obj: obj}, function () {
      return obj.a + obj.b == 3;
    });
    (obj.a + obj.b).should.be.exactly(3);
  });

  it('keeps inequality.', function() {
    var obj = {a: 8};
    prepared_always({obj: obj}, function () {
      return obj.a >= 100;
    });
    obj.a.should.not.be.lessThan(100);
    obj.a = 110;
    obj.a.should.be.exactly(110);
  });

  it('can handle simple paths.', function() {
    ClSimplexSolver.resetInstance();
    var pointA = pt(1, 2),
        pointB = pt(2, 3),
        o = {a: pointA, b: pointB};
    prepared_always({o: o}, function () {
      return o.a.x + 100 <= o.b.x;
    });
    (pointA.x + 100).should.not.be.greaterThan(pointB.x);
  });

  it('can invalidate simple paths.', function() {
    var pointA = pt(1, 2),
        pointB = pt(2, 3),
        o = {a: pointA, b: pointB};
    prepared_always({o: o}, function() {
        return o.a.x + 100 <= o.b.x;
    });
    pointA = pt(12, 12);
    o.a = pointA;
    (pointA.x + 100).should.not.be.greaterThan(pointB.x);
  });

  it('can solve temperature conversion problem.', function() {
    var obj = {fahrenheit: 212, centigrade: 100};
    prepared_always({ obj: obj}, function() {
        return obj.fahrenheit - 32 == obj.centigrade * 1.8;
    });

    (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
    obj.fahrenheit = 100;
    (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
    obj.centigrade = 121;
    (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
  });


  it('can handle undefined variables.', function() {
    var obj = {};
    return bbb.always({
      allowTests: true,
      solver: new bbb_cassowary.ClSimplexSolver(),
      ctx: { obj: obj}
    }, function() {
        return obj.a + obj.b == obj.c;
    });
  });

  it('recalculates for text input.', function() {
    var obj = {
            txt: new lively.morphic.Text(),
            a: 10
        };
    obj.txt.setTextString("5");

    debugger
    prepared_always({obj: obj}, function() {
        return obj.a == obj.txt.getTextString();
    });
    (obj.a == obj.txt.getTextString()).should.be.true();

    obj.txt.setTextString("15");
    (obj.a == obj.txt.getTextString()).should.be.true();
    (obj.a === 15).should.be.true();
  });

  /* Template for a test
  it('', function() {
    prepared_always({obj: obj}, function () {

    });
    ().should.not.be.lessThan();
    ().should.be.exactly();
  });
  */
});

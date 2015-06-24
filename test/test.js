var should = require("should")
var bbb = require("babelsbergjs-core");
var bbb_cassowary = require("../cassowary_ext");


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
  /* Template for a test
  it('', function() {
    prepared_always({obj: obj}, function () {

    });
    ().should.not.be.lessThan();
    ().should.be.exactly();
  });
  */
});

require("babelsbergjs-core");
var bbb_cassowary = require("./cassowary_ext");

obj = {a: 1, b: 2};
s = new bbb_cassowary.ClSimplexSolver();
bbb.always({solver: s, ctx: {obj: obj}}, function () {
  return obj.a + 7 <= obj.b;
});
obj.a = 10;

console.log("Testing ClSimplexSolver solves 'always'-condition...")
if(!(obj.a + 7 <= obj.b))
  throw("AssertionError: Expecting obj.b (" + obj.b + ") to be at least 7 + obj.a (" + obj.a + ")")
else
  console.log('... successfull!')

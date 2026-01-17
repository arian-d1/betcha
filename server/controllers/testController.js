// const testModel = require("./model")

function testFunction(req, res) {
  try {
    return res.json("Message");
  } catch (e) {
    return res.json({
      success: false,
      error: e.message || "Test Error",
    });
  }
}

module.exports = {
  testFunction,
};

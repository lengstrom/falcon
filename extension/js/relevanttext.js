String.prototype.deleteArray = function(find) {
  var replaceString = this;
  for (var i = 0; i < find.length; i++) {
    replaceString = replaceString.replace(" " + find[i] + " ", " ");
  }
  return replaceString;
};

var NLParser = (function NLParser() {

	return function NLParserConstructor() {
		var _this = this; // Cache the `this` keyword
		_this.getRelevantText = function(docstr) {
  			var parser = new DOMParser()
  			, doc = parser.parseFromString(docstr, "text/html");
			var readableResponse = readability.grabArticle(doc)
			if (!readableResponse) {
				return null;
			}
			return readableResponse.innerText.replace(/(\r\n|\n|\r|\t|  )/gm,"").deleteArray(stops) + " --- " + readability.getArticleTitle(doc)
		}
	};
}());

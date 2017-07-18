function ClozeCard(text, cloze) {
	this.text = text.split(cloze);
	this.cloze = cloze;
};

function ClozeCardProtype() {
	this.clozeRemoved = function() {
		return `${this.text[0]} ... ${this.text[1]}`
	};
};

ClozeCard.prototype = new ClozeCardProtype();
module.exports = ClozeCard;
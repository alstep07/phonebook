const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('Connecting to ', url);

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then((result) => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.log(`error connecting to MongoDB: ${err}`);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 3,
		required: true
	}
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

const Person = mongoose.model('Person', personSchema);

module.exports = mongoose.model('Person', personSchema);

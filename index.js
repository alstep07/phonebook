require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('content', function (request, response) {
	return JSON.stringify(request.body);
});

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] :content'));

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number
	});

	person.save().then((savedPerson) => {
		response.json(person);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

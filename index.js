require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const { isValidObjectId } = require('mongoose');
const { response } = require('express');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('content', function (request, response) {
	return JSON.stringify(request.body);
});
app.use(morgan(':method :url :status :res[content-length] :content'));

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.log(error.message);
	if (error.name === 'CastError') {
		return response.status(404).send({ error: 'malformatted id' });
	}

	next(error);
};
app.use(errorHandler);

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((err) => next(err));
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

app.delete('api/persons/:id', (request, response) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((err) => next(err));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

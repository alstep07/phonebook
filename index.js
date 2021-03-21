const express = require('express');
const morgan = require('morgan');

let persons = [
	{
		name: 'Arto Hellas',
		number: '234234234234',
		id: 1
	},
	{
		name: 'Dan Abramov',
		number: '12 - 43 - 234345',
		id: 2
	},
	{
		name: 'Mary Poppendieck',
		number: '39 - 23 - 6423122',
		id: 3
	},
	{
		name: 'Ada Lovelace',
		number: '0649238374',
		id: 4
	}
];

const app = express();

morgan.token('content', function (request, response) {
	return JSON.stringify(request.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] :content'));

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/info', (request, response) => {
	const amount = persons.length;
	const date = new Date();

	response.send(`<p>Phonebook has info for ${amount} people.</p>
<p>${date}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);

	if (!person) {
		return response.status(400).end();
	}

	response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateUniqId = () => {
	const ids = persons.map((person) => person.id);
	let id = Math.floor(Math.random() * 1000000);
	while (ids.includes(id)) {
		id++;
	}
	return id;
};

const validateName = (name) => name && !persons.map((person) => person.name).includes(name);

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!validateName(body.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateUniqId()
	};

	persons = persons.concat(person);
	response.json(person);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

const http = require('http');
const express = require('express');
const { request, response } = require('express');

const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});

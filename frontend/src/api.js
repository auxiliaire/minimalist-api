
// TODO: retreive endpoint from configuration
const endpoint = 'http://localhost:8000/tickets';

const getTicket = (id) =>
    fetch(endpoint + '/' + id, { method: "GET", headers: { "Accept": "application/json" }})
        .then(r => r.json())
        .catch(err => console.log(err));

const createTicket = (body) =>
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body})
        .then(r => r.json())
        .catch(err => console.log(err));

export { getTicket, createTicket };
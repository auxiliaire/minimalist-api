import { Show, createSignal } from "solid-js";

const Ticket = (props) => {
    return (
        <div class="card w-96 bg-primary text-primary-conten mx-auto mb-4">
            <div class="card-body">
                <h2 class="card-title">Ticket</h2>
                <div>
                    <div class="row">
                        <div class="col-2"><b>Id</b></div><div class="col-4">{props.ticket.id}</div>
                    </div>
                    <div class="row">
                        <div class="col-2"><b>Title</b></div><div class="col-4">{props.ticket.title}</div>
                    </div>
                </div>
            </div>
      </div>
    );
};

const App = () => {
    const [id, setId] = createSignal(0);
    const [ticket, setTicket] = createSignal({});
    const [error, setError] = createSignal();
    const useResult = (result) => {
         if (result.hasOwnProperty('id') && result.hasOwnProperty('title')) {
            setError();
            setTicket(result);
        } else if (result.hasOwnProperty('code') && result.hasOwnProperty('message')) {
            setError(result);
        } else {
            console.log(result);
            setError({code: "Unknown", message: "Failed to process the response."})
        }
    };
    const getTicket = () =>
        fetch('http://localhost:8000/tickets/' + id(), { method: "GET", headers: { "Accept": "application/json" }})
            .then(r => r.json())
            .then(useResult)
            .catch(err => console.log(err));
    const updateTicket = (id) => {
        setId(id);
        getTicket();
    }

    return (
        <div>
            <div class="navbar bg-neutral text-neutral-content mb-4">
                <input type="text" onInput={(e) => updateTicket(e.target.value)} placeholder="Enter Id" class="input input-bordered input-sm w-full max-w-xs mx-auto" />
            </div>
            <Ticket ticket={ticket()} />
            <Show when={error()}>
                <div class="alert alert-warning w-1/2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{error().code}: {error().message}</span>
                </div>
            </Show>
        </div>
    );
  };
  
  export default App;
  
import { Show, createSignal } from "solid-js";
import TicketView from "./components/TicketView";
import { A, Navigate, Outlet, Route, Routes, useMatch, useNavigate } from "@solidjs/router";
import TicketCreate from "./components/TicketCreate";
import DisappearingToast, { showToast } from "./components/DisappearingToast";

const App = () => {
    const [id, setId] = createSignal(0);
    const [ticket, setTicket] = createSignal({});
    const [error, setError] = createSignal();
    const [success, setSuccess] = createSignal();
    const isTicketView = useMatch(() => '/tickets');
    const navigate = useNavigate();
    const useResult = (result) => {
         if (result.hasOwnProperty('id') && result.hasOwnProperty('title')) {
            if (!isTicketView()) {
                navigate('/tickets', {replace: true});
                showToast({code: "OK", message: "Saved successfully."}, success, setSuccess);
            }
            setError();
            setTicket(result);
        } else if (result.hasOwnProperty('code') && result.hasOwnProperty('message')) {
            showToast(result, error, setError);
        } else {
            console.log(result);
            showToast({code: "Unknown", message: "Failed to process the response."}, error, setError);
        }
    };
    // TODO: retreive endpoint from configuration
    const endpoint = 'http://localhost:8000/tickets';
    const getTicket = () =>
        fetch(endpoint + '/' + id(), { method: "GET", headers: { "Accept": "application/json" }})
            .then(r => r.json())
            .then(useResult)
            .catch(err => console.log(err));
    const createTicket = (body) =>
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body})
            .then(r => r.json())
            .then(useResult)
            .catch(err => console.log(err));
    const updateTicket = (id) => {
        setId(id);
        getTicket();
    }
    const TicketData = ({params, location, navigate, data}) => {
        return ticket;
    }
    
    return (
        <div>
            <div class="navbar bg-neutral text-neutral-content mb-4">
                <div class="navbar-start">
                    <A href="/" class="btn btn-ghost normal-case text-xl">Ticketing</A>
                    <ul class="menu menu-horizontal px-1">
                        <li><A href="/tickets">View</A></li>
                        <li><A href="/tickets/new">Create</A></li>
                    </ul>
                </div>
                <div class="navbar-center">
                    <Show when={isTicketView()}>
                        <input type="text" onInput={(e) => updateTicket(e.target.value)} placeholder="Enter Id" class="input input-bordered input-sm w-full max-w-xs" />                
                    </Show>
                </div>
            </div>
            <Outlet />
            <DisappearingToast getter={success} className="alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </DisappearingToast>
            <DisappearingToast getter={error} className="alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>                 
            </DisappearingToast>
            <Routes>
                <Route path="/" element={<Navigate href="/tickets"/>}/>
                <Route path="/tickets" component={TicketView} data={TicketData}/>
                <Route path="/tickets/new" component={TicketCreate} data={() => createTicket}/>
            </Routes>
        </div>
    );
  };
  
  export default App;
  
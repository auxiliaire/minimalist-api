import { Show, createSignal } from "solid-js";
import TicketView from "./components/TicketView";
import { A, Navigate, Outlet, Route, Routes, useMatch, useNavigate } from "@solidjs/router";
import TicketCreate from "./components/TicketCreate";
import DisappearingToast, { showToast } from "./components/DisappearingToast";
import api from "./api";

const App = () => {
    const [id, setId] = createSignal(0);
    const [ticket, setTicket] = createSignal({});
    const [error, setError] = createSignal();
    const [success, setSuccess] = createSignal();
    const isTicketView = useMatch(() => '/tickets');
    const navigate = useNavigate();

    const isTicket = (result) => result && result.hasOwnProperty('id') && result.hasOwnProperty('title');
    const isError = (result) => result && result.hasOwnProperty('code') && result.hasOwnProperty('message');
    
    const useResult = (result) => {
         if (isTicket(result)) {
            if (!isTicketView()) {
                navigate('/tickets', {replace: true});
                showToast({code: "OK", message: "Saved successfully."}, success, setSuccess);
            }
            setError();
            setTicket(result);
        } else if (isError(result)) {
            showToast(result, error, setError);
            setTicket({});
        } else {
            console.log(result);
            showToast({code: "Unknown", message: "Failed to process the response."}, error, setError);
            setTicket({});
        }
    };
    const updateTicketModel = (id) => {
        setId(id);
        if (id) {
            api.getTicket(id)
                .then(useResult);
        } else {
            setTicket({});
        }
    }
    const saveTicket = (ticketObj) => {
        api.postTicket(ticketObj)
            .then(useResult);
    };
    const TicketData = (_) => {
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
                        <input type="text" onInput={(e) => updateTicketModel(e.target.value)} placeholder="Enter Id" class="input input-bordered input-sm w-full max-w-xs" />                
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
                <Route path="/tickets/new" component={TicketCreate} data={() => saveTicket}/>
            </Routes>
        </div>
    );
  };
  
  export default App;
  
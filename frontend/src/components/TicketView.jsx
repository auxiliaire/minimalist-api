import { useRouteData } from "@solidjs/router";

const TicketView = () => {
    const ticket = useRouteData();
    return (
        <div class="card w-96 bg-primary text-primary-conten mx-auto mb-4">
            <div class="card-body">
                <h2 class="card-title">Ticket</h2>
                <div>
                    <div class="row">
                        <div class="col-2"><b>Id</b></div><div class="col-4">{ticket().id}</div>
                    </div>
                    <div class="row">
                        <div class="col-2"><b>Title</b></div><div class="col-4">{ticket().title}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketView;
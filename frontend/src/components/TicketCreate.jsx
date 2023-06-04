import { useRouteData } from "@solidjs/router";
import { useForm } from "../forms/validation";

const ErrorLabel = (props) => {
    return (
        <label class="label">
            <span class="label-text-alt">{props.error}</span>
        </label>
    );
};

const TicketCreate = () => {
    const createTicket = useRouteData();
    const { validate, formSubmit, errors } = useForm({
        errorClass: "input-error"
    });
    const submitTicket = (form) => {
        console.log('Submitting...');
        const formEntries = new FormData(form).entries();
        const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y})));
        json.id = 0;
        createTicket(JSON.stringify(json));
    };

    return (
        <div class="card w-96 bg-primary text-primary-conten mx-auto mb-4">
            <div class="card-body">
                <h2 class="card-title">Ticket Create</h2>
                <div>
                    <form use:formSubmit={submitTicket}>
                        <div class="row tooltip" data-tip="Provided by the backend">
                            <div class="col-2"><b>Id</b></div><div class="col-4">?</div>
                        </div>
                        <div class="row">
                            <div class="col-2"><b>Title</b></div>
                            <div class="col-4">
                                <input type="text" name="title" placeholder="Type here" class="input w-full max-w-xs" required minLength="8" use:validate={[]} />
                                {errors.title && <ErrorLabel error={errors.title} />}
                            </div>
                        </div>
                        <div class="row">
                            <button type="submit" class="btn btn-accent w-full max-w-xs mt-4">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketCreate;
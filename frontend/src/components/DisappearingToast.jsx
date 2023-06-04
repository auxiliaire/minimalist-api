
const duration = 5000;
let interval;
let timeout;

export function showToast(obj, getter, setter) {
    setter({code: obj.code, message: obj.message, durationLeft: duration});
    if (timeout) clearTimeout(timeout);
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        const s = getter();
        setter({code: s.code, message: s.message, durationLeft: s.durationLeft - 100});
    }, 100);
    timeout = setTimeout(() => {
        clearInterval(interval);
        setter();
        interval = undefined;
        timeout = undefined;
    }, duration);
}

const currentProgress = (durationLeft) => Math.floor(durationLeft / (duration / 100)); 

const currentProgressStyle = (durationLeft) => `--value:${currentProgress(durationLeft)}; --size:1rem; --thickness:3px;`;

const DisappearingToast = (props) => {
    return (
        <Show when={props.getter()}>
            <div class="alert w-1/2 mx-auto mb-4" className={props.className}>
                {props.children}
                <span>{props.getter().code}: {props.getter().message}</span>
                <span class="radial-progress" style={currentProgressStyle(props.getter().durationLeft)}></span>
            </div>
        </Show>
    );
};

export default DisappearingToast;
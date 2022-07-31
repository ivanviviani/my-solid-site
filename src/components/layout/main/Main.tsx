import { Component, For, JSX } from "solid-js";
import "./Main.scss";

const Main: Component<{children: JSX.Element[]}> = (props) => {

    return <main id="main" class="main">
        <For each={props.children} fallback={<div role="status">Loading components...</div>}>
            {(child) => <section>{child}</section>}
        </For>
    </main>;
};

export default Main;
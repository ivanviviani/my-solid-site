import { Component, For, JSX } from "solid-js";
import "./Main.scss";

const Main: Component<{children: JSX.Element[]}> = (props) => {

    return <main id="main" class="main">
        <For each={props.children} fallback={<div role="status">Loading components...</div>}>
            {renderComponent}
        </For>
    </main>;
};

export default Main;

function renderComponent(component : JSX.Element) : JSX.Element {
    return <section>
        {component}
    </section>;
}
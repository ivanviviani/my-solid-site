import { Component, For } from "solid-js";
import "./Richtext.scss";

const Richtext: Component<{ richtext: Element[] }> = (props) => {

    return <div class="richtext">
        <For each={props.richtext}>
            {renderTextElement}
        </For>
    </div>;
};

export default Richtext;

function renderTextElement(textElement: Element): Element {
    return textElement;
}
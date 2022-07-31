import { Component, onMount } from "solid-js";
import { ThreeDRendererService } from "../../../services/ThreeDRendererService";
import "./Background.scss";

const Background: Component = () => {

    let canvas;
    onMount(() => {
        const three = new ThreeDRendererService();
        three.createScene(canvas);

        window.addEventListener('resize', () => {
            three.resize();
        });
        document.body.onscroll = () => {
            three.moveCamera();
        };
    });

    return <canvas class="background" ref={canvas}></canvas>;
};

export default Background;
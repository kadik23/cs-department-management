let dialogue = document.getElementById("dialogue");
let open_dialogue_btn = document.getElementById("open-dialogue-btn");
let close_dialogue_btn = document.getElementById("dialogue-close-btn");
let dialogue_body = document.getElementById("dialogue-body");

open_dialogue_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    dialogue.style.display = "flex";
});

close_dialogue_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    dialogue.style.display = "none";
});

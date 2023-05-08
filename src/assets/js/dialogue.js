let dialogue = document.getElementById("dialogue");
let open_dialogue_btns = document.getElementsByClassName("open-dialogue-btn");
let close_dialogue_btns = document.getElementsByClassName("dialogue-close-btn");
let dialogue_body = document.getElementById("dialogue-body");

for(let i = 0; i < open_dialogue_btns.length; i++){
    let open_dialogue_btn = open_dialogue_btns[i];
    open_dialogue_btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        dialogue.style.display = "flex";
        setTimeout(() => { dialogue.style.opacity = 1; }, 50);
    });
}

for(let i = 0; i < close_dialogue_btns.length; i++){
    let close_dialogue_btn = close_dialogue_btns[i];
    close_dialogue_btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        dialogue.style.opacity = 0;
        setTimeout(() => {
            dialogue.style.display = "none";
        }, 500);
    });
}



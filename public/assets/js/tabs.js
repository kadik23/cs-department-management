let tabs = document.getElementsByClassName("tab");
let tabs_content = document.getElementsByClassName("tab-content");

for(let i = 0; i < tabs.length; i++){
    let tab = tabs[i];
    tab.addEventListener("click", (ev) => {
        ev.preventDefault();
        toggleTab(i);
    });
}

function toggleTab(index){
    for(let i = 0; i < tabs_content.length; i++){
        let tab_content = tabs_content[i];
        tab_content.style.display = "none";
        tabs[i].classList.remove("selected-tab");
    }
    tabs_content[index].style.display = "flex";
    tabs[index].classList.toggle("selected-tab");
}

toggleTab(0);
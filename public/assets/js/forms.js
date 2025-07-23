let spec_form = document.getElementById("target_form");
let open_create_spec_btn = document.getElementById("open_create_spec");
let close_create_spec_btn = document.getElementById("close_create_spec");

open_create_spec_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    open_create_spec_btn.style.opacity = "0";
    spec_form.style.maxHeight = "1000px";
    spec_form.style.width = "calc(100%*1/2)";
    setTimeout(() => {
        spec_form.style.opacity = 1;
    },500);
});

close_create_spec_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    spec_form.style.opacity = 0;
    setTimeout(() => {
        spec_form.style.maxHeight = "0";
        spec_form.style.width = "0";
        open_create_spec_btn.style.opacity = "1";
    }, 500);
});


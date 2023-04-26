let spec_form = document.getElementById("create_speciality");
let open_create_spec_btn = document.getElementById("open_create_spec");
let close_create_spec_btn = document.getElementById("close_create_spec");

open_create_spec_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    spec_form.style.display = "flex";
    open_create_spec_btn.style.display = "none";
});

close_create_spec_btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    spec_form.style.display = "none";
    open_create_spec_btn.style.display = "block";
});
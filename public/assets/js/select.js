function initSelectedList(){
  let selected_inputs = document.getElementsByClassName("selected_input");
  let hidden_selected_inputs = document.getElementsByClassName("hidden_selected_input");

  for(let i = 0; i < selected_inputs.length; i++){
    let selected_input = selected_inputs[i];
    let hidden_selected_input = hidden_selected_inputs[i];
    selected_input.addEventListener("change", (ev) => {
      // 1. Setting the value to the hidden input.
      let value = ev.target.value;
      hidden_selected_input.value = value;
      // 2. Replace the value with its Text.
      let list = ev.target.list.children;
      for(let j = 0; j < list.length; j++){
        let item = list[j];
        if(item.value == value){
          selected_input.value = item.innerText;
        }
      }
    });
  }
}

initSelectedList();
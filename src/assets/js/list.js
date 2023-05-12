function createListItem(value, flex=null){
    let list_item = document.createElement("div", {});
    list_item.classList.add("list-item");
    
    if(flex)
        list_item.style.flex = flex;
    
        list_item.innerText = value;
    return list_item;
}

function createListRow(children){
    let list_row = document.createElement("div", {});
    list_row.classList.add("list-row");
    for(let i = 0; i < children.length; i++){
        list_row.appendChild(children[i]);
    }
    return list_row;
}
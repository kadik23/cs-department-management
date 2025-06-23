function init(){
    let account_type = document.getElementById("account-type");
    account_type.onselect = (target) => {
        window.location.search = "?account_type="+target.toLocaleLowerCase();
    }   
}

init();
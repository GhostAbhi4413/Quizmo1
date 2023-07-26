function rmPop(){
    const Alert=$('.alert')[0];
    if(Alert.classList.contains('popIn'))
    Alert.classList.remove('popIn');
}

function Alert(text){
    const Alert=$('.alert')[0];
    Alert.children[1].innerHTML=text;
    Alert.classList+=" popIn";
    setTimeout(rmPop, 5000);
}
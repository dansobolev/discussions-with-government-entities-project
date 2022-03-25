function generateDiscussionsList(discussions){
    var dList = discussions['items'];
    var dListRoot = $('.discussions');
    for (let dListKey in dList) {
        let elemListKey = dList[dListKey];
        let dListKeyTitle = elemListKey['name'];
        let dListKeyId = elemListKey['id'];
        var dListItem = document.createElement('div');
        dListItem.classList.add('discussions__item');
        let dlItemHTML = '';
        dlItemHTML += '<a target="_self" href="http://127.0.0.1:8080/discussions/'+dListKeyId+'">'+dListKeyTitle+'</a>';
        dListItem.innerHTML = dlItemHTML;
        dListRoot.append(dListItem);
    }
}

$.ajax({
    type: "GET",
    contentType: 'application/json; charset=utf-8',
    url: "http://127.0.0.1:8080/discussions/list",
    processData: false,
    success: function(response){
        generateDiscussionsList(response);
    }
});
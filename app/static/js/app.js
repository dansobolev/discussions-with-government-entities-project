function sendMessage(){
    var messageText = document.getElementById("text_to_send").value;
    $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: "http://localhost:8080/"+$('#daneezy-clowneeze').innerHTML+"/comments",
        data: messageText,
        processData: false,
        success: function(response){
            var sectionMessage = document.createElement('div');
            sectionMessage.classList.add('chat-section__message');
            var sectionMessageHTML = '';
            sectionMessageHTML += '<div class="message message_outcoming">';
            sectionMessageHTML += '<a class="message__avatar" href="">';
            sectionMessageHTML += '<img alt="" src="/static/img/photo01.jpg" srcSet="/static/img/photo01@2x.jpg 2x">';
            sectionMessageHTML += '</a>';
            sectionMessageHTML += '<div class="message__body">';
            sectionMessageHTML += '<div class="message__header">';
            sectionMessageHTML += '<div class="message__author">';
            sectionMessageHTML += '<a class="message__author-name js-name" href="#">'+response["author"]+'</a>';
            sectionMessageHTML += '</div>';
            sectionMessageHTML += '</div>';
            sectionMessageHTML += ' <div class="message__content">';
            sectionMessageHTML += ' <p>';
            sectionMessageHTML += ' <a class="js-name" href="">response["author"]</a> '+messageText;
            sectionMessageHTML += ' </p>';
            sectionMessageHTML += ' </div>';
            sectionMessageHTML += ' <div class="message__footer">';
            sectionMessageHTML += ' <a class="message__doc-link" href="#">';
            sectionMessageHTML += '<span class="message__doc-icon">';
            sectionMessageHTML += '<img alt="" height="28" src="/static/img/doc.svg" width="22">';
            sectionMessageHTML += '</span>';
            sectionMessageHTML += ' <span class="message__doc-label">Оригинал документа</span>';
            sectionMessageHTML += ' </a>';
            sectionMessageHTML += ' <div class="message__previews">';
            sectionMessageHTML += ' <img alt="" src="/static/img/preview01.jpg" srcSet="/static/img/preview01@2x.jpg 2x">';
            sectionMessageHTML += ' </a>';
            sectionMessageHTML += ' <a class="message__preview js-gallery-slide" href="/static/img/image02@2x.jpg"data-gallery="gallery1">';
            sectionMessageHTML += ' <img alt="" src="/static/img/preview02.jpg"srcSet="/static/img/preview02@2x.jpg 2x">';
            sectionMessageHTML += ' </a>';
            sectionMessageHTML += ' </div>';
            sectionMessageHTML += ' <p class="message__date">'+currentComment['created_at']+'</p>';
            sectionMessageHTML += ' </div>';
            sectionMessageHTML += ' </div>';
            sectionMessageHTML += ' </div>';
            sectionMessageHTML += ' </div>';
            sectionMessage.innerHTML = sectionMessageHTML;
            $('.chat-section__feed').append(sectionMessage);
        }
    });
}
function add_member(login_adder_user, login_added_user){
     var sectionAddMember = document.createElement('div');
     sectionAddMember.classList.add('chat-section__message');
     let sectionAddMemberHTML = '';
     sectionAddMemberHTML += '<div className="chat-section__notify">';
     sectionAddMemberHTML += '<div className="notify">';
     //sectionAddMemberHTML = '<p><a className="js-name" href="">@sorokin</a> добавил <a className="js-name" href="">@procuratura</a>';
     sectionAddMemberHTML += '<p>@'+login_adder_user+' добавил @'+ login_added_user + '</p>';
     sectionAddMemberHTML += '</p>';
     sectionAddMemberHTML += '</div>';
     sectionAddMemberHTML += '</div>';
     sectionAddMember.innerHTML = sectionAddMemberHTML;
     $('.chat-section__feed').append(sectionAddMember);
}
///{discussion_id}/participant
function invite(user_login){
    // var messageText = document.getElementById("text_to_send").value;
    $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: "http://localhost:8080/"+ $('#daneezy-clowneeze').innerHTML+ "/participant",
        data: user_login,
        processData: false,
        success: function(response){
             add_member(response['user_inviter'], response['user_participant']);
        }
    });
}
function generate_comments(dataComments){
    (document.getElementsByClassName('chat-section__title')[0]).innerHTML = dataComments['items'][0]['name'];
    $('h2', '.chat-section__title').innerHTML = 0;
    for(let i in dataComments['items'][0]['comments']){
        var currentComment = dataComments['items'][0]['comments'][i];
        var sectionMessage = document.createElement('div');
        sectionMessage.classList.add('chat-section__message');
        var sectionMessageHTML = '';
        sectionMessageHTML += '<div class="message message_outcoming">';
        sectionMessageHTML += '<a class="message__avatar" href="">';
        sectionMessageHTML += '<img alt="" src="/static/img/photo01.jpg" srcSet="/static/img/photo01@2x.jpg 2x">';
        sectionMessageHTML += '</a>';
        sectionMessageHTML += '<div class="message__body">';
        sectionMessageHTML += '<div class="message__header">';
        sectionMessageHTML += '<div class="message__author">';
        sectionMessageHTML += '<a class="message__author-name js-name" href="#">'+currentComment['author']['login']+'</a>';
        sectionMessageHTML += '</div>';
        sectionMessageHTML += '</div>';
        sectionMessageHTML += ' <div class="message__content">';
        sectionMessageHTML += ' <p>';
        sectionMessageHTML += ' <a class="js-name" href="">@krti</a> '+currentComment['comment_text'];
        sectionMessageHTML += ' </p>';
        sectionMessageHTML += ' </div>';
        sectionMessageHTML += ' <div class="message__footer">';
        sectionMessageHTML += ' <a class="message__doc-link" href="#">';
        sectionMessageHTML += '<span class="message__doc-icon">';
        sectionMessageHTML += '<img alt="" height="28" src="/static/img/doc.svg" width="22">';
		sectionMessageHTML += '</span>';
        sectionMessageHTML += ' <span class="message__doc-label">Оригинал документа</span>';
        sectionMessageHTML += ' </a>';
        sectionMessageHTML += ' <div class="message__previews">';
        sectionMessageHTML += ' <img alt="" src="/static/img/preview01.jpg" srcSet="/static/img/preview01@2x.jpg 2x">';
        sectionMessageHTML += ' </a>';
        sectionMessageHTML += ' <a class="message__preview js-gallery-slide" href="/static/img/image02@2x.jpg"data-gallery="gallery1">';
        sectionMessageHTML += ' <img alt="" src="/static/img/preview02.jpg"srcSet="/static/img/preview02@2x.jpg 2x">';
        sectionMessageHTML += ' </a>';
        sectionMessageHTML += ' </div>';
        sectionMessageHTML += ' <p class="message__date">'+currentComment['created_at']+'</p>';
        sectionMessageHTML += ' </div>';
        sectionMessageHTML += ' </div>';
        sectionMessageHTML += ' </div>';
        sectionMessageHTML += ' </div>';
        sectionMessage.innerHTML = sectionMessageHTML;
        $('.chat-section__feed').append(sectionMessage);
    }
}

function idGen(response){
    for (let idGenKey in response['items']['0']['participants']){
        let localLogin = response['items']['0']['participants'][idGenKey]['login'];
        let idRoot = $('.chat__bottom__text-wrap__id-box');
        let idItem = document.createElement('div');
        idItem.classList.add('chat__bottom__text-wrap__id-box__item');
        $(idItem).attr('login', localLogin);
        let itemHTML = '';
        itemHTML += 'Пригласить @'+localLogin+'';
        idItem.innerHTML = itemHTML;
        idRoot.append(idItem);
    }
    $(".chat__bottom__text-wrap__id-box__item").click(function(){
        let login_loc = $(this).attr('login');
        invite(login_loc);
        document.getElementById("text_to_send").value = '';
        $('.chat__bottom__text-wrap__id-box').removeClass('id-box-active');
    });
}



$(document).ready(function(){
    $('#daneezy-clowneeze').innerHTML = window.location.href;
});


$.ajax({
    type: "GET",
    contentType: 'application/json; charset=utf-8',
    // url: "http://localhost:8080/discussions"+$('#daneezy-clowneeze').innerHTML,
    url: "http://localhost:8080/discussions/98f7622c-ec16-487c-a9ae-81dc916d8694",
    processData: false,
    success: function(response){
        idGen(response);
        generate_comments(response);
    }
});

// $('.chat__bottom__text-wrap__id-box').

$("#text_to_send").on("input",function() {
  if($("#text_to_send").val()=='@'){
      $('.chat__bottom__text-wrap__id-box').addClass('id-box-active');
  } else{
      $('.chat__bottom__text-wrap__id-box').removeClass('id-box-active');
  }
});
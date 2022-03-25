$(document).ready(function(){
    function getCookie(c_name) {
        if(document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if(c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if(c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }

    $(function () {
        $.ajaxSetup({
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        });
    });
});
let regData = new Object();

function sendRegData(){
    userName = (document.querySelector('#regname')).value;
    userSurname = (document.querySelector('#regsurname')).value;
    userPatronymic = (document.querySelector('#regpatronymic')).value;
    userEmail = (document.querySelector('#regemail')).value;
    userPhone = (document.querySelector('#regphone')).value;
    userUsername = (document.querySelector('#regusername')).value;
    userPassword = (document.querySelector('#regpass')).value;
    regData['firstname'] = userName;
    regData['lastname'] = userSurname;
    regData['middlename'] = userPatronymic;
    regData['email'] = userEmail;
    regData['login'] = userUsername;
    regData['password'] = userPassword;
    regData['phone_number'] = userPhone;
    // let profile_image = (document.querySelector('#images'));
    // let fd = new FormData;
    // fd.append('img', profile_image.value);
    //
    // if((profile_image.value !== '')){
    //     $.ajax({
    //         type: "POST",
    //         contentType: 'application/json; charset=utf-8',
    //         url: "http://127.0.0.1:8000/upload-image",
    //         data: fd,
    //         cache:false,
    //         contentType: false,
    //         processData: false,
    //         success: function (response) {
    //             regData['profile_image_id'] = response['profile_image_id'];
    //         }
    //     })
    // }


    $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: "http://127.0.0.1:8080/register",
        processData: false,
        data: JSON.stringify(regData),
        success: function(data){
            console.log(data)
            if(data.status_code = 200){
                window.location.replace("../login")
            }
        }
    });

}
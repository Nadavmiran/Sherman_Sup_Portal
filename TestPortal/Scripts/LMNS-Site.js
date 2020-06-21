function doSubmitUserProfile() {
    //let frm = $('#frmUsrProfile');
    let lang = $('#comboLang option:selected').text();
    let name = $('#txtFullName').val();
    let password = $('#password-field').val();
    console.log("doSubmitUserProfile ==> lang = ", lang);
    console.log("doSubmitUserProfile ==> name = ", name);
    console.log("doSubmitUserProfile ==> password = ", password);
$.ajax(
    {
        type: "POST",
        url: window.location.origin + $('#navSaveUserProfile').data('url'), //'/SherPortal/Account/SaveUserProfile',
       data: {
                lang: lang,
           fullName: name,
                pass: password
        },
        cache: false,
        success: function (response) {
            console.log("response", response);
            if (x === 'rtl') {
                $("#modal-error-text").html('המידע נשמר, מומלץ לצאת מהמערכת ולהכנס מחדש');
                $("#modal-2").trigger("click");
            }
            else {
                $("#modal-error-text").html("The changes were saved. It's recomended to log off and login.");
                $("#modal-21").trigger("click");
            }
        }
            //else {
            //    if (response.ErrorDescription != '') {
            //        form_data[0].reset();
            //        $('.modal').modal('hide');
            //        $('.modal').removeClass('show');
            //        $("#modal-error-text").html(response.ErrorDescription);
            //        $("#modal-1").trigger("click");
            //    }
            //}
        //}
    });
}
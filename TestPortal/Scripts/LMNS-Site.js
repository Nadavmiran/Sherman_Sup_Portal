function doSubmitUserProfile() {
    //let frm = $('#frmUsrProfile');
    let lang = $('#comboLang option:selected').text();
    let name = $('#txtFullName').val();
    console.log("doSubmitUserProfile ==> lang = ", lang);
    console.log("doSubmitUserProfile ==> name = ", name);
$.ajax(
    {
        type: "POST",
        url: window.location.origin + $('#navSaveUserProfile').data('url'), //'/SherPortal/Account/SaveUserProfile',
       data: {
                lang: lang,
                fullName: name
        },
        cache: false,
        success: function (response) {
            console.log("response", response);
            $("#modal-error-text").html('המידע נשמר, מומלץ לצאת מהמערכת ולהכנס מחדש');
            $("#modal-2").trigger("click");
        }
        //    else {
        //        if (response.ErrorDescription != '') {
        //            form_data[0].reset();
        //            $('.modal').modal('hide');
        //            $('.modal').removeClass('show');
        //            $("#modal-error-text").html(response.ErrorDescription);
        //            $("#modal-1").trigger("click");
        //        }
        //    }
        //}
    });
}
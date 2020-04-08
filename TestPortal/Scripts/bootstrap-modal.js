﻿"use strict";

//$("#modal-1").fireModal({body: 'Modal body text goes here.'});
$("#modal-1").fireModal({ title: 'שגיאה בשמירת נתונים', body: $("#modal-error") });
$("#modal-2").fireModal({ title: 'הודעת מערכת', body: $("#modal-error"), center: true});

let modal_3_body = '<p>Object to create a button on the modal.</p><pre class="language-javascript"><code>';
modal_3_body += '[\n';
modal_3_body += ' {\n';
modal_3_body += "   text: 'Login',\n";
modal_3_body += "   submit: true,\n";
modal_3_body += "   class: 'btn btn-primary btn-shadow',\n";
modal_3_body += "   handler: function(modal) {\n";
modal_3_body += "     alert('Hello, you clicked me!');\n"
modal_3_body += "   }\n"
modal_3_body += ' }\n';
modal_3_body += ']';
modal_3_body += '</code></pre>';
$("#modal-3").fireModal({
  title: 'Modal with Buttons',
  body: modal_3_body,
  buttons: [
    {
      text: 'Click, me!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
        alert('Hello, you clicked me!');
      }
    }
  ]
});

$("#modal-4").fireModal({
  footerClass: 'bg-whitesmoke',
  body: 'Add the <code>bg-whitesmoke</code> class to the <code>footerClass</code> option.',
  buttons: [
    {
      text: 'No Action!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-5").fireModal({
  title: 'Login',
  body: $("#modal-login-part"),
  footerClass: 'bg-whitesmoke',
  autoFocus: false,
  onFormSubmit: function(modal, e, form) {
    // Form Data
    let form_data = $(e.target).serialize();
    console.log(form_data)

    // DO AJAX HERE
    let fake_ajax = setTimeout(function() {
      form.stopProgress();
      modal.find('.modal-body').prepend('<div class="alert alert-info">Please check your browser console</div>')

      clearInterval(fake_ajax);
    }, 1500);

    e.preventDefault();
  },
  shown: function(modal, form) {
    console.log(form)
  },
  buttons: [
    {
      text: 'Login',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-6").fireModal({
  body: '<p>Now you can see something on the left side of the footer.</p>',
  created: function(modal) {
    modal.find('.modal-footer').prepend('<div class="mr-auto"><a href="#">I\'m a hyperlink!</a></div>');
  },
  buttons: [
    {
      text: 'No Action',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$("#modal-7").fireModal({
    title: 'בדיקת איכות לפריט',
    body: $("#modal-test-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        onSubmit_TestForm(e);
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            modal.find('.modal-body').prepend('<div class="alert alert-info" id="divMsg">הנתונים נשמרו.</div>');

            clearInterval(fake_ajax);
        }, 1500);

        e.preventDefault();
    },
    shown: function (modal, form) {
        console.log(form);
    },
    buttons: [
        {
            text: 'שמור',
            submit: true,
            class: 'btn btn-primary btn-shadow',
            handler: function (modal) {
            }
        }
    ]
});

$("#modal-8").fireModal({
    title: 'Test Results',
    body: $("#modal-test-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        onSubmit_TestForm(e);
         let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divMsg">Data submited.</div>');

            clearInterval(fake_ajax);
        }, 1500);

        e.preventDefault();
    },
    shown: function (modal, form) {
        console.log(form);
    },
    buttons: [
        {
            text: 'Submit',
            submit: true,
            class: 'btn btn-primary btn-shadow',
            handler: function (modal) {
            }
        }
    ]
});

$("#modal-9").fireModal({
    title: 'רשימת דגימות',
    body: $("#modal-QA-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        onSubmitCreateSampleList(e);
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">הנתונים נשמרו.</div>');

            clearInterval(fake_ajax);
        }, 1500);

        e.preventDefault();
    },
    shown: function (modal, form) {
        console.log(form);
    },
    buttons: [
        {
            text: 'שמור',
            submit: true,
            class: 'btn btn-primary btn-shadow',
            handler: function (modal) {
            }
        }
    ]
});

$("#modal-10").fireModal({
    title: 'Test list',
    body: $("#modal-QA-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        onSubmitCreateSampleList(e);
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">Data submited.</div>');

            clearInterval(fake_ajax);
        }, 1500);

        e.preventDefault();
    },
    shown: function (modal, form) {
        console.log(form);
    },
    buttons: [
        {
            text: 'Submit',
            submit: true,
            class: 'btn btn-primary btn-shadow',
            handler: function (modal) {
            }
        }
    ]
});

$('.oh-my-modal').fireModal({
  title: 'My Modal',
  body: 'This is cool plugin!'
});

//$("#modal-8").fireModal({
//    title: 'Test Results',
//    body: $("#modal-test-part"),
//    footerClass: 'bg-whitesmoke',
//    autoFocus: true,
//    onFormSubmit: function (modal, e, form) {
        // Form Data
        //let form_data = $(e.target).serialize();
        //let fd = $(e.target.elements);
        //var fdata = new FormData();
        //var formdata = $('#attachments').prop("files");
        //console.log("files = ", formdata);
        //console.log("e = ", e);
        //console.log("modal = ", modal);
        //console.log("form = ", form);
        //for (var i = 0; i < formdata.length; i++) {
        //    var sfilename = formdata[i].name;
        //    let srandomid = Math.random().toString(36).substring(7);

        //    fdata.append(sfilename, formdata[i]);
        //}
        // // DO AJAX HERE
        //$.ajax(
        //    {
        //        type: "POST",
        //        data:
        //        {
        //            data: createJson(fd)//decode(form_data)
        //        },
        //        url: "/Home/SaveTest",
        //        contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
        //        success: function (response) {
        //            console.log("response", response);
        //        }
        //    });

        //$.ajax(
        //    {
        //        type: "POST",
        //        data: fdata,
        //        url: "/Home/UploadFiles",
        //        contentType: false,
        //        processData: false,
        //        success: function (response) {
        //            console.log("response", response);
        //            $('.modal').modal('hide');
        //            $('.modal').removeClass('show');
        //        }
        //    });
//        let fake_ajax = setTimeout(function () {
//            form.stopProgress();
//            modal.find('.modal-body').prepend('<div class="alert alert-info" id="divMsg">Data submited.</div>');

//            clearInterval(fake_ajax);
//        }, 1500);

//        e.preventDefault();
//    },
//    shown: function (modal, form) {
//        console.log(form);
//    },
//    buttons: [
//        {
//            text: 'Submit',
//            submit: true,
//            class: 'btn btn-primary btn-shadow',
//            handler: function (modal) {
//            }
//        }
//    ]
//});
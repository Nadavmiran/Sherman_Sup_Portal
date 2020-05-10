"use strict";

//$("#modal-1").fireModal({body: 'Modal body text goes here.'});
$("#modal-1").fireModal({ title: 'שגיאה בשמירת נתונים', body: $("#modal-error") });
$("#modal-2").fireModal({ title: 'הודעת מערכת', body: $("#modal-error"), center: true});
$("#modal-21").fireModal({ title: 'System message', body: $("#modal-error"), center: true });
let modal_3_body = '<p>לפתיחת תעודת דגימה חדשה בחר "כן"<br/>להוספת בדיקות לתעודת דגימה קיימת, לחץ "לא"</p>';
let modal_31_body = '<p>To create a new sample document, click "Yes"<br/>To add tests for an existing document, click "no".</p>';
//let modal_31_body = '<p>Do you want to create a new sample document</p><pre class="language-javascript"><code>';
//modal_31_body += '[\n';
//modal_31_body += ' {\n';
//modal_31_body += "   text: 'Login',\n";
//modal_31_body += "   submit: true,\n";
//modal_31_body += "   class: 'btn btn-primary btn-shadow',\n";
//modal_31_body += "   handler: function(modal) {\n";
//modal_31_body += "     alert('Hello, you clicked me!');\n"
//modal_31_body += "   }\n"
//modal_31_body += ' }\n';
//modal_31_body += ']';
//modal_31_body += '</code></pre>';
$("#modal-3").fireModal({
    title: 'דגימה חדשה?',
    body: modal_3_body,
    buttons: [
        {
            text: 'כן',
            class: 'btn btn-primary btn-shadow',
            handler: function (modal) {
                document.getElementById("hdnIsNewDocument").value = 1;
                doNext();
            }
        },
        {
            text: 'לא',
            class: 'btn btn-primary btn-danger',
            handler: function (modal) {
                document.getElementById("hdnIsNewDocument").value = 0;
                doNext();
            }
        }
    ]
});
$("#modal-31").fireModal({
  title: 'New sample document?',
  body: modal_31_body,
  buttons: [
    {
      text: 'Yes',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
          document.getElementById("hdnIsNewDocument").value = 1;
          doNext();
      }
      },
      {
          text: 'No',
          class: 'btn btn-primary btn-danger',
          handler: function (modal) {
              document.getElementById("hdnIsNewDocument").value = 0;
              doNext();
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

$("#modal-11").fireModal({
    title: 'פרטי שורת הזמנה',
    body: $("#modal-order-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        onSubmit_UpdateOrderLineData();
        //onSubmitCreateSampleList(e);
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">Data submited.</div>');

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

$("#modal-12").fireModal({
    title: 'Order Line',
    body: $("#modal-order-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        //onSubmitCreateSampleList(e);
        onSubmit_UpdateOrderLineData();
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">Data submited.</div>');

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

$("#modal-13").fireModal({
    title: 'עדכון פרטי תעודת דגימה',
    body: $("#modal-Sample-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        //onSubmitCreateSampleList(e);
        onSubmit_UpdateSampleDetails();
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">Data submited.</div>');

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

$("#modal-14").fireModal({
    title: 'Update sample detailse',
    body: $("#modal-Sample-part"),
    footerClass: 'bg-whitesmoke',
    autoFocus: true,
    onFormSubmit: function (modal, e, form) {
        // Form Data
        //onSubmitCreateSampleList(e);
        onSubmit_UpdateSampleDetails();
        let fake_ajax = setTimeout(function () {
            form.stopProgress();
            //modal.find('.modal-body').prepend('<div class="alert alert-info" id="divTLMsg">Data submited.</div>');

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

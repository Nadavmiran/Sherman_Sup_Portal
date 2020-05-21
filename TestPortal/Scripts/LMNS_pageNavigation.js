function navigateTestProduct(ORD, ORDNAME) {
    $.ajax({

        type: "GET",
        url: $('#navTestProduct').data('url'),
        data: {
            OrderID: ORD,
            orderNumber: ORDNAME
        },
        cache: false,
        success: function (data) {
            //console.log("navigateTestProduct data = ", data);
            document.getElementById('pageContent').innerHTML = data;
        }
    });
    setTimeout(function () {
        $.ajax({

            type: "POST",
            url: $('#navPostTestProduct').data('url'),
            data: {
                OrderID: ORD,
                orderNumber: ORDNAME
            },
            cache: false,
            success: function (data) {

                console.log("navPostTestProduct ==> onCellSelect data = ", data);
                InitTestPageData(data);
                document.getElementById('divOrdDetails').style.display = 'inline';
                $("#loader").hide();
            }
        });}, 300);
    
}

function navigateQA_Page(ORD, ORDNAME, PARTNAME, LINE) {
    $("#loader").show();
    $.ajax({

        type: "GET",
        url: $('#navQA_Page').data('url'), 
        cache: false,
        success: function (data) {
            //console.log("navigateQA_Page data = ", data);
            document.getElementById('pageContent').innerHTML = data;
        }
    });
    setTimeout(function () {$.ajax({

        type: "POST",
        url: $('#navGetProductQaData').data('url'), 
        data: {
            orderID: ORD,
            orderName: ORDNAME,
            prodName: PARTNAME,
            ordLine: LINE
        },
        cache: false,
        success: function (data) {
            console.log("navigateQA_Page ==> navGetProductQaData data = ", data);
            InitQAPageData(data);
            $("#loader").hide();
        }
    });
    }, 300);
}

function navigateTestPage() {
    navigateTestProduct(document.getElementById('hdnOrdId').value, document.getElementById('hdnPrdId').value);
    //if (x === 'rtl')
    //    window.location = window.location.origin + $('#navTestProduct').data('url') + '/?OrderID=' + document.getElementById('hdnOrdId').value + '&orderNumber=' + document.getElementById('hdnPrdId').value;
    //else
    //    window.location = window.location.origin + $('#navTestProduct').data('url') + '/?OrderID=' + document.getElementById('hdnOrdId').value + '&orderNumber=' + document.getElementById('hdnPrdId').value;
}
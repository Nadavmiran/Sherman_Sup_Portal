﻿var x = document.getElementsByTagName("html")[0].getAttribute("dir");
var objSample = '';
var pageSampleobject = '';
var objSampleStandardList = '';
var selectedORD = 0;
var selectedPARTNAME = '';
var selectedLINE = 0;
var previewsSupplayDate = '';

function pageSize() {
    $.jgrid.defaults.responsive = true;
    $.jgrid.defaults.shrinkToFit = true;
    $('#pageContent').css('height', $(document).innerHeight() - ($(document).innerHeight() / 4));
}

function getData(supplier) {
    //console.log("getData ==> window.sessionStorage.getItem('objOrdersList')", window.sessionStorage.getItem('objOrdersList'));
    if (null === window.sessionStorage.getItem('objOrdersList')) {
        $.ajax({

            type: "POST",
            url: $('#navGetOrdersData').data('url'), //"Home/GetOrdersData",
            data: {
                supplier: supplier
            },
            cache: false,
            success: function (data) {
                console.log("getData ==> data", data);
                window.sessionStorage.setItem('objOrdersList', JSON.stringify(data.lstOrderObject));
                grid_data = data.lstOrderObject;
                if (null === grid_data || grid_data === '')
                    return;

                showGrid();
            }
        });
    }
    else {
        grid_data = JSON.parse(window.sessionStorage.getItem('objOrdersList'));
        if (null === grid_data || grid_data === '')
            return;

        showGrid();
    }
}

function refreshOrdersData(supplier) {
    console.log("refreshOrdersData ==> supplier", supplier);
    window.sessionStorage.removeItem('objOrdersList');
    $.ajax({

        type: "POST",
        url: $('#navGetOrdersData').data('url'), //"Home/GetOrdersData",
        data: {
            supplier: supplier
        },
        cache: false,
        success: function (data) {
            console.log("refreshOrdersData ==> data", data);
            window.sessionStorage.setItem('objOrdersList', JSON.stringify(data.lstOrderObject));
            $("#jqGrid").GridUnload();
            grid_data = data.lstOrderObject;
            if (null === grid_data || grid_data === '')
                return;

            showGrid();
        }
    });
}

function InitTestPageData(data) {
    var OrdId = document.getElementById('hdnOrdId').value;
    var pordId = document.getElementById('hdnPrdId').value;

    document.getElementById('salesViewTabs').style.display = 'none';
    document.getElementById('ordViewTabs').style.display = 'inline';

    if (x === 'rtl') {
        document.getElementById('pageTitle').innerHTML = "דגימות";
    }
    else {
        document.getElementById('pageTitle').innerHTML = "Samples";
    }
    document.getElementById('mnuSampleDetails').style.display = 'none'; 
    document.getElementById('mnuSampleList').style.display = 'none'; 
    document.getElementById('mnuPartsList').style.display = 'none';
    document.getElementById('mnuRefresh').style.display = 'none';
    console.log('hdnOrdId = ', OrdId);
    console.log('pordId = ', pordId);
    console.log('$(document).ready ==> data = ', data);
    console.log('$(document).ready ==> data.lstAttachments = ', data.lstAttachments);

    showOrderDetail(data.objOrder);
    document.getElementById('orderAlert1').innerHTML = null === data.htmlText ? '' : data.htmlText;
    console.log('data.objOrderText ==> ', data.objOrderText);
    document.getElementById('ordCommonTextAlert1').innerHTML = null === data.objOrderText ? '' : data.objOrderText;
    if (null === data.lstItemsObject)
        GetOrderProducts(OrdId);
    else
        showGridProd(data.lstItemsObject);

    $("#jqGridAttachments_Ord").GridUnload();
    if (null !== data.lstOrderAttachments && null !== data.lstOrderAttachments.EXTFILES_SUBFORM && data.lstOrderAttachments.length > 0)
        if (null !== data.lstOrderAttachments[0].EXTFILES_SUBFORM && data.lstOrderAttachments[0].EXTFILES_SUBFORM.length > 0)
            showGridProdAttachments(data.lstOrderAttachments[0].EXTFILES_SUBFORM, '#jqGridAttachments_Ord');
}

function InitQAPageData(data) {
    pageSampleobject = data;
    if (x === 'rtl') {
        document.getElementById('pageTitle').innerHTML = "בדיקות איכות";
    }
    else {
        document.getElementById('pageTitle').innerHTML = "Testing Arena";
    }
    document.getElementById('lbl_pageREQDATE').style.display = 'inline-block';
    document.getElementById('lbl_DELAYREASON').style.display = 'inline-block';
    document.getElementById('txt_pageREQDATE').style.display = 'none';
    document.getElementById('combo_DELAYREASON').style.display = 'none';
    document.getElementById('txt_ReasonRejection').setAttribute('disabled', 'disabled');

    document.getElementById('mnuRefresh').style.display = 'none';
    document.getElementById('mnuSampleList').style.display = 'inline-block';
    document.getElementById('mnuPartsList').style.display = 'inline-block';
    document.getElementById('mnuSampleDetails').style.display = 'inline-block';
    document.getElementById('divOrdLineDetails').style.display = 'inline';
    document.getElementById('divSampleQA').style.display = 'inline-block';
    document.getElementById('sampleQaList').style.display = 'inline-block';
    document.getElementById('sampleDetails').style.display = 'inline-block';
    document.getElementById('hdnQaListSUPNAME').value = '';
    document.getElementById('hdnQaListORDNAME').value = '';
    document.getElementById('hdnQaListPARTNAME').value = '';
    document.getElementById('hdnQaListDOCNO').value = '';
    document.getElementById('hdnOrdId').value = data.objOrder.ORD;
    document.getElementById('hdnSUPNAME').value = data.objOrder.SUPNAME;
    document.getElementById('hdnPrdId').value = data.objProduct.PARTNAME;
    document.getElementById('hdnORDNAME').value = data.objOrder.ORDNAME;
    document.getElementById('hdnQaListORDNAME').value = data.objOrder.ORDNAME;

    showOrderLineDetail(data.objProduct);
    //Show order line text(comment)
    document.getElementById('orderLineAlert').innerHTML = null === data.objItemText || null === data.objItemText.TEXT ? '' : data.objItemText.TEXT;

    if (null !== data.lstSampleObject && data.lstSampleObject.length > 0)
        showPartSampls(data.lstSampleObject);
    else {
        console.log('data.lstSampleObject = ', data.lstSampleObject);
        if (x === 'rtl') {
            $("#modal-2").trigger("click");
            $("#modal-error-text").html('לא נמצאה תעודת דגימה. לחץ על הכפתור "בדיקות" בתפריט ליצירת תעודת דגימה.');
        }
        else {
            $("#modal-21").trigger("click");
            $("#modal-error-text").html('Sample document was not found. Click "Tests" button to create sample document.');
        }
    }
    $("#jqGridAttachments").GridUnload();

    if (null !== data.lstAttachments)
        showGridProdAttachments(data.lstAttachments, '#jqGridAttachments');

    $("#loader").hide();
}

function showSalesorderDetail(PARTNAME, ORD, LINE) {
    $("#loader").show();
    console.log('showSalesorderDetail ==> ORD = ', ORD);
    console.log('showSalesorderDetail ==> LINE = ', LINE);
    console.log('showSalesorderDetail ==> PARTNAME = ', PARTNAME);
    selectedORD = ORD;
    selectedPARTNAME = PARTNAME;
    selectedLINE = LINE;
    $.ajax({
        type: "POST",
        url: $('#navGetSalesorderDetail').data('url'),//"PostTestProduct",
        data: {
            orderID: ORD,
            prodName: PARTNAME,
            ordLine: LINE
        },
        cache: false,
        success: function (data) {
            console.log("showSalesorderDetail ==> data", data);
            if (null == data.objOrder.PORDERITEMS_SUBFORM || data.objOrder.PORDERITEMS_SUBFORM.length == 0 ) {
                $("#loader").hide();
                showErrorMessage(data.ErrorDescription);
                return;
            }
            showOrderDetail(data.objOrder);
            //Show order comments
            document.getElementById('orderAlert').innerHTML = null === data.htmlText ? '' : data.htmlText;
            document.getElementById('orderAlert1').innerHTML = null === data.htmlText ? '' : data.htmlText;
            showOrderLineDetail(data.objProduct);
            document.getElementById('ordCommonTextAlert').innerHTML = null === data.objOrderText ? '' : data.objOrderText;
            //Show order line comments
            console.log("showSalesorderDetail ==> data.objItemText", data.objItemText);
            document.getElementById('orderLineAlert').innerHTML = null === data.objItemText || null === data.objItemText.TEXT ? '' : data.objItemText.TEXT;
            //if (null !== data.objSample.MED_TRANSSAMPLEQA_SUBFORM)
            //    showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
            $("#jqGridAttachments").GridUnload();
            if (null !== data.lstOrderAttachments && null !== data.lstOrderAttachments.EXTFILES_SUBFORM && data.lstOrderAttachments.length > 0)
                if (null !== data.lstOrderAttachments[0].EXTFILES_SUBFORM && data.lstOrderAttachments[0].EXTFILES_SUBFORM.length > 0)
                    showGridProdAttachments(data.lstOrderAttachments[0].EXTFILES_SUBFORM, '#jqGridAttachments');

            document.getElementById('salesViewTabs').style.display = 'inline';
            document.getElementById('ordViewTabs').style.display = 'none';
            manageDelayReasonSelect(data);
            $("#loader").hide();
            if (x === 'rtl')
                $("#modal-11").trigger("click");
            else
                $("#modal-12").trigger("click");
        }
    });
}

function manageDelayReasonSelect(data)
{
    document.getElementById('div_ReasonRejection').style.display = 'block';
    let selectList = document.getElementById('combo_DELAYREASON');
    let i, L = selectList.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectList.remove(i);
    }

    let option = document.createElement("option");
    option.value = '-2';
    if (x === 'rtl')
        option.text = '-- בחר סיבת דחיה --';
    else
        option.text = '-- select delay reason --';
    option.disabled = true;
    option.selected = true;
    selectList.appendChild(option);

    //option = document.createElement("option");
    //option.value = '-1';
    //if (x === 'rtl')
    //    option.text = 'אחר';
    //else
    //    option.text = 'Other';
    //selectList.appendChild(option);
    if (null !== data.lstDelayReason && data.lstDelayReason.length > 0) {
        for (i = 0; i < data.lstDelayReason.length; i++) {
            option = document.createElement("option");
            option.value = data.lstDelayReason[i].CODE;
            if (x === 'rtl')
                option.text = data.lstDelayReason[i].DES;
            else
                option.text = data.lstDelayReason[i].EDES;

            console.log("showSalesorderDetail ==> data.objProduct.EFI_DELAYREASON", data.objProduct.EFI_DELAYREASON);
            console.log("showSalesorderDetail ==> data.lstDelayReason[i].DES", data.lstDelayReason[i].DES);
            if (null !== data.objProduct.EFI_DELAYREASON && data.objProduct.EFI_DELAYREASON !== '')
                if (data.objProduct.EFI_DELAYREASON === data.lstDelayReason[i].DES || data.objProduct.EFI_DELAYREASON === data.lstDelayReason[i].EDES)
                    option.selected = true;

            selectList.appendChild(option);
        }
    }
    option = document.createElement("option");
    option.value = '-1';
    if (x === 'rtl')
        option.text = 'אחר';
    else
        option.text = 'Other';
    selectList.appendChild(option);
    document.getElementById('lbl_pageREQDATE').style.display = 'none';
    document.getElementById('lbl_DELAYREASON').style.display = 'none';

    document.getElementById('txt_pageREQDATE').style.display = 'inline-block';
    document.getElementById('combo_DELAYREASON').style.display = 'inline-block';

    if (selectList.options[selectList.selectedIndex].value === '-1') {
        document.getElementById("txt_ReasonRejection").removeAttribute('disabled');
        document.getElementById('txt_ReasonRejection').value = data.objProduct.EFI_DELAYREASON;
    }
    else
        document.getElementById('txt_ReasonRejection').setAttribute('disabled', 'disabled');
}

function comboDelayReasonOnChange() {
    
    let selectList = document.getElementById('combo_DELAYREASON');
    console.log('comboDelayReasonOnChange ==> selectList.options[selectList.selectedIndex].value', selectList.options[selectList.selectedIndex].value);
    if (selectList.options[selectList.selectedIndex].value === '-1')
        document.getElementById("txt_ReasonRejection").removeAttribute('disabled');
    else
        document.getElementById('txt_ReasonRejection').setAttribute('disabled', 'disabled');
}

function showOrderDetail(objOrder) {
    console.log('showOrderDetail ==> objOrder', objOrder);
    document.getElementById('lbl_ORDNAME').innerText = null === objOrder.ORDNAME ? '' : objOrder.ORDNAME;
    document.getElementById('lbl_pageCURDATE').innerText = null === objOrder.pageCURDATE ? '' : objOrder.pageCURDATE;
    document.getElementById('lbl_OWNERLOGIN').innerText = null === objOrder.OWNERLOGIN ? '' : objOrder.OWNERLOGIN;
    document.getElementById('lbl_CURVERSION').innerText = null === objOrder.CURVERSION ? '' : objOrder.CURVERSION;
    //document.getElementById('SHR_SUPTYPEDES').innerText = null == objOrder.SUPTYPEDES ? '' : objOrder.SUPTYPEDES;
    document.getElementById('lbl_SUPNAME').innerText = null === objOrder.SUPNAME ? '' : objOrder.SUPNAME;
    document.getElementById('lbl_CDES').innerText = null === objOrder.CDES ? '' : objOrder.CDES;
    if (x === 'rtl') {
        document.getElementById('lbl_STATDESE').innerText = null === objOrder.STATDES ? '' : objOrder.STATDES;
        document.getElementById('lbl_TYPEDES').innerText = null === objOrder.TYPEDES ? '' : objOrder.TYPEDES;
    }
    else {
        document.getElementById('lbl_STATDESE').innerText = null === objOrder.EFI_ESTATDES ? '' : objOrder.EFI_ESTATDES;
        document.getElementById('lbl_TYPEDES').innerText = null === objOrder.EFI_ETYPEDES ? '' : objOrder.EFI_ETYPEDES;
    }
}

function setInputDate(_id, pageREQDATE) {
    let _dat = document.querySelector(_id);
    let minDate = new Date();
    let hoy = '';
    let d = '';
    let m = '';
    let y = '';
    let min_d = '';
    let min_m = '';
    let min_y = '';
    let data;
    if (null === pageREQDATE || pageREQDATE === '') {
        hoy = new Date(),
            d = hoy.getDate(),
            m = hoy.getMonth() + 1,
            y = hoy.getFullYear(),
            data;
        console.log(hoy);
        
    }
    else {
        pageREQDATE = pageREQDATE.replace("/", "-").replace("/", "-");
        let arr = pageREQDATE.split("-");
        pageREQDATE = arr[2] + '-' + arr[1] + '-' + arr[0];
        console.log(pageREQDATE);
        hoy = new Date(pageREQDATE);
        console.log(hoy);
        d = hoy.getDate();
        m = hoy.getMonth()+1;
        y = hoy.getFullYear();
    }

    min_d = minDate.getDate();
    min_m = minDate.getMonth() +1;
    min_y = minDate.getFullYear;

    if (min_d < 10) {
        min_d = "0" + d;
    }
    if (min_m < 10) {
        min_m = "0" + m;
    }

    if (d < 10) {
        d = "0" + d;
    }
    if (m < 10) {
        m = "0" + m;
    }

    data = y + "-" + m + "-" + d;
    console.log(data);
    _dat.value = data;
    data = min_y + '-' + min_m + '-' + min_d;
    _dat.min = data;
    previewsSupplayDate = _dat.value;
}

function showOrderLineDetail(objProduct) {
    console.log('showOrderLineDetail ==>  = objProduct', objProduct);
    previewsSupplayDate = '';
    var dateControl = document.querySelector('input[type="date"]');
    console.log('showOrderLineDetail ==>  = dateControl', dateControl);
    document.getElementById('lbl_LINE').innerText = null === objProduct.KLINE ? '' : objProduct.KLINE;
    document.getElementById('lbl_PARTNAME').innerText = null === objProduct.PARTNAME ? '' : objProduct.PARTNAME;
    console.log('showOrderLineDetail ==>  document.getElementById("lbl_pageREQDATE")', document.getElementById('lbl_pageREQDATE'));
    document.getElementById('lbl_pageREQDATE').innerText = null === objProduct.pageREQDATE ? '' : objProduct.pageREQDATE;
    if (objProduct.pageREQDATE === '')
        $('#txt_pageREQDATE').val('--/--/----');
    else {
        setInputDate("#txt_pageREQDATE", objProduct.pageREQDATE);
    }
    document.getElementById('lbl_SHR_SUP_REMARKS').value = null === objProduct.SHR_SUP_REMARKS ? '' : objProduct.SHR_SUP_REMARKS;
    document.getElementById('lbl_REQDATE2').innerText = null === objProduct.REQDATE2 ? '' : objProduct.pageREQDATE2;
    document.getElementById('lbl_SERIALNAME').innerText = null === objProduct.SERIALNAME ? '' : objProduct.SERIALNAME;
    document.getElementById('lbl_TQUANT').innerText = null === objProduct.TQUANT ? '' : objProduct.TQUANT;
    document.getElementById('lbl_TBALANCE').innerText = null === objProduct.TBALANCE ? '' : objProduct.TBALANCE;
    document.getElementById('lbl_ACTNAME').innerText = null === objProduct.ACTDES ? '' : objProduct.ACTDES;
    //document.getElementById('lbl_ACTNAME').innerText = null === objProduct.ACTNAME ? '' : objProduct.ACTNAME;
    document.getElementById('lbl_SHR_DRAW').innerText = null === objProduct.SHR_DRAW ? '' : objProduct.SHR_DRAW;
    document.getElementById('lbl_MNFDES').innerText = null === objProduct.MNFDES ? '' : objProduct.MNFDES;
    document.getElementById('lbl_SUPPARTNAME').innerText = null === objProduct.SUPPARTNAME ? '' : objProduct.SUPPARTNAME;
    document.getElementById('lbl_SHR_SERIAL_REVNUM').innerText = null === objProduct.SHR_SERIAL_REVNUM ? '' : objProduct.SHR_SERIAL_REVNUM;
    document.getElementById('lbl_REVNAME').innerText = null === objProduct.REVNAME ? '' : objProduct.REVNAME;
    document.getElementById('lbl_DELAYREASON').innerText = null === objProduct.EFI_DELAYREASON ? '' : objProduct.EFI_DELAYREASON;
    document.getElementById('lbl_REMARK').innerText = null === objProduct.REMARK ? '' : objProduct.REMARK;
    
    document.getElementById('div_ReasonRejection').style.display = 'none';

    if (x === 'rtl')
        document.getElementById('lbl_PDES').innerText = null === objProduct.PDES ? '' : objProduct.PDES;
    else
        document.getElementById('lbl_PDES').innerText = null === objProduct.EFI_EPARTDES ? '' : objProduct.EFI_EPARTDES;
}

function showSampleDetails(objSample) {
    console.log('showSampleDetails ==> objSample', objSample);
    if (null === objSample || null === objSample.DOCNO) {
        if (x === 'rtl') {
            //$("#modal-2").trigger("click");
            //$("#modal-error-text").html('לא נמצאה תעודת דגימה. לחץ על הכפתור "בדיקות" בתפריט ליצירת תעודת דגימה.');
            showErrorMessage('לא נמצאה תעודת דגימה. לחץ על הכפתור "בדיקות" בתפריט ליצירת תעודת דגימה.');
        }
        else {
            //$("#modal-21").trigger("click");
            //$("#modal-error-text").html('Sample document was not found. Click "Tests" button to create sample document.');
            showErrorMessage('Sample document was not found. Click "Tests" button to create sample document.');
        }
    }
    else {
        GetSampleStandardList(objSample);
    }
}

function GetSampleStandardList(objSample) {
    x = document.getElementsByTagName("html")[0].getAttribute("dir");
    $.ajax(
        {
            type: "POST",
            url: $('#navGetSampleStandardList').data('url'),//"/Home/GetSampleTestList",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log('GetSampleStandardList ==> response', response);
                document.getElementById('lbl_SERIALNAME').value = null === objSample.SERIALNAME ? '' : objSample.SERIALNAME;
                document.getElementById('lbl_PARTNAME').value = null === objSample.PARTNAME ? '' : objSample.PARTNAME;
                document.getElementById('lbl_DOCNO').innerText = null === objSample.DOCNO ? '' : objSample.DOCNO;
                document.getElementById('lbl_CURDATE').innerText = null === objSample.pageCURDATE ? '' : objSample.pageCURDATE;
                document.getElementById('lbl_SHR_QUANT').value = null === objSample.SHR_QUANT ? 0 : objSample.SHR_QUANT;
                document.getElementById('lbl_MAX_REJECT').innerText = null === objSample.MAX_REJECT ? '' : objSample.MAX_REJECT;
                document.getElementById('lbl_EFI_SUPNO').value = null === objSample.SUPNAME ? '' : objSample.SUPNAME;
                document.getElementById('lbl_SHR_SERIAL_QUANT').innerText = null === objSample.SHR_SERIAL_QUANT ? '' : objSample.SHR_SERIAL_QUANT;
                document.getElementById('lbl_SHR_RAR').innerText = null === objSample.SHR_RAR ? '' : objSample.SHR_RAR;
                document.getElementById('lbl_SHR_SAMPLE_STD_CODE').value = null === objSample.SHR_SAMPLE_STD_CODE ? '' : objSample.SHR_SAMPLE_STD_CODE;
                document.getElementById('lbl_QUANT').innerText = null === objSample.QUANT ? '' : objSample.QUANT;
                document.getElementById('lbl_SHR_ROHS').checked = null === objSample.SHR_ROHS || objSample.SHR_ROHS === 'N' ? false : true;
                document.getElementById('lbl_SAMPLE_TYPE_CODE').value = null === objSample.SAMPLE_TYPE_CODE ? '' : objSample.SAMPLE_TYPE_CODE;
                console.log('GetSampleStandardList ==> objSample.SAMPLE_TYPE_CODE', objSample.SAMPLE_TYPE_CODE);
                objSampleStandardList = response.lstSampleStandard;
                console.log('GetSampleStandardList ==> objSampleStandardList', objSampleStandardList);
                let sl = document.getElementById('lbl_SHR_SAMPLE_STD_CODE');
                console.log('GetSampleStandardList ==> sl = lbl_SHR_SAMPLE_STD_CODE', sl);
                let i, L = sl.options.length - 1;
                for (i = L; i >= 0; i--) {
                    sl.remove(i);
                }
                for (i = 0; i < objSampleStandardList.length; i++) {
                    let option = document.createElement("option");
                    console.log('GetSampleStandardList ==> objSampleStandardList[i].SAMPLE_STD_CODE', objSampleStandardList[i].SAMPLE_STD_CODE);
                    console.log('GetSampleStandardList ==> objSampleStandardList[i].SHR_SAMPLE_STD', objSampleStandardList[i].SHR_SAMPLE_STD);
                    option.value = objSampleStandardList[i].SHR_SAMPLE_STD;
                    option.text = objSampleStandardList[i].SAMPLE_STD_CODE;
                    
                    if (objSample.SHR_SAMPLE_STD_CODE === objSampleStandardList[i].SAMPLE_STD_CODE)
                        option.selected = true;
                    sl.appendChild(option);
                }
                // Fill sample status
                sl = document.getElementById('lbl_STATDES');
                console.log('GetSampleStandardList ==> sl = lbl_STATDES', sl);
                if (null !== sl.options) {
                    L = sl.options.length - 1;
                    for (i = L; i >= 0; i--) {
                        sl.remove(i);
                    }
                }
                console.log('GetSampleStandardList ==> response.lstSampleStatus', response.lstSampleStatus);
                console.log('GetSampleStandardList ==> x', x);
                for (i = 0; i < response.lstSampleStatus.length; i++) {
                    let option = document.createElement("option");
                    option.value = response.lstSampleStatus[i].SAMPLESTATUS;
                    option.setAttribute('heb_Status', response.lstSampleStatus[i].STATDES);
                    if (x === 'rtl')
                    {
                        option.text = response.lstSampleStatus[i].STATDES;
                        if (objSample.STATDES === response.lstSampleStatus[i].STATDES) {
                            console.log('GetSampleStandardList ==> objSample.STATDES', objSample.STATDES);
                            console.log('GetSampleStandardList ==> response.lstSampleStatus[i].STATDES', response.lstSampleStatus[i].STATDES);
                            option.selected = true;
                        }
                    }
                    else
                    {
                        option.text = response.lstSampleStatus[i].ESTATDES;
                        if (objSample.ESTATDES === response.lstSampleStatus[i].ESTATDES) {
                            console.log('GetSampleStandardList ==> objSample.STATDES', objSample.ESTATDES);
                            console.log('GetSampleStandardList ==> response.lstSampleStatus[i].STATDES', response.lstSampleStatus[i].ESTATDES);
                            option.selected = true;
                        }
                    }
                    sl.appendChild(option);
                }
                document.getElementById('sampleDetails').style.display = 'inline-block';
                //var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                if (x === 'rtl')
                    $("#modal-13").trigger("click");
                else
                    $("#modal-14").trigger("click");
            }
        });
}
function onSubmit_UpdateSampleDetails() {
    let DOCNO = document.getElementById('lbl_DOCNO').innerText;
    let EFI_SUPNO = document.getElementById('lbl_EFI_SUPNO').value;
    let SHR_QUANT = document.getElementById('lbl_SHR_QUANT').value;
    let SHR_ROHS = document.getElementById('lbl_SHR_ROHS').checked ? 'Y' : 'N';
    let PARTNAME = document.getElementById('lbl_PARTNAME').value;
    let SERIALNAME = document.getElementById('lbl_SERIALNAME').value;
    //let SHR_SAMPLE_STD_CODE = document.getElementById('lbl_SHR_SAMPLE_STD_CODE').value;
    let SAMPLE_TYPE_CODE = document.getElementById('lbl_SAMPLE_TYPE_CODE').value;

    let sl = document.getElementById('lbl_SHR_SAMPLE_STD_CODE');
    console.log("onSubmit_UpdateSampleDetails ==> lbl_SHR_SAMPLE_STD_CODE => sl.options[sl.selectedIndex].text", sl.options[sl.selectedIndex].text);
    let SHR_SAMPLE_STD_CODE = sl.options[sl.selectedIndex].text;

    sl = document.getElementById('lbl_STATDES');
    console.log("onSubmit_UpdateSampleDetails ==> lbl_STATDES => sl.options[sl.selectedIndex]", sl.options[sl.selectedIndex].attributes.heb_status.nodeValue);
    console.log("onSubmit_UpdateSampleDetails ==> lbl_STATDES => sl.options[sl.selectedIndex].text", sl.options[sl.selectedIndex].text);
    //let STATDES = sl.options[sl.selectedIndex].text;
    let STATDES = sl.options[sl.selectedIndex].attributes.heb_status.nodeValue;
    console.log("onSubmit_UpdateSampleDetails ==> DOCNO", DOCNO);
    console.log("onSubmit_UpdateSampleDetails ==> EFI_SUPNO", EFI_SUPNO);
    console.log("onSubmit_UpdateSampleDetails ==> SHR_QUANT", SHR_QUANT);
    console.log("onSubmit_UpdateSampleDetails ==> SHR_ROHS", SHR_ROHS);
    console.log("onSubmit_UpdateSampleDetails ==> SHR_SAMPLE_STD_CODE", SHR_SAMPLE_STD_CODE);
    console.log("onSubmit_UpdateSampleDetails ==> SAMPLE_TYPE_CODE", SAMPLE_TYPE_CODE);
    console.log("onSubmit_UpdateSampleDetails ==> SERIALNAME", SERIALNAME);
    console.log("onSubmit_UpdateSampleDetails ==> PARTNAME", PARTNAME);
    $.ajax(
        {
            type: "POST",
            data:
            {
                STATDES: STATDES,
                SAMPLE_TYPE_CODE: SAMPLE_TYPE_CODE,
                EFI_SUPNO: EFI_SUPNO,
                SHR_QUANT: SHR_QUANT,
                SHR_ROHS: SHR_ROHS,
                SHR_SAMPLE_STD_CODE: SHR_SAMPLE_STD_CODE,
                DOCNO: DOCNO,
                SERIALNAME: SERIALNAME,
                PARTNAME: PARTNAME
            },
            url: $('#navUpdateSampleDetails').data('url'),//"/Home/UpdateSampleDetails",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response)
            {
                console.log("onSubmit_UpdateSampleDetails ==> response", response);
                if (null === response.objOrder && null === response.lstSampleObject)
                {
                    if (null === response.apiResultMessage || response.apiResultMessage === '')
                    {
                        if (x === 'rtl')
                            showErrorMessage('ארעה שגיאה בעת שמירת הנתונים.');
                        else
                            showErrorMessage('An error occured while saving data.');
                    }
                    else
                        showErrorMessage(response.apiResultMessage);
                }
                else {
                       pageSampleobject.objSample = response.objSample;
                        pageSampleobject.lstSampleObject = response.lstSampleObject;
                        $("#jqGridPartSampls").GridUnload();
                        showPartSampls(response.lstSampleObject);
                }
            }
        });
}

function showErrorMessage(errMsg) {
    console.log('showErrorMessage ==> errMsg', errMsg);
    if (x === 'rtl') {
        $("#modal-error-text").html(errMsg);
        $("#modal-2").trigger("click");
        //$("#modal-error-text").html(errMsg);
        console.log('showErrorMessage ==> modal-error-text', $("#modal-error-text"));
    }
    else {
        $("#modal-21").trigger("click");
        $("#modal-error-text").html(errMsg);
    }
}

function fillSampleSection(objSample) {
    console.log('fillSampleSection ==> objSample.CURDATE = ', objSample.CURDATE);
    document.getElementById('lbl_S_DOCNO').innerText = objSample.DOCNO;
    document.getElementById('lbl_S_CURDATE').innerText = objSample.pageCURDATE;
    document.getElementById('lbl_S_QUANT').innerText = objSample.QUANT;
    document.getElementById('lbl_S_SERIALNAME').innerText = objSample.SERIALNAME;
    document.getElementById('lbl_S_SHR_RAR').innerText = objSample.SHR_RAR;
    document.getElementById('lbl_S_SHR_SERIAL_QUANT').innerText = objSample.SHR_SERIAL_QUANT;
    document.getElementById('lbl_S_STATDES').innerText = objSample.STATDES;
    document.getElementById('lbl_S_SHR_SAMPLE_STD_CODE').innerText = objSample.SHR_SAMPLE_STD_CODE;
}

function getFormattedDate(date) {
    var dDate = new Date(date);
    var year = dDate.getFullYear();

    var month = (1 + dDate.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = dDate.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

function doNext() {
    let supName = document.getElementById('hdnSUPNAME').value;
    let partName = document.getElementById('hdnPrdId').value;
    let ordNAME = document.getElementById('hdnORDNAME').value;
    let ordLINE = document.getElementById('lbl_LINE').innerText;
    let inNewDoc = document.getElementById('hdnIsNewDocument').value;
    console.log('OpentestList ==> supName = ', supName);
    console.log('OpentestList ==> partName = ', partName);
    console.log('OpentestList ==> ordNAME = ', ordNAME);
    console.log('OpentestList ==> ordLINE = ', ordLINE);
    console.log('OpentestList ==> inNewDoc = ', inNewDoc);

    document.getElementById('hdnQaListSUPNAME').value = supName;
    document.getElementById('hdnQaListPARTNAME').value = partName;

    if (inNewDoc == 1) {
        createNewSampleDocument(supName, ordNAME, partName, ordLINE);
    }
    else {
        $.ajax(
            {
                type: "POST",
                data:
                {
                    supName: supName,
                    partName: partName,
                    ordName: ordNAME,
                    ordLine: ordLINE
                },
                url: $('#navGetSampleTestList').data('url'),//"/Home/GetSampleTestList",
                contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
                success: function (response) {
                    console.log("response", response);
                    if (null !== response && null !== response.lstSamplQA && response.lstSamplQA.length > 0) {
                        pageSampleobject.objSample = response.objSample;
                        pageSampleobject.lstSamplQA = response.lstSamplQA;
                        showGridTestList(response.lstSamplQA);
                        //if (null !== response.objSample && null !== response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                        //    showSelectedSampleQA(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                        //else {
                            var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                            if (x === 'rtl')
                                $("#modal-9").trigger("click");
                            else
                                $("#modal-10").trigger("click");
                        //}
                    }
                    else {
                        if (response.ErrorDescription !== '') {
                            //form_data[0].reset();
                            $('.modal').modal('hide');
                            $('.modal').removeClass('show');
                            $("#modal-error-text").html(response.ErrorDescription);
                            $("#modal-1").trigger("click");
                        }
                    }
                }
            });
    }
}
function OpentestList()
{
    var x = document.getElementsByTagName("html")[0].getAttribute("dir");
    console.log("GetSampleTests ==> pageSampleobject", pageSampleobject);
    console.log("OpentestList ==> DOCNO", document.getElementById('hdnQaListDOCNO').value);
    console.log("OpentestList ==> x(isRTL)", x);
    if (document.getElementById('hdnQaListDOCNO').value === '' && pageSampleobject.lstSampleObject !== null && pageSampleobject.lstSampleObject.length > 0)
    {
        if (x === 'rtl') {
            $("#modal-2").trigger("click");
            $("#modal-error-text").html('יש לבחור תעודת דגימה מרשימת הדגימות ואז להוסיף בדיקות.');
        }
        else {
            $("#modal-21").trigger("click");
            $("#modal-error-text").html('No sample document was selected. Please select document from the list below and then add tests.');
        }
    }
    else
    {
        //Open message : do you want to create a new sample document?
        $("#jqGridSampleQA").GridUnload();
        document.getElementById('hdnIsNewDocument').value = -1;
        // Show modal Is new document?
        if (x === 'rtl')
            $("#modal-3").trigger("click");
        else 
            $("#modal-31").trigger("click");
    }
}

function getSampleTestList() {
    let supName = document.getElementById('hdnSUPNAME').value;
    let partName = document.getElementById('hdnPrdId').value;
    let ordNAME = document.getElementById('hdnORDNAME').value;
    let ordLINE = document.getElementById('lbl_LINE').innerText;
    let inNewDoc = document.getElementById('hdnIsNewDocument').value;
    console.log('OpentestList ==> supName = ', supName);
    console.log('OpentestList ==> partName = ', partName);
    console.log('OpentestList ==> ordNAME = ', ordNAME);
    console.log('OpentestList ==> ordLINE = ', ordLINE);
    console.log('OpentestList ==> inNewDoc = ', inNewDoc);

    document.getElementById('hdnQaListSUPNAME').value = supName;
    document.getElementById('hdnQaListPARTNAME').value = partName;
    $.ajax(
        {
            type: "POST",
            data:
            {
                supName: supName,
                partName: partName,
                ordName: ordNAME,
                ordLine: ordLINE
            },
            url: $('#navGetSampleTestList').data('url'),//"/Home/GetSampleTestList",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log("getSampleTestList ==> response", response);
                if (null !== response && null !== response.lstSamplQA && response.lstSamplQA.length > 0) {
                    document.getElementById('sampleQaList').style.display = 'inline-block';
                    showGridTestList(response.lstSamplQA);
                    //if (null !== response.objSample && null !== response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                    //    showSelectedSampleQA(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                    //else {
                    //var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                    if (x === 'rtl')
                        $("#modal-9").trigger("click");
                    else
                        $("#modal-10").trigger("click");
                    //}
                }
                else {
                    if (response.ErrorDescription !== '') {
                        //form_data[0].reset();
                        $('.modal').modal('hide');
                        $('.modal').removeClass('show');
                        $("#modal-error-text").html(response.ErrorDescription);
                        $("#modal-1").trigger("click");
                    }
                }
            }
        });
}

function GetSampleTests(rowData) {

    console.log("GetSampleTests ==> rowData", rowData);
    /***********  Fill Qa test list pop-up hidden fields **************/
    document.getElementById('hdnQaListSUPNAME').value = rowData.SUPNAME;
    document.getElementById('hdnQaListORDNAME').value = document.getElementById('hdnORDNAME').value;
    document.getElementById('hdnQaListPARTNAME').value = rowData.PARTNAME;
    document.getElementById('hdnQaListDOCNO').value = rowData.DOCNO;
    /******************************************************************/
    $.ajax(
        {
            type: "POST",
            data:
            {
                PARTNAME: rowData.PARTNAME,
                SUPNAME: rowData.SUPNAME,
                DOCNO: rowData.DOCNO
            },
            url: $('#navGetSampleTest').data('url'),//"/Home/GetSampleTestList",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log("GetSampleTests ==> response", response);
                if (null != response && null != response.objSample) {
                    pageSampleobject.objSample = response.objSample;
                    if (null !== response.lstSampleAttachments)
                        showGridSampleAttachments(response.lstSampleAttachments);
                    $("#jqGridRevision").GridUnload();
                    if (null !== response.objSample && null !== response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                        showGridProdSamples(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                    else {
                        let x = document.getElementsByTagName("html")[0].getAttribute("dir");
                        if (x === 'rtl') {
                            $("#modal-2").trigger("click");
                            $("#modal-error-text").html('לא נמצאו בדיקות לדגימה זו. יש ללחוץ על כפתור "בדיקות" ולהוסיף בדיקות מתוך הרשימה.');
                        }
                        else {
                            $("#modal-21").trigger("click");
                            $("#modal-error-text").html('No tests were found for this sample.Click the "Test" button and add tests from the list.');
                        }
                    }
                }
                else {
                    if (response.ErrorDescription !== '') {
                        form_data[0].reset();
                        $('.modal').modal('hide');
                        $('.modal').removeClass('show');
                        $("#modal-error-text").html(response.ErrorDescription);
                        $("#modal-1").trigger("click");
                    }
                    else
                    {
                        if (null != response && null != response.RouteValues && response.RouteValues.length > 0)
                        {
                            $.ajax(
                                {
                                    type: "POST",
                                    data:
                                    {
                                        supName: supName,
                                        partName: partName,
                                        ordName: ordNAME,
                                        ordLine: ordLINE
                                    },
                                    url: $('#navLogOff').data('url'),//"/Account/Logoff",
                                    contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
                                    success: function (response) {
                                    }
                                });
                        }
                    }
                }
            }
        });
}
function UpdateSampleDetails() {
    console.log('UpdateSampleDetails ==> pageSampleobject', pageSampleobject);
    showSampleDetails(pageSampleobject.objSample);
}

function createNewSampleDocument(supNAME, ordNAME, partNAME, ordLINE) {
    console.log("IN createNewSampleDocument");
    $.ajax(
        {
            type: "POST",
            data:
            {
                supName: supNAME,
                partName: partNAME,
                ordName: ordNAME,
                ordLine: ordLINE
            },
            url: $('#navCreateSampleDocument').data('url'),//"/Home/GetSampleTestList",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log("createNewSampleDocument ==> response", response);
                if (null !== response && null !== response.lstSampleObject && response.lstSampleObject.length > 0) {
                    pageSampleobject.objSample = response.objSample;
                    pageSampleobject.lstSamplQA = response.lstSamplQA;
                    $("#jqGridPartSampls").GridUnload();
                    showPartSampls(response.lstSampleObject);

                    if (null !== response.objSample && null !== response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length == 0) {
                        getSampleTestList();
                        //showGridTestList(response.lstSamplQA);
                        //var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                        //if (x === 'rtl')
                        //    $("#modal-9").trigger("click");
                        //else
                        //    $("#modal-10").trigger("click");
                    }
                    else
                        showSelectedSampleQA(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                }
                else {
                    if (response.ErrorDescription !== '') {
                        //form_data[0].reset();
                        $('.modal').modal('hide');
                        $('.modal').removeClass('show');
                        $("#modal-error-text").html(response.ErrorDescription);
                        $("#modal-1").trigger("click");
                    }
                }
            }
        });
}

function GetOrderProducts(OrdId) {
    $.ajax({
        type: "POST", 
        url: $('#navTestProductOrderItems').data('url'),//"TestProductOrderItems",
        data: {
            orderId: parseInt(OrdId)
        },
        cache: false,
        success: function (data) {
            console.log("GetOrderProducts ==> data", data);
            grid_data = data.lstItemsObject;
            showGridProd(grid_data);
        }
    });
}

function GetOrderProductTests(prodName, supplier, qaCode, REPETITION, DOCNO) {
    console.log('GetOrderProductTests ==> REPETITION = ', REPETITION);
    if (REPETITION === 0)
        return;
    //console.log('GetOrderProductTests ==> prodName = ', prodName);
    $.ajax({
        type: "POST",
        url: $('#navGetOrderProductTests').data('url'),//"GetOrderProductTests",
        data: {
            DOCNO: DOCNO,
            qaCode: qaCode
        },
        cache: false,
        success: function (resData) {
            console.log("GetOrderProductTests ==> resData", resData);
            let isRESULTDET_SUBFORM = false;

            console.log("GetOrderProductTests ==> REPETITION", REPETITION);
            document.getElementById("testRepitition").style.display = 'none';
            if (null !== resData.objSample && REPETITION > 0)
                if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM && resData.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                    if (resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].RESULTANT === 'Y') {
                        isRESULTDET_SUBFORM = true;
                        document.getElementById("testRepitition").style.display = 'inline';
                        pageSampleobject.objSample = resData.objSample;
                    }                
            console.log("GetOrderProductTests ==> isRESULTDET_SUBFORM", isRESULTDET_SUBFORM);
            var continer = document.getElementById("repititionTest");
            continer.innerHTML = '';
            for (var i = 0; i < REPETITION; i++)
            {
                var div = document.createElement('div');
                var lbl = document.createElement('label');
                var text = document.createElement('input');

                div.classList.add('form-group', 'col-md-3', 'col-12');
               
                lbl.style.fontWeight = 'bolder';
                if (document.getElementsByTagName("html")[0].getAttribute("dir") === 'rtl')
                    lbl.innerText = 'שורה';
                else
                    lbl.innerText = 'Line';

                div.appendChild(lbl);
                
                text.type = 'text';
                text.classList.add('form-control');
                text.id = 'txtLINE_' + i;
                if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0])
                    if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM && resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM.length > 0)
                        if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM[i])
                            if (isRESULTDET_SUBFORM)
                                text.value = resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM[i].KLINE;

                div.appendChild(text);

                continer.appendChild(div);
                //console.log("continer ==> continer", continer);

                div = document.createElement('div');
                div.classList.add('form-group', 'col-md-3', 'col-12');

                lbl = document.createElement('label');
                lbl.style.fontWeight = 'bolder';
                if (document.getElementsByTagName("html")[0].getAttribute("dir") === 'rtl')
                    lbl.innerText = 'תוצאה';
                else
                    lbl.innerText = 'Result';

                div.appendChild(lbl);

                text = document.createElement('input');
                text.type = 'text';
                text.classList.add('form-control');
                text.id = 'txtRESULT_' + i;
                if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0])
                    if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM && resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM.length > 0)
                        if (null !== resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM[i])
                            if (isRESULTDET_SUBFORM)
                                text.value = resData.objSample.MED_TRANSSAMPLEQA_SUBFORM[0].MED_RESULTDET_SUBFORM[i].RESULT;
                div.appendChild(text);

                continer.appendChild(div);
                //console.log("continer ==> continer", continer);
            }
        }
    });
}

function formatTestProdLink(cellValue, options, rowObject) {//options.rowId
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'javascript:GetProductAndRevision(' + rowObject.OrderID + ', ' + options.rowId + ', ' + rowObject.LINE + ');';
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    return a.outerHTML;
}

function formatRPTLinkTest(cellValue, options, rowObject) {//options.rowId
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    return a.outerHTML;
}

function formatGetRevListLink(cellValue, options, rowObject) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'javascript:GetRevision(' + cellValue + ', ' + options + ', ' + rowObject + ');';
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatFileIcon(cellValue, options, rowObject) {//options.rowId
    //rowObject.ProductID
    console.log("formatFileIcon ==> options", options);
    console.log("formatFileIcon ==> rowObject", rowObject);
    var a = document.createElement('i');
    var ico = document.createTextNode(cellValue);
    //a.appendChild(ico);
    //a.title = cellValue;
    a.style = "font-size: 20px;";
    switch (cellValue) {
        case 'pdf':
        case 'PDF':
            a.classList = 'far fa-file-pdf';
            break;
        case 'doc':
        case 'DOC':
        case 'docx':
        case 'DOCX':
            a.classList = 'far fa-file-word';
            break;
        case 'xls':
        case 'XLS':
        case 'xlsx':
        case 'XLSX':
            a.classList = 'far fa-file-excel';
            break;
        default:
            a.classList = 'far fa-file-alt';
            break;
    }
    
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function downloadFile(filefolder, filename) {
    console.log("filefolder", filefolder);
    //filefolder = 'Test';
    //filename = 'פורטל ספקים01022020.docx';

    console.log("downloadFile ==> filefolder", filefolder);
    console.log("downloadFile ==> filename", filename);
    //$.fileDownload('http://192.168.0.125/SherPortal/PriorityDocs/MM602085C.pdf');
    //I:/23559000/23559000_C/MM602085C.pdf
    $.ajax(
        {
            type: "POST",
            data:
            {
                fileFolder: filefolder,
                fileName: filename
            },
            url: $('#navDownload').data('url'),//"/Home/Download",
            success: function (response) {
                //
                console.log("downloadFile ==> Downlod => url", $('#navDownloadFile').data('url'));
                DoDownlod(filefolder, filename);
                
                //window.location = window.location.origin + $('#downLoadFile').data('url') + "/?fileFolder=" + filefolder + "&fileName=" + filename;
           }
        });
}

function DoDownlod(filefolder, filename) {
    $.ajax({
        type: "GET",
        data:
        {
            fileFolder: filefolder,
            fileName: filename
        },
        url: $('#navDownloadFile').data('url'),//"/Home/DownloadFile",
        success: function (response) {
            console.log("DoDownlod ==> DownloadFile => response", response);
            //window.open(window.location.origin + $('#navDownloadFile').data('url') + "/?fileFolder=" + filefolder + "&fileName=" + filename);
            //window.location.href = "@Url.RouteUrl(new { Controller = "Home", Action = "DownloadFile" })/?fileFolder=" + filefolder + "&fileName=" + filename;
            window.location = window.location.origin + $('#navDownloadFile').data('url') + "/?fileFolder=" + filefolder + "&fileName=" + filename;
        }
    });
}

function onSelectRow_ProdSamples(id, rowId, iCol, content) {
    console.log('jqGridRevision ==> getLocalRow ', $('#jqGridRevision').getLocalRow(rowId));
    console.log('jqGridRevision ==> id ', id);
    var rowData = $('#jqGridRevision').getRowData(id);
    console.log("onSelectRow rowData = ", rowData);
    console.log('jqGridRevision ==> rowId ', rowId);
    console.log('jqGridRevision ==> iCol ', iCol);
    console.log('jqGridRevision ==> content ', content);

    OpenSampleModal(rowData);
}

function OpenSampleModal(rowData) {
    console.log("OpenSampleModal rowData = ", rowData);

    $('#divMsg').remove();

    var rasData = GetOrderProductTests(rowData.PARTNAME, rowData.SUPNAME, rowData.QACODE, rowData.REPETITION, rowData.DOCNO);
    document.getElementById('attachments').value = '';
    document.getElementById('txtQACODE').innerText = rowData.QACODE;
    
    document.getElementById('txtQaLOCATION').innerText = rowData.LOCATION;
    document.getElementById('txtQaSHR_TEST').innerText = rowData.SHR_TEST;
    document.getElementById('txtQaRESULTMIN').innerText = rowData.RESULTMIN;
    document.getElementById('txtQaRESULTMAX').innerText = rowData.RESULTMAX;
    if (rowData.RESULTANT === 'Y') // אם תוצאתית
    {
        document.getElementById("txtQaRESULTANT").setAttribute('disabled', 'disabled');
        document.getElementById('txtQaRESULTANT').checked = true;
        document.getElementById('txtQaRESULTANT').value = 'on';
        document.getElementById('txtQaNORMAL').setAttribute('disabled', 'disabled');
        //document.getElementById('txtQaNORMAL').value = rowData.NORMAL;
        if (rowData.REPETITION > 0)
            document.getElementById('txtQaRESULT').setAttribute('disabled', 'disabled');
        else
            document.getElementById("txtQaRESULT").removeAttribute('disabled');
    }
    else
    {
        document.getElementById('txtQaRESULT').setAttribute('disabled', 'disabled');
        document.getElementById("txtQaRESULTANT").setAttribute('disabled', 'disabled');
        document.getElementById('txtQaRESULTANT').checked = false;
        document.getElementById('txtQaRESULTANT').value = 'off';
        document.getElementById("txtQaNORMAL").removeAttribute('disabled');
        document.getElementById('txtQaNORMAL').value = rowData.NORMAL;
        //if (rowData.NORMAL === 'Y') //  אם תקין
        //{
        //    document.getElementById('txtQaNORMAL').value = true;
        //}
        //else {
        //    document.getElementById('txtQaNORMAL').checked = false;
        //}
    }
    document.getElementById('hdnQaORDNAME').value = document.getElementById('hdnORDNAME').value;
    document.getElementById('txtQaREPETITION').innerText = rowData.REPETITION;
    document.getElementById('txtQaREQUIRED_RESULT').innerText = rowData.REQUIRED_RESULT;
    document.getElementById('txtQaSAMPQUANT').innerText = rowData.SAMPQUANT;
    
    document.getElementById('txtQaEFI_CRITICALFLAG').checked = null === rowData.EFI_CRITICALFLAG || rowData.EFI_CRITICALFLAG === '' || rowData.EFI_CRITICALFLAG === 'N' ? false : true;
    if (document.getElementById('txtQaEFI_CRITICALFLAG').checked)
        document.getElementById('lblQaEFI_CRITICALFLAG').style.color = 'red';
    else
        document.getElementById('lblQaEFI_CRITICALFLAG').style.color = 'crimson';
    document.getElementById('txtQaRESULT').value = rowData.RESULT;
    document.getElementById('txtQaREMARK').value = rowData.REMARK;
    document.getElementById('hdnQaDOCNO').value = rowData.DOCNO;
    document.getElementById('hdnQaSUPNAME').value = rowData.SUPNAME;
    document.getElementById('hdnQACODE').value = rowData.QACODE;
    document.getElementById('hdnLOCATION').value = rowData.LOCATION;
    document.getElementById('hdnQA').value = rowData.QA;
    document.getElementById('hdnQaPARTNAME').value = rowData.PARTNAME;
    document.getElementById('hdnQaREPETITION').value = rowData.REPETITION;
    document.getElementById('hdnQaSAMPQUANT').value = rowData.SAMPQUANT;
    
    if (x === 'rtl') {
        document.getElementById('txtQADES').innerText = rowData.QADES;
        document.getElementById('txtQaMEASUREDES').innerText = rowData.MEASUREDES;
        document.getElementById('txtQaEFI_MEASURESUPTOOLS').value = rowData.EFI_MEASURESUPTOOLS;
    }
    else {
        document.getElementById('txtQADES').innerText = rowData.EFI_QADES;//SHR_QADES;
        document.getElementById('txtQaMEASUREDES').innerText = rowData.EFI_EDES;
        document.getElementById('txtQaEFI_MEASURESUPTOOLS').value = rowData.EFI_EDES;
    }
    
}

function GetResultRecord(data, parentRowKey) {
    console.log("GetResultRecord ==> parentRowKey", parentRowKey);
    console.log("GetResultRecord ==> data", data);
    var rec = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].QACODE === parentRowKey) {
            for (var x = 0; x < data[i].MED_RESULTDET_SUBFORM.length; x++) {
                rec.push(data[i].MED_RESULTDET_SUBFORM[x]);
            }
            console.log("GetResultRecord ==> rec", rec);
            return rec;
        }
    }
    return rec;
}

function onSubmit_TestForm(e) {
    console.log("onSubmit_TestForm ==> e = ", e);
    // Form Data
    let form_data = $(e.target);
    let fd = $(e.target.elements);
    var fdata = new FormData();
    var formdata = $('#attachments').prop("files");
    console.log("files = ", formdata);
    console.log("$(e) = ", fd);
    console.log("form_data = ", form_data);
    for (var i = 0; i < formdata.length; i++) {
        var sfilename = formdata[i].name;
        let srandomid = Math.random().toString(36).substring(7);

        fdata.append(sfilename, formdata[i]);
    }

    console.log(formdata);
    fdata.append("sampleData", decode(createJson(fd)));
    console.log("UploadFiles ==> fdata = ", fdata);
    $.ajax(
        {
            type: "POST",
            data: fdata,
            url: $('#navUploadFiles').data('url'),//"/Home/UploadFiles",
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("UploadFiles - response", response);
                if (null !== response)
                {
                    if (null !== response.ResultData)
                    {
                        if (response.ResultStatus === 'OK')
                            return;
                    }
                    if (response.ErrorDescription !== '') {
                        //$("#modal-error-text").html(response.ErrorDescription);
                        //$("#modal-1").trigger("click");
                        showErrorMessage(response.ErrorDescription);
                    }
                }
            }
        });
    // DO AJAX HERE
    $.ajax(
        {
            type: "POST",
            data:
            {
                data: createJson(fd)//decode(form_data)
            },
            url: $('#navSaveTest').data('url'),//"/Home/SaveTest",
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log("response", response);
                if (null !== response && null !== response.ResultData)
                {
                    pageSampleobject.objSample = response.ResultData;
                    if (null !== response.ResultData.MED_EXTFILES_SUBFORM) {
                        $("#jqGridSampleAttachments").GridUnload();
                        showGridSampleAttachments(response.ResultData.MED_EXTFILES_SUBFORM);
                    }

                    if (null !== response.ResultData.MED_TRANSSAMPLEQA_SUBFORM) {
                        $("#jqGridRevision").GridUnload();
                        showGridProdSamples(response.ResultData.MED_TRANSSAMPLEQA_SUBFORM);

                    }
                    else {
                        if (response.ErrorDescription !== '') {
                            form_data[0].reset();
                            $('.modal').modal('hide');
                            $('.modal').removeClass('show');
                            if (x === 'rtl') {
                                $("#modal-1").trigger("click");
                                $("#modal-error-text").html(response.ErrorDescription);
                            }
                            else {
                                $("#modal-21").trigger("click");
                                $("#modal-error-text").html(response.ErrorDescription);
                            }
                        }
                    }
                }
                else {
                    if (response.ErrorDescription !== '') {
                        form_data[0].reset();
                        $('.modal').modal('hide');
                        $('.modal').removeClass('show');
                        if (x === 'rtl')
                        {
                            $("#modal-1").trigger("click");
                            $("#modal-error-text").html(response.ErrorDescription);
                        }
                        else {
                            $("#modal-21").trigger("click");
                            $("#modal-error-text").html(response.ErrorDescription);
                        }
                    }
                }
            }
        });

    //fdata.append("sampleData", decode(createJson(fd)));
    //console.log("UploadFiles ==> fdata = ", fdata);
    //$.ajax(
    //    {
    //        type: "POST",
    //        data: fdata,
    //        url: $('#navUploadFiles').data('url'),//"/Home/UploadFiles",
    //        contentType: false,
    //        processData: false,
    //        success: function (response) {
    //            console.log("UploadFiles - response", response);
    //            if (null !== response && null !== response.ResultData) {
    //                if (response.ResultStatus === 'OK')
    //                    return;

    //                if (response.ErrorDescription !== '') {
    //                    $("#modal-error-text").html(response.ErrorDescription);
    //                    $("#modal-1").trigger("click");
    //                }
    //            }
    //        }
    //    });
}

function onSubmitCreateSampleList(e) {
    let fd = $(e.target.elements);
    console.log("fd", fd);
    console.log('selected row data:', $('#jqGridSampleQA'));
    var grid = $("#jqGridSampleQA");
    var rowKey = grid.getGridParam("selrow");

    if (!rowKey)
        alert("No rows are selected");
    else {
        var selectedIDs = grid.getGridParam("selarrrow");
        var rowData = '';
        console.log('selectedIDs:', selectedIDs);
        var jsonObj = {
            "form": []
        };
        var item = {};
        var result = "";
        for (var i = 0; i < selectedIDs.length; i++) {
            rowData = $("#jqGridSampleQA").getRowData(selectedIDs[i]);
            item["RESULTMIN"] = rowData.RESULTMIN;
            item["RESULTMAX"] = rowData.RESULTMAX;
            item["REPETITION"] = rowData.REPETITION;
            item["QACODE"] = selectedIDs[i];

            console.log('rowData:', rowData);
            result += selectedIDs[i] + ",";
            console.log("item", item);
            jsonObj.form.push(item);
            item = {};
        }
    }
    result = jsonObj;
    console.log("result", JSON.stringify(jsonObj));
    let SUPNAME = '';
    let PARTNAME = '';
    let ORDNAME = '';
    let isNewDocument = false;
    for (i = 0; i < fd.length; i++) {
        if (fd[i].id.includes('hdnQaListSUPNAME'))
            SUPNAME = fd[i].value;
        if (fd[i].id.includes('hdnQaListPARTNAME'))
            PARTNAME = fd[i].value;
        if (fd[i].id.includes('hdnQaListORDNAME'))
            ORDNAME = fd[i].value;
        if (fd[i].id.includes('hdnQaListDOCNO'))
            DOCNO = fd[i].value;
    }

    console.log("SUPNAME", SUPNAME);
    console.log("PARTNAME", PARTNAME);
    //if (document.getElementById('hdnIsNewDocument').value == '1')
    //    isNewDocument = true;
    // DO AJAX HERE
    $.ajax(
    {
        type: "POST",
        data:
        {
            supName: SUPNAME,
            partName: PARTNAME,
            DOCNO: DOCNO,
            ordName: ORDNAME,
            qaCode: JSON.stringify(jsonObj)
        },
            url: $('#navCreateTest').data('url'),//"/Home/CreateTest",
        contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
        success: function (response) {
            console.log("response", response);
            pageSampleobject.objSample = response.objSample;
            if (null !== response.objSample.MED_TRANSSAMPLEQA_SUBFORM) {
                $("#jqGridRevision").GridUnload();
                $("#jqGridPartSampls").GridUnload();
                showPartSampls(response.lstSampleObject);
                //show test for sample doc
                //showGridProdSamples(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);

                jQuery('#jqGridSelectedSampleQA').jqGrid('clearGridData');
                jQuery('#jqGridSelectedSampleQA').jqGrid('setGridParam', { data: response.objSample.MED_TRANSSAMPLEQA_SUBFORM });
                jQuery('#jqGridSelectedSampleQA').trigger('reloadGrid');
            }
            else {
                if (response.ErrorDescription !== '') {
                    form_data[0].reset();
                    $('.modal').modal('hide');
                    $('.modal').removeClass('show');
                    $("#modal-error-text").html(response.ErrorDescription);
                    $("#modal-1").trigger("click");
                }
            }
        }
    });
}

function compareDates() {
    let REQDATE = document.getElementById('txt_pageREQDATE').value;
    let REQDATE2 = document.getElementById('lbl_REQDATE2').innerText;
    console.log("compareDates => REQDATE", REQDATE);
    console.log("compareDates => REQDATE2", REQDATE2);
    if ((null !== REQDATE || REQDATE !== '') && (null != REQDATE2 || REQDATE2 !== '')) {
        let REQDATE_dateFormat = REQDATE.replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$2/$1");
        console.log("REQDATE_dateFormat", REQDATE_dateFormat);
        let REQDATE_Date = new Date(REQDATE_dateFormat);
        REQDATE_Date.setHours(0, 0, 0, 0);
        console.log("REQDATE_Date", REQDATE_Date);
        console.log("REQDATE2", REQDATE2);
        let REQDATE2_dateFormat = REQDATE2.replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$2/$1");
        console.log("REQDATE2_dateFormat", REQDATE_dateFormat);
        let REQDATE2_Date = new Date(REQDATE2_dateFormat);
        REQDATE2_Date.setHours(0, 0, 0, 0);
        console.log("REQDATE2_Date", REQDATE_Date);

        if (REQDATE_Date > REQDATE2_Date) {
            //alert(REQDATE_Date < REQDATE2_Date);
            if (x === 'rtl')
                document.getElementById('lbl_pageREQDATE_Err').innerText = 'שים לב: תאריך אספקה מאוחר יותר מתאריך אספקה מבוקש';
            else
                document.getElementById('lbl_pageREQDATE_Err').innerText = 'NOTE: Delivery date later than requested delivery date';
        }
        else
            document.getElementById('lbl_pageREQDATE_Err').innerText = '';
    }
}


function validateOrderLineDetailsOnSubmit() {
    let selectList = document.getElementById('combo_DELAYREASON');
    let SUPNAME = document.getElementById('lbl_SUPNAME').innerText;
    let PARTNAME = document.getElementById('lbl_PARTNAME').innerText;
    let ORDNAME = document.getElementById('lbl_ORDNAME').innerText;
    let LINE = document.getElementById('lbl_LINE').innerText;
    let DELAYREASON = '';
    let REQDATE = document.getElementById('txt_pageREQDATE').value;
    let SHR_SUP_REMARKS = document.getElementById('lbl_SHR_SUP_REMARKS').value;
    let res = 0;

    console.log("SHR_SUP_REMARKS", SUPNAME);
    console.log("SUPNAME", SUPNAME);
    console.log("PARTNAME", PARTNAME);
    console.log("ORDNAME", ORDNAME);
    console.log("LINE", LINE);
    console.log("DELAYREASON", DELAYREASON);
    console.log("DELAYREASON - VALUE", selectList.options[selectList.selectedIndex].value);
    console.log("REQDATE", REQDATE);
    console.log("previewsSupplayDate", previewsSupplayDate);

    if (null === REQDATE || REQDATE === '') {
        if (x === 'rtl') {
            showErrorMessage('חובה לציין תאריך אספקה');
        }
        else
            showErrorMessage('Supply date is mandatory field');

        setTimeout(function () { showSalesorderDetail(selectedPARTNAME, selectedORD, selectedLINE); }, 5000);
        return false;
    }

    if (selectList.options[selectList.selectedIndex].value === '-1')
        DELAYREASON = document.getElementById("txt_ReasonRejection").value;
    else
        DELAYREASON = selectList.options[selectList.selectedIndex].text;

    if (selectList.options[selectList.selectedIndex].value === '-2')
        DELAYREASON = '';

    if (selectList.options[selectList.selectedIndex].value === '-2' && previewsSupplayDate !== '')
    {
        if (REQDATE !== previewsSupplayDate) {
            if (x === 'rtl')
                showErrorMessage('בכוונתך לעדכן תאריך אספקה בפעם השנייה - חובה לציין סיבת דחייה');
            else
                showErrorMessage('You are about to change supply date again - Please add delay reason');

            return false;
            //(function () { showSalesorderDetail(selectedPARTNAME, selectedORD, selectedLINE); }, 4000);
            // false;
        }
    }
    return true;
}
function onSubmit_UpdateOrderLineData(e, form) {
    let selectList = document.getElementById('combo_DELAYREASON');
    let SUPNAME = document.getElementById('lbl_SUPNAME').innerText;
    let PARTNAME = document.getElementById('lbl_PARTNAME').innerText;
    let ORDNAME = document.getElementById('lbl_ORDNAME').innerText;
    let LINE = document.getElementById('lbl_LINE').innerText;
    let DELAYREASON = '';
    let REQDATE = document.getElementById('txt_pageREQDATE').value;
    let SHR_SUP_REMARKS = document.getElementById('lbl_SHR_SUP_REMARKS').value;
    let res = 0;

    console.log("SHR_SUP_REMARKS", SUPNAME);
    console.log("SUPNAME", SUPNAME);
    console.log("PARTNAME", PARTNAME);
    console.log("ORDNAME", ORDNAME);
    console.log("LINE", LINE);
    console.log("DELAYREASON", DELAYREASON);
    console.log("DELAYREASON - VALUE", selectList.options[selectList.selectedIndex].value);
    console.log("REQDATE", REQDATE);
    console.log("previewsSupplayDate", previewsSupplayDate);
    
    //if (null === REQDATE || REQDATE === '') {
    //    if (x === 'rtl') {
    //        showErrorMessage('חובה לציין תאריך אספקה');
    //    }
    //    else
    //        showErrorMessage('Supply date is mandatory field');

    //    setTimeout(function () { showSalesorderDetail(selectedPARTNAME, selectedORD, selectedLINE); }, 5000);
    //    return false;
    //}

    //if (selectList.options[selectList.selectedIndex].value === '-1')
    //    DELAYREASON = document.getElementById("txt_ReasonRejection").value;
    //else
    //    DELAYREASON = selectList.options[selectList.selectedIndex].text;

    //if (selectList.options[selectList.selectedIndex].value === '-2')
    //    DELAYREASON = '';

    //if (selectList.options[selectList.selectedIndex].value === '-2' && previewsSupplayDate !== '')
    //{
    //    if (REQDATE !== previewsSupplayDate) {
    //        if (x === 'rtl')
    //            showErrorMessage('בכוונתך לעדכן תאריך אספקה בפעם השנייה - חובה לציין סיבת דחייה');
    //        else
    //            showErrorMessage('You are about to change supply date again - Please add delay reason');


    //        //(function () { showSalesorderDetail(selectedPARTNAME, selectedORD, selectedLINE); }, 4000);
    //        // false;
    //    }
    //    //else
    //    //    DELAYREASON = '';
    //}
    /****************************************************************************/
    //else
    //    DELAYREASON = '';

    $("#loader").show();
    // DO AJAX HERE
    $.ajax(
        {
            type: "POST",
            data:
            {
                PARTNAME: PARTNAME,
                SUPNAME: SUPNAME,
                LINE: LINE,
                ORDNAME: ORDNAME,
                REQDATE: REQDATE,
                DELAYREASON: DELAYREASON,
                SHR_SUP_REMARKS: SHR_SUP_REMARKS
            },
            url: $('#navUpdateSupplyDateAndDelayReason').data('url'),
            contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
            success: function (response) {
                console.log("onSubmit_UpdateOrderLineData ==> response", response);
                
                $("#loader").hide();
                if (null !== response.ErrorDescription) {
                    showErrorMessage(response.ErrorDescription);
                }
                else
                    res = 1;
            }
        });

    //console.log('onSubmit_UpdateOrderLineData - SUBMIT result = ' + res);
    //if (res == 0)
    //    setTimeout(function () { showSalesorderDetail(selectedPARTNAME, selectedORD, selectedLINE); }, 4000);
    //else
        refreshOrdersData(SUPNAME);
    return true;
}

function decode(str) {
return decodeURIComponent(str.replace(/\+/g, " "));
}

function createJson(fd) {
    var jsonObj = {
        "form": [],
        "SUB_RES": []
    };
    var item = {};
    var itemRes = {};
    for (var i = 0; i < fd.length; i++) {
        if (fd[i].id === '')
            continue;
       
        console.log("fd[i]", fd[i]);
        console.log("fd[i] txtLINE_", fd[i].id.includes('txtLINE_'));
        console.log("fd[i] txtRESULT_", fd[i].id.includes('txtRESULT_'));

        if (fd[i].id.includes('txtLINE_'))
            itemRes["KLINE"] = fd[i].value;
        if (fd[i].id.includes('txtRESULT_'))
        {
            itemRes["RESULT"] = fd[i].value;
            jsonObj.SUB_RES.push(itemRes);
            itemRes = {};
        }
        else
        {
            //var val = fd[i].value;
            console.log("fd[i].value", fd[i].value);
            if (fd[i].id === 'txtQaNORMAL') {
                let sl = document.getElementById('txtQaNORMAL');
                console.log("createJson ==> txtQaNORMAL => sl.options[sl.selectedIndex].value", sl.options[sl.selectedIndex].value);
                fd[i].value = sl.options[sl.selectedIndex].value;
                //console.log("fd[i].checked ==> txtQaNORMAL", fd[i].checked);
                //if (fd[i].checked)
                //    fd[i].value = 'Y';
                //else
                //    fd[i].value = 'N';

                console.log("fd[i].value ==> txtQaNORMAL", fd[i].value);
            }
            if (fd[i].id === 'txtQaEFI_CRITICALFLAG') {
                console.log("fd[i].checked ==> txtQaEFI_CRITICALFLAG", fd[i].checked);
                if (fd[i].checked)
                    fd[i].value = 'Y';
                else
                    fd[i].value = 'N';
            }
            item[fd[i].id] = fd[i].value;
        }
        console.log("itemRes", itemRes);
    }
    jsonObj.form.push(item);
    

    console.log("JSON.stringify(jsonObj)", JSON.stringify(jsonObj));
    return JSON.stringify(jsonObj);
}

function GetRecord(data, parentRowKey) {
    console.log("GetRecord ==> parentRowKey", parentRowKey);
    console.log("GetRecord ==> data", data);
    var rec = [];
    for (var i = 0; i < data.length; i++)
    {
        console.log("GetRecord ==> data[i].ORD", data[i].ORD);
        if (data[i].ORD == parentRowKey)
        {
            
            for (var x = 0; x < data[i].PORDERITEMS_SUBFORM.length; x++)
            {
                rec.push(data[i].PORDERITEMS_SUBFORM[x]);
            }
            console.log("GetRecord ==> rec", rec);
            return rec;
        }
    }
    return rec;
}

function UpdateOrderlineData() {

    //oi.ORDNAME = ORDNAME;
    //oi.PARTNAME = PARTNAME;
    //oi.LINE = LINE;
    //oi.EFI_DELAYREASON = DELAYREASON;
    //oi.REQDATE = Convert.ToDateTime(REQDATE);
    //ResultAPI ra = oi.UpdateOrderLineData(SUPNAME);
}
//function GetRevision(cellValue, options, rowObject) {
//    $.ajax({
//        type: "POST",
//        url: $('#navGetProductRevisionList').data('url'),//"GetProductRevisionList",
//        data: {
//            prodId: options.rowId,
//            revId: rowObject.REVNUM
//        },
//        cache: false,
//        success: function (data) {
//            console.log("GetOrderProducts ==> data", data);
//            if (null != data.lstRevision) {
//                gridRevisionData = data.lstRevision;
//                showGridProdRevision(gridRevisionData);
//            }
//        }
//    });
//}

//function GetProductAndRevision(OrderID, prodId, ordLine) {
//    console.log("GetProductAndRevision ==> options", OrderID);
//    console.log("GetProductAndRevision ==> prodId", prodId);
//    console.log("GetProductAndRevision ==> ordLine", ordLine);
//    jQuery("#jqGridRevision").jqGrid("GridUnload");
//    $.ajax({
//        type: "POST",
//        url: $('#navTestProductItemData').data('url'),//"TestProductItemData",
//        data: {
//            orderID: OrderID,
//            prodId: prodId,
//            ordLine: ordLine
//        },
//        cache: false,
//        success: function (data) {
//            console.log("GetProductAndRevision ==> data", data);
//            if (null != data.lstRevision) {
//                gridRevisionData = data.lstRevision;
//                showGridProdRevision(gridRevisionData);
//                document.getElementById('lblProductName').innerText = data.objProduct.ProductName;
//                document.getElementById('hdnOrdId').value = data.objProduct.OrderID;
//                document.getElementById('hdnPrdId').value = data.objProduct.ProductID;
//                document.getElementById('lblProductDescription').innerText = data.objProduct.ProductDescription;
//                document.getElementById('lblSupplyDate').innerText = data.objProduct.SupplyDate;
//                document.getElementById('lblTotalAmountInOrder').innerText = data.objProduct.TotalAmountInOrder;
//                document.getElementById('lblLeftAmountToDeliver').innerText = data.objProduct.LeftAmountToDeliver;
//                document.getElementById('lblLineStatus').innerText = data.objProduct.LineStatus;
//            }
//        }
//    });
//}

//function GetProductDetails(rowData) {
//    console.log("IN GetProductDetails ==> rowData", rowData);
//    $("#loader").show();
//    $.ajax({
//        type: "POST",
//        url: $('#navPostTestProductItem').data('url'),//"/Home_IL/PostTestProductItem",
//        data: {
//            orderID: parseInt(rowData.ORD),
//            prodName: rowData.PARTNAME,
//            ordLine: parseInt(rowData.LINE)
//        },
//        cache: false,
//        success: function (data) {
//            $("#jqGridRevision").GridUnload();
//            $("#jqGridAttachments").GridUnload();
//            $("#jqGridTest").GridUnload();

//            console.log("GetProductDetails ==> data", data);
//            if (null != data.objProduct) {
//                document.getElementById('lblLineNun').innerText = data.objProduct.LINE;
//                document.getElementById('lblProductName').innerText = null == data.objProduct.PARTNAME ? '' : data.objProduct.PARTNAME;
//                document.getElementById('lblSupplyDate').innerText = null == data.objProduct.pageREQDATE ? '' : data.objProduct.pageREQDATE;
//                document.getElementById('lblProductDescription').innerText = null == data.objProduct.PDES ? '' : data.objProduct.PDES;
//                document.getElementById('lbl_SERIALNAME').innerText = null == data.objProduct.SERIALNAME ? '' : data.objProduct.SERIALNAME;
//                document.getElementById('lbl_REQDATE2').innerText = null == data.objProduct.pageREQDATE2 ? '' : data.objProduct.pageREQDATE2;
//                document.getElementById('lblTotalAmountInOrder').innerText = null == data.objProduct.TQUANT ? '' : data.objProduct.TQUANT;
//                document.getElementById('lblLeftAmountToDeliver').innerText = null == data.objProduct.TBALANCE ? '' : data.objProduct.TBALANCE;
//                document.getElementById('lbl_ACTNAME').innerText = null == data.objProduct.ACTNAME ? '' : data.objProduct.ACTNAME;
//                document.getElementById('lbl_SHR_DRAW').innerText = null == data.objProduct.SHR_DRAW ? '' : data.objProduct.SHR_DRAW;
//                document.getElementById('lbl_SHR_MNFPARTNAME').innerText = null == data.objProduct.SHR_MNFPARTNAME ? '' : data.objProduct.SHR_MNFPARTNAME;
//                document.getElementById('lbl_SHR_MNFDES').innerText = null == data.objProduct.SHR_MNFDES ? '' : data.objProduct.SHR_MNFDES;
//                document.getElementById('lbl_SHR_SERIAL_REVNUM').innerText = null == data.objProduct.SHR_SERIAL_REVNUM ? '' : data.objProduct.SHR_SERIAL_REVNUM;
//                document.getElementById('lbl_REVNAME').innerText = null == data.objProduct.REVNAME ? '' : data.objProduct.REVNAME;
//                document.getElementById('lblReasonRejection').innerText = '';

//                document.getElementById('hdnOrdId').value = data.objProduct.ORD;
//                document.getElementById('hdnPrdId').value = data.objProduct.PARTNAME;

//                if (null != data.lstAttachments)
//                    showGridProdAttachments(data.lstAttachments);

//                if (null == data.objSample.DOCNO) {
//                    /****** To Do: ****************/
//                    /* Opan new saple             */
//                    OpentestList();
//                    /*****************************/
//                    $("#jqGridRevision").GridUnload();
//                }
//                else {
//                    // Fill sample data
//                    fillSampleSection(data.objSample);
//                    $("#jqGridRevision").GridUnload();
//                    console.log("data.objSample.MED_TRANSSAMPLEQA_SUBFORM", data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
//                    if (null != data.objSample.MED_TRANSSAMPLEQA_SUBFORM) {
//                        console.log("data.objSample.MED_TRANSSAMPLEQA_SUBFORM", data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
//                        showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
//                    }
//                }
//                $("#loader").hide();
//            }
//            else {
//                window.location.href = $('#Logoff').data('url');
//            }
//        }
//    });
//}
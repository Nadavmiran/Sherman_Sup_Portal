var x = document.getElementsByTagName("html")[0].getAttribute("dir");

var pageSampleobject = '';

function getData(supplier) {
    $.ajax({

        type: "POST",
        url: $('#navGetOrdersData').data('url'), //"Home/GetOrdersData",
        data: {
            supplier: supplier
        },
        cache: false,
        success: function (data) {
            console.log("data", data);
            grid_data = data.lstOrderObject;
            if ((null === grid_data) || (grid_data === ''))
                return;

            showGrid();
        }
    });
}

function InitTestPageData(data) {
    var OrdId = document.getElementById('hdnOrdId').value;
    var pordId = document.getElementById('hdnPrdId').value;

    document.getElementById('mnuSampleList').style.display = 'none';
    document.getElementById('mnuPartsList').style.display = 'none';

    console.log('hdnOrdId = ', OrdId);
    console.log('pordId = ', pordId);
    console.log('$(document).ready ==> data = ', data);
    console.log('$(document).ready ==> data.lstAttachments = ', data.lstAttachments);

    showOrderDetail(data.objOrder);
    if (null == data.lstItemsObject)
        GetOrderProducts(OrdId);
    else
        showGridProd(data.lstItemsObject);
}

function InitQAPageData(data) {
    pageSampleobject = data;
    document.getElementById('mnuSampleList').style.display = 'inline-block';
    document.getElementById('mnuPartsList').style.display = 'inline-block';
    document.getElementById('divSampleQA').style.display = 'inline-block';
    document.getElementById('sampleQaList').style.display = 'inline-block';
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
    if (null != data.lstSampleObject && data.lstSampleObject.length > 0)
        showPartSampls(data.lstSampleObject);
    else {
        console.log('data.lstSampleObject = ', data.lstSampleObject);
        if (x == 'rtl') {
            $("#modal-2").trigger("click");
            $("#modal-error-text").html('לא נמצאה תעודת דגימה. לחץ על הכפתור "בדיקות" בתפריט ליצירת תעודת דגימה.');
        }
        else {
            $("#modal-21").trigger("click");
            $("#modal-error-text").html('Sample document was not found. Click "Tests" button to create sample document.');
        }
    }

    if (null != data.lstAttachments)
        showGridProdAttachments(data.lstAttachments);

    $("#loader").hide();
}

function navigateTestPage() {
    if (x == 'rtl')
        window.location = window.location.origin + $('#navTestProduct').data('url') + '/?OrderID=' + document.getElementById('hdnOrdId').value + '&orderNumber=' + document.getElementById('hdnPrdId').value;
    else
        window.location = window.location.origin + $('#navTestProduct').data('url') + '/?OrderID=' + document.getElementById('hdnOrdId').value + '&orderNumber=' + document.getElementById('hdnPrdId').value;
}

function showSalesorderDetail(PARTNAME, ORD, LINE) {
    console.log('showSalesorderDetail ==> ORD = ', ORD);
    console.log('showSalesorderDetail ==> LINE = ', LINE);
    console.log('showSalesorderDetail ==> PARTNAME = ', PARTNAME);
    $.ajax({
        type: "POST",
        url: $('#navOrder').data('url'),//"PostTestProduct",
        data: {
            orderID: ORD,
            prodName: PARTNAME,
            ordLine: LINE
        },
        cache: false,
        success: function (data) {
            console.log("showSalesorderDetail ==> data", data);
            showOrderDetail(data.objOrder);
            showOrderLineDetail(data.objProduct);

            if (null != data.objSample.MED_TRANSSAMPLEQA_SUBFORM)
                showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
            if (null != data.lstAttachments)
                showGridProdAttachments(data.lstAttachments);

            if (x == 'rtl')
                $("#modal-11").trigger("click");
            else
            $("#modal-12").trigger("click");
        }
    });
}

function showOrderDetail(objOrder) {
    console.log('showOrderDetail ==> objOrder', objOrder);
    document.getElementById('lbl_ORDNAME').innerText = null == objOrder.ORDNAME ? '' : objOrder.ORDNAME;
    document.getElementById('lbl_pageCURDATE').innerText = null == objOrder.pageCURDATE ? '' : objOrder.pageCURDATE;
    document.getElementById('lbl_STATDESE').innerText = null == objOrder.STATDESE ? '' : objOrder.STATDESE;
    document.getElementById('lbl_OWNERLOGIN').innerText = null == objOrder.OWNERLOGIN ? '' : objOrder.OWNERLOGIN;
    document.getElementById('SHR_SUPTYPEDES').innerText = null == objOrder.SUPTYPEDES ? '' : objOrder.SUPTYPEDES;
    document.getElementById('lbl_SUPNAME').innerText = null == objOrder.SUPNAME ? '' : objOrder.SUPNAME;
    document.getElementById('lbl_CDES').innerText = null == objOrder.CDES ? '' : objOrder.CDES;
    document.getElementById('lbl_TYPEDES').innerText = null == objOrder.TYPEDES ? '' : objOrder.TYPEDES;
    
}

function showOrderLineDetail(objProduct) {
    document.getElementById('lbl_LINE').innerText = null == objProduct.LINE ? '' : objProduct.LINE;
    document.getElementById('lbl_PARTNAME').innerText = null == objProduct.PARTNAME ? '' : objProduct.PARTNAME;
    document.getElementById('lbl_pageREQDATE').innerText = null == objProduct.pageREQDATE ? '' : objProduct.pageREQDATE;
    document.getElementById('lbl_REQDATE2').innerText = null == objProduct.REQDATE2 ? '' : objProduct.pageREQDATE2;
    document.getElementById('lbl_PDES').innerText = null == objProduct.PDES ? '' : objProduct.PDES;
    document.getElementById('lbl_SERIALNAME').innerText = null == objProduct.SERIALNAME ? '' : objProduct.SERIALNAME;
    document.getElementById('lbl_TQUANT').innerText = null == objProduct.TQUANT ? '' : objProduct.TQUANT;
    document.getElementById('lbl_TBALANCE').innerText = null == objProduct.TBALANCE ? '' : objProduct.TBALANCE;
    document.getElementById('lbl_ACTNAME').innerText = null == objProduct.ACTNAME ? '' : objProduct.ACTNAME;
    document.getElementById('lbl_SHR_DRAW').innerText = null == objProduct.SHR_DRAW ? '' : objProduct.SHR_DRAW;
    document.getElementById('lbl_SHR_MNFDES').innerText = null == objProduct.SHR_MNFDES ? '' : objProduct.SHR_MNFDES;
    document.getElementById('lbl_SHR_MNFPARTNAME').innerText = null == objProduct.SHR_MNFPARTNAME ? '' : objProduct.SHR_MNFPARTNAME;
    document.getElementById('lbl_SHR_SERIAL_REVNUM').innerText = null == objProduct.SHR_SERIAL_REVNUM ? '' : objProduct.SHR_SERIAL_REVNUM;
    document.getElementById('lbl_REVNAME').innerText = null == objProduct.REVNAME ? '' : objProduct.REVNAME;
}

function showSampleDetails(objSample) {
    console.log('showSampleDetails ==> objSample', objSample);
    if (null == objSample || null == objSample.DOCNO) {
        $("#modal-21").trigger("click");
        $("#modal-error-text").html('Sample document was not found. Click "Tests" button to create sample document.');
    }
    else {
        document.getElementById('lbl_DOCNO').innerText = null == objSample.DOCNO ? '' : objSample.DOCNO;
        document.getElementById('lbl_CURDATE').innerText = null == objSample.pageCURDATE ? '' : objSample.pageCURDATE;
        document.getElementById('lbl_QUANT').innerText = null == objSample.QUANT ? '' : objSample.QUANT;
        document.getElementById('lbl_SERIALNAME').innerText = null == objSample.SERIALNAME ? '' : objSample.SERIALNAME;
        document.getElementById('lbl_SHR_RAR').innerText = null == objSample.SHR_RAR ? '' : objSample.SHR_RAR;
        document.getElementById('lbl_SHR_SERIAL_QUANT').innerText = null == objSample.SHR_SERIAL_QUANT ? '' : objSample.SHR_SERIAL_QUANT;
        document.getElementById('lbl_STATDES').innerText = null == objSample.STATDES ? '' : objSample.STATDES;
        document.getElementById('lbl_SHR_SAMPLE_STD_CODE').innerText = null == objSample.SHR_SAMPLE_STD_CODE ? '' : objSample.SHR_SAMPLE_STD_CODE;
    }
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
                    //showGridSampleList(response.lstSamplQA);
                    $("#jqGridRevision").GridUnload();
                    if (null != response.objSample && null != response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                        showGridProdSamples(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);

                    //var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                    //if (x == 'rtl')
                    //    $("#modal-9").trigger("click");
                    //else
                    //    $("#modal-10").trigger("click");
                }
                else {
                    if (response.ErrorDescription != '') {
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
                if (null != response && null != response.lstSamplQA && response.lstSamplQA.length > 0) {
                    pageSampleobject.objSample = response.objSample;
                    pageSampleobject.lstSamplQA = response.lstSamplQA;
                    showGridSampleList(response.lstSamplQA);

                    if (null != response.objSample && null != response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                        showSelectedSampleQA(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);

                    var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                    if (x == 'rtl')
                        $("#modal-9").trigger("click");
                    else
                        $("#modal-10").trigger("click");
                }
                else {
                    if (response.ErrorDescription != '') {
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
function OpentestList()
{
    var x = document.getElementsByTagName("html")[0].getAttribute("dir");
    console.log("GetSampleTests ==> pageSampleobject", pageSampleobject);
    console.log("OpentestList ==> DOCNO", document.getElementById('hdnQaListDOCNO').value);
    console.log("OpentestList ==> x(isRTL)", x);
    if (document.getElementById('hdnQaListDOCNO').value == '' && pageSampleobject.lstSampleObject != null && pageSampleobject.lstSampleObject.length > 0)
    {
        if (x == 'rtl') {
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
        var x = document.getElementsByTagName("html")[0].getAttribute("dir");
        document.getElementById('hdnIsNewDocument').value = -1;
        if (x == 'rtl')
            $("#modal-3").trigger("click");
        else {
            $("#modal-31").trigger("click");
        }
    }
}

function createNewSampleDocument(supNAME, ordNAME, partNAME, ordLINE) {
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
                console.log("response", response);
                if (null != response && null != response.lstSampleObject && response.lstSampleObject.length > 0) {
                    pageSampleobject.objSample = response.objSample;
                    pageSampleobject.lstSamplQA = response.lstSamplQA;
                    showPartSampls(response.lstSampleObject);

                    //if (null != response.objSample && null != response.objSample.MED_TRANSSAMPLEQA_SUBFORM && response.objSample.MED_TRANSSAMPLEQA_SUBFORM.length > 0)
                    //    showSelectedSampleQA(response.objSample.MED_TRANSSAMPLEQA_SUBFORM);

                    var x = document.getElementsByTagName("html")[0].getAttribute("dir");
                    if (x == 'rtl')
                        $("#modal-9").trigger("click");
                    else
                        $("#modal-10").trigger("click");
                }
                else {
                    if (response.ErrorDescription != '') {
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
                if (document.getElementsByTagName("html")[0].getAttribute("dir") == 'rtl')
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
                if (document.getElementsByTagName("html")[0].getAttribute("dir") == 'rtl')
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
                console.log("downloadFile ==> Downlod => url", $('#downLoadFile').data('url'));
                //DoDownlod(filefolder, filename);
                
                window.location.href = $('#downLoadFile').data('url') + "/?fileFolder=" + filefolder + "&fileName=" + filename;
           }
        });
}

function DoDownlod(filefolder, filename) {
    $.ajax({
        type: "POST",
        data:
        {
            fileFolder: filefolder,
            fileName: filename
        },
        url: $('#navDownloadFile').data('url'),//"/Home/DownloadFile",
        success: function (response) {
            console.log("DoDownlod ==> DownloadFile => response", response);
            //window.location.href = "@Url.RouteUrl(new { Controller = "Home", Action = "DownloadFile" })/?fileFolder=" + filefolder + "&fileName=" + filename;
            //window.location = '~../../../../PriorityDocs/' + filefolder + '/' + filename;
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
    document.getElementById('txtQADES').innerText = rowData.QADES;
    document.getElementById('txtQaLOCATION').innerText = rowData.LOCATION;
    document.getElementById('txtQaSHR_TEST').innerText = rowData.SHR_TEST;
    document.getElementById('txtQaRESULTMIN').innerText = rowData.RESULTMIN;
    document.getElementById('txtQaRESULTMAX').innerText = rowData.RESULTMAX;
    if (rowData.RESULTANT == 'Y') // אם תוצאתית
    {
        document.getElementById("txtQaRESULTANT").setAttribute('disabled', 'disabled');
        document.getElementById('txtQaRESULTANT').checked = true;
        document.getElementById('txtQaRESULTANT').value = 'on';
        document.getElementById('txtQaNORMAL').setAttribute('disabled', 'disabled');
        
        if (rowData.REPETITION > 0)
            document.getElementById('txtQaRESULT').setAttribute('disabled', 'disabled');
    }
    else
    {
        document.getElementById("txtQaRESULTANT").setAttribute('disabled', 'disabled');
        document.getElementById('txtQaRESULTANT').checked = false;
        document.getElementById('txtQaRESULTANT').value = 'off';
        document.getElementById("txtQaNORMAL").removeAttribute('disabled');
        if (rowData.NORMAL == 'Y') //  אם תקין
        {
            document.getElementById('txtQaNORMAL').checked = true;
        }
        else {
            document.getElementById('txtQaNORMAL').checked = false;
        }
    }
    document.getElementById('hdnQaORDNAME').value = document.getElementById('hdnORDNAME').value;
    document.getElementById('txtQaREPETITION').innerText = rowData.REPETITION;
    document.getElementById('txtQaREQUIRED_RESULT').innerText = rowData.REQUIRED_RESULT;
    document.getElementById('txtQaSAMPQUANT').innerText = rowData.SAMPQUANT;
    document.getElementById('txtQaMEASUREDES').innerText = rowData.MEASUREDES;
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
}

function GetResultRecord(data, parentRowKey) {
    console.log("GetResultRecord ==> parentRowKey", parentRowKey);
    console.log("GetResultRecord ==> data", data);
    var rec = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].QACODE == parentRowKey) {
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
                if (null != response && null != response.ResultData)
                {
                    pageSampleobject.objSample = response.ResultData;
                    if (null != response.ResultData.MED_TRANSSAMPLEQA_SUBFORM) {
                        $("#jqGridRevision").GridUnload();
                        showGridProdSamples(response.ResultData.MED_TRANSSAMPLEQA_SUBFORM);

                    }
                    else {
                        if (response.ErrorDescription != '') {
                            form_data[0].reset();
                            $('.modal').modal('hide');
                            $('.modal').removeClass('show');
                            if (x == 'rtl') {
                                $("#modal-1").trigger("click");
                                $("#odal-error-text").html(response.ErrorDescription);
                            }
                            else {
                                $("#modal-21").trigger("click");
                                $("#odal-error-text").html(response.ErrorDescription);
                            }
                        }
                    }
                }
                else {
                    if (response.ErrorDescription != '') {
                        form_data[0].reset();
                        $('.modal').modal('hide');
                        $('.modal').removeClass('show');
                        if (x == 'rtl')
                        {
                            $("#modal-1").trigger("click");
                            $("#odal-error-text").html(response.ErrorDescription);
                        }
                        else {
                            $("#modal-21").trigger("click");
                            $("#odal-error-text").html(response.ErrorDescription);
                        }
                    }
                }
            }
        });

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
                if (null != response && null != response.ResultData) {
                    if (response.ResultStatus == 'OK')
                        return;

                    if (response.ErrorDescription != '') {
                        $("#modal-error-text").html(response.ErrorDescription);
                        $("#modal-1").trigger("click");
                    }
                }
            }
        });
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
            if (null != response.objSample.MED_TRANSSAMPLEQA_SUBFORM) {
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
                if (response.ErrorDescription != '') {
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
        if (fd[i].id == '')
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
            var val = fd[i].value;
            console.log("fd[i].value", fd[i].value);
            if (fd[i].id == 'txtQaNORMAL') {
                console.log("fd[i].checked", fd[i].checked);
                if (fd[i].checked)
                    fd[i].value = 'on';
                else
                    fd[i].value = 'off';
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
    for (var i = 0; i < data.length; i++) {
        if (data[i].ORD == parentRowKey) {
            for (var x = 0; x < data[i].PORDERITEMS_SUBFORM.length; x++) {
                rec.push(data[i].PORDERITEMS_SUBFORM[x]);
            }
            console.log("GetRecord ==> rec", rec);
            return rec;
        }
    }
    return rec;
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
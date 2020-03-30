function InitTestPageData(data) {
    var OrdId = document.getElementById('hdnOrdId').value;
    var pordId = document.getElementById('hdnPrdId').value;
    console.log('hdnOrdId = ', OrdId);
    console.log('pordId = ', pordId);
    console.log('$(document).ready ==> data = ', data);
    console.log('$(document).ready ==> data.lstAttachments = ', data.lstAttachments);

    if (null == data.lstItemsObject)
        GetOrderProducts(OrdId);
    else
        showGridProd(data.lstItemsObject);
    if (null != data.objSample) {
        if (null != data.objSample.MED_TRANSSAMPLEQA_SUBFORM)
            showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
    }

    if (null != data.lstAttachments)
        showGridProdAttachments(data.lstAttachments);

    if (null != data.lstTestObject)
        showGridProdTests(data.lstTestObject);
    else if ((null != pordId) && (pordId != ''))
        GetOrderProductTests(OrdId, pordId);
}

function OpenSampleModal(rowData) {
    console.log("OpenSampleModal rowData = ", rowData);
    document.getElementById('txtQACODE').innerText = rowData.QACODE;
    document.getElementById('txtQADES').innerText = rowData.QADES;
    document.getElementById('txtQaLOCATION').innerText = rowData.LOCATION;
    document.getElementById('txtQaSHR_TEST').innerText = rowData.SHR_TEST;
    document.getElementById('txtQaRESULTMIN').innerText = rowData.RESULTMIN;
    document.getElementById('txtQaRESULTMAX').innerText = rowData.RESULTMAX;
    if (rowData.RESULTANT != 'Y') // אם לא תוצאתית
    {
        document.getElementById('txtQaRESULTANT').checked = false;
        document.getElementById('txtQaRESULTANT').readOnly = false;
        document.getElementById('txtQaRESULT').readOnly = true;
    }
    else {
        document.getElementById('txtQaRESULT').readOnly = false;
        document.getElementById('txtQaRESULTANT').readOnly = true;
    }
    document.getElementById('txtQaREPETITION').innerText = rowData.REPETITION;
    document.getElementById('txtQaREQUIRED_RESULT').innerText = rowData.REQUIRED_RESULT;
    document.getElementById('txtQaSAMPQUANT').innerText = rowData.SAMPQUANT;
    document.getElementById('txtQaNORMAL').innerText = rowData.NORMAL;
    document.getElementById('txtQaMEASUREDES').value = rowData.MEASUREDES;
    //document.getElementById('txtQaMEASUREDES').value = rowData.MEASUREDES;
    document.getElementById('txtQaRESULT').value = rowData.RESULT;
    document.getElementById('txtQaREMARK').value = '';
    document.getElementById('txtQaREMARK').value = '';
    document.getElementById('hdnQaDOCNO').value = rowData.DOCNO;
    document.getElementById('hdnQaSUPNAME').value = rowData.SUPNAME;
    document.getElementById('hdnQACODE').value = rowData.QACODE;
    document.getElementById('hdnLOCATION').value = rowData.LOCATION;
    document.getElementById('hdnQA').value = rowData.QA;
}

function GetProductDetails(rowData) {
    console.log("IN GetProductDetails ==> rowData", rowData);
    $("#loader").show();
    $.ajax({
        type: "POST",
        url: "/Home_IL/PostTestProductItem",
        data: {
            orderID: parseInt(rowData.ORD),
            prodName: rowData.PARTNAME,
            ordLine: parseInt(rowData.LINE)
        },
        cache: false,
        success: function (data) {
            $("#jqGridRevision").GridUnload();
            $("#jqGridAttachments").GridUnload();
            $("#jqGridTest").GridUnload();

            console.log("GetProductDetails ==> data", data);
            if (null != data.objProduct) {
                document.getElementById('lblLineNun').innerText = data.objProduct.LINE;
                document.getElementById('lblProductName').innerText = data.objProduct.PARTNAME;
                document.getElementById('lblSupplyDate').innerText = data.objProduct.pageREQDATE;
                document.getElementById('lblProductDescription').innerText = data.objProduct.PDES;
                document.getElementById('lbl_SERIALNAME').innerText = data.objProduct.SERIALNAME;
                document.getElementById('lbl_REQDATE2').innerText = data.objProduct.REQDATE2;
                document.getElementById('lblTotalAmountInOrder').innerText = data.objProduct.TQUANT;
                document.getElementById('lblLeftAmountToDeliver').innerText = data.objProduct.TBALANCE;
                document.getElementById('lbl_ACTNAME').innerText = data.objProduct.ACTNAME;
                document.getElementById('lbl_SHR_DRAW').innerText = data.objProduct.SHR_DRAW;
                document.getElementById('lbl_SHR_MNFPARTNAME').innerText = data.objProduct.SHR_MNFPARTNAME;
                document.getElementById('lbl_SHR_MNFDES').innerText = data.objProduct.SHR_MNFDES;
                document.getElementById('lbl_SHR_SERIAL_REVNUM').innerText = data.objProduct.SHR_SERIAL_REVNUM;
                document.getElementById('lbl_REVNAME').innerText = data.objProduct.REVNAME;
                document.getElementById('lblReasonRejection').innerText = '';

                document.getElementById('hdnOrdId').value = data.objProduct.ORD;
                document.getElementById('hdnPrdId').value = data.objProduct.PARTNAME;

                if (null != data.lstAttachments)
                    showGridProdAttachments(data.lstAttachments);

                if (null == data.objSample.DOCNO) {
                    /****** To Do: ****************/
                    /* Opan new saple             */
                    /*****************************/
                    $("#jqGridRevision").GridUnload();
                }
                else {
                    // Fill sample data
                    $("#jqGridRevision").GridUnload();
                    console.log("data.objSample.MED_TRANSSAMPLEQA_SUBFORM", data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                    if (null != data.objSample.MED_TRANSSAMPLEQA_SUBFORM) {
                        console.log("data.objSample.MED_TRANSSAMPLEQA_SUBFORM", data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                        showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);
                    }
                }
                $("#loader").hide();
            }
            else
            {
                window.location.href = $('#Logoff').data('url');
            }
        }
    });
}

function GetOrderProducts(OrdId) {
    $.ajax({
        type: "POST",
        url: "TestProductOrderItems",
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

function GetOrderProductTests(OrdId, pordId) {
    console.log('GetOrderProductTests ==> pordId = ', pordId);
    $.ajax({
        type: "POST",
        url: "GetOrderProductTests",
        data: {
            orderId: parseInt(OrdId),
            pordId: parseInt(pordId)
        },
        cache: false,
        success: function (data) {
            console.log("GetOrderProductTests ==> data", data);
            var grid_data = data.lstTestObject;
            showGridProdTests(grid_data);
        }
    });
}

function formatTestProdLink(cellValue, options, rowObject) {//options.rowId
    //rowObject.ProductID
    //console.log("formatRPTLink ==> options", options);
    //console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    //a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
    a.href = 'javascript:GetProductAndRevision(' + rowObject.OrderID + ', ' + options.rowId + ', ' + rowObject.LINE + ');';
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    //console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatRPTLinkTest(cellValue, options, rowObject) {//options.rowId
    //rowObject.ProductID
    //console.log("formatRPTLink ==> options", options);
    //console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    //console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatGetRevListLink(cellValue, options, rowObject) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'javascript:GetRevision(' + cellValue + ', ' + options + ', ' + rowObject + ');';
    //a.onclick = function () 
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

function GetProductAndRevision(OrderID, prodId, ordLine) {
    console.log("GetProductAndRevision ==> options", OrderID);
    console.log("GetProductAndRevision ==> prodId", prodId);
    console.log("GetProductAndRevision ==> ordLine", ordLine);
    jQuery("#jqGridRevision").jqGrid("GridUnload");
    $.ajax({
        type: "POST",
        url: "TestProductItemData",
        data: {
            orderID: OrderID,
            prodId: prodId,
            ordLine: ordLine
        },
        cache: false,
        success: function (data) {
            console.log("GetProductAndRevision ==> data", data);
            if (null != data.lstRevision) {
                gridRevisionData = data.lstRevision;
                showGridProdRevision(gridRevisionData);
                document.getElementById('lblProductName').innerText = data.objProduct.ProductName;
                document.getElementById('hdnOrdId').value = data.objProduct.OrderID;
                document.getElementById('hdnPrdId').value = data.objProduct.ProductID;
                document.getElementById('lblProductDescription').innerText = data.objProduct.ProductDescription;
                document.getElementById('lblSupplyDate').innerText = data.objProduct.SupplyDate;
                document.getElementById('lblTotalAmountInOrder').innerText = data.objProduct.TotalAmountInOrder;
                document.getElementById('lblLeftAmountToDeliver').innerText = data.objProduct.LeftAmountToDeliver;
                document.getElementById('lblLineStatus').innerText = data.objProduct.LineStatus;
            }
        }
    });
}

function GetRevision(cellValue, options, rowObject) {
    //console.log("formatRPTLink ==> options", options);
    //console.log("formatRPTLink ==> rowObject", rowObject);
    $.ajax({
        type: "POST",
        url: "GetProductRevisionList",
        data: {
            prodId: options.rowId,
            revId: rowObject.REVNUM
        },
        cache: false,
        success: function (data) {
            console.log("GetOrderProducts ==> data", data);
            if (null != data.lstRevision) {
                gridRevisionData = data.lstRevision;
                showGridProdRevision(gridRevisionData);
            }
        }
    });
}

function downloadFile(filefolder, filename) {
    console.log("filefolder", filefolder);
    filefolder = 'Test';
    filename = 'פורטל ספקים01022020.docx';

    console.log("downloadFile ==> filefolder", filefolder);
    console.log("downloadFile ==> filename", filename);
    $.ajax(
        {
            type: "POST",
            data:
            {
                fileFolder: filefolder,
                fileName: filename
            },
            url: "/Home/Download",
            success: function (response) {
                //
                console.log("downloadFile ==> Downlod => url", $('#downLoadFile').data('url'));
                //DoDownlod(filefolder, filename);
                
                window.location.href = $('#downLoadFile').data('url') + "/?fileFolder=" + filefolder + "&fileName=" + filename;
                //window.location = '~../../../../PriorityDocs/' + filefolder + '/' + filename;
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
        url: "/Home/DownloadFile",
        success: function (response) {
            console.log("DoDownlod ==> DownloadFile => response", response);
            //window.location.href = "@Url.RouteUrl(new { Controller = "Home", Action = "DownloadFile" })/?fileFolder=" + filefolder + "&fileName=" + filename;
            //window.location = '~../../../../PriorityDocs/' + filefolder + '/' + filename;
        }
    });
}
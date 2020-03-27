function InitTestPageData(data) {
    var OrdId = document.getElementById('hdnOrdId').value;
    var pordId = document.getElementById('hdnPrdId').value;
    console.log('hdnOrdId = ', OrdId);
    console.log('pordId = ', pordId);
    console.log('$(document).ready ==> data = ', data);

    if (null == data.lstItemsObject)
        GetOrderProducts(OrdId);
    else
        showGridProd(data.lstItemsObject);

    if (null != data.objSample.MED_TRANSSAMPLEQA_SUBFORM)
        showGridProdSamples(data.objSample.MED_TRANSSAMPLEQA_SUBFORM);

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
    document.getElementById('txtQaREPETITION').innerText = rowData.REPETITION;
    document.getElementById('txtQaRESULTANT').innerText = rowData.RESULTANT;
    document.getElementById('txtQaREQUIRED_RESULT').innerText = rowData.REQUIRED_RESULT;
    document.getElementById('txtQaSAMPQUANT').innerText = rowData.SAMPQUANT;
    document.getElementById('txtQaNORMAL').innerText = rowData.NORMAL;
    document.getElementById('txtQaMEASUREDES').value = rowData.MEASUREDES;
    //document.getElementById('txtQaMEASUREDES').value = rowData.MEASUREDES;
    document.getElementById('txtQaRESULT').value = rowData.RESULT;
    document.getElementById('txtQaREMARK').value = '';
}

function GetProductDetails(rowData) {
    console.log("IN GetProductDetails ==> rowData", rowData);

    $.ajax({
        type: "POST",
        url: "PostTestProductItem",
        data: {
            orderID: parseInt(rowData.ORD),
            prodName: rowData.PARTNAME,
            ordLine: parseInt(rowData.LINE)
        },
        cache: false,
        success: function (data) {
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
            }
            else {
                if (null != data.RouteValues) {
                    $.ajax({
                        type: "POST",
                        url: "/Account/LogOff",
                        //data: {
                        //    orderId: parseInt(OrdId)
                        //},
                        cache: false,
                        success: function (data) {
                            console.log("DO LogOff");
                        }
                    });
                }
            }

            if (null == data.objSample.DOCNO) {
                /****** To Do: ****************/
                /* Opan new saple             */
                /*****************************/
                $("#jqGridRevision").GridUnload();
               // $("#jqGridRevision").jqGrid("clearGridData");
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
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    //a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
    a.href = 'javascript:GetProductAndRevision(' + rowObject.OrderID + ', ' + options.rowId + ', ' + rowObject.LINE + ');';
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatRPTLinkTest(cellValue, options, rowObject) {//options.rowId
    //rowObject.ProductID
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
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
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
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
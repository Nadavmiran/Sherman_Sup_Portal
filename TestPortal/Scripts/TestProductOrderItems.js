$(document).ready(function () {
    var OrdId = document.getElementById('hdnOrdId').value;
    var pordId = document.getElementById('hdnPrdId').value;
    console.log('hdnOrdId = ', OrdId);
    console.log('pordId = ', pordId);
    GetOrderProducts(OrdId);
    if ((null != pordId) && (pordId != ''))
        GetOrderProductTests(OrdId, pordId);
});

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
            grid_data = data.lstTestObject;
            showGridProdTests(grid_data);
        }
    });
}

function showGridProd(grid_data) {
    console.log("showGrid ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: '#', name: 'LINE', align: 'center', hidden: true, width: 75 },
            { label: 'ProductID', name: 'ProductID', align: 'center', key: true, hidden: true, width: 75 },
            { label: 'Serial No.', name: 'ProductName', align: 'center', formatter: formatTestProdLink, width: 100 },
            { label: 'Description', name: 'ProductDescription', align: 'center', width: 100 },
            { label: 'Quntity', name: 'TotalAmountInOrder', align: 'center', width: 100 },
            { label: 'Left Quntity', name: 'LeftAmountToDeliver', align: 'center', width: 100 },
            { label: 'Supply Date', name: 'SupplyDate', align: 'center', width: 100 },
            { label: 'Status', name: 'LineStatus', align: 'center', width: 100 }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'ltr',
        autowidth: true,
        height: null,
        rowNum: 30,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridPager",
        loadonce: true,
        subGrid: false
    });
}

function showGridProdTests(grid_data) {
    console.log("showGridProdTests ==> grid_data", grid_data);
    $("#jqGridTest").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            {
                label: 'Test Code', name: 'TestCode', align: 'center', key: true, /*formatter: formatRPTLinkTest,*/ width: 75, editable: true,
            edittype: "select" },
            {
                label: 'Test Result', name: 'TestResult', align: 'center', width: 100, editable: true, edittype: "select" },
            {
                label: 'Test Type', name: 'TestType', align: 'center', width: 100, editable: true, edittype: "select" },
            {
                label: 'Comments.', name: 'TestComments', align: 'center', width: 100, editable: true, edittype: "select" }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'ltr',
        autowidth: true,
        height: null,
        rowNum: 30,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridTestPager",
        loadonce: true,
        subGrid: false,
        onSelectRow: function (id) {
            var OrdId = document.getElementById('hdnOrdId').value;
            var pordId = document.getElementById('hdnPrdId').value;
            var rowData = $(this).getRowData(id);
            console.log("onSelectRow id = ", id);
            console.log("onSelectRow rowData = ", rowData);
            console.log("onSelectRow txtTestResult = ", document.getElementById('txtTestResult').value);
            console.log('hdnOrdId = ', OrdId);
            console.log('pordId = ', pordId);
            $.ajax({
                type: "POST",
                url: "GetProductTestToEdit",
                data: {
                    orderId: parseInt(OrdId),
                    pordId: parseInt(pordId),
                    test: id
                },
                cache: false,
                success: function (data) {
                    console.log("GetOrderProductTests ==> data", data);
                    document.getElementById('txtTestCode').value = data.TestObject.TestCode;
                    document.getElementById('txtTestResult').value = data.TestObject.TestResult;
                    document.getElementById('txtTestType').value = data.TestObject.TestType;
                    document.getElementById('txtTestComments').value = data.TestObject.TestComments;
                    document.getElementById('attachments').value = "file.txt";
                }
            });

            $("#modal-7").trigger("click");
        } //End onSelectRow
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
    a.href = 'TestProductItem?' + 'OrderID=' + rowObject.OrderID + '&prodId=' + options.rowId + '&ordLine=' + rowObject.LINE;
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
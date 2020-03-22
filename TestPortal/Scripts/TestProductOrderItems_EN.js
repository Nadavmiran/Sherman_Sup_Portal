function showGridProd(grid_data) {
    console.log("showGrid ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: '#', name: 'ORIGLINE', align: 'center', hidden: true, width: 75 },
            { label: 'ProductID', name: 'PARTNAME', align: 'center', key: true, hidden: true, width: 75 },
            { label: 'Serial No.', name: 'PARTNAME', align: 'center', formatter: formatProdLink, width: 100 },
            { label: 'Description', name: 'PDES', align: 'center', width: 100 },
            { label: 'Quntity', name: 'TQUANT', align: 'center', width: 100 },
            { label: 'Left Quntity', name: 'TBALANCE', align: 'center', width: 100 },
            { label: 'Supply Date', name: 'pageREQDATE', align: 'center', width: 100 },
            { label: 'Status', name: 'PORDISTATUSDES', align: 'center', width: 100 }
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

function showGridProdRevision(grid_data) {
    console.log("showGridProdRevision ==> grid_data", grid_data);
    $("#jqGridRevision").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'QACODE', name: 'QACODE', align: 'center', key: true, hidden: true, width: 75 },
            { label: 'PART', name: 'PART', align: 'center', hidden: true, width: 75 },
            { label: 'LOCATION', name: 'LOCATION', align: 'center', hidden: true, width: 75 },
            { label: 'MEASURECODE', name: 'MEASURECODE', align: 'center', hidden: true, width: 75 },
            { label: 'REV', name: 'REV', align: 'center', hidden: true, width: 75 },
            { label: 'Description', name: 'QADES', align: 'center', /*formatter: formatGetRevListLink,*/ width: 100 },
            { label: 'Test', name: 'SHR_TEST', align: 'center', width: 100 },
            { label: 'Measure Tool', name: 'MEASUREDES', align: 'center', width: 100 },
            { label: 'Requird Result Quntity', name: 'REQUIRED_RESULT', align: 'center', width: 100 },
            { label: 'Remarks', name: 'REMARKS', align: 'center', width: 100 },
            { label: 'File', name: 'EXTFILENAME', align: 'center', width: 100 }
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
        pager: "#jqGridRevisionPager",
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
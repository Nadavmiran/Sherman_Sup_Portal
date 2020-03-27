function showGridProd(grid_data) {
    console.log("showGridProd ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'ORD', name: 'ORD', align: 'center', hidden: false, width: 75 },
            { label: '#', name: 'LINE', align: 'center', hidden: false, width: 75 },
            { label: 'ProductID', name: 'PARTNAME', align: 'center', key: true, hidden: true, width: 75 },
            { label: 'מק"ט', name: 'PARTNAME', align: 'center', width: 100 }, //formatter: formatProdLink, 
            { label: 'תאור', name: 'PDES', align: 'center', width: 100 },
            { label: 'כמות', name: 'TQUANT', align: 'center', width: 100 },
            { label: 'נותר לספק', name: 'TBALANCE', align: 'center', width: 100 },
            { label: 'תאריך אספקה', name: 'pageREQDATE', align: 'center', width: 100 },
            { label: 'סטטוס', name: 'PORDISTATUSDES', align: 'center', width: 100 }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 30,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridPager",
        loadonce: true,
        subGrid: false,
        onSelectRow: function (id, rowId, iCol, content, event) {
            console.log('showGridProd ==> id ', id);
            var rowData = $(this).getRowData(id);
            console.log("onSelectRow rowData = ", rowData);
            console.log('showGridProd ==> rowId ', rowId);
            console.log('showGridProd ==> iCol ', iCol);
            console.log('showGridProd ==> content ', content);
            GetProductDetails(rowData);
        }
    });
}

function showGridProdSamples(grid_data) {
    console.log("showGridProdRevision ==> grid_data", grid_data);
    $("#jqGridRevision").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'QACODE', name: 'QACODE', align: 'center', key: true, hidden: true, width: 75 },
            { label: 'מיקום', name: 'LOCATION', align: 'center', hidden: false, width: 30 },
            { label: 'תאור בדיקה', name: 'QADES', align: 'center', hidden: false, width: 250 },
            { label: 'בדיקה - טקסט', name: 'SHR_TEST', align: 'center', hidden: false, width: 100 },
            { label: 'תוצאת מינ.', name: 'RESULTMIN', align: 'center', hidden: false, width: 30 },
            { label: 'תוצאת מקס.', name: 'RESULTMAX', align: 'center', /*formatter: formatGetRevListLink,*/ width: 30 },
            { label: 'חזרות', name: 'REPETITION', align: 'center', width: 30 },
            { label: 'תוצאתית (Y/N)', name: 'RESULTANT', align: 'center', width: 30 },
            { label: 'תוצאה נדרשת', name: 'REQUIRED_RESULT', align: 'center', width: 40 }, 
            { label: 'גודל המדגם', name: 'SAMPQUANT', align: 'center', width: 30 },
            { label: 'כלי בדיקה', name: 'MEASUREDES', align: 'center', width: 200 },
            { label: 'תוצאה', name: 'RESULT', align: 'center', width: 40 },
            { label: 'תקין', name: 'NORMAL', align: 'center', width: 30 },
            { label: 'הערות', name: 'REMARKS', align: 'center', width: 200 }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 30,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridRevisionPager",
        loadonce: true,
        subGrid: false,
        onSelectRow: function (id, rowId, iCol, content, event) {
            console.log('jqGridRevision ==> id ', id);
            var rowData = $(this).getRowData(id);
            console.log("onSelectRow rowData = ", rowData);
            console.log('jqGridRevision ==> rowId ', rowId);
            console.log('jqGridRevision ==> iCol ', iCol);
            console.log('jqGridRevision ==> content ', content);
            OpenSampleModal(rowData);
            $("#modal-7").trigger("click");
        }
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
                label: 'קוד בדיקה', name: 'TestCode', align: 'center', key: true, /*formatter: formatRPTLinkTest,*/ width: 75, editable: true,
                edittype: "select"
            },
            {
                label: 'תוצאת בדיקה', name: 'TestResult', align: 'center', width: 100, editable: true, edittype: "select"
            },
            {
                label: 'סוג בדיקה', name: 'TestType', align: 'center', width: 100, editable: true, edittype: "select"
            },
            {
                label: 'הערות', name: 'TestComments', align: 'center', width: 200, editable: true, edittype: "select"
            }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'rtl',
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
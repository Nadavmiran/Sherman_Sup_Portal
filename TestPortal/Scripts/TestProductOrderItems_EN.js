function showGridProd(grid_data) {
    console.log("showGrid ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'ORD', name: 'ORD', align: 'center', hidden: true, width: 75 },
            { label: '#', name: 'LINE', align: 'center', hidden: false, width: 75 },
            { label: 'ProductID', name: 'PARTNAME', align: 'center', key: true, hidden: false, width: 75 },
            { label: 'Serial No.', name: 'PARTNAME', align: 'center', width: 100 }, //, formatter: formatProdLink
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
        rowNum: 10,
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
            { label: 'QA', name: 'QA', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'DOCNO', name: 'DOCNO', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SUPNAME', name: 'SUPNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'PARTNAME', name: 'PARTNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'Code', name: 'QACODE', align: 'center', key: true, hidden: false, width: 80 },
            { label: 'Location', name: 'LOCATION', align: 'center', hidden: false, width: 140 },
            { label: 'Sample', name: 'QADES', align: 'center', hidden: false, width: 200 },
            { label: 'Sample - Text', name: 'SHR_TEST', align: 'center', hidden: true, width: 100 },
            { label: 'Result - Min', name: 'RESULTMIN', align: 'center', hidden: true, width: 80 },
            { label: 'Result - Max', name: 'RESULTMAX', align: 'center', hidden: true, width: 80 },/*formatter: formatGetRevListLink,*/ 
            { label: 'Repitition', name: 'REPETITION', align: 'center', width: 120 },
            { label: 'Resultant', name: 'RESULTANT', align: 'center', width: 120 }, 
            { label: 'Requird Result', name: 'REQUIRED_RESULT', align: 'center', hidden: true, width: 80 },
            { label: 'Sample Qnt.', name: 'SAMPQUANT', align: 'center', width: 120 },
            { label: 'Measure Tool', name: 'MEASUREDES', align: 'center', hidden: true, width: 200 },
            { label: 'Result', name: 'RESULT', align: 'center', width: 90 },
            { label: 'Normal', name: 'NORMAL', align: 'center', width: 90 },
            { label: 'Remarks', name: 'REMARK', align: 'center', width: 200 }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'ltr',
        autowidth: true,
        height: null,
        rowNum: 10,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridRevisionPager",
        loadonce: true,
        subGrid: true,
        subGridOptions:
        {
            // load the subgrid data only once
            // and the just show/hide
            reloadOnExpand: false,
            // select the row when the expand column is clicked
            selectOnExpand: true,
            plusicon: "fa fa-plus center bigger-110 blue",
            minusicon: "fa fa-minus center bigger-110 blue",
            openicon: "fa fa-chevron-right center orange"
        },
        subGridRowExpanded: function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
            $("#" + subgridTableId).jqGrid({
                guiStyle: "bootstrap",
                iconSet: "fontAwesome",
                direction: 'rtl',
                datatype: 'local',
                data: GetResultRecord(grid_data, rowId),
                autowidth: true,
                height: null,
                colModel: [
                    { label: 'Line', name: 'KLINE', align: 'center', key: true, hidden: false, width: 75 },
                    { label: 'Result', name: 'RESULT', align: 'center', width: 100 }
                ]
            });
        },
        onSelectRow: function (id, rowId, iCol, content, event) {
            if (iCol == undefined)
                return;
            onSelectRow_ProdSamples(id, rowId, iCol, content, event);

            $("#modal-8").trigger("click");
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

function showGridProdAttachments(grid_data) {
    console.log("showGridProdAttachments ==> grid_data", grid_data);
    $("#jqGridAttachments").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'Purchase tag', name: 'SHR_PURCH_FLAG', align: 'center', width: 200 },
            { label: 'File type', name: 'SUFFIX', align: 'center', width: 200, formatter: formatFileIcon }, //formatter: formatProdLink, 
            { label: 'File name', name: 'FILE_NAME', align: 'center', hidden: false, width: 200 },
            { label: 'Folder', name: 'FOLDER', align: 'center', hidden: true, width: 200 },
            { label: 'Subject', name: 'SHR_EXTFILEDESTEXT', align: 'center', hidden: false, width: 200 },
            { label: '#', name: 'SHR_LINE', align: 'center', key: true, hidden: false, width: 75 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 30,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridAttachmentsPager",
        loadonce: true,
        subGrid: false,
        onSelectRow: function (id, rowId, iCol, content, event) {
            var rowData = $(this).getRowData(id);
            console.log('showGridProdAttachments ==> rowData ', rowData);
            downloadFile(rowData.FOLDER, rowData.FILE_NAME);
        }
    });
}

function showGridSampleList(grid_data) {
    console.log("showGridSampleList ==> grid_data", grid_data);
    var $grid = $("#jqGridSampleQA"), idsOfSelectedRows = [],
        updateIdsOfSelectedRows = function (id, isSelected) {
            $(this).jqGrid("editRow", id);
            var index = $.inArray(id, idsOfSelectedRows);
            if (!isSelected && index >= 0) {
                idsOfSelectedRows.splice(index, 1); // remove id from the list
            } else if (index < 0) {
                idsOfSelectedRows.push(id);
                console.log('IN idsOfSelectedRows');
            }
        };

    $("#jqGridSampleQA").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'QA', name: 'QA', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'DOCNO', name: 'DOCNO', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SUPNAME', name: 'SUPNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'PARTNAME', name: 'PARTNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'Test code', name: 'QACODE', key: true, hidden: false, width: 85 },
            { label: 'Description', name: 'QADES', align: 'right', hidden: false, width: 250 },
            { label: 'Result Min.', name: 'RESULTMIN', align: 'center', editable: true, hidden: false, width: 80 },
            { label: 'Result Max.', name: 'RESULTMAX', align: 'center', editable: true, hidden: false, width: 80 },/*formatter: formatGetRevListLink,*/
            { label: 'Repitition', name: 'REPETITION', align: 'center', editable: true, width: 50 },
            { label: 'resultant (Y/N)', name: 'RESULTANT', align: 'center', width: 80 },
            { label: 'Sample Qnt.', name: 'SAMPQUANT', align: 'center', width: 80 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'ltr',
        autowidth: true,
        height: null,
        rowNum: 20,
        //rowList: [10, 30, 50, 100],
        pager: "#jqGridSampleQAPager",
        loadonce: true,
        subGrid: false,
        multiselect: true,
        //multiPageSelection: true,
        onSelectRow: function () {
            updateIdsOfSelectedRows();
                },
        gridComplete: function () {
            currids = $(this).jqGrid('getDataIDs');
        },
        onSelectAll: function (aRowids, isSelected) {
            var i, count, id;
            for (i = 0, count = aRowids.length; i < count; i++) {
                id = aRowids[i];
                updateIdsOfSelectedRows(id, isSelected);
            }
        },
        loadComplete: function () {
            console.log('IN loadComplete');
            var $this = $(this), i, count;
            for (i = 0, count = idsOfSelectedRows.length; i < count; i++) {
                $this.jqGrid('setSelection', idsOfSelectedRows[i], false);
            }
        },
        //inlineEditing: {
        //    keys: true
        //},
        // singleSelectClickMode: "selectonly", // prevent unselect once selected rows
    });
    $("#jqGridSampleQA").jqGrid('navGrid', '#jqGridSampleQAPager', { edit: false, save: true, add: false, del: false }, {}, {}, {}, { multipleSearch: true, overlay: false });
    jQuery("#jqGridSampleQA").jqGrid('inlineNav', "#jqGridSampleQAPager", { edit: true, save: true, add: false, del: false }, {}, {}, {}, { multipleSearch: true, overlay: false });
}

function showSelectedSampleQA(grid_data) {
    $("#jqGridSelectedSampleQA").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'QA', name: 'QA', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'DOCNO', name: 'DOCNO', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SUPNAME', name: 'SUPNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'PARTNAME', name: 'PARTNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'Test code', name: 'QACODE', align: 'center', key: true, hidden: false, width: 85 },
            { label: 'Description', name: 'QADES', align: 'right', hidden: false, width: 250 },
            { label: 'Result Min.', name: 'RESULTMIN', align: 'center', hidden: false, width: 80 },
            { label: 'Result Max.', name: 'RESULTMAX', align: 'center', hidden: false, width: 80 },/*formatter: formatGetRevListLink,*/
            { label: 'Repitition', name: 'REPETITION', align: 'center', width: 50 },
            { label: 'resultant (Y/N)', name: 'RESULTANT', align: 'center', width: 80 },
            { label: 'Sample Qnt.', name: 'SAMPQUANT', align: 'center', width: 80 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'ltr',
        autowidth: true,
        height: null,
        width: 500,
        rowNum: 20,
        //rowList: [10, 30, 50, 100],
        pager: "#jqGridSelectedSampleQAPager",
        loadonce: true,
        subGrid: false
    });
}
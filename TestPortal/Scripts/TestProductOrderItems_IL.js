function showGridProd(grid_data) {
    console.log("showGridProd ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'ORD', name: 'ORD', align: 'center', hidden: true, width: 75 },
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
        altRows: true,
        direction: 'rtl',
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
            window.location = window.location.origin + $('#navQA_Page').data('url') + '?orderID=' + rowData.ORD + '&orderName=' + document.getElementById('lbl_ORDNAME').innerText + '&prodName=' + rowData.PARTNAME + '&ordLine=' + rowData.LINE;
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
            { label: 'תוצאה נדרשת', name: 'REQUIRED_RESULT', align: 'center', hidden: true, width: 80 },
            { label: 'EFI_MEASURESUPTOOLS', name: 'EFI_MEASURESUPTOOLS', align: 'center', hidden: true, width: 200 },
            { label: 'כלי בדיקה', name: 'MEASUREDES', align: 'center', hidden: true, width: 200 },
            { label: 'EFI_CRITICALFLAG', name: 'EFI_CRITICALFLAG', align: 'center', hidden: true, width: 200 },
            { label: 'QA', name: 'QA', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'DOCNO', name: 'DOCNO', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SUPNAME', name: 'SUPNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'PARTNAME', name: 'PARTNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'בדיקה - טקסט', name: 'SHR_TEST', align: 'center', hidden: true, width: 100 },
            { label: 'תוצאת מינ.', name: 'RESULTMIN', align: 'center', hidden: true, width: 80 },
            { label: 'תוצאת מקס.', name: 'RESULTMAX', align: 'center', hidden: true, width: 80 },/*formatter: formatGetRevListLink,*/
            { label: 'קוד בדיקה', name: 'QACODE', align: 'center', key: false, hidden: false, width: 80 },
            { label: 'מיקום', name: 'LOCATION', align: 'center', key: true, hidden: false, width: 80 },
            { label: 'תאור בדיקה', name: 'QADES', align: 'center', hidden: false, width: 250 },
            { label: 'חזרות', name: 'REPETITION', align: 'center', width: 50 },
            { label: 'תוצאתית (Y/N)', name: 'RESULTANT', align: 'center', width: 80 },
            { label: 'גודל המדגם', name: 'SAMPQUANT', align: 'center', width: 80 },
            { label: 'תוצאה', name: 'RESULT', align: 'center', width: 80 },
            { label: 'תקין', name: 'NORMAL', align: 'center', width: 60 },
            { label: 'הערות', name: 'REMARK', align: 'center', width: 200 }
        ],
        viewrecords: true,
        //rownumbers: true, // show row numbers
        //rownumWidth: 35, // the width of the row numbers columns
        altRows: true,
        direction: 'rtl',
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
                    { label: 'שורה', name: 'KLINE', align: 'center', key: true, hidden: false, width: 75 },
                    { label: 'תוצאה', name: 'RESULT', align: 'center', width: 100 }
                ]
            });
        },
        onSelectRow: function (id, rowId, iCol, content, event) {
            if (iCol == undefined)
                return;
            onSelectRow_ProdSamples(id, rowId, iCol, content, event);

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

function showGridProdAttachments(grid_data) {
    console.log("showGridProdAttachments ==> grid_data", grid_data);
    $("#jqGridAttachments").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: '#', name: 'SHR_LINE', align: 'center', key: true, hidden: false, width: 75 }, 
            { label: 'נושא', name: 'SHR_EXTFILEDESTEXT', align: 'center', hidden: false, width: 200 },
            { label: 'תיקייה', name: 'FOLDER', align: 'center', hidden: false, width: 200 },
            { label: 'שם קובץ', name: 'FILE_NAME', align: 'center', hidden: false, width: 200 },
            { label: 'קובץ', name: 'SUFFIX', align: 'center', width: 200, formatter: formatFileIcon}, //formatter: formatProdLink, 
            { label: 'תג רכש', name: 'SHR_PURCH_FLAG', align: 'center', width: 200}
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
            { label: 'קוד בדיקה', name: 'QACODE', key: true, hidden: false, width: 85 },
            { label: 'תאור בדיקה', name: 'QADES', align: 'right', hidden: false, width: 250 },
            { label: 'תוצאת מינ.', name: 'RESULTMIN', align: 'center', editable: true, hidden: false, width: 80 },
            { label: 'תוצאת מקס.', name: 'RESULTMAX', align: 'center', editable: true, hidden: false, width: 80 },/*formatter: formatGetRevListLink,*/
            { label: 'חזרות', name: 'REPETITION', align: 'center', editable: true, width: 50 },
            { label: 'תוצאתית (Y/N)', name: 'RESULTANT', align: 'center', width: 80 },
            { label: 'גודל המדגם', name: 'SAMPQUANT', align: 'center', width: 80 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
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
        }
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
            { label: 'קוד בדיקה', name: 'QACODE', align: 'center', key: true, hidden: false, width: 85 },
            { label: 'תאור בדיקה', name: 'QADES', align: 'right', hidden: false, width: 250 },
            { label: 'תוצאת מינ.', name: 'RESULTMIN', align: 'center', hidden: false, width: 80 },
            { label: 'תוצאת מקס.', name: 'RESULTMAX', align: 'center', hidden: false, width: 80 },/*formatter: formatGetRevListLink,*/
            { label: 'חזרות', name: 'REPETITION', align: 'center', width: 50 },
            { label: 'תוצאתית (Y/N)', name: 'RESULTANT', align: 'center', width: 80 },
            { label: 'גודל המדגם', name: 'SAMPQUANT', align: 'center', width: 80 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 20,
        //rowList: [10, 30, 50, 100],
        pager: "#jqGridSelectedSampleQAPager",
        loadonce: true,
        subGrid: false
    });
}

function showPartSampls(grid_data) {
    $("#jqGridPartSampls").jqGrid({
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'PARTNAME', name: 'PARTNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SUPNAME', name: 'SUPNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'SERIALNAME', name: 'SERIALNAME', align: 'center', key: false, hidden: true, width: 75 },
            { label: 'תעודת דגימה', name: 'DOCNO', align: 'center', key: true, hidden: false, width: 120 },
            { label: 'תאריך דגימה', name: 'pageCURDATE', align: 'center', key: false, hidden: false, width: 100 },
            { label: 'סטטוס', name: 'STATDES', align: 'center', hidden: false, width: 150 },
            { label: 'תקן דגימה', name: 'SHR_SAMPLE_STD_CODE', align: 'center', hidden: false, width: 150 },
            //{ label: 'גודל מנה', name: 'SHR_QUANT', align: 'center', hidden: false, width: 90 },
            //{ label: 'כמות מבוקשת', name: 'SHR_RAR', align: 'center', hidden: false, width: 150 },
            //{ label: 'מקס. דחויים', name: 'MAX_REJECT', align: 'center', hidden: false, width: 150 },
            { label: 'כמות הפק"ע', name: 'SHR_SERIAL_QUANT', align: 'center', hidden: false, width: 150 },/*formatter: formatGetRevListLink,*/
            { label: 'כמות המדגם', name: 'QUANT', align: 'center', width: 150 }
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        width: 500,
        rowNum: 20,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridSelectedSampleQAPager",
        loadonce: true,
        subGrid: false,
        onSelectRow: function (id, rowId, iCol, content, event) {
            console.log('showGridProd ==> id ', id);
            var rowData = $(this).getRowData(id);
            console.log("jqGridSelectedSample ==> onSelectRow rowData = ", rowData);
            GetSampleTests(rowData);
        }
    });
}
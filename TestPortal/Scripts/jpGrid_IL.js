//function getData(supplier) {
//    $.ajax({
//        type: "POST",
//        url: "Home/GetOrdersData",
//        data: {
//            supplier: supplier
//        },
//        cache: false,
//        success: function (data) {
//            console.log("data", data);
//            grid_data = data.lstOrderObject;
//            if ((null === grid_data) || (grid_data === ''))
//                return;

//            showGrid();
//        }
//    });
//}

function showGrid() {
    console.log("showGrid ==> grid_data", grid_data);
    
    $("#jqGrid").jqGrid({
        //styleUI: 'Bootstrap',
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'OrderID', name: 'ORD', align: 'center', index: 'ORD', key: true, hidden: true, width: 75 },//, formatter: formatRPTLink
            { label: 'שם ספק', name: 'SHR_SUPTYPEDES', align: 'center', hidden: true },//, formatter: formatRPTLink
            { label: 'הזמנה', name: 'ORDNAME', index: 'ORDNAME', align: 'center', width: 75, sorttype: 'string', searchtype: 'string', searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en', 'cn', 'nc']}},//, formatter: formatRPTLink
            { label: 'תאריך הזמנה', name: 'pageCURDATE', align: 'center', width: 150},//, formatter: formatRPTLink
            { label: 'שם הקניין', name: 'OWNERLOGIN', align: 'center', width: 150},//, formatter: formatRPTLink
            { label: 'סוג הזמנה ', name: 'TYPEDES', align: 'center', width: 150},
            { label: 'ססטוס הזמנה', name: 'STATDES', align: 'center', width: 150}//, formatter: formatRPTLink
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 30,
        gridview: true,
        rowList: [10, 30, 50, 100],
        pager: "#jqGridPager",
        loadonce: true,
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        loadComplete: function (data) {
            $("#loader").hide();
        },
        onCellSelect: function (row, col, content, event) {
            var id = jQuery("#jqGrid").jqGrid('getCell', row, 'ORD');
            var rowData = $(this).getRowData(id);
            console.log("onSelectRow rowData = ", rowData);
            //window.location.href += '/TestProduct/?OrderID=' + rowData.ORD + '&orderNumber=' + rowData.ORDNAME;
            window.location = window.location.origin + $('#navTestProduct').data('url') + '/?OrderID=' + rowData.ORD + '&orderNumber=' + rowData.ORDNAME;
        },
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
                data: GetRecord(grid_data, rowId),
                autowidth: true,
                height: null,
                colModel: [
                    { label: '#', name: 'LINE', align: 'center', key: true, hidden: false, width: 75 },
                    { label: 'ORD', name: 'ORD', align: 'center', hidden: true, width: 75 },
                    { label: 'מק"ט', name: 'PARTNAME', align: 'center', width: 100},//, formatter: formatProdLink
                    { label: 'שרטוט', name: 'SHR_DRAW', align: 'center', width: 100 },
                    { label: 'תאור', name: 'PDES', align: 'center', width: 100 },
                    { label: 'כמות', name: 'TQUANT', align: 'center', width: 100 },
                    { label: 'נותר לספק', name: 'TBALANCE', align: 'center', width: 100 },
                    { label: 'תאריך אספקה', name: 'pageREQDATE', align: 'center', width: 100 },
                    { label: 'סטטוס', name: 'PORDISTATUSDES', align: 'center', width: 100 },
                    { label: 'פרטי שורת הזמנה', name: 'Information', align: 'center', width: 150, formatter: formatBTNLink }
                ],
                onCellSelect: function (id, col, iCol, event) {
                    if (col == 9) return;
                    console.log("onSelectRow col = ", col);
                    console.log("onSelectRow iCol = ", iCol);
                    console.log("onSelectRow id = ", id);
                    //console.log("onSelectRow rowId = ", rowId);
                    var rowData = $(this).getRowData(id);
                    console.log("onSelectRow rowData = ", rowData);
                    window.location = window.location.origin + $('#navQA_Page').data('url') + '/?orderID=' +  + rowData.ORD + '&orderName=' + rowData.ORDNAME + '&prodName=' + rowData.PARTNAME + '&ordLine=' + rowData.LINE;
                }
            });
        }
    });
    jQuery("#jqGrid").jqGrid("filterToolbar", { searchOperators: true, stringResult: true, searchOnEnter: false });
    $("#jqGrid").jqGrid('navGrid', '#jqGridPager', { edit: false, save: false, add: false, del: false, search: true }, {}, {}, {}, { multipleSearch: true, overlay: false });
    
}

function formatBTNLink(cellValue, options, rowObject) {
    return '<i class="fas fa-info-circle" style="font-size:14px;" onclick="showSalesorderDetail(\'' + rowObject.PARTNAME + '\',' + rowObject.ORD + ',' + rowObject.LINE + ')"></i>';
}
//function formatRPTLink(cellValue, options, rowObject) {
//    //console.log("formatRPTLink ==> options", options);
//    //console.log("formatRPTLink ==> rowObject", rowObject);
//    var a = document.createElement('a');
//    var linkText = document.createTextNode(cellValue);
//    a.appendChild(linkText);
//    a.title = cellValue;
//    a.href = 'Home_IL/TestProduct?' + 'OrderID=' + rowObject.ORD + '&OrderNumber=' + rowObject.ORDNAME;
//    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
//    //console.log("setHref ==> a", a.outerHTML);
//    return a.outerHTML;
//}

//function formatProdLink(cellValue, options, rowObject) {//options.rowId
//    //rowObject.ProductID
//    //console.log("formatRPTLink ==> options", options);
//    //console.log("formatRPTLink ==> rowObject", rowObject);
//    var a = document.createElement('a');
//    var linkText = document.createTextNode(cellValue);
//    a.appendChild(linkText);
//    a.title = cellValue;
//    a.href = '/Home_IL/TestProductItem?' + 'OrderID=' + rowObject.ORD + '&prodName="' + rowObject.PARTNAME + '"&ordLine=' + rowObject.LINE;
//    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
//    //console.log("setHref ==> a", a.outerHTML);
//    return a.outerHTML;
//}
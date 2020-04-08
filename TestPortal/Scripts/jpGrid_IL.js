function getData(supplier) {
    $.ajax({
        type: "POST",
        url: "Home/GetOrdersData",
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
            { label: 'הזמנה', name: 'ORDNAME', align: 'center', width: 75 },//, formatter: formatRPTLink
            { label: 'תאריך הזמנה', name: 'pageCURDATE', align: 'center', width: 150, sorttype: "date" },//, formatter: formatRPTLink
            { label: 'שם ספק', name: 'SHR_SUPTYPEDES', align: 'center', width: 150 },//, formatter: formatRPTLink
            { label: 'לטיפול – שם הקניין ', name: 'OWNERLOGIN', align: 'center', width: 150 },//, formatter: formatRPTLink
            { label: 'סטטוס', name: 'STATDES', align: 'center', width: 150 }//, formatter: formatRPTLink
        ],
        viewrecords: true,
        altRows: true,
        direction: 'rtl',
        autowidth: true,
        height: null,
        rowNum: 30,
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
            window.location.href += '/TestProduct/?OrderID=' + rowData.ORD + '&orderNumber=' + rowData.ORDNAME;
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
                    { label: 'ProductID', name: 'PARTNAME', align: 'center', key: true, hidden: true, width: 75 },
                    { label: 'מק"ט', name: 'PARTNAME', align: 'center', width: 100 },//, formatter: formatProdLink
                    { label: 'תאור', name: 'PDES', align: 'center', width: 100 },
                    { label: 'כמות', name: 'TQUANT', align: 'center', width: 100 },
                    { label: 'נותר לספק', name: 'TBALANCE', align: 'center', width: 100 },
                    { label: 'תאריך אספקה', name: 'pageREQDATE', align: 'center', width: 100 },
                    { label: 'סטטוס', name: 'PORDISTATUSDES', align: 'center', width: 100 }
                ],
                onSelectRow: function (id, rowId, iCol, content, event) {
                    var rowData = $(this).getRowData(id);
                    console.log("onSelectRow rowData = ", rowData);
                    window.location.href += '/TestProductItem/?OrderID=' + rowData.ORD + '&prodName="' + rowData.PARTNAME + '"&ordLine=' + rowData.LINE;
                }
            });
        }
    });
}

function formatRPTLink(cellValue, options, rowObject) {
    //console.log("formatRPTLink ==> options", options);
    //console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'Home_IL/TestProduct?' + 'OrderID=' + rowObject.ORD + '&OrderNumber=' + rowObject.ORDNAME;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    //console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatProdLink(cellValue, options, rowObject) {//options.rowId
    //rowObject.ProductID
    //console.log("formatRPTLink ==> options", options);
    //console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = '/Home_IL/TestProductItem?' + 'OrderID=' + rowObject.ORD + '&prodName="' + rowObject.PARTNAME + '"&ordLine=' + rowObject.LINE;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    //console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}
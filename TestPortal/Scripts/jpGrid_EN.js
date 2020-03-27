function getData(supplier)
{
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

function showGrid()
{
    console.log("showGrid ==> grid_data", grid_data);
    $("#jqGrid").jqGrid({
        //styleUI: 'Bootstrap',
        guiStyle: "bootstrap",
        iconSet: "fontAwesome",
        datatype: "local",
        data: grid_data,
        colModel: [
            { label: 'OrderID', name: 'ORD', align: 'center', formatter: formatRPTLink, index: 'ORD', key: true, hidden: true, width: 75 },
            { label: 'Order', name: 'ORDNAME', align: 'center', formatter: formatRPTLink, width: 75 },
            { label: 'Order Date', name: 'pageCURDATE', align: 'center', width: 150, sorttype: "date" },
            { label: 'Supplier', name: 'SHR_SUPTYPEDES', align: 'center', width: 150 },
            { label: 'For treatment ', name: 'OWNERLOGIN', align: 'center', width: 150 },
            { label: 'Status', name: 'STATDES', align: 'center', width: 150 }
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
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        loadComplete: function (data) {
            $("#loader").hide();
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
                direction: 'ltr',
                datatype: 'local',
                data: GetRecord(grid_data, rowId),
                autowidth: true,
                height: null,
                colModel: [
                    { label: '#', name: 'LINE', align: 'center', hidden: false, width: 75 },
                    { label: 'ORD', name: 'ORD', align: 'center', key: true, hidden: true, width: 75 },
                    { label: 'Serial No.', name: 'PARTNAME', align: 'center', formatter: formatProdLink, width: 100 },
                    { label: 'Description', name: 'PDES', align: 'center', width: 100 },
                    { label: 'Quntity', name: 'TQUANT', align: 'center', width: 100 },
                    { label: 'Left Quntity', name: 'TBALANCE', align: 'center', width: 100 },
                    { label: 'Supply Date', name: 'pageREQDATE', align: 'center', width: 100 },
                    { label: 'Status', name: 'PORDISTATUSDES', align: 'center', width: 100 }
                ]
            });
        }
    });
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

    //$.ajax({
    //    type: "POST",
    //    url: "Home/GetOrderItems",
    //    data: {
    //        parentRowKey: parentRowKey
    //    },
    //    cache: false,
    //    async: false,
    //    success: function (data) {
    //        console.log("GetRecord ==> data", data);
    //        console.log("GetRecord ==> data.lstItemsObject", data.lstItemsObject);
    //        if (null === data.lstItemsObject)
    //            return rec;

    //        if (data.lstItemsObject.length > 0)
    //        {
    //            for (var i = 0; i < data.lstItemsObject.length; i++)
    //            {
    //                rec.push(data.lstItemsObject[i]);
    //            }
    //            console.log("GetRecord ==> rec", rec);
    //        }
    //        return rec;
    //    }
    //});
    //console.log("GetRecord ==> rec - END", rec);
    //return rec;
}

function formatRPTLink(cellValue, options, rowObject)
{
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'Home/TestProduct?' + 'OrderID=' + rowObject.ORD + '&OrderNumber=' + rowObject.ORDNAME ;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}

function formatProdLink(cellValue, options, rowObject)
{//options.rowId
    //rowObject.ProductID
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = '/Home/TestProductItem?' + 'OrderID=' + rowObject.ORD + '&prodName="' + rowObject.PARTNAME + '"&ordLine=' + rowObject.LINE;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}
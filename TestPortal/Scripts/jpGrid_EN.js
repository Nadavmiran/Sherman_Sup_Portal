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
            { label: 'OrderID', name: 'OrderID', align: 'center', formatter: formatRPTLink, index: 'ORD', key: true, hidden: true, width: 75 },
            {label: 'Order', name: 'OrderNumber', align: 'center', formatter: formatRPTLink, width: 75 },
            { label:'Order Date', name: 'OrderDate', align: 'center', width: 150, sorttype: "date" },
            { label:'Status', name: 'OrderStatus', align: 'center', width: 150 },
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
                data: GetRecord(rowId),
                autowidth: true,
                height: null,
                colModel: [
                    { label: 'ProductID', name: 'ProductID', align: 'center', key: true, hidden: true, formatter: formatRPTLink, width: 75 },
                    { label: 'Serial No.', name: 'ProductName', align: 'center', formatter: formatRPTLink, width: 100 },
                    { label: 'Description', name: 'ProductDescription', align: 'center', width: 100 },
                    { label: 'Quntity', name: 'TotalAmountInOrder', align: 'center', width: 100 },
                    { label: 'Left Quntity', name: 'LeftAmountToDeliver', align: 'center', width: 100 },
                    { label: 'Supply Date', name: 'SupplyDate', align: 'center', width: 100 },
                    { label: 'Status', name: 'LineStatus', align: 'center', width: 100 }
                ]
            });
        }
    });
}

function GetRecord(parentRowKey) {
    console.log("GetRecord ==> parentRowKey", parentRowKey);
    var rec = [];
    $.ajax({
        type: "POST",
        url: "Home/GetOrderItems",
        data: {
            parentRowKey: parentRowKey
        },
        cache: false,
        async: false,
        success: function (data) {
            console.log("GetRecord ==> data", data);
            console.log("GetRecord ==> data.lstItemsObject", data.lstItemsObject);
            if (null == data.lstItemsObject)
                return rec;

            if (data.lstItemsObject.length > 0)
            {
                for (var i = 0; i < data.lstItemsObject.length; i++)
                {
                    rec.push(data.lstItemsObject[i]);
                }
                console.log("GetRecord ==> rec", rec);
            }
            return rec;
        }
    });
    console.log("GetRecord ==> rec - END", rec);
    return rec;
}

function formatRPTLink(cellValue, options, rowObject)
{
    console.log("formatRPTLink ==> options", options);
    console.log("formatRPTLink ==> rowObject", rowObject);
    var a = document.createElement('a');
    var linkText = document.createTextNode(cellValue);
    a.appendChild(linkText);
    a.title = cellValue;
    a.href = 'Home/TestProduct?' + 'OrderID=' + rowObject.OrderID + '&OrderNumber=' + rowObject.OrderNumber;
    a.classList = '.ui-state-highlight a, .ui-widget-content .ui-state-highlight a, .ui-widget-header .ui-state-highlight a';//.style.color = "#01416F";
    console.log("setHref ==> a", a.outerHTML);
    return a.outerHTML;
}
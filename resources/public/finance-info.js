/********************************************************************
* This script is the engine for IIBC weekly financial brief
* Written by: Hohyun, KIm
* Last updated: 2016-06-24
*********************************************************************/

var focused_btn = "#btn-a";

function btn_focus(id) {
    if (id != focused_btn) {
        $(focused_btn).removeClass("btn-success");
        $(focused_btn).addClass("btn-primary");
        $(id).addClass("btn-success");
        focused_btn = id;
    }
}
$("#btn-a").click(function () {
    btn_focus("#btn-a");
    $("#panel-a").show(300);
    $("#chart1, #chart2, #chart3").hide(300);
});
$("#btn-b").click(function () {
    btn_focus("#btn-b");
    $("#chart1").show(300);
    $("#panel-a, #chart2, #chart3").hide(300);
});
$("#btn-c").click(function () {
    btn_focus("#btn-c");
    $("#chart2").show(300);
    $("#panel-a, #chart1, #chart3").hide(300);
});
$("#btn-d").click(function () {
    btn_focus("#btn-d");
    $("#chart3").show(300);
    $("#panel-a, #chart1, #chart2").hide(100);
});

function validate(form) {
    if (form.password.value == "1611") {
        $("#btn-a, #btn-b, #btn-c, #btn-d").show(300);
        $("#panel-a").show(300);
        $("#tbn-a").removeClass("btn-primary");
        $("#btn-a").addClass("btn-success");
    } else {
        alert("Invalid password!");
    }
    form.password.value = "";
}

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});

$(document).ready(function() {
    // hide initially ---------------------------------------------------------------------
    $("#btn-a, #btn-b, #btn-c, #btn-d").hide();
    $("#panel-a, #chart1, #chart2, #chart3").hide();

    // weekly info panel ------------------------------------------------------------------
    $.getJSON('https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/offering_data.json', function (data) {
        $.each(data, function (key, val) {
            if (key == "date") $("#asOfDate").text(val);
            else if (key == "w-general") $("#w-general").text(accounting.formatNumber(val));
            else if (key == "m-general") $("#m-general").text(accounting.formatNumber(val));
            else if (key == "y-general") $("#y-general").text(accounting.formatNumber(val));
            else if (key == "w-mission") $("#w-mission").text(accounting.formatNumber(val));
            else if (key == "m-mission") $("#m-mission").text(accounting.formatNumber(val));
            else if (key == "y-mission") $("#y-mission").text(accounting.formatNumber(val));
            else if (key == "w-special") $("#w-special").text(accounting.formatNumber(val));
            else if (key == "m-special") $("#m-special").text(accounting.formatNumber(val));
            else if (key == "y-special") $("#y-special").text(accounting.formatNumber(val));
            else if (key == "w-total") $("#w-total").text(accounting.formatNumber(val));
            else if (key == "m-total") $("#m-total").text(accounting.formatNumber(val));
            else if (key == "y-total") $("#y-total").text(accounting.formatNumber(val));
        });
    });

    // chart 1: monthly offering -------------------------------------------------------------
    var options1 = {
        chart: {
            renderTo: 'chart1',
            defaultSeriesType: 'areaspline'
        },
        title: {
            text: 'Offerings status over time'
        },
        subtitle: {
            text: 'Monthly offering trend since 2015.1'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
            text: "Offerings"
            }
        },
        plotOptions: {
            series: {
            marker: {
            enabled: false
            }
        },
        areaspline: {
            stacking: 'normal',
            fillOpacity: 0.5,
            lineWidth: 1
            } 
        },
        credits: {
            text: "IIBC Treasury"
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        series: []
    };

    $.get('https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/offering_trend.csv', function(csv) {

        var lines = csv.split('\n');
        $.each(lines, function(lineNo, line) {
  
            var items = line.split(',');
            var d = new Date(items[0]);

            if (lineNo == 0) {
                $.each(items, function (itemNo, item) {
                    if (itemNo != 0) {
                        var temp = {
                            name: item,
                            data: []
                        }
                        if (itemNo > 3) {
                            temp.type = 'spline';
                        }
                        options1.series.push(temp);
                    }
                });
            }

            if (lineNo != 0) {
                $.each(items, function(itemNo, item) {      
                    if (itemNo != 0) {
                        options1.series[itemNo-1].data.push([d.getTime(), parseInt(item)]);
                    }
                });
            }
        });

        var chart1 = new Highcharts.Chart(options1);
    });

    // chart2: Offering vs expenses -----------------------------------------------
    var options2 = {
        chart: {
            renderTo: 'chart2',
            type: 'column'
        },
        title: {
            text: 'Offerings and expenses over time'
        },
        subtitle: {
            text: 'offerings vs expenses vs net (this year)'
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: "Amount"
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        credits: {
            text: "IIBC Treasury"
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        series: []
    };  

    $.get('https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/income_spending.csv', function(csv) {

        var lines = csv.split('\n');
        $.each(lines, function(lineNo, line) {
  
            var items = line.split(',');
            var d = new Date(items[0]);

            if (lineNo == 0) {
                $.each(items, function (itemNo, item) {
                    if (itemNo != 0) {
                        var temp = {
                            name: item,
                            data: []
                        }
                        options2.series.push(temp);
                    }
                });
            }

            if (lineNo != 0) {
                $.each(items, function(itemNo, item) {      
                    if (itemNo == 0) {
                        options2.xAxis.categories.push(item);
                    } else {
                        options2.series[itemNo-1].data.push(parseInt(item));
                    }
                });
            }
        });

        var chart = new Highcharts.Chart(options2);
    });      

    // chart3: Expense details ----------------------------------------------------
    options3 = {
        chart: {
            renderTo: 'chart3',
            type: 'pie'
        },
        title: {
            text: 'Expenses by categories'
        },
        subtitle: {
            text: 'Click the slice to view subcategories of others.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:,.0f}'
                }
            }
        },
        credits: {
            text: "IIBC Treasury"
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.p:.1f}%</b> of total<br/>'
        },
        series: [{
            name: 'Categories',
            colorByPoint: true,
            data: []
        }],
        drilldown: {
            series: [{
                name: 'Others',
                id: 'Others',
                data: []
            }]
        }
    }

    $.get('https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/expense.csv', function(csv) {

        var lines = csv.split('\n');
        var drilldown_flag = false;
        $.each(lines, function(lineNo, line) {
  
            var items = line.split(',');
            if (lineNo == 0) {
                options3.subtitle.text = items[3] + ", " + options3.subtitle.text;
            }
            if (lineNo != 0 && line != "") {
                if (!drilldown_flag) {
                    var temp = {
                        name: items[0],
                        y: parseInt(items[1]),
                        p: parseFloat(items[2]) 
                    };
                    if (items[0] == 'Others') { 
                        temp.drilldown = 'Others';
                        temp.sliced = true;
                        drilldown_flag = true;
                    }
                    options3.series[0].data.push(temp);
                } else { 
                    options3.drilldown.series[0].data.push([items[0], parseInt(items[1])]);
                }
            }
        });
    
        var chart3 = new Highcharts.Chart(options3);
    });    
  }) <!-- end of $(document).ready -->

import '../../assets/css/cart.css';
import { Phim } from './../models/phim';
import * as Highcharts from 'highcharts';
import * as Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

Highcharts.chart('container', {
    // options - see https://api.highcharts.com/highcharts
    title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
    },

    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

var danhSachGioHang: Phim[] = [];
window.onload = () => {
    danhSachGioHang = JSON.parse(localStorage.getItem('cartList'));
    taoBang(danhSachGioHang)
}

let taoBang = (danhSachGioHang) => {
    let htmlContent = '';
    for (let i in danhSachGioHang) {
        let { MaPhim, TenPhim, Trailer, HinhAnh, MoTa, MaNhom, NgayKhoiChieu, DanhGia } = danhSachGioHang[i];
        htmlContent += `
            <tr>
                <td>${parseInt(i) + 1}</td>
                <td>${MaPhim}</td>
                <td>${TenPhim}</td>
                <td>${Trailer}</td>
                <td><img src=${HinhAnh} style="width:150px"/></td>
                <td>${MaNhom}</td>
                <td>${NgayKhoiChieu}</td>
                <td>${DanhGia}</td>
                <td>
                    <button data-maphim=${MaPhim} class="btn btn-info" id="btn-Xoa">Xóa</button>
                </td>
            </tr>
        `;
    }
    (<HTMLTableElement>document.getElementById('listPhimContent')).innerHTML = htmlContent;
    xoaPhim('btn-Xoa');
}

let timPhimTheoMa = (movieArr: Phim[], maPhim: string) => {
    for (let i in movieArr) {
        if (movieArr[i].MaPhim === maPhim) {
            return parseInt(i);
        }
    }
    return -1;
}

let xoaPhim = (btnClass: string) => {
    let btns: any = <HTMLCollection>document.getElementsByClassName(btnClass);
    for (let btn of btns) {
        btn.addEventListener('click', () => {
            let maPhim = btn.getAttribute('data-maphim');
            let index = timPhimTheoMa(danhSachGioHang, maPhim);
            if (index !== -1) {
                danhSachGioHang.splice(index, 1);
            }
            localStorage.setItem('cartList', JSON.stringify(danhSachGioHang));
            taoBang(danhSachGioHang);
        });
    }
}
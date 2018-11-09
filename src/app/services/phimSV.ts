import $ from 'jquery';
declare let $: any;

export class PhimSV {
    layDanhSachPhim() {
        return $.ajax({
            type: 'get',
            url: 'http://sv2.myclass.vn/api/QuanLyPhim/LayDanhSachPhim?MaNhom=GP01'
        });
    }
}
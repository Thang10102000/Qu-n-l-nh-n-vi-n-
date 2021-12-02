var listAccount = []
var currentPage = 1;
var size = 10;
var sortField = "id";
var isAsc = true;
var totalPages;
var admin = true;
var currentAccount = null;


var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + +today.getDate();


$(function () {

    getListEmployees();

    $("#form1").hide();
})

function getAccountByID() {
    getListEmployees();
}

function khenthuong(sonam) {
    if (sonam < 1) {
        return "Thực tập viên";
    }
    else if (sonam < 2) {
        return "Nhân viên đồng";
    }
    else if (sonam < 3) {
        return "Nhân viên bạc";
    }
    else if (sonam < 4) {
        return "Nhân viên vàng";
    }
    else {
        return "Nhân viên kim cương";
    }

}
function luongthuong(sonam) {
    if (sonam < 1) {
        return "5.000.000 VNĐ";
    }
    else if (sonam < 2) {
        return "10.000.000 VNĐ ";
    }
    else if (sonam < 3) {
        return "15.000.000 VNĐ ";
    }
    else if (sonam < 4) {
        return "20.000.000 VNĐ ";
    }
    else {
        return "30.000.000 VNĐ ";
    }

}
function validateSelectBox(obj) {
    // Lấy danh sách các options
    var options = obj.children;

    // Biến lưu trữ các chuyên mục đa chọn
    var html = "";

    // lặp qua từng option và kiểm tra thuộc tính selected
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) {
            html += options[i].value;
            console.log(html);
        }
    }
    localStorage.setItem("chon", html);
    // Gán kết quả vào div#result
    //var a = (document.getElementById("result").innerHTML = html);
    getListEmployees();
}

function showAccount() {

    // Xóa hết kết quả đang hiển thị ở bảng kết quả
    $('#Result_TB').empty()
    // Lặp trong listAccount để in thông tin từng phần tử

    for (var index = 0; index < listAccount.length; index++) {
        let tm = Date.parse(listAccount[index].CreateDate) - Date.parse(date);
        tm / (60 * 60 * 24 * 365 * 1000);
        let namconghien = tm / (60 * 60 * 24 * 365 * 1000);
        namconghien = Math.abs(namconghien);
        namconghien = namconghien.toFixed(2);
        if (localStorage.getItem("chon") === khenthuong(namconghien)) {
            $('#Result_TB').append(`
              <tr>
              <th>${listAccount[index].AccountID}</th>
              <th>${listAccount[index].Email}</th>
              <th>${listAccount[index].FullName}</th>
              <th>${listAccount[index].Department}</th>
              <th>${listAccount[index].Position}</th>   
              <th>${namconghien}</th>
              <th>${khenthuong(namconghien)}</th>
              <th>${luongthuong(namconghien)}</th>
              </tr>
              `)
        }

        if (localStorage.getItem("chon") === "all") {
            $('#Result_TB').append(`
              <tr>
              <th>${listAccount[index].AccountID}</th>
              <th>${listAccount[index].Email}</th>
              <th>${listAccount[index].FullName}</th>
              <th>${listAccount[index].Department}</th>
              <th>${listAccount[index].Position}</th>   
              <th>${namconghien}</th>
              <th>${khenthuong(namconghien)}</th>
              <th>${luongthuong(namconghien)}</th>
              </tr>
              `)
        }


    }
}

function getListEmployees() {

    var url = "http://localhost:8080/api/v1/accounts/";
    url += "?page=" + currentPage + "&size=" + size;
    url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json', // datatype return
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(localStorage.getItem("USERNAME") + ":" + localStorage.getItem("PASSWORD")));
        },
        success: function (data, textStatus, xhr) {
            // reset list employees
            listAccount = [];
            parseData(data);
            showAccount();
            totalPages = data.totalPages;
            // Sau khi hiển thị dữ liệu sẽ Show thêm các nút để thực hiện phân trang, tính các nút này dựa trên API totalPages được trả ra
            pagingTable(totalPages);
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}

// lưu dữ liệu account 
function parseData(data) {
    // employees = data;
    data.content.forEach(function (item) {
        var account = {
            AccountID: item.id,
            Email: item.email,
            Username: item.username,
            FullName: item.fullname,
            Department: item.department,
            Position: item.position,
            CreateDate: item.createDate,
        }
        listAccount.push(account)
    });
}
function pagingTable(pageAmount) {
    var pagingStr = "";
    // Hàm Gen nút Previous
    if (pageAmount > 1 && currentPage > 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="prevPaging()">Previous</a>' +
            '</li>';
    }
    // Hàm Gen nút số trang 1,2,3 ...
    for (i = 0; i < pageAmount; i++) {
        pagingStr +=
            '<li class="page-item ' + (currentPage == i + 1 ? "active" : "") + '">' +
            '<a class="page-link" onClick="changePage(' + (i + 1) + ')">' + (i + 1) + '</a>' +
            '</li>';
    }
    // Hàm Gen nút Next
    if (pageAmount > 1 && currentPage < pageAmount) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="nextPaging()">Next</a>' +
            '</li>';
    }
    $('#pagination').empty();
    $('#pagination').append(pagingStr);

}
// Hàm thực hiện khi nhấn vào các nút phân trang 1, 2, 3
function changePage(page) {
    if (page == currentPage) {
        return;
    }
    currentPage = page;
    getListEmployees();
}
// Hàm xử lý khi nhấn nút Previous
function prevPaging() {
    changePage(currentPage - 1);
}
// Hàm xử lý khi nhấn nút next
function nextPaging() {
    changePage(currentPage + 1);
}
function resetPaging() {
    currentPage = 1;
    size = 5;
}
function changeSort(field) {
    if (field == sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    getListEmployees();
}



function changrRole(role) {
    localStorage.setItem("isAdmin", role)
}

function isAdmin() {
    if (!localStorage.getItem("isAdmin")) {
        return false;
    }

    return (localStorage.getItem("isAdmin") == "true")
}

function CancelLogin() {

    var confirm_del = confirm('Bạn có muốn quay trở lại không')
    if (confirm_del) {
        window.location.replace("Manager.html");
    }

}








function openNewVisit(){
    document.getElementById("newVisit").style.display="flex"
    document.getElementById("newVisitBtn").style.display="none"
}

function inpName(val){
    $.ajax({
        url: '/inpName',
        method: 'post',
        dataType: 'html',
        data: {val},
        success:function(datas){
            //console.log(datas.indexOf('<ul id="listClient">'))
            let tmp = datas.slice(datas.indexOf('<ul id="listClient">'),(datas.indexOf('</ul>',datas.indexOf('<ul id="listClient">'))+5))
            document.getElementById("listClient").innerHTML=tmp
        }
    });
}
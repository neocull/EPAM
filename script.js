/* Variables
***************************************/
var table = document.getElementById('info-table'),
    modalFormButton = document.getElementById("modal-form"),
    modalName = document.getElementById('modal-name'),
    modalCount = document.getElementById('modal-count'),
    modalPrice = document.getElementById('modal-price'),
    phrase = document.getElementById('search-text')

var valName = false,    /* Validation */
    stringPrice = "",   /* input price */
    sortValue = 1,      /* 1,2 - sort Name; 3,4 - sort Price */
    maxSize = 0,        /* Number next elem in array */
    numEdit, numDel;    /* Number line for edit and delete */

/* Array */
var txt = new Array()

function fullArray(name, count, price){
   this.name = name;
   this.count = count;
   this.price = price;
}

/* action buttons */
var btnEdit = '<button type="button" class="btn btn-dark" onclick="modalForm(';
var btnEditClose =',this)">Edit</button>'
var btnDelete = '<button type="button" class="btn btn-dark" onclick="modalDelete(this)">Delete</button>';

/* Block count*/
var divCount = '<div class="div-count">';
var divCountClose = '</div>';

/* OnClick functions
***************************************/

/* Search */
function tableSearch() {
    
    var regPhrase = new RegExp(phrase.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = regPhrase.test(txt[i-1].name);
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }

}

/* open modal form window */
function modalForm(value, numLine) {
    
    modalFormButton.innerHTML = value;
    
    if (value === "Add"){
        modalFormButton.setAttribute('onclick', 'Add()');
        
        modalName.value = "";
        modalCount.value = "";
        modalPrice.value = "";
        stringPrice = "";
    } else {
        modalFormButton.setAttribute('onclick', 'Update()');
        
        $("table tbody tr").click(function(){ 
            numEdit = this.rowIndex - 1;
            
            modalName.value = txt[numEdit].name;
            modalCount.value = txt[numEdit].count;
            modalPrice.value = txt[numEdit].price;

        });
    }
        
    $('#exampleModal').modal(); 
        
}

/*************************************/
function Add() {
    
    if(valName) {
        
        var indexArrValue = txt.length;
        txt[indexArrValue] = new fullArray(modalName.value, modalCount.value, modalPrice.value);
    
        allocator(sortValue);    
            
        $('#exampleModal').modal('toggle');
            
    } else {
            
        $('#modal-name').css("border-color","red");
        $("#modal-name").next(".tooltip").html("Пустая строка");
        $("#modal-name").next(".tooltip").css("opacity","1");
            
    }

}

/*************************************/
function Update() {
    
    if(valName) {
        
        txt[numEdit].name = modalName.value;
        txt[numEdit].count = modalCount.value;
        txt[numEdit].price = modalPrice.value;
    
        allocator(sortValue);    
            
        $('#exampleModal').modal('toggle');
            
    } else {
            
        $('#modal-name').css("border-color","red");
        $("#modal-name").next(".tooltip").html("Пустая строка");
        $("#modal-name").next(".tooltip").css("opacity","1");
            
    }

}

/*************************************/
function modalDelete(o) {
    
    $("table tbody tr").click(function(){ 
        numDel = this.rowIndex - 1;    
    });
    $('#deleteModal').modal();
    
}

/*************************************/
function deleteRow() {
    
    txt.splice(numDel, 1);
    allocator(sortValue); 

    $('#deleteModal').modal('toggle');
}

/* button sort name */
function sortName(unicodValue) {     
    
    if(unicodValue.charCodeAt(0) === 9660) {
        
        sortValue = 1;
        $("#sort-name").html('&#9650;');
        allocator(1);
        
    } else {
        
        sortValue = 2;
        $("#sort-name").html('&#9660;');
        allocator(2);
        
    }
    
}

/* button sort price */
function sortPrice(unicodValue) {
    
    if(unicodValue.charCodeAt(0) === 9660) {
        
        sortValue = 3;
        $("#sort-price").html('&#9650;');
        allocator(3);
        
    } else {
        
        sortValue = 4;
        $("#sort-price").html('&#9660;');
        allocator(4);
        
    }
    
}

/* Field validation
***************************************/

$('#modal-name').focusout(function(){
        
    if(modalName.value === "") {
        $('#modal-name').css("border-color","red");
        $("#modal-name").next(".tooltip").html("Пустая строка");
        $("#modal-name").next(".tooltip").css("opacity","1");
        valName = false;
    } else if(/^\s+$/.test(modalName.value)) {
        $('#modal-name').css("border-color","red");
        $("#modal-name").next(".tooltip").html("Строка из пробелов");
        $("#modal-name").next(".tooltip").css("opacity","1");
        valName = false; 
    } else if (modalName.value.length > 15) {
        $('#modal-name').css("border-color","red");
        $("#modal-name").next(".tooltip").html("Символов больше 15");
        $("#modal-name").next(".tooltip").css("opacity","1");
        valName = false; 
    } else {
        $('#modal-name').css("border-color","#ced4da");
        $("#modal-name").next(".tooltip").css("opacity","0");
        valName = true;
    }
        
});

$('#modal-price').focus(function(){
    
    var stringPrice = this.value;
    if(stringPrice !== ""){
        stringPrice = stringPrice.substr(1);
        stringPrice = parseFloat(stringPrice.replace(/,/g, ''));
        this.value = stringPrice;
    }
    document.getElementById('modal-price').type = 'number';
    
}); 

$('#modal-price').focusout(function(){
    
    document.getElementById('modal-price').type = 'text';
    var number = parseFloat(this.value);
    if(this.value === ""){
        this.value = "";
    } else {
        this.value = "$" + number.toLocaleString('en');
    }
    
}); 

/* Sorting
**************************/

function allocator(Num){
    
    var GetRem = table;
    var cloneGetRem = document.getElementById("remover");
    GetRem.removeChild(cloneGetRem);
    
    if(Num === 1){ 
        sortAscNames();
    } else if(Num === 2) {
        sortDesNames();
    } else if(Num === 3) {
        sortAscPrice();
    } else if(Num === 4) {
        sortDesPrice();
    }
    
    maxSize = 0;
    createTable();

} 

/* Name descending */
function sortDesNames(){

    for(counter = 0; counter < txt.length-1; counter++){

        maxSize++;
        for(count = maxSize; count <= txt.length-1; count++){
	                       
                if(txt[counter].name.replace(/\d+/, '') <= txt[count].name.replace(/\d+/, '') 
                   && +txt[counter].name.replace(/\D+/, '') <= +txt[count].name.replace(/\D+/, '')){
                    swap(counter, count);
                }
            
        }
    } 
    
}

/* Name ascending */
function sortAscNames(){

    for(counter = 0; counter < txt.length-1; counter++){

        maxSize++;
        for(count = maxSize; count <= txt.length-1; count++){
	                       
                if((txt[counter].name.replace(/\d+/, '') >= txt[count].name.replace(/\d+/, '') 
                   && +txt[counter].name.replace(/\D+/, '') >= +txt[count].name.replace(/\D+/, ''))
                  || (txt[counter].name.replace(/\d+/, '') === "" && +txt[counter].name.replace(/\D+/, '') !== ""
                     && txt[count].name.replace(/\d+/, '') !== "")){
                    swap(counter, count);
                }
            
        }
    } 
    
}

/* Price descending */
function sortDesPrice(){

    for(counter = 0; counter < txt.length - 1; counter++){

        maxSize++;
        for(count = maxSize; count <= txt.length - 1; count++){
                
            var priceFirst = txt[counter].price.slice(1),
                priceSecond = txt[count].price.slice(1);              
	                       
            if(parseFloat(priceFirst.replace(/,/g, '')) < parseFloat(priceSecond.replace(/,/g, ''))){
                 swap(counter, count);
            }
            if((txt[counter].name.replace(/\d+/, '') < txt[count].name.replace(/\d+/, '') 
                   && +txt[counter].name.replace(/\D+/, '') < +txt[count].name.replace(/\D+/, ''))
                  || (txt[count].name.replace(/\d+/, '') === "" && +txt[count].name.replace(/\D+/, '') !== ""
                     && txt[counter].name.replace(/\d+/, '') !== "")){
                    swap(counter, count);
                }
            
        }
    }
    
}

/* Price ascending */
function sortAscPrice(){

    for(counter = 0; counter < txt.length - 1; counter++){

        maxSize++;
        for(count = maxSize; count <= txt.length - 1; count++){
                
            var priceFirst = txt[counter].price.slice(1),
                priceSecond = txt[count].price.slice(1);              
	                       
            if(parseFloat(priceFirst.replace(/,/g, '')) > parseFloat(priceSecond.replace(/,/g, ''))){
                 swap(counter, count);
            }   
            
        }
    }
    
}

/* Function swap */
function swap(a, b){
    
    temp1 = txt[a].name;
    temp2 = txt[a].count;
    temp3 = txt[a].price;
    temp4 = txt[b].name;
    temp5 = txt[b].count;
    temp6 = txt[b].price;
    txt[b].name = temp1;
    txt[b].count = temp2;
    txt[b].price = temp3;
    txt[a].name = temp4;
    txt[a].count = temp5;
    txt[a].price = temp6;
    
}

/* Function create table */

function createTable(){
    
    var getIDs = document.getElementById("remover");
    
    if(!getIDs){
        var getIDTest = table;
        var crtID = document.createElement("tbody");
        crtID.id = "remover";
        getIDTest.appendChild(crtID); 
        getIDs = document.getElementById("remover");
    }	

    for(var counter = 0; counter <= txt.length - 1; counter++){ 
            
        var crtTr = document.createElement("tr");  
            
        var row = document.createElement("TR");
        var td1 = document.createElement("TD");
        td1.innerHTML = txt[counter].name + divCount + txt[counter].count + divCountClose;
        var td2 = document.createElement("TD");
        td2.appendChild (document.createTextNode(txt[counter].price));
        var td3 = document.createElement("TD");
        td3.innerHTML = btnEdit + "'Update'" + btnEditClose + btnDelete;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        getIDs.appendChild(row);
    
    }
    
 }

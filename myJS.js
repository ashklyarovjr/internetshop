/**
 * Created by Anton on 3/31/2015.
 */
function Item(id, name, volume, price, quantity) {
    this.id = id;
    this.name = name;
    this.volume = volume;
    this.price = price;
    this.quantity = quantity;
}

var localStorage = window['localStorage'];


$(document).ready(function () {
    defaultTableGen();
});

function defaultTableGen() {
    if (localStorage != null) {
        var keys = [];
        var values = [];
        var summary = document.getElementById('summary-input');
        for (var i = 0; i < localStorage.length; i++) {
            keys[i] = localStorage.key(i);
        }
        for (var k = 0; k < keys.length; k++) {
            values[k] = localStorage[keys[k]];
        }
        for (var j = 0; j < values.length; j++) {
            var elem = new Item(JSON.parse(values[j]).id, JSON.parse(values[j]).name, JSON.parse(values[j]).volume, JSON.parse(values[j]).price, JSON.parse(values[j]).quantity);
            var sum = parseInt(summary.getAttribute('value')) + elem.price * elem.quantity;
            summary.setAttribute('value', JSON.stringify(sum));
            rowGen(elem);
        }
    }
}

function setStringItem(itID, elemPriceID, elemVolID, elemNameID) {
    var item = new Item(itID, elemNameID, elemVolID, elemPriceID, 1);
    return JSON.stringify(item);
}

function rowGen(element) {
    $('#purchase-products-list').append("<tr class='item-row' id='" + element.id + "-row'><td>" + element.name + "</td><td>" + element.volume + "</td><td><div class='container-fluid'><div class='row'><button role='button' type='button' class='btn btn-sm quantity-serve' onclick='elemMinus(" + JSON.stringify(element.id) + ")'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button><input disabled id='" + element.id + "-quantity-input' type='text' class='form-control quantity-input quantity-serve' placeholder='Кол-во' value='" + element.quantity + "'><button role='button' type='button' class='btn btn-sm quantity-serve' onclick='elemPlus(" + JSON.stringify(element.id) + ")'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button></div></div></td><td>" + element.price + "</td><td><button role='button' type='button' class='btn btn-sm' onclick='deleteItem(" + JSON.stringify(element.id) + ")'><span class='glyphicon glyphicon-remove center-block' aria-hidden='true'></span></button></td></tr>");

}

function rowModify(element) {
    var elemQuant = document.getElementById(element.id + '-quantity-input');
    elemQuant.setAttribute('value', element.quantity);
}

function verify(itID, itPrice, itVolume, itName) {
    try {
        var id = itID;
        var price = document.getElementById(itPrice).innerText;
        var volume = document.getElementById(itVolume).innerText;
        var name = document.getElementById(itName).innerText;
    } catch (e) {
    }

    var summary = document.getElementById('summary-input');
    var element = new Item(id, name, volume, price, 1);
    if (localStorage[element.id] != undefined) {
        element.quantity += JSON.parse(localStorage[element.id]).quantity;
        addItem(element);
        var sum = parseInt(summary.getAttribute('value')) + element.price * 1;
        summary.setAttribute('value', JSON.stringify(sum));
        rowModify(element);

    } else {
        addItem(element);
        var sums = parseInt(summary.getAttribute('value')) + element.price * 1;
        summary.setAttribute('value', JSON.stringify(sums));
        rowGen(element);
    }

}

function deleteItem(elemID) {
    if (undefined != localStorage) {
        var summary = document.getElementById('summary-input');
        var element = new Item("", "", "", JSON.parse(localStorage[elemID]).price, JSON.parse(localStorage[elemID]).quantity);
        var sums = parseInt(summary.getAttribute('value')) - (element.price * element.quantity);
        summary.setAttribute('value', JSON.stringify(sums));
        localStorage.removeItem(elemID);
        rowRem(elemID);
    }
}

function rowRem(elemID) {
    var id = '#' + elemID + '-row';
    $(id).remove();
}

function addItem(element) {
    if (undefined != localStorage) {
        localStorage.setItem(element.id, JSON.stringify(element));
    }
    else {
        alert("Your browser doesn't support local storage");
    }
}

function elemPlus(elemID) {
    var summary = document.getElementById('summary-input');
    var elem = new Item(elemID, JSON.parse(localStorage[elemID]).name, JSON.parse(localStorage[elemID]).volume, JSON.parse(localStorage[elemID]).price, JSON.parse(localStorage[elemID]).quantity + 1);
    var sum = parseInt(summary.getAttribute('value')) + (elem.price * 1);
    summary.setAttribute('value', JSON.stringify(sum));
    rowModify(elem);
    addItem(elem);
}

function elemMinus(elemID) {
    var elem = new Item(elemID, JSON.parse(localStorage[elemID]).name, JSON.parse(localStorage[elemID]).volume, JSON.parse(localStorage[elemID]).price, JSON.parse(localStorage[elemID]).quantity - 1);
    if (elem.quantity != 0) {
        var summary = document.getElementById('summary-input');
        var sum = parseInt(summary.getAttribute('value')) - (elem.price * 1);
        summary.setAttribute('value', JSON.stringify(sum));
        rowModify(elem);
        addItem(elem);
    }
    else {
        deleteItem(elemID);
    }
}

function clearAllRows() {
    $('.item-row').remove();

}

function confirm() {
    if (localStorage.length != 0) {
        var summary = document.getElementById('summary-input');
        alert("Поздравляем, заказав наш мед, вы стали победителем по жизни! Приходите к нам еще...")
        localStorage.clear();
        clearAllRows();
        summary.setAttribute('value', JSON.stringify(0));
    } else {
        alert("Сначала надо что-то добавить в корзину...");
    }
}
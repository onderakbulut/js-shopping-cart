/* scroll content start */
let page = 0;
loadScroll(0);

function loadScroll(page) {
    let html = "";
    fetch('https://www.cheapshark.com/api/1.0/deals?title=batman&sortBy=Savings&onSale=1&pageSize=10&pageNumber=' + page)
        .then(res => res.json())
        .then(json => {
            if (json != "[]") {
                json.forEach(element => {
                    let isChecked = fav.checkItem(element.internalName,element.storeID) == true ? "active":"";
                    let unique = element.internalName+"-"+element.storeID;
                    let saving = Number(element.savings).toFixed(2);
                    html +=
                        `<div class="card bg-white rounded-[16px] overflow-hidden">
                        <div class="relative overflow-hidden pb-[10rem]">
                            <img class="absolute left-0 top-0 right-0 bottom-0 w-full h-full object-cover lazyload" data-src="${element.thumb}" alt="">
                        </div>
                        <div class="card-content px-[24px] pt-[32px] pb-[30px]">
                            <div class="flex mb-[24px] items-center justify-between">
                                <h6 class="text-[#081F32] tracking-[0.01em] text-[24px] leading-[25px] font-['DM_Serif_Display']">Store : ${element.storeID}</h6>
                                <a class="fav ${isChecked}" href="#" data-item="${unique}">
                                    <i class="icon-heart-outlined text-[24px]"></i>
                                </a>
                            </div> 
                            <p class="text-[16px] leading-[25px] text-[#6E798C] mb-[33px]">${element.title}</p>
                            <span class="text-[#A5ADBB]">Saving / ${saving} %</span>
                            <div class="flex justify-between flex-wrap">
                                <div class="flex items-center mr-[4px]">
                                    <span class="text-[#081F32] font-['DM_Serif_Display'] text-[28px] leading-[25px] mr-[8px]">$${element.salePrice}</span>
                                    <span class="text-[#F8593B] font-['DM_Serif_Display'] text-[20px] leading-[25px] ">$${element.normalPrice}</span>
                                </div>
                                <a href="#" class="add-to-cart text-white text-[14px] leading-[25px] tracking-[0.18em] rounded-[4px] bg-[#2ECC71] py-[9px] px-[29px]" data-name="${element.title}" data-price="${element.salePrice}" data-thumb="${element.thumb}" data-internal="${element.internalName}" data-storeID="${element.storeID}">ORDER</a>
                            </div>
                        </div>
                    </div>`;

                });
                $(".product-list").append(html);
            }

        });

}


$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        page++;
        loadScroll(page);
    }
});
/* scroll content end */



/* cart popup start */
const body = $('body');
body.on('click', 'button.plus , button.minus', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $inputTag = $(this).closest('.quantity').find('.qty');
    if ($inputTag) {
        let value = $inputTag.val() ? parseInt($inputTag.val(), 10) : 0
            , max = $inputTag.data('max') || 100
            , min = $inputTag.data('min') || 0
            , step = $inputTag.data('step') || 1;
        if ($(this).hasClass('plus')) {
            value = value + step <= max ? value + step : max;
        } else {
            value = value - step >= min ? value - step : min;
        }
        $inputTag.val(value).trigger('change');
    }
});

body.on("click", ".push-cart", function (e) {
    e.preventDefault();
    openCart();
});
body.on("click", ".close-cart", function (e) {
    closeCart();
});

openCart = function () {
    $(".cart-popup").addClass("show");
}
closeCart = function () {
    $(".cart-popup").removeClass("show");
}

$("html").delegate(".add-to-cart", "click", function (event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    var thumb = $(this).data('thumb');
    var internalName = $(this).data('internal');
    var storeID = $(this).data('storeid');

    if($(event.target).parents(".fav-list").length){
        // if clicked from wishlist send to cart
        fav.removeItemFromWhislist(internalName, storeID);
        var item = internalName+"-"+storeID;
        if(fav.totalCount() < 1){
            closeModal();
        }
        displayWishlist();
        $("[data-item="+item+"]").removeClass("active");
    }
    
    shoppingCart.addItemToCart(name, price, 1, thumb, internalName, storeID);
    displayCart();
    openCart();
});


$('.show-cart').on("click", ".delete-item", function(event) {
    var internalName = $(this).data('internal');
    var storeID = $(this).data('storeid'); 
    shoppingCart.removeItemFromCartAll(internalName, storeID);
    displayCart();
})

$('.clear-cart').click(function() {
    shoppingCart.clearCart();
    displayCart();
});

// -1
$('.show-cart').on("click", ".minus", function (event) {
    var internalName = $(this).parent().find('input').data('internal');
    var storeID = $(this).parent().find('input').data('storeid');
    shoppingCart.removeItemFromCart(internalName, storeID);
    displayCart();
})
// +1
$('.show-cart').on("click", ".plus", function (event) {
    var name = $(this).parent().find('input').data('name');
    var price = Number($(this).parent().find('input').data('price'));
    var thumb = $(this).parent().find('input').data('thumb');
    var internalName = $(this).parent().find('input').data('internal');
    var storeID = $(this).parent().find('input').data('storeid');

    shoppingCart.addItemToCart(name, price, 1, thumb, internalName, storeID);
    displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
    var name = $(this).data('name');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
});

function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
        output +=
            `<div class="cart-popup-item border-t-[1px] py-3 lg:py-[30px] flex relative">
                <div class="w-[100px] basis-[100px] mr-3 lg:mr-[30px]">
                    <div class="bg-no-repeat w-[100px] h-full bg-center" style="background-image:url(${cartArray[i].image})"></div>
                </div> 
                <div class="w-full">
                    <p class="text-[#151517] text-[14px] mb-3 relative pr-3">
                         ${cartArray[i].name}
                        <a href="javascript:void(0);" class="absolute top-0 right-0 delete-item" data-internal="${cartArray[i].internalName}" data-storeid="${cartArray[i].storeID}"><i class="icon-close"></i></a>
                    </p>
                    <p class="text-[15px] font-bold mb-3">Store : ${cartArray[i].storeID}</p>
                    <div class="flex items-center justify-between">
                        <div class="quantity flex w-[88px]">
                            <button class="minus bg-white text-black border-2 border-[#EEEEEE] w-[28px]"><i class="icon-minus text-[18px]"></i></button>
                            <input type="number" class="qty text-center h-[34px] font-semibold w-[32px] text-[#222] m-0 outline-0  border-2 border-[#EEEEEE] border-l-0 border-r-0" step="1" min="0" max="9999" value="${cartArray[i].count}" data-name="${cartArray[i].name}" data-price="${cartArray[i].price}" data-thumb="${cartArray[i].thumb}" data-internal="${cartArray[i].internalName}" data-storeid="${cartArray[i].storeID}">
                            <button class="plus bg-white text-black border-2 border-[#EEEEEE] w-[28px]"><i class="icon-plus text-[18px]"></i></button>
                        </div>
                        <div class="cart-price">
                            <ins class="no-underline font-bold">$${cartArray[i].price}</ins>
                        </div>
                    </div> 
                </div>
            </div>`;
    }
    if(cartArray.length < 1){
        $('.show-cart').html("Sepetenizde hiç ürün bulunmuyor.");
    }
    else {
        $('.show-cart').html(output);
    }
    $('.total-cart').html("$"+shoppingCart.totalCart());
    $('.cart-count').html(shoppingCart.totalCount());
    
}

var shoppingCart = (function () {

    cart = [];

    function Item(name, price, count, image, internalName, storeID) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.image = image;
        this.internalName = internalName;
        this.storeID = storeID;
    }

    // Save cart
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Load cart
    function loadCart() {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    if (localStorage.getItem("cart") != null) {
        loadCart();
    }

    var obj = {};

    // Add to cart
    obj.addItemToCart = function (name, price, count, image, internalName, storeID) {
        for (var item in cart) {
            if (cart[item].internalName+"-"+cart[item].storeID === internalName+"-"+storeID) {
                cart[item].count++;
                saveCart();
                return;
            }
        }
        var item = new Item(name, price, count, image, internalName, storeID);
        cart.push(item);
        saveCart();
    }
    // Set count from item
    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (internalName, storeID) {
        for (var item in cart) {
            if (cart[item].internalName+"-"+cart[item].storeID === internalName+"-"+storeID) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();
    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function (internalName, storeID) {
        for (var item in cart) {
            if (cart[item].internalName+"-"+cart[item].storeID === internalName+"-"+storeID) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }

    // Clear cart
    obj.clearCart = function () {
        cart = [];
        saveCart();
    }

    // Count cart 
    obj.totalCount = function () {
        var totalCount = 0;
        for (var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // Total cart
    obj.totalCart = function () {
        var totalCart = 0;
        for (var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    // List cart
    obj.listCart = function () {
        return cart;
    }


    return obj;
})();

displayCart();

/* cart popup end */

/* fav start */

var fav = (function(){
    wishlist = [];

    function Item(name, price, count, image, internalName, storeID) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.image = image;
        this.internalName = internalName;
        this.storeID = storeID;
    }

    // Save Wishlist
    function saveWish() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Load Wishlist
    function loadWish() {
        wishlist = JSON.parse(localStorage.getItem('wishlist'));
    }
    if (localStorage.getItem("wishlist") != null) {
        loadWish();
    }

    var obj = {};

    // Add to Wishlist
    obj.addItemToWishlist = function (name, price, count, image, internalName, storeID) {
        for (var item in wishlist) {
            if (wishlist[item].internalName+"-"+wishlist[item].storeID === internalName+"-"+storeID) {
                console.log("ürün zaten fav listesinde");
                return;
            }
        }
        var item = new Item(name, price, count, image, internalName, storeID);
        wishlist.push(item);
        saveWish();
    }
    // Remove all items from whislist
     obj.removeItemFromWhislist = function (internalName, storeID) {
        for (var item in wishlist) {
            if (wishlist[item].internalName+"-"+wishlist[item].storeID === internalName+"-"+storeID) {
                wishlist.splice(item, 1);
                break;
            }
        }
        saveWish();
    }
    // Count whislist 
    obj.totalCount = function () {
        var totalCount = 0;
        for (var item in wishlist) {
            totalCount += wishlist[item].count;
        }
        return totalCount;
    }
    // check item is whislist
    obj.checkItem = function (internalName, storeID) {
        let result = false;
        for (var item in wishlist) {
            if (wishlist[item].internalName+"-"+wishlist[item].storeID === internalName+"-"+storeID) {
                result = true;                
            }
        }
        return result;
    }
    // favlist
    obj.favlist = function () {
        
        return wishlist;
    }
    // Clear Whishlist
    obj.clearfavlist = function () {
        wishlist = [];
        saveWish();
    }

    return obj;
})();

$("html").delegate(".fav", "click", function (event) {
    
    event.preventDefault();
    var name = $(this).parents(".card-content").find(".add-to-cart").data('name');
    var price = Number($(this).parents(".card-content").find(".add-to-cart").data('price'));
    var thumb = $(this).parents(".card-content").find(".add-to-cart").data('thumb');
    var internalName = $(this).parents(".card-content").find(".add-to-cart").data('internal');
    var storeID = $(this).parents(".card-content").find(".add-to-cart").data('storeid');
    
    if(!$(this).hasClass("active")){
        $(this).addClass("active");
        fav.addItemToWishlist(name, price, 1, thumb, internalName, storeID);
    }
    else {
        $(this).removeClass("active");
        fav.removeItemFromWhislist(internalName, storeID);
    }
    
    displayWishlist();
});

$("html").delegate(".delete-from-whislist", "click", function (event) {
    event.preventDefault();
    var internalName = $(this).data('internal');
    var storeID = $(this).data('storeid');
    var item = internalName+"-"+storeID;
    fav.removeItemFromWhislist(internalName, storeID);
    displayWishlist();
    $("[data-item="+item+"]").removeClass("active");
});

$("#clearWish").on("click",function(){
    fav.clearfavlist();
    $(".fav.active").removeClass("active");
    displayWishlist();
});

$('.fav-count').html(fav.totalCount());
displayWishlist();

$("[data-toggle=modal]").on("click",function(){
    var id = $(this).data("target");
    $(id).addClass("show");
    $(".modal-backdrop").addClass("show");
});
$("[data-dismiss=modal]").on("click",function(e){
    e.preventDefault();
    closeModal();
});

$(".modal").on("click",function(e){
    if($(e.target).hasClass("modal")){
        closeModal();
    }
    
});

function closeModal() {
    $(".modal").removeClass("show");
    $(".modal-backdrop").removeClass("show");
}

function displayWishlist() {
    var wishArray = fav.favlist();
   
    var output = "";
    for (var i in wishArray) {
       
        output += 
        `<div class="grid grid-cols-12 justify-items-center items-center gap-3 p-2 border-b-[1px]">
            <div class="col-span-1 lg:p-3">
                <a href="javascript:void(0);" class="delete-from-whislist" data-internal="${wishArray[i].internalName}" data-storeid="${wishArray[i].storeID}">
                    <i class="icon-close align-middle"></i>
                </a>
            </div>
            <div class="col-span-4 lg:col-span-3 lg:p-3">
            <span class="block text-[12px] leading-4 sm:text-[16px] sm:leading-6">${wishArray[i].name}</span>
            </div>
            <div class="lg:col-span-2 hidden lg:block">
                <div class="w-[100px] basis-[100px] mx-auto">
                    <div class="bg-no-repeat w-[100px] h-[100px] bg-center" style="background-image:url(${wishArray[i].image})"></div>
                </div>                                                
            </div>
            <div class="col-span-2 lg:col-span-2 lg:p-3 text-center">
                <span class="text-[#081F32] text-[20px] leading-[25px]">$${wishArray[i].price}</span>
            </div>
            <div class="col-span-5 lg:col-span-4 lg:p-3 text-center">
            <a href="#" class="add-to-cart text-white text-[14px] leading-[25px] tracking-[0.18em] rounded-[4px] bg-[#2ECC71] py-[9px] px-[29px]" data-name="${wishArray[i].name}" data-price="${wishArray[i].price}" data-thumb="${wishArray[i].image}" data-internal="${wishArray[i].internalName}" data-storeID="${wishArray[i].storeID}">Add to Cart</a>
            </div>
        </div>`
    }
    if(wishArray.length < 1){
        $('.fav-list').html("Listenizde hiç ürün bulunmuyor.");
    }
    else {
        $('.fav-list').html(output);
    }
    $('.fav-count').html(fav.totalCount());
}


/* gtm start */

// pageview
dataLayer.push({
    event: "page_view", 
    page_title: 'test',
    page_path: '/test',
    send_to: 'UA-102179747-7'
})

// product click
$("html").delegate(".card", "click", function (event) {

    var name = $(this).find('.add-to-cart').data('name');
    var price = $(this).find('.add-to-cart').data('price');
    
    dataLayer.push({
        'event': 'productClick',
        'ecommerce': {
            'click': {
                'products': [{
                    'name': name,             
                    'price':price
                }]
            }
        }
    });

});

// add to cart
$("html").delegate(".add-to-cart", "click", function (event) {

    var name = $(this).data('name');
    var price = $(this).data('price');

    dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
            'add': {                                
                'products': [{                        
                    'name': price,
                    'price': price,
                    'quantity': 1
                }]
            }
        }
    });

});

// 75 scroll
$(window).on('scroll', function () {
    var top = $(window).scrollTop(),
        dHeight = $(document).height(),
        wHeight = $(window).height();

    var scrollPercent = (top / (dHeight - wHeight)) * 100;
 
    if (scrollPercent < 75) {
        dataLayer.push({
            'event':'%75 Scroll', 
            'eventCategory':'Scroll Depth'
        });
    };

})
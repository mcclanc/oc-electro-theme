$(document).ready(function() {
    // Categories menu
    var nav_items = $("#navigation ul li");
    var title = $("title").text();
    var foundId = false;
    for (var i = 0, len = nav_items.length; i < len; i++) {
        var nav_item = nav_items[i];
        if ($(nav_item).data("id") == title) {
            $(nav_item).addClass("active");
            foundId = true;
        }

    }
    if (!foundId) {
        var metas = $('meta');
        var url;
        for (var i = 0, len = metas.length; i < len; i++) {
            if ($(metas[i]).attr('name') == 'electro') {
                url = $(metas[i]).attr('content');
                if (url === '' || url == undefined || url == null) {
                    $('#navigation ul #nav_home').addClass("active");
                }
            }
        }
    }


    // Search button
    $('#search-button').on('click', function(e) {
        e.preventDefault();

        var url = $('base').attr('href') + 'index.php?route=product/search';

        var value = $("#search-input").val();

        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }
        window.location = url;
    });
    $('#search-input').on('keydown', function(e) {
        if (e.keyCode == 13) {
            $('#search-button').trigger('click');
        }
    });
    $('.input-checkbox label').on('click', function(e) {
        window.location = $(e.target).parent().data("href");
    });

    $('#input-quantity').on('input', function(event) {
        $('.add-to-cart-btn').data({ 'quantity': $(event.target).val() });
    });
    var addToCartFn = function(event) {
        var id = $(event.target).data('product-id');
        var quantity = $(event.target).data('quantity');
        if (quantity == undefined) {
            quantity = $(event.target).parent().parent().find('#input-quantity').val();
        }
        var target = event.target;
        var elements = $(target).parents('.product-details,.product-layout').find("input[type=\'text\'],input[type=\'hidden\'],input[type=\'radio\']:checked,input[type=\'checkbox\']:checked,select,textarea");

        if (elements.length === 0) {

            var data = 'product_id=' + id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1);
        } else {
            var data = {
                //'option': []
            };
            for (var i = 0, len = elements.length; i < len; i++) {
                var el = elements[i];
                data['option[' + $(el).data('option-id') + "]"] = $(el).val();
            }
            data['product_id'] = id;
            data['quantity'] = quantity;
        }

        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: data,
            dataType: 'json',
            beforeSend: function() {},
            complete: function() {},
            success: function(json) {
                $('.alert-dismissible, .text-danger').remove();
                $('.form-group').removeClass('has-error');

                if (json['error']) {
                    if (json['error']['option']) {
                        for (i in json['error']['option']) {
                            var element = $('#input-option' + i.replace('_', '-'));

                            if (element.parent().hasClass('input-group')) {
                                element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
                            } else {
                                element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
                            }
                        }
                    }

                    if (json['error']['recurring']) {
                        $('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
                    }

                    // Highlight any found errors
                    $('.text-danger').parent().addClass('has-error');
                }

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {

                    $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');


                    // Need to set timeout otherwise it wont update the total
                    setTimeout(function() {
                        $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                    }, 100);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                } else {
                    $('#content').parent().before('<div class="alert alert-danger alert-dismissible"><i class="fa fa-check-circle"></i> Oops! Something is wrong. Maybe you have not set some options... Please, ensure that you have set all the required options on the page.<button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                }
                if (!json) {
                    $('#content').parent().before('<div class="alert alert-danger alert-dismissible"><i class="fa fa-check-circle"></i> No JSON <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                }
                return false;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return false;
    }
    $('.add-to-cart-btn').on('click', addToCartFn);

    // Mobile Nav toggle
    $('.menu-toggle > a').on('click', function(e) {
        e.preventDefault();
        $('#responsive-nav').toggleClass('active');
    })

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function(e) {
        e.stopPropagation();
    });

    // Products Slick

    // function product_slick_fn() {
    //     var $this = $(this),
    //         $nav = $this.attr('data-nav');

    // $this.slick({
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     infinite: true,
    //     speed: 300,
    //     dots: false,
    //     arrows: true,
    //     appendArrows: $nav ? $nav : false,
    //     responsive: [{
    //             breakpoint: 991,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             }
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             }
    //         },
    //     ]
    // });
    // }
    // $('.products-slick').each(product_slick_fn);

    // Products Widget Slick
    function products_widget_fn() {
        var $this = $(this),
            $nav = $this.attr('data-nav');

        $this.slick({
            infinite: true,
            autoplay: true,
            speed: 300,
            dots: false,
            arrows: true,
            appendArrows: $nav ? $nav : false,
        });
    }
    $('.products-widget-slick').each(products_widget_fn);

    // Product Main img Slick
    $('#product-main-img').slick({
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        fade: true,
        asNavFor: '#product-imgs',
    });




    // Product imgs Slick
    $('#product-imgs').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: 0,
        vertical: true,
        asNavFor: '#product-main-img',
        responsive: [{
            breakpoint: 991,
            settings: {
                vertical: false,
                arrows: false,
                dots: true,
            }
        }, ]
    });
    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
        $('#product-main-img .product-preview').zoom();
    }

});

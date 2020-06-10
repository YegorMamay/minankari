"use strict";

(function(w, d, $, ajax) {
    $(function() {
        console.info("The site developed by BRAIN WORKS digital agency");
        console.info("Сайт разработан маркетинговым агентством BRAIN WORKS");
        var $w = $(w);
        var $d = $(d);
        var html = $("html");
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            html.addClass("is-mobile");
        }
        html.removeClass("no-js").addClass("js");
        scrollToElement();
        sidebarAccordion();
        reviews(".js-reviews");
        scrollTop(".js-scroll-top");
        wrapHighlightedElements(".highlighted");
        if (ajax) {
            ajaxLoadMorePosts(".js-load-more", ".js-ajax-posts");
        }
        stickFooter(".js-footer", ".js-container");
        anotherHamburgerMenu(".js-menu", ".js-hamburger", ".js-menu-close");
        buyOneClick(".one-click", '[data-field-id="field7"]', "h1.page-name");
        relatedProductsSlider("#related-carousel");
        createTogglers(".toggler");
        filterTogglers(".bw-filters-group-container", ".bw-filters-group-header", ".bw-filters-group-content");
        clearUrlFromQueryParams([ "add-to-cart" ]);
        $d.on("copy", addLink);
        $w.on("resize", function() {
            if ($w.innerWidth() >= 630) {
                removeAllStyles($(".js-menu"));
            }
        });
        cartPanel(".cart-panel");
        $(".woocommerce-product-gallery__image div.zoom").hover(function() {
            var zoom = document.querySelector(".zoomImg");
            zoom.onclick = function() {
                return $(".wpgis-popup").click();
            };
        }, function() {
            var zoom = document.querySelector(".zoomImg");
            zoom.onclick = null;
        });
    });
    var stickFooter = function stickFooter(footer, container) {
        var previousHeight, currentHeight;
        var offset = 0;
        var $footer = $(footer);
        var $container = $(container);
        currentHeight = $footer.outerHeight() + offset + "px";
        previousHeight = currentHeight;
        $container.css("paddingBottom", currentHeight);
        $(window).on("resize", function() {
            currentHeight = $footer.outerHeight() + offset + "px";
            if (previousHeight !== currentHeight) {
                $container.css("paddingBottom", currentHeight);
            }
        });
    };
    var reviews = function reviews(container) {
        var element = $(container);
        if (element.children().length > 1 && typeof $.fn.slick === "function") {
            element.slick({
                adaptiveHeight: false,
                autoplay: false,
                autoplaySpeed: 3e3,
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev">&lsaquo;</button>',
                nextArrow: '<button type="button" class="slick-next">&rsaquo;</button>',
                dots: false,
                dotsClass: "slick-dots",
                draggable: true,
                fade: false,
                infinite: true,
                responsive: [ {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                } ],
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,
                swipe: true,
                zIndex: 10
            });
        }
    };
    var anotherHamburgerMenu = function anotherHamburgerMenu(menuElement, hamburgerElement, closeTrigger) {
        var Elements = {
            menu: $(menuElement),
            button: $(hamburgerElement),
            close: $(closeTrigger)
        };
        Elements.button.add(Elements.close).on("click", function() {
            Elements.menu.toggleClass("is-active");
        });
        Elements.menu.find("a").on("click", function() {
            Elements.menu.removeClass("is-active");
        });
        var arrowOpener = function arrowOpener(parent) {
            var activeArrowClass = "menu-item-has-children-arrow-active";
            return $("<button />").addClass("menu-item-has-children-arrow").on("click", function() {
                parent.children(".sub-menu").eq(0).slideToggle(300);
                if ($(this).hasClass(activeArrowClass)) {
                    $(this).removeClass(activeArrowClass);
                } else {
                    $(this).addClass(activeArrowClass);
                }
            });
        };
        var items = Elements.menu.find(".menu-item-has-children, .sub-menu-item-has-children");
        for (var i = 0; i < items.length; i++) {
            items.eq(i).append(arrowOpener(items.eq(i)));
        }
    };
    var removeAllStyles = function removeAllStyles(elementParent) {
        elementParent.find(".sub-menu").removeAttr("style");
    };
    var wrapHighlightedElements = function wrapHighlightedElements(elements) {
        elements = $(elements);
        var i, highlightedHeader;
        for (i = 0; i < elements.length; i++) {
            highlightedHeader = elements.eq(i);
            highlightedHeader.wrap('<div style="display: block;"></div>');
        }
    };
    var buyOneClick = function buyOneClick(button, field, headline) {
        var btn = $(button);
        if (btn.length) {
            btn.on("click", function() {
                $(field).prop("disabled", true).val($(headline).text());
            });
        }
    };
    var scrollTop = function scrollTop(element) {
        var el = $(element);
        el.on("click touchend", function() {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
            return false;
        });
        var scrollPosition;
        $(window).on("scroll", function() {
            scrollPosition = $(this).scrollTop();
            if (scrollPosition > 200) {
                if (!el.hasClass("is-visible")) {
                    el.addClass("is-visible");
                }
            } else {
                el.removeClass("is-visible");
            }
        });
    };
    var addLink = function addLink() {
        var body = document.body || document.getElementsByTagName("body")[0];
        var selection = window.getSelection();
        var page_link = "\n Источник: " + document.location.href;
        var copy_text = selection + page_link;
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "-9999px";
        body.appendChild(div);
        div.innerText = copy_text;
        selection.selectAllChildren(div);
        window.setTimeout(function() {
            body.removeChild(div);
        }, 0);
    };
    var scrollToElement = function scrollToElement() {
        var animationSpeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        var links = $("a");
        links.each(function(index, element) {
            var $element = $(element), href = $element.attr("href");
            if (href[0] === "#" || href[0] + href[1] === "/#") {
                var adaptiveHref = href[0] === "#" ? href : href.slice(1);
                var el = $(adaptiveHref);
                if (el.length) {
                    $element.on("click", function(e) {
                        e.preventDefault();
                        if (el.length) {
                            $("html, body").animate({
                                scrollTop: el.offset().top
                            }, animationSpeed);
                        }
                    });
                }
            }
        });
    };
    var sidebarAccordion = function sidebarAccordion() {
        var sidebarMenu = $(".sidebar .widget_nav_menu");
        var items = sidebarMenu.find("li");
        var subMenu = items.find(".sub-menu");
        if (subMenu.length) {
            subMenu.each(function(index, value) {
                $(value).parent().first().append('<i class="trigger"></i>');
            });
        }
        var classAction = "is-opened";
        var trigger = items.find(".trigger");
        trigger.on("click", function() {
            var el = $(this), parent = el.parent();
            if (parent.hasClass(classAction)) {
                parent.removeClass(classAction);
            } else {
                parent.addClass(classAction);
            }
        });
    };
    var relatedProductsSlider = function relatedProductsSlider(selector) {
        var element$ = $(selector);
        if (element$.length) {
            element$.slick({
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                prevArrow: $(".arrow-prev"),
                nextArrow: $(".arrow-next"),
                responsive: [ {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                } ]
            });
        }
    };
    var createTogglers = function createTogglers(selector) {
        $(selector).each(function(_, el) {
            var toggler$ = $(el);
            var link$ = toggler$.find("".concat(selector, "-link"));
            var content$ = toggler$.find("".concat(selector, "-content"));
            console.log(link$);
            link$.click(function(e) {
                e.preventDefault();
                content$.slideToggle(300);
                console.log(content$);
            });
        });
    };
    var ajaxLoadMorePosts = function ajaxLoadMorePosts(selector, container) {
        var btn = $(selector);
        var storage = $(container);
        if (!btn.length && !storage.length) return;
        var data, ajaxStart;
        data = {
            action: ajax.action,
            nonce: ajax.nonce,
            paged: 1
        };
        btn.on("click", function() {
            if (ajaxStart) return;
            ajaxStart = true;
            btn.addClass("is-loading");
            $.ajax({
                url: ajax.url,
                method: "POST",
                dataType: "json",
                data: data
            }).done(function(response) {
                var posts = response.data;
                storage.append(response.data);
                data.paged += 1;
                ajaxStart = false;
                btn.removeClass("is-loading");
                if (posts === "") {
                    btn.remove();
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                ajaxStart = false;
                throw new Error("Handling Ajax request loading posts has caused an ".concat(textStatus, " - ").concat(errorThrown));
            });
        });
    };
    var filterTogglers = function filterTogglers(container, heading, content) {
        $(container).each(function(_, el) {
            var container$ = $(el), heading$ = container$.find(heading), content$ = container$.find(content);
            heading$.on("click", function(e) {
                heading$.toggleClass("active");
                content$.slideToggle(400);
            });
        });
    };
    var cartPanel = function cartPanel(containerSelector) {
        var panel = $(containerSelector);
        var itemSelector = "".concat(containerSelector, "-product-item");
        var items = panel.find(itemSelector);
        var total = panel.find(".total-wrapper strong .price-point");
        var headerPrice = $(".cart-panel-wrapper .header-cart-price");
        var headerQty = $(".cart-panel-wrapper small");
        var updatePrice = function updatePrice(price, qty) {
            headerPrice.text(price);
            total.text(price);
            headerQty.text("(".concat(qty, ")"));
        };
        var countPrice = function countPrice(items) {
            return Array.from(items).map(function(item) {
                return +$(item).find("input[name=product-price]").val() * +$(item).find("input[name=quantity]").val();
            }).reduce(function(a, b) {
                return a + b;
            }, 0);
        };
        var countQty = function countQty(items) {
            return Array.from(items).map(function(item) {
                return +$(item).find("input[name=quantity]").val();
            }).reduce(function(a, b) {
                return a + b;
            }, 0);
        };
        items.each(function(index, element) {
            var el$ = $(element);
            var closeButton = el$.find(".close");
            var id = el$.find("input[name=product-id]").val();
            var key = el$.find("input[name=product-cart-item-key]").val();
            var price = +el$.find("input[name=product-price]").val();
            var qty$ = el$.find("input[name=quantity]");
            var decQty$ = el$.find(".quantity-inpute-decrease");
            var incQty$ = el$.find(".quantity-inpute-increase");
            var price$ = el$.find(".price span");
            closeButton.click(function() {
                updateQty(key, 0);
                el$.remove();
                items = panel.find(itemSelector);
                updatePrice(countPrice(items) || 0, countQty(items) || 0);
            });
            decQty$.click(function() {
                var val = +qty$.val() - 1;
                if (val <= 0) {
                    return;
                }
                updateQty(key, val);
                qty$.val(val);
                price$.text(price * val);
                updatePrice(countPrice(items), val);
            });
            incQty$.click(function() {
                var val = +qty$.val() + 1;
                if (val > 50) {
                    val = 50;
                }
                updateQty(key, val);
                qty$.val(val);
                price$.text(price * val);
                updatePrice(countPrice(items), val);
            });
        });
    };
    var updateQty = function updateQty(cart_item_key, qty) {
        return $.ajax({
            type: "POST",
            dataType: "json",
            url: "/wp-admin/admin-ajax.php",
            data: {
                action: "update_item_from_cart",
                cart_item_key: cart_item_key,
                qty: qty
            },
            success: function success(data) {
                if (data) {} else {}
            }
        });
    };
    var clearUrlFromQueryParams = function clearUrlFromQueryParams(queryParams) {
        var _location = location, search = _location.search;
        if (search) {
            var params = search.slice(1).split("&").map(function(param) {
                return param.split("=");
            }).filter(function(param) {
                return queryParams.indexOf(param[0]) === -1;
            }).map(function(param) {
                return param.join("=");
            }).join("&").trim();
            if (params) params = "?" + params;
            location.search = params;
        }
    };
})(window, document, jQuery, window.jpAjax);
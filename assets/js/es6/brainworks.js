"use strict";

((w, d, $, ajax) => {
  $(() => {
    console.info("The site developed by BRAIN WORKS digital agency");
    console.info("Сайт разработан маркетинговым агентством BRAIN WORKS");

    const $w = $(w);
    const $d = $(d);
    const html = $("html");
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

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
    // hamburgerMenu('.js-menu', '.js-hamburger', '.js-menu-close');
    anotherHamburgerMenu(".js-menu", ".js-hamburger", ".js-menu-close");
    buyOneClick(".one-click", '[data-field-id="field7"]', "h1.page-name");
    relatedProductsSlider("#related-carousel");
    createTogglers(".toggler");
    filterTogglers(
      ".bw-filters-group-container",
      ".bw-filters-group-header",
      ".bw-filters-group-content"
    );

    clearUrlFromQueryParams(["add-to-cart"]);

    // On Copy
    $d.on("copy", addLink);

    $w.on("resize", () => {
      if ($w.innerWidth() >= 630) {
        removeAllStyles($(".js-menu"));
      }
    });

    cartPanel(".cart-panel");

    $(".woocommerce-product-gallery__image div.zoom").hover(
      () => {
        var zoom = document.querySelector(".zoomImg");
        zoom.onclick = () => $(".wpgis-popup").click();
      },
      () => {
        var zoom = document.querySelector(".zoomImg");
        zoom.onclick = null;
      }
    );

    // $('.woocommerce-product-gallery__image div.zoom').on('mouseover', (e) => {
    //   console.log(e, 'over')
    // }).on('mouseout', e => {
    //   console.log(e, 'out')
    // })
  });

  /**
   * Stick Footer
   *
   * @example
   * stickFooter('.js-footer', '.js-wrapper');
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @param {(string|Object)} footer - footer element
   * @param {(string|Object)} container - container element
   * @returns {void}
   */
  const stickFooter = (footer, container) => {
    let previousHeight, currentHeight;

    const offset = 0;
    const $footer = $(footer);
    const $container = $(container);

    currentHeight = $footer.outerHeight() + offset + "px";
    previousHeight = currentHeight;

    $container.css("paddingBottom", currentHeight);

    $(window).on("resize", () => {
      currentHeight = $footer.outerHeight() + offset + "px";

      if (previousHeight !== currentHeight) {
        $container.css("paddingBottom", currentHeight);
      }
    });
  };

  /**
   * Reviews - Slick Slider
   *
   * @example
   * reviews('.js-reviews');
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @param {(string|Object)} container - reviews container
   * @returns {void}
   */
  const reviews = container => {
    const element = $(container);

    if (element.children().length > 1 && typeof $.fn.slick === "function") {
      element.slick({
        adaptiveHeight: false,
        autoplay: false,
        autoplaySpeed: 3000,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">&lsaquo;</button>',
        nextArrow: '<button type="button" class="slick-next">&rsaquo;</button>',
        dots: false,
        dotsClass: "slick-dots",
        draggable: true,
        fade: false,
        infinite: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ],
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 300,
        swipe: true,
        zIndex: 10
      });

      /*element.on('swipe', (slick, direction) => {
                console.log(slick, direction);
            });

            element.on('afterChange', (slick, currentSlide) => {
                console.log(slick, currentSlide);
            });

            element.on('beforeChange', (slick, currentSlide, nextSlide) => {
                console.log(slick, currentSlide, nextSlide);
            });*/
    }
  };

  /**
   * Hamburger Menu
   *
   * @example
   * hamburgerMenu('.js-menu', '.js-hamburger', '.js-menu-close');
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @param {(string|Object)} menuElement - Selected menu
   * @param {(string|Object)} hamburgerElement - Trigger element for open/close menu
   * @param {(string|Object)} closeTrigger - Trigger element for close opened menu
   * @returns {void}
   */
  /*const hamburgerMenu = (menuElement, hamburgerElement, closeTrigger) => {
        const menu = $(menuElement),
            close = $(closeTrigger),
            hamburger = $(hamburgerElement),
            menuAll = hamburger.add(menu);

        hamburger.add(close).on('click', () => {
            menu.toggleClass('is-active');
        });

        $(window).on('load', (event) => {
            if (document.location.hash !== '') {
                scrollToElement(document.location.hash);
            }
        });

        $(window).on('click', (e) => {
            if (!$(e.target).closest(menuAll).length) {
                menu.removeClass('is-active');
            }
        });
    };*/

  /**
   * Scroll to element
   *
   * @param {(string|Object)} elements Elements to add to handler
   * @returns {void}
   */
  /*const scrollHandlerForButton = (elements) => {
        elements = $(elements);

        let i, el;

        for (i = 0; i < elements.length; i++) {

            el = elements.eq(i);

            el.on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                scrollToElement($(e.target.hash), () => {
                    document.location.hash = e.target.hash;
                });
            });

        }
    };*/

  /**
   * Another Hamburger Menu
   *
   * @param {string} menuElement Selector or element
   * @param {string} hamburgerElement Selector or element
   * @param {string} closeTrigger Also selector or element
   * @returns {void}
   */
  const anotherHamburgerMenu = (
    menuElement,
    hamburgerElement,
    closeTrigger
  ) => {
    const Elements = {
      menu: $(menuElement),
      button: $(hamburgerElement),
      close: $(closeTrigger)
    };

    Elements.button.add(Elements.close).on("click", () => {
      Elements.menu.toggleClass("is-active");
    });

    Elements.menu.find("a").on("click", () => {
      Elements.menu.removeClass("is-active");
    });

    /**
     * Arrow Opener
     *
     * @param {Object} parent Selector or element
     * @returns {(Object)} jQuery element
     */
    const arrowOpener = function(parent) {
      const activeArrowClass = "menu-item-has-children-arrow-active";

      return $("<button />")
        .addClass("menu-item-has-children-arrow")
        .on("click", function() {
          parent
            .children(".sub-menu")
            .eq(0)
            .slideToggle(300);
          if ($(this).hasClass(activeArrowClass)) {
            $(this).removeClass(activeArrowClass);
          } else {
            $(this).addClass(activeArrowClass);
          }
        });
    };

    const items = Elements.menu.find(
      ".menu-item-has-children, .sub-menu-item-has-children"
    );

    for (let i = 0; i < items.length; i++) {
      items.eq(i).append(arrowOpener(items.eq(i)));
    }
  };

  /**
   * Remove All Styles from sub menu element
   *
   * @param {Object} elementParent selector or element
   * @returns {void}
   */
  const removeAllStyles = elementParent => {
    elementParent.find(".sub-menu").removeAttr("style");
  };

  /**
   * Wrap all highlighted elements in container
   *
   * @param {(string|Object)} elements selector or elements
   * @returns {void}
   */
  const wrapHighlightedElements = elements => {
    elements = $(elements);

    let i, highlightedHeader;

    for (i = 0; i < elements.length; i++) {
      highlightedHeader = elements.eq(i);

      highlightedHeader.wrap('<div style="display: block;"></div>');
    }
  };

  /**
   * Buy in one click
   *
   * @example
   * buyOneClick('.one-click', '[data-field-id="field7"]', 'h1.page-name');
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @param {(string|Object)} button - The selected button when clicking on which the form of purchase pops up
   * @param {(string|Object)} field - The selected field for writing the value (disabled field)
   * @param {(string|Object)} headline - The element from which we get the value to write to the field
   * @returns {void}
   */
  const buyOneClick = (button, field, headline) => {
    const btn = $(button);

    if (btn.length) {
      btn.on("click", () => {
        $(field)
          .prop("disabled", true)
          .val($(headline).text());
      });
    }
  };

  /**
   * Scroll Top
   *
   * @example
   * scrollTop('.js-scroll-top');
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @param {(string|Object)} element - Selected element
   * @returns {void}
   */
  const scrollTop = element => {
    const el = $(element);

    el.on("click touchend", () => {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });

    let scrollPosition;

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

  /**
   * Adding link to the site resource at copying
   *
   * @example
   * document.oncopy = addLink; or $(document).on('copy', addLink);
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @returns {void}
   */
  const addLink = () => {
    const body = document.body || document.getElementsByTagName("body")[0];
    const selection = window.getSelection();
    const page_link = "\n Источник: " + document.location.href;
    const copy_text = selection + page_link;
    const div = document.createElement("div");

    div.style.position = "absolute";
    div.style.left = "-9999px";

    body.appendChild(div);
    div.innerText = copy_text;

    selection.selectAllChildren(div);

    window.setTimeout(() => {
      body.removeChild(div);
    }, 0);
  };

  /**
   * Function to add scroll handler for all links with hash as first symbol of href
   *
   * @param {number} [animationSpeed=400] speed of animation
   * @returns {void}
   */
  const scrollToElement = (animationSpeed = 400) => {
    const links = $("a");
    links.each((index, element) => {
      const $element = $(element),
        href = $element.attr("href");
      if (href[0] === "#" || href[0] + href[1] === "/#") {
        const adaptiveHref = href[0] === "#" ? href : href.slice(1);
        const el = $(adaptiveHref);
        if (el.length) {
          $element.on("click", e => {
            e.preventDefault();
            if (el.length) {
              $("html, body").animate(
                {
                  scrollTop: el.offset().top
                },
                animationSpeed
              );
            }
          });
        }
      }
    });
  };

  /**
   * Sidebar Accordion
   *
   * @example
   * sidebarAccordion();
   *
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   *
   * @returns {void}
   */
  const sidebarAccordion = () => {
    const sidebarMenu = $(".sidebar .widget_nav_menu");
    const items = sidebarMenu.find("li");
    const subMenu = items.find(".sub-menu");

    if (subMenu.length) {
      subMenu.each(function(index, value) {
        $(value)
          .parent()
          .first()
          .append('<i class="trigger"></i>');
      });
    }

    const classAction = "is-opened";
    const trigger = items.find(".trigger");

    trigger.on("click", function() {
      const el = $(this),
        parent = el.parent();

      if (parent.hasClass(classAction)) {
        parent.removeClass(classAction);
      } else {
        parent.addClass(classAction);
      }
    });
  };

  const relatedProductsSlider = selector => {
    const element$ = $(selector);

    if (element$.length) {
      element$.slick({
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        prevArrow: $(".arrow-prev"),
        nextArrow: $(".arrow-next"),
        responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  };

  const createTogglers = selector => {
    $(selector).each((_, el) => {
      const toggler$ = $(el);
      const link$ = toggler$.find(`${selector}-link`);
      const content$ = toggler$.find(`${selector}-content`);
      console.log(link$);
      link$.click(e => {
        e.preventDefault();
        content$.slideToggle(300);
        console.log(content$);
      });
    });
  };

  /**
   * Ajax Load More Posts Handler
   *
   * @example
   * ajaxLoadMorePosts('.js-load-more', '.js-ajax-posts');
   * @author Fedor Kudinov <brothersrabbits@mail.ru>
   * @param {string} selector - Element for event handler (send ajax)
   * @param {string} container - The container to which the html markup will be added
   * @returns {void}
   */
  const ajaxLoadMorePosts = (selector, container) => {
    const btn = $(selector);
    const storage = $(container);

    if (!btn.length && !storage.length) return;

    let data, ajaxStart;

    data = {
      action: ajax.action,
      nonce: ajax.nonce,
      paged: 1
    };

    btn.on("click", () => {
      if (ajaxStart) return;

      ajaxStart = true;

      btn.addClass("is-loading");

      $.ajax({
        url: ajax.url,
        method: "POST",
        dataType: "json",
        data: data
      })
        .done(response => {
          const posts = response.data;
          storage.append(response.data);

          data.paged += 1;

          ajaxStart = false;

          btn.removeClass("is-loading");

          if (posts === "") {
            btn.remove();
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          ajaxStart = false;
          throw new Error(
            `Handling Ajax request loading posts has caused an ${textStatus} - ${errorThrown}`
          );
        });
    });
  };

  const filterTogglers = (container, heading, content) => {
    $(container).each((_, el) => {
      const container$ = $(el),
        heading$ = container$.find(heading),
        content$ = container$.find(content);

      heading$.on("click", e => {
        heading$.toggleClass("active");

        content$.slideToggle(400);
      });
    });
  };

  const cartPanel = containerSelector => {
    let panel = $(containerSelector);
    let itemSelector = `${containerSelector}-product-item`;
    let items = panel.find(itemSelector);
    let total = panel.find(".total-wrapper strong .price-point");
    let headerPrice = $(".cart-panel-wrapper .header-cart-price");
    let headerQty = $(".cart-panel-wrapper small");

    const updatePrice = (price, qty) => {
      headerPrice.text(price);
      total.text(price);
      headerQty.text(`(${qty})`);
    };

    const countPrice = items =>
      Array.from(items)
        .map(
          item =>
            +$(item)
              .find("input[name=product-price]")
              .val() *
            +$(item)
              .find("input[name=quantity]")
              .val()
        )
        .reduce((a, b) => a + b, 0);

    const countQty = items =>
      Array.from(items)
        .map(
          item =>
            +$(item)
              .find("input[name=quantity]")
              .val()
        )
        .reduce((a, b) => a + b, 0);

    items.each((index, element) => {
      const el$ = $(element);
      const closeButton = el$.find(".close");
      const id = el$.find("input[name=product-id]").val();
      const key = el$.find("input[name=product-cart-item-key]").val();
      const price = +el$.find("input[name=product-price]").val();

      const qty$ = el$.find("input[name=quantity]");
      const decQty$ = el$.find(".quantity-inpute-decrease");
      const incQty$ = el$.find(".quantity-inpute-increase");
      const price$ = el$.find(".price span");

      closeButton.click(() => {
        updateQty(key, 0);
        el$.remove();
        items = panel.find(itemSelector);
        updatePrice(countPrice(items) || 0, countQty(items) || 0);
      });

      decQty$.click(() => {
        let val = +qty$.val() - 1;
        if (val <= 0) {
          return;
        }
        updateQty(key, val);
        qty$.val(val);
        price$.text(price * val);
        updatePrice(countPrice(items), val);
      });

      incQty$.click(() => {
        let val = +qty$.val() + 1;
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

  const updateQty = (cart_item_key, qty) =>
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/wp-admin/admin-ajax.php",
      data: {
        action: "update_item_from_cart",
        cart_item_key: cart_item_key,
        qty: qty
      },
      success: function(data) {
        if (data) {
        } else {
        }
      }
    });

  const clearUrlFromQueryParams = queryParams => {
    const { search } = location;
    if (search) {
      let params = search
        .slice(1)
        .split("&")
        .map(param => param.split("="))
        .filter(param => queryParams.indexOf(param[0]) === -1)
        .map(param => param.join("="))
        .join("&")
        .trim();
      if (params) params = "?" + params;
      // location.search = params;
    }
  };
})(window, document, jQuery, window.jpAjax);

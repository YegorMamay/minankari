<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="<?php bloginfo('name'); ?> - <?php bloginfo('description'); ?>">
    <link rel="shortcut icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/img/favicon.ico'); ?>" type="image/x-icon">
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/img/favicon.ico'); ?>" type="image/x-icon">
    <?php wp_head(); ?>
    <script>
        window.$ = jQuery;
    </script>
</head>

<body <?php body_class(); ?> id="top">

    <?php wp_body_open(); ?>
    <div class="wrapper js-container">
        <!--Do not delete!-->
        <!-- <div class="pre-header container">
        <?php echo do_shortcode('[bw-phone]'); ?>

        <?php
        $address = get_theme_mod('bw_additional_address');
        if (!empty($address)) { ?>
                <span>
                    <i class="fas fa-map-marker-alt"></i>
                    <?php echo esc_html($address); ?>
                </span>
        <?php } ?>

        <?php
        $email = get_theme_mod('bw_additional_email');
        if (!empty($email)) { ?>
            <a href="mailto:<?php echo esc_attr($email); ?>">
                <i class="fas fa-envelope" aria-hidden="true"></i>
                <?php echo esc_html($email); ?>
            </a>
        <?php } ?>

        <?php echo do_shortcode('[bw-social]'); ?>

        

        <div class="woo-cart">
            <i class="far fa-shopping-cart"></i>
            <?php if (class_exists('WooCommerce')) woocommerce_cart() ?>
        </div>
    </div> -->

        <header class="page-header">
            <div class="container">
                <button class="js-hamburger hamburger">
                    <i class="fal fa-bars"></i>
                </button>
                <div class="row">
                    <div class="col-md-2 col-xs-12 header-col">
                        <div class="header-logo">
                            <?php
                            get_default_logo_link([
                                'name'    => 'logo.jpg',
                                'options' => [
                                    'class'  => 'logo-img',
                                    'width'  => 175,
                                    'height' => 'auto',
                                ],
                            ]);
                            ?>
                        </div>
                    </div>
                    <div class="col-lg-1 hidden-md"></div>
                    <div class="col-md-3 col-xs-6 stretch header-col">
                        <div class="phone">
                            <i class="fal fa-phone"></i>
                            <?php
                            $phones = get_phones();
                            if (sizeof($phones) > 0) {
                                $phone = $phones[0];
                            ?>
                                <a href="tel:<?php the_phone_number(strip_tags($phone)); ?>">
                                    <?php echo $phone; ?>
                                </a>
                            <?php
                            }
                            ?>

                        </div>
                        <div class="search">
                            <form role="search" method="get" id="searchform" action="<?php echo esc_url(home_url('/')); ?>">
                                <i class="fal fa-search"></i>
                                <input placeholder="<?php _e('Поиск...', 'brainworks'); ?>" name="s" id="s" value="<?php echo get_search_query(); ?>" />
                            </form>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-12 text-right stretch header-col">
                        <div class="menu">
                            <div class="menu-wrapper js-menu">
                                <?php wp_nav_menu(array(
                                    'theme_location' => 'main-nav',
                                    'container' => false,
                                    'menu_class' => 'menu-container',
                                    'menu_id' => '',
                                    'fallback_cb' => 'wp_page_menu',
                                    'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                                    'depth' => 3
                                )); ?>
                            </div>
                            <?php if (function_exists('pll_the_languages')) { ?>
                                <div class="menu-languages">
                                    <span>
                                        <?php echo pll_current_language('name'); ?>
                                    </span>
                                    <ul class="lang">
                                        <?php
                                        $languages = pll_the_languages(['raw' => 1, 'hide_current' => 1]);
                                        foreach ($languages as $lang) {
                                        ?>
                                            <li>
                                                <a href="<?php echo $lang['url'] ?>"><?php echo $lang['name'] ?></a>
                                            </li>
                                        <?php
                                        }
                                        ?>
                                    </ul>
                                </div>
                            <?php } ?>
                        </div>
                        <div class="circle-controls">
                            <a href="/my-account">
                                <i class="fal fa-user"></i>
                                <p>
                                    <span>
                                        <?php _e('Личный кабинет', 'brainworks'); ?>
                                    </span>
                                </p>
                            </a>
                            <div class="cart-panel-wrapper">
                                <a href="/cart">
                                    <i class="fal fa-shopping-cart"></i>
                                    <p>
                                        <span>
                                            <?php _e('Корзина', 'brainworks'); ?> <small>(<?php echo WC()->cart->get_cart_contents_count() ?>)</small>
                                        </span>
                                        <span class="big"><strong class="header-cart-price">
                                                <?php echo intval(WC()->cart->total); ?>
                                            </strong> <?php echo get_woocommerce_currency_symbol(); ?></span>
                                    </p>
                                </a>
                                <div class="cart-panel">
                                    <?php
                                    global $woocommerce;
                                    $items = $woocommerce->cart->get_cart();
                                    $price = 0;
                                    ?>
                                    <div class="card-panel-header">
                                        <h4><?php _e("Корзина", "brainworks"); ?></h4>
                                    </div>
                                    <div class="card-panel-body">
                                        <?php foreach ($items as $item) {
                                            $_product =  wc_get_product($item['data']->get_id());
                                            $terms = get_the_terms($_product->get_id(), 'product_cat');
                                            $links = [];
                                            $price += $item['quantity'] * $_product->get_price();
                                            foreach ($terms as $term) {
                                                // $links[] = '<a href="'.get_term_link($term).'">'.$term->name.'</a>';
                                            }
                                        ?>
                                            <div class="cart-panel-product-item">
                                                <input type="hidden" name="product-id" value="<?php echo $_product->get_id(); ?>" />
                                                <input type="hidden" name="product-price" value="<?php echo $_product->get_price(); ?>" />
                                                <input type="hidden" name="product-cart-item-key" value="<?php echo $item['key']; ?>" />
                                                <div class="image-wrapper">
                                                    <img src="<?php echo get_the_post_thumbnail_url($_product->get_id()); ?>" alt="" title="" />
                                                </div>
                                                <div class="data-wrapper">
                                                    <button type="button" class="close">&times;</button>
                                                    <h5><?php echo $_product->get_title(); ?></h5>
                                                    <p>
                                                        <?php echo implode(', ', $links); ?>
                                                    </p>
                                                    <div class="price-wrapper">
                                                        <div class="quantity-input">
                                                            <button type="button" class="quantity-inpute-decrease"><i class="fal fa-minus"></i></button>
                                                            <input type="number" name="quantity" value="<?php echo $item['quantity']; ?>" />
                                                            <button type="button" class="quantity-inpute-increase"><i class="fal fa-plus"></i></button>
                                                        </div>
                                                        <div class="price">
                                                            <span><?php echo $item['quantity'] * $_product->get_price(); ?></span> <?php echo get_woocommerce_currency_symbol(); ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php
                                        } ?>

                                        <div class="total-wrapper">
                                            <span><?php _e("Всего", "brainworks"); ?>:</span>
                                            <strong>
                                                <span class="price-point"><?php echo $price ?></span>
                                                <?php echo get_woocommerce_currency_symbol() ?>
                                            </strong>
                                        </div>

                                        <div class="button-wrapper">
                                            <a href="/checkout">
                                                <?php _e("Оформить заказ", "brainworks"); ?>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="categories-list">
            <div class="container">
                <ul>
                    <?php $categories = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 100]);
                    foreach ($categories as $cat) {
                        $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                        $image = wp_get_attachment_url($thumbnail_id);
                        if ($image) {
                    ?>
                            <li>
                                <a href="<?php echo get_term_link($cat, 'product_cat') ?>">
                                    <img src="<?php echo $image; ?>" alt="" title="" />
                                    <span><?php echo $cat->name ?></span>
                                </a>
                            </li>
                    <?php
                        }
                    } ?>

                    <li>
                        <a href="/shop?on_sale=1">
                            <img src="<?php echo get_template_directory_uri() ?>/assets/svg/menu/sale.svg" alt="">
                            <span><?php _e("Распродажа", "brainworks"); ?></span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- <?php if (has_nav_menu('main-nav')) { ?>
            <nav class="nav js-menu">
                <button type="button" tabindex="0" class="menu-item-close menu-close js-menu-close"></button>
                
            </nav>
        <?php } ?> -->

        <!-- <div class="nav-mobile-header">
        <button class="hamburger js-hamburger" type="button" tabindex="0">
        <span class="hamburger-box">
            <span class="hamburger-inner"></span>
        </span>
        </button>
        <div class="logo"><?php get_default_logo_link(); ?></div>
    </div> -->
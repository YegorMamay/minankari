<?php

/**
 * Template Name: Home Page
 **/
?>

<?php get_header(); ?>

<?php _layerslider(1); ?>

<section class="block">
    <div class="container">
        <h2 class="block__title">
            <?php _e("Новые поступления", "brainworks   "); ?>
            <a href="/shop">
                <?php _e('показать больше'); ?>
                <i class="fal fa-long-arrow-right"></i>
            </a>
        </h2>

        <div class="row products-row">
            <?php foreach (get_last_added_products() as $product) the_product_card($product); ?>
        </div>
    </div>
</section>

<section class="block">
    <div class="container">
        <h2 class="block__title">
            <?php _e("Акционный товар", "brainworks"); ?>
            <a href="/shop?on_sale=1">
                <?php _e('все акции'); ?>
                <i class="fal fa-long-arrow-right"></i>
            </a>
        </h2>

        <div class="row products-row">
            <?php foreach (get_products_on_sale() as $product) the_product_card($product); ?>
        </div>
    </div>
</section>

<section class="block">
    <div class="container">
        <div class="about-grid">
            <div class="col">
                <div class="image">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/blocks/calendar.svg" alt="" title="" />
                </div>
                <span><?php _e('На рынке с 2005 года', 'brainworks'); ?></span>
            </div>
            <div class="col">
                <div class="image">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/blocks/original-product.svg" alt="" title="" />
                </div>
                <span><?php _e('Оригинальный товар', 'brainworks'); ?></span>
            </div>
            <div class="col">
                <div class="image big">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/blocks/map.svg" alt="" title="" />
                </div>
                <span><?php _e('100% грузинское качество', 'brainworks'); ?></span>
            </div>
            <div class="col">
                <div class="image">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/blocks/delivery.svg" alt="" title="" />
                </div>
                <span><?php _e('Доставка точно в срок', 'brainworks'); ?></span>
            </div>
            <div class="col">
                <div class="image">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/blocks/best-prices.svg" alt="" title="" />
                </div>
                <span><?php _e('Лучшие цены на рынке', 'brainworks'); ?></span>
            </div>
        </div>
    </div>
</section>

<section class="block">
    <div class="container">
        <h2 class="block__title"><?php _e('Новости', 'brainworks'); ?> <a href="/blog"><?php _e('Все новости', 'brainworks'); ?> <i class="fal fa-long-arrow-right"></i></a></h2>
        <div class="sp-xs-3"></div>
        <?php
        $posts_query = new WP_Query(['posts_per_page' => 3, 'post_status' => 'publish']);
        $first_post = $posts_query->posts[0];
        $aside_posts = [];
        if (sizeof($posts_query->posts) > 1) {
            $aside_posts = array_slice($posts_query->posts, 1);
        }
        ?>
        <div class="row">
            <div class="col-md-5 col-xs-12">
                <a href="<?php echo get_the_permalink($first_post->ID) ?>" class="news-item">
                    <div class="image">
                        <img src="<?php echo get_the_post_thumbnail_url($first_post->ID, 'large'); ?>" alt="">
                    </div>
                    <h4>
                        <?php echo $first_post->post_title; ?>
                    </h4>
                    <span class="time">
                        <i class="fal fa-clock"></i>
                        4 октября
                    </span>
                </a>
            </div>
            <div class="col-md-7 col-xs-12">
                <?php foreach ($aside_posts as $aside_post) {
                    ?>
                    <a href="<?php echo get_the_permalink($aside_post->ID) ?>" class="news-item in-row">
                        <div class="image">
                            <img src="<?php echo get_the_post_thumbnail_url($first_post->ID, 'medium'); ?>" alt="">
                        </div>
                        <div class="info">
                            <h4>
                                <?php echo $aside_post->post_title; ?>
                            </h4>
                            <span class="time">
                                <i class="fal fa-clock"></i>
                                4 октября
                            </span>
                        </div>
                    </a>
                <?php
                } ?>
            </div>
        </div>
    </div>
</section>

<section id="section" class="block home-about">
    <div class="container">
        <h2 class="block__title block__title--no-styling">
            <?php _e('О «Minanakari»', 'brainworks'); ?>
        </h2>
        <div class="row">
            <div class="col-md-6">
                <?php echo do_shortcode(get_post_meta(get_the_ID(), 'about-left', true)); ?>
            </div>
            <div class="col-md-6">
                <?php echo do_shortcode(get_post_meta(get_the_ID(), 'about-right', true)); ?>
                <div class="sp-xs-3"></div>
                <?php echo do_shortcode('[signature]'); ?>
            </div>
        </div>
        <?php get_template_part('loops/content', 'home'); ?>
    </div>
</section>

<?php get_footer(); ?>
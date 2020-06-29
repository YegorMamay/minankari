<?php
global $product;
$product = wc_get_product(get_the_ID());
?>
<div class="sp-xs-2"></div>
<?php if (function_exists('kama_breadcrumbs')) kama_breadcrumbs(' / '); ?>
<div class="sp-xs-4"></div>
<div class="bw-product">
    <div class="row">
        <div class="col-md-5">
            <?php
            $attachmentIds = $product->get_gallery_image_ids();
            $images_count = count($attachmentIds) + 1;
            if ($images_count == 1) echo '<div class="disable-left-gallery">';
            do_action('woocommerce_before_single_product_summary');
            if ($images_count == 1) echo '</div>';
            ?>
        </div>
        <div class="col-md-3">
            <h2>
                <?php the_title(); ?>
            </h2>
            <span class="in-stock">
                <?php $product->is_in_stock() ? _e('В наличии', 'brainworks') : _e('Нет в наличии', 'brainworks'); ?>
            </span>
            <?php
            $attributes = $product->get_attributes();
            ?>
            <ul class="attributes">
                <li>
                    <span class="name">
                        <?php _e('Код', 'brainworks'); ?>:
                    </span>
                    <span class="value">
                        <?php echo $product->get_sku(); ?>
                    </span>
                </li>
                <?php foreach ($attributes as $key => $attr) {
                ?>
                    <li>
                        <span class="name">
                            <?php echo wc_attribute_label($key); ?>
                        </span>
                        <span class="value">
                            <?php echo implode(array_map(function ($term) {
                                return $term->name;
                            }, wc_get_product_terms($post->ID, $key, 'names'))); ?>
                        </span>
                    </li>
                <?php
                } ?>
            </ul>
            <?php 
                $tags = wp_get_post_terms( $post->ID, 'product_tag' );
                if (sizeof($tags) > 0) {
                    $html_tags = [];
                    foreach ($tags as $tag) {
                        $html_tags[] = sprintf('<a href="%s">%s</a>', get_term_link($tag->term_id), $tag->name);
                    }
                    echo '<div class="product-tags">'.implode($html_tags, ',    ').'</div>';
                }
            ?>
            <span class="price">
                <?php echo $product->get_price(); ?> <?php echo get_woocommerce_currency_symbol(); ?>
            </span>
            <form class="cart single-product" method="post" enctype='multipart/form-data'>
                <?php do_action('woocommerce_before_add_to_cart_button'); ?>
                <input type="hidden" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" />
                <button type="submit" class="single_add_to_cart_button button alt cart-buttton add-to-cart"><?php _e('Купить', 'brainworks'); ?></button>
                <?php do_action('woocommerce_after_add_to_cart_button'); ?>
            </form>
            <p class="description">
                <?php echo $post->post_content; ?>
            </p>
        </div>
        <div class="col-md-4">
            <ul class="delivery-list">
                <li>
                    <span class="icon"> <img src="<?php echo get_template_directory_uri() ?>/assets/svg/product/delivery-car.svg" alt=""> </span>
                    <h4><?php _e('Доставка', 'brainworks'); ?></h4>
                    <p>
                        <span><?php _e('Новая почта (отделение):', 'brainworks'); ?></span> <br>
                        <?php _e('Бесплатно. Вы оплачиваете только стоимость товара.', 'brainworks'); ?><br>
                        <span><?php _e('Курьером (по Украине)', 'brainworks'); ?></span><br>
                        <?php _e('Более 1 000 грн.: Бесплатно', 'brainworks'); ?><br>
                        <span><?php _e('Курьером (по Украине)', 'brainworks'); ?></span><br>
                        <?php _e('В любом из 380 магазинов сети', 'brainworks'); ?><br>
                        <span><?php _e('Бронь на 2 дня', 'brainworks'); ?></span> - <?php _e('Бесплатно', 'brainworks'); ?>.<br>
                        <span><?php _e('Сроки доставки', 'brainworks'); ?></span> 1-5 дней<br>
                    </p>
                </li>
                <li>
                    <span class="icon"> <img src="<?php echo get_template_directory_uri() ?>/assets/svg/product/payment.svg" alt=""> </span>
                    <h4><?php _e('Оплата', 'brainworks'); ?></h4>
                    <p>
                        - <?php _e('Наличными при получении', 'brainworks'); ?><br>
                        - <?php _e('Оплата платежной картой VISA/Mastercard', 'brainworks'); ?><br>
                        - <?php _e('На Новой Почте', 'brainworks'); ?>
                    </p>
                </li>
                <li>
                    <span class="icon"> <img src="<?php echo get_template_directory_uri() ?>/assets/svg/product/warranty.svg" alt=""> </span>
                    <h4><?php _e('Гарантия', 'brainworks'); ?></h4>
                    <p>
                        <?php _e('Обмен и возврат в течении 14 дней', 'brainworks'); ?>
                    </p>
                </li>
            </ul>
        </div>
    </div>
</div>

<section class="block block--offset">
    <div class="container">
        <h2 class="block__title">
            <?php _e('Похожие товары', 'brainworks'); ?>
            <div class="arrows">
                <button class="arrow-prev">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/product/arrow-left.svg">
                </button>

                <button class="arrow-next">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/svg/product/arrow-right.svg">
                </button>
            </div>
        </h2>

        <div id="related-carousel">
            <?php
            $related_products_ids = wc_get_related_products($product->get_id(), 10, $product->get_upsell_ids());
            foreach ($related_products_ids as $id) {
                $related_product = wc_get_product($id);
                the_product_card($related_product);
            }
            ?>
        </div>
    </div>
</section>
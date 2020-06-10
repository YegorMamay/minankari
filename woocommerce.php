<?php get_header(); ?>

<?php if (is_category() || is_tax() || is_shop()) {
    wc_get_template_part('archive-product');
} else {
    ?>
    <div class="container">
        <?php if (is_single()) {
                wc_get_template_part('single-product');
            } else {
                woocommerce_content();
            } ?>
    </div><!-- /.container -->

<?php
} ?>


<?php get_footer(); ?>
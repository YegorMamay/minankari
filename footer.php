<footer class="footer js-footer">
    <div class="footer-content container">
        <div class="row">
            <div class="col-md-3">
                <div class="logo">
                    <?php
                    get_default_logo_link([
                        'name'    => 'logo.jpg',
                        'options' => [
                            'class'  => 'logo-img',
                            'width'  => 175,
                            'height' => 'auto',
                        ],
                    ]); ?>
                </div>
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
                <?php
                $email = get_theme_mod('bw_additional_email');
                if ($email) {
                    ?>
                    <div class="email">
                        <a href="mailto:<?php echo $email ?>">
                            <?php echo $email; ?>
                        </a>
                    </div>
                <?php
                }
                ?>

                <?php
                $schedule = get_theme_mod('bw_additional_work_schedule');
                if ($schedule) {
                    ?>
                    <div class="schedule">
                        <p>
                            <?php echo $schedule; ?>
                        </p>
                    </div>
                <?php
                }
                ?>
            </div>
            <div class="col-md-3">
                <h4><?php _e('Информация', 'brainworks'); ?></h4>
                <div class="footer-categories-list one-column">
                    <ul>
                        <?php $items = wp_get_nav_menu_items('footer-menu');
                        if ($items) {
                            foreach ($items as $item) { ?>
                                <li>
                                    <a href="<?php echo $item->url; ?>">
                                        <?php echo $item->title ?>
                                    </a>
                                </li>
                        <?php }
                        } ?>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <h4><?php _e('Каталог', 'brainworks'); ?></h4>
                <div class="footer-categories-list">
                    <ul>
                        <?php $categories = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 100]);
                        foreach ($categories as $cat) {
                            ?>
                            <li>
                                <a href="<?php echo get_term_link($cat, 'product_cat') ?>">
                                    <?php echo $cat->name ?>
                                </a>
                            </li>
                        <?php
                        } ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="copyright">
            <div class="col">
                <p>
                    © «Minankari» <?php echo date('Y'); ?>. <?php _e('Все права защищены', 'brainworks'); ?>
                </p>
            </div>
            <div class="col">
                <ul class="footer-social">
                    <li>
                        <span><?php _e('Мы в соцсетях:', 'brainworks'); ?></span>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</footer>

</div><!-- .wrapper end Do not delete! -->

<?php scroll_top(); ?>

<div class="is-hide"><?php svg_sprite(); ?></div>

<?php wp_footer(); ?>

</body>

</html>
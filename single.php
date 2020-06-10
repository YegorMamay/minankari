<?php get_header(); ?>

<div class="container">
<div class="row">
    <div class="col-12 col-sm-12 col-md-12 col-lg-12 single-content">
        <?php if (!is_front_page() && function_exists('kama_breadcrumbs')) kama_breadcrumbs(' / '); ?>
        <?php get_template_part('loops/content', 'single'); ?>
    </div>
</div><!-- /.row -->
</div><!-- /.container -->

<?php get_footer(); ?>

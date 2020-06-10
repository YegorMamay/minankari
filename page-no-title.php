<?php
/**
 * Template Name: Page Without Title
 **/
?>

<?php get_header(); ?>
<div class="container">

<?php if (have_posts()): while (have_posts()): the_post(); ?>
    <?php if (function_exists('kama_breadcrumbs')) kama_breadcrumbs(' / '); ?>

    <?php the_content() ?>
    <?php wp_link_pages(); ?>

<?php endwhile;
else: ?>
    <?php get_template_part('loops/content', 'none'); ?>
<?php endif; ?>

</div><!-- /.container -->
<?php get_footer(); ?>

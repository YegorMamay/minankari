<?php
/**
 * Template Name: Sitemap Page
 * Template Post Type: page
 **/
?>

<?php get_header(); ?>

<div class="sp-xs-2"></div>

<div class="container">
<div class="row">
    <div class="col-12 col-md-12">
        <?php if (!is_front_page() && function_exists('kama_breadcrumbs')) kama_breadcrumbs(' / '); ?>

        <?php if (have_posts()): while (have_posts()): the_post(); ?>
            <article id="post_<?php the_ID() ?>" <?php post_class() ?>>
                <h1 class="page-name"><?php the_title(); ?></h1>
                <?php the_content() ?>
            </article>
        <?php endwhile; ?>

        <?php else : ?>
            <article id="post_<?php the_ID() ?>" <?php post_class() ?>>
                <h1 class="page-name"><?php the_title(); ?></h1>
                <?php echo do_shortcode('[bw-html-sitemap]'); ?>
            </article>
        <?php endif; ?>
    </div>
</div><!-- /.row -->
</div><!-- /.container -->

<?php get_footer(); ?>

<?php get_header(); ?>
<div class="container">

<div class="sp-xs-2"></div>
<h1><?php _e('Search Results for', 'brainworks'); ?> &ldquo;<?php the_search_query(); ?>&rdquo;</h1>

<div class="sp-xs-1"></div>
<hr/>
<div class="sp-xs-1"></div>

<?php get_template_part('loops/content', 'search'); ?>

</div><!-- /.container -->
<?php get_footer(); ?>

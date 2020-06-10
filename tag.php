<?php get_header(); ?>
<div class="container">

<?php if (function_exists('kama_breadcrumbs')) kama_breadcrumbs(' / '); ?>

<h1><?php _e('Tag', 'brainworks'); ?>: <?php echo single_tag_title(); ?></h1>

<div class="sp-xs-2"></div>
<hr>
<div class="sp-xs-2"></div>

<?php get_template_part('loops/content', get_post_format()); ?>

<?php get_footer(); ?>


<?php get_header(); ?>
<div class="container">

<div class="page-404">
  <div class="contain">
    <div class="message">
        <h1 class="text-center"><?php _e('Error', 'brainworks'); ?> 404</h1>
        <p class="text-center"><?php _e('The page you were looking for does not exist.', 'brainworks'); ?></p>
    </div>

    <div class="btn-to-home">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-secondary btn-block btn-lg">
            <?php _e('Back to the homepage', 'brainworks'); ?>
        </a>
    </div>

    <div class="search-form">
        <h5 class="text-center"><?php _e('Or use search', 'brainworks'); ?></h5>
        <?php get_search_form(); ?>
    </div>
  </div>
</div>

</div>
<?php get_footer(); ?>

<?php
$post = $wp_query->get_queried_object();
?>
<div class="bw-container">
    <?php
    if (function_exists('kama_breadcrumbs') && !is_shop()) {
        kama_breadcrumbs(' / ', [], []);
    } else { ?>
        <div class="kama_breadcrumbs">
            <span>
                <a href="/">
                </a>
            </span>
            <span class="kb_sep"> / </span>
            <span>
                <?php _e("Магазин", "brainworks") ?>
            </span>
        </div>
    <?php }
    ?>
    <div id="bwpf"></div>
</div>
<script>
    window._BRAINWORKS_CONFIG_ = {
        Category: "<?php echo is_tax() || is_category() ? $post->term_id : '' ?>",
        PageHeader: "<?php echo is_shop() ? __('Магазин', "brainworks") : $post->name; ?>",
        PageDescription: "<?php echo is_shop() ? '' : $post->description  ?>",
        OnSale: Boolean("<?php echo isset($_GET["on_sale"]) ? 1 : '' ?>"),
        DisableFilter: true
    };
</script>
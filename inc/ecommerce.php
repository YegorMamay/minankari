<?php

if ( defined( 'WC_ABSPATH' ) ) {
    // WC 3.6+ - Cart and notice functions are not included during a REST request.
    include_once WC_ABSPATH . 'includes/wc-cart-functions.php';
    include_once WC_ABSPATH . 'includes/wc-notice-functions.php';
}

class Brainworks_DTO_Product
{
    function __construct(WP_Post $post)
    {
        $this->Title = $post->post_title;
        $this->Id = $post->ID;

        $this->set_price();

        $this->set_permalink();

        $this->set_attributes();

        $this->set_picture();

        $this->set_category();
    }

    public function set_price()
    {
        $this->RegularPrice = get_post_meta($this->Id, '_regular_price', true);
        $this->SalePrice = get_post_meta($this->Id, '_sale_price', true);
    }

    public function set_permalink()
    {
        $this->Permalink = get_the_permalink($this->Id);
    }

    public function set_attributes()
    {
        $self_attrs = [];
        $attrs = wc_get_product($this->Id)->get_attributes();
        foreach ($attrs as $key => $attr) {
            $options = [];
            foreach ($attr['options'] as $id) {
                $terms = get_terms($key, $id);

                if (!isset($terms->errors)) {
                    $options[] = $terms[0]->name;
                }
            }
            if (sizeof($options) > 0) {
                $self_attrs[$key] = $options;
            }
        }
        $this->Attributes = $self_attrs;
    }

    public function set_picture()
    {
        $this->PictureUrl = get_the_post_thumbnail_url($this->Id, 'large');
    }

    public function set_category()
    {
        $terms = get_the_terms($this->Id, 'product_cat');
        $slug = [];
        $names = [];

        foreach ($terms as $term) {
            $slug[] = $term->slug;
            $names[] = $term->name;
        }

        $this->CategorySlug = $slug;
        $this->CategoryName = $names;
    }
}

class Brainworks_DTO_Filter
{
    public function __construct($name, $slug, array $options = [], $type = "default")
    {
        $this->Name = $name;
        $this->Slug = $slug;
        $this->Type = $type;
        $this->Options = $options;
        $this->Descriptions = [];
    }

    public function haveOptions()
    {
        return sizeof($this->Options) > 0;
    }

    public function addOption(WP_Term $term)
    {
        if (!in_array($term->name, $this->Options)) {
            $this->Options[] = $term->name;
            $this->Descriptions[] = $term->description;
        }
    }
}

function get_min_max_price($category, $on_sale)
{
    global $wpdb;
    $meta_keys = ['"_regular_price"', '"_sale_price"'];
    $price_cond = "AND wtr.term_taxonomy_id = $category";
    if ($on_sale) array_shift($meta_keys);
    if (!$category) $price_cond = '';
    $query = "SELECT MAX(CAST(wpm.meta_value as UNSIGNED)) AS MaxPrice, MIN(CAST(wpm.meta_value AS UNSIGNED)) AS MinPrice FROM wp_posts AS posts
                INNER JOIN wp_term_relationships wtr ON wtr.object_id = ID
                LEFT JOIN wp_postmeta wpm ON wpm.post_id = ID
                WHERE post_type = \"product\" AND post_status = \"publish\" $price_cond
                AND wpm.meta_key IN (" . implode(",", $meta_keys) . ") AND wpm.meta_value > 0
                ORDER BY post_title";
    $query_result = $wpdb->get_results($query);
    $minPrice = $query_result[0]->MinPrice;
    $maxPrice = $query_result[0]->MaxPrice;
    return [intval($minPrice), intval($maxPrice)];
}

if (!function_exists('get_product_image')) {
    function get_product_image(WP_REST_Request $request)
    {
        $id = $request->get_param('id');
        if (!$id) {
            return false;
        }
        $url = get_the_post_thumbnail_url($id, 'large');
        $file = fopen($url, 'rb');
        $info = getimagesize($url);
        switch ($info['mime']) {
            case IMAGETYPE_JPEG:
                header("Content-Type: image/jpeg");
                break;
            case IMAGETYPE_GIF:
                header("Content-Type: image/gif");
                break;
            case IMAGETYPE_PNG:
                header("Content-Type: image/png");
                break;
            default:
                header($_SERVER["SERVER_PROTOCOL"] . " 500 Internal Server Error");
                break;
        }
        readfile($url);
    }

    add_action("rest_api_init", function () {
        register_rest_route("brainworks", "products/image", array(
            "methods" => "GET",
            "callback" => "get_product_image"
        ));
    });
}

if (!function_exists("get_products_rest")) {
    function get_products_rest(WP_REST_Request $request)
    {
        header('Access-Control-Allow-Origin: *');

        $limit = 10;
        $page = 1;
        $sort_by = 'date';
        $sort = 'DESC';
        $on_sale = false;
        $category = '';
        $pre_order = false;

        $tax_query = [];
        $meta_query = [];
        $params = $request->get_params();

        foreach ($params as $key => $param) {
            if ($key == 'limit') $limit = $param;
            if ($key == 'page') $page = $param;
            if ($key == 'sort_by') $sort_by = $param;
            if ($key == "pre_order") $pre_order = true;
            if ($key == 'sort') $sort = $param;
            if ($key == "on_sale") $on_sale = true;
            if ($key == "category") $category = $param;
            if (strpos($key, 'pa_') !== false) {
                $param_arr = explode(',', $param);
                $terms = [];
                foreach ($param_arr as $p_item) {
                    $term = get_term_by('name', $p_item, $key);
                    $terms[] = $term->term_id;
                }
                $tax_query[] = [
                    'taxonomy' => $key,
                    'terms' => $terms,
                    'field' => 'term_id',
                    'operator' => 'IN'
                ];
            }
        }

        $offset = $limit * ($page - 1);

        $result = [];
        $query = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'offset' => $offset,
            'posts_per_page' => $limit,
            // 'orderby' => $sort_by,
            'order' => $sort,
        ];

        if ($pre_order) {
            $meta_query[] = [
                'key' => '_ywpo_preorder',
                'value' => ['yes'],
                'compare' => 'IN'
            ];
        }

        if ($category) {
            $tax_query[] = [
                'taxonomy' => 'product_cat',
                'terms' => [$category],
                'field' => 'term_id',
                'operator' => 'IN'
            ];
        }

        if ($on_sale) {
            $meta_query[] = [
                'relation' => 'OR',
                [
                    'key'           => '_sale_price',
                    'value'         => 0,
                    'compare'       => '>',
                    'type'          => 'numeric'
                ],
                [
                    'key'           => '_min_variation_sale_price',
                    'value'         => 0,
                    'compare'       => '>',
                    'type'          => 'numeric'
                ]
            ];
        }

        $prices = get_min_max_price($category, $on_sale);

        $minPrice = intval(isset($params['minPrice']) ? $params['minPrice'] : $prices[0]);
        $maxPrice = intval(isset($params['maxPrice']) ? $params['maxPrice'] : $prices[1]);
        $meta_query[] = [
            'relation' => 'OR',
            [
                'relation' => 'AND',
                [
                    'key' => '_regular_price',
                    'compare' => '>=',
                    'value' => $minPrice,
                    'type' => 'NUMERIC'
                ],
                [
                    'key' => '_regular_price',
                    'compare' => '<=',
                    'value' => $maxPrice,
                    'type' => 'NUMERIC'
                ],
                [
                    'key' => '_sale_price',
                    'compare' => 'NOT EXISTS'
                ]
            ],
            [
                'relation' => 'AND',
                [
                    'key' => '_sale_price',
                    'compare' => '>=',
                    'value' => $minPrice,
                    'type' => 'NUMERIC'
                ], [
                    'key' => '_sale_price',
                    'compare' => '<=',
                    'value' => $maxPrice,
                    'type' => 'NUMERIC'
                ]
            ]
        ];

        $query['tax_query'] = $tax_query;
        $query['meta_query'] = $meta_query;

        if ($sort_by === "PRICE_ASC" || $sort_by === "PRICE_DESC") {
            $query['orderby'] = 'meta_value_num';
            $query['meta_key'] = '_price';

            if ($sort_by === "PRICE_ASC") $query['order'] = "asc";
            else $query['order'] = "desc";
        } else {
            $query['orderby'] = 'post_title';
            $query["order"] = "asc";
        }

        $products = new WP_Query($query);

        foreach ($products->posts as $index => $product) $result['Data'][] = new Brainworks_DTO_Product($product);

        $result['Total'] = $products->found_posts;

        return $result;
    }

    add_action("rest_api_init", function () {
        register_rest_route("brainworks", "products", array(
            "methods" => "GET",
            "callback" => "get_products_rest"
        ));
    });
}

if (!function_exists("get_filters_rest")) {
    function get_filters_rest(WP_REST_Request $request)
    {
        header('Access-Control-Allow-Origin: ' . esc_url_raw(site_url()));
        $category = $request->get_param('category');
        $on_sale = $request->get_param("on_sale");
        $query = [];
        $filters = [];

        if ($category) {
            $term = get_term_by('id', $category, 'product_cat', 'ARRAY_A');
            $query['category'] = [$term['slug']];
        }

        $products = wc_get_products($query);

        foreach ($products as $product) {
            if ($on_sale && !$product->is_on_sale()) continue;
            $attrs = $product->get_attributes();
            foreach ($attrs as $taxonomy => $attr) {
                $id = $attr['id'];
                $type = $taxonomy == "pa_color" ? "color" : "default";
                if (!isset($filters[$id])) {
                    $filters[$id] = new Brainworks_DTO_Filter(wc_attribute_label($taxonomy), $taxonomy, [], $type);
                }
                foreach ($attr['options'] as $option) {
                    $terms = get_terms($taxonomy, $option);

                    if (isset($terms->errors)) {
                        continue;
                    }
                    foreach ($terms as $term) {
                        $filters[$id]->addOption($term);
                    }
                }
            }
        }

        foreach ($filters as $key => $filter) {
            if (!$filter->haveOptions()) {
                unset($filters[$key]);
            }
        }

        $prices = get_min_max_price($category, $on_sale);

        $result = [
            'Data' => $filters,
            'MinPrice' => $prices[0],
            'MaxPrice' => $prices[1]
        ];

        return $result;
    }

    add_action("rest_api_init", function () {
        register_rest_route("brainworks", "filters", array(
            "methods" => "GET",
            "callback" => "get_filters_rest"
        ));
    });
}

if (!function_exists("remove_from_cart")) {
    function remove_from_cart(WP_REST_Request $request)
    {
        ob_start();
        global $woocommerce;
        WC()->frontend_includes();
        WC()->cart = new WC_Cart();
        $products = $request->get_param("products");
        foreach ($products as $id) {
            WC()->cart->remove_cart_item($id);
        }
        return;
    }

    add_action("rest_api_init", function () {
        register_rest_route("brainworks", "cart/remove", array(
            "methods" => "POST",
            "callback" => "remove_from_cart"
        ));
    });
}

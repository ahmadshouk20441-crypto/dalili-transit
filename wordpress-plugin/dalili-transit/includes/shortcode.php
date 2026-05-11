<?php
defined('ABSPATH') || exit;

add_shortcode('dalili_transit_map', 'dalili_render_shortcode');
add_action('wp_enqueue_scripts', 'dalili_maybe_enqueue_assets');

function dalili_render_shortcode(array $atts): string {
    $atts = shortcode_atts([
        'height' => '600px',
        'theme'  => 'auto', // auto | light | dark
    ], $atts, 'dalili_transit_map');

    $height = esc_attr($atts['height']);
    $theme  = esc_attr($atts['theme']);

    // Enqueue assets
    dalili_enqueue_assets();

    $class = 'dalili-transit-embed';
    if ($theme === 'dark')  $class .= ' dark';
    if ($theme === 'light') $class .= ' light';

    return sprintf(
        '<div id="dalili-transit-root" class="%s" style="height:%s; min-height:400px;"></div>',
        esc_attr($class),
        $height
    );
}

function dalili_maybe_enqueue_assets() {
    // Only enqueue if shortcode is present in this page's content
    global $post;
    if ($post && has_shortcode($post->post_content, 'dalili_transit_map')) {
        dalili_enqueue_assets();
    }
}

function dalili_enqueue_assets() {
    static $enqueued = false;
    if ($enqueued) return;
    $enqueued = true;

    $dist_url = DALILI_PLUGIN_URL . 'assets/dist/';
    $dist_dir = DALILI_PLUGIN_DIR . 'assets/dist/';

    // CSS
    if (file_exists($dist_dir . 'index.css')) {
        wp_enqueue_style(
            'dalili-transit',
            $dist_url . 'index.css',
            [],
            DALILI_VERSION
        );
    }

    // JS
    if (file_exists($dist_dir . 'index.js')) {
        wp_enqueue_script(
            'dalili-transit',
            $dist_url . 'index.js',
            [],
            DALILI_VERSION,
            ['in_footer' => true, 'strategy' => 'defer']
        );
    }

    // Pass WP API URL to React app
    wp_add_inline_script(
        'dalili-transit',
        sprintf(
            'window.__DALILI_CONFIG__ = %s;',
            wp_json_encode([
                'apiBase' => rest_url('dalili/v1'),
                'nonce'   => wp_create_nonce('wp_rest'),
                'lang'    => get_locale(),
            ])
        ),
        'before'
    );
}

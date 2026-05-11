<?php
/**
 * Plugin Name:       Dalili Transit | دليلي
 * Plugin URI:        https://dalili.app
 * Description:       خريطة النقل الداخلي في مدينة حلب - إدارة المحطات والخطوط والتنبيهات
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Dalili Team
 * License:           GPL v2 or later
 * Text Domain:       dalili-transit
 * Domain Path:       /languages
 */

defined('ABSPATH') || exit;

define('DALILI_VERSION', '1.0.0');
define('DALILI_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DALILI_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load includes
require_once DALILI_PLUGIN_DIR . 'includes/post-types.php';
require_once DALILI_PLUGIN_DIR . 'includes/acf-fields.php';
require_once DALILI_PLUGIN_DIR . 'includes/rest-api.php';
require_once DALILI_PLUGIN_DIR . 'includes/shortcode.php';

register_activation_hook(__FILE__, 'dalili_activate');
register_deactivation_hook(__FILE__, 'dalili_deactivate');

function dalili_activate() {
    dalili_register_post_types();
    flush_rewrite_rules();
}

function dalili_deactivate() {
    flush_rewrite_rules();
}

add_action('plugins_loaded', 'dalili_load_textdomain');
function dalili_load_textdomain() {
    load_plugin_textdomain('dalili-transit', false, dirname(plugin_basename(__FILE__)) . '/languages');
}

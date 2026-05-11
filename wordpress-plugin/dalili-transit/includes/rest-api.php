<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', 'dalili_register_rest_routes');

function dalili_register_rest_routes() {
    $namespace = 'dalili/v1';

    register_rest_route($namespace, '/stations', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_stations',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($namespace, '/stations/(?P<id>[a-zA-Z0-9_-]+)', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_station',
        'permission_callback' => '__return_true',
        'args'                => ['id' => ['required' => true, 'sanitize_callback' => 'sanitize_text_field']],
    ]);

    register_rest_route($namespace, '/lines', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_lines',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($namespace, '/alerts', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_alerts',
        'permission_callback' => '__return_true',
    ]);
}

// ─── Stations ───────────────────────────────────────────────────────────────

function dalili_get_stations(WP_REST_Request $request): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_station',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);

    $data = array_map('dalili_format_station', $posts);
    return rest_ensure_response($data);
}

function dalili_get_station(WP_REST_Request $request): WP_REST_Response {
    $station_id = $request->get_param('id');
    $posts = get_posts([
        'post_type'   => 'dalili_station',
        'post_status' => 'publish',
        'meta_key'    => 'station_id',
        'meta_value'  => $station_id,
        'numberposts' => 1,
    ]);

    if (empty($posts)) {
        return new WP_REST_Response(['message' => 'Station not found'], 404);
    }

    return rest_ensure_response(dalili_format_station($posts[0]));
}

function dalili_format_station(WP_Post $post): array {
    $line_ids_raw  = get_field('transit_lines', $post->ID) ?: [];
    $line_ids      = array_map(fn($id) => get_field('line_id', $id) ?: "line-$id", $line_ids_raw);

    return [
        'id'          => get_field('station_id', $post->ID) ?: "st-{$post->ID}",
        'name'        => $post->post_title,
        'description' => get_field('station_description', $post->ID) ?: '',
        'x'           => (int) (get_field('svg_x', $post->ID) ?: 0),
        'y'           => (int) (get_field('svg_y', $post->ID) ?: 0),
        'lineIds'     => array_values($line_ids),
    ];
}

// ─── Lines ───────────────────────────────────────────────────────────────────

function dalili_get_lines(WP_REST_Request $request): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_line',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ]);

    $data = array_map('dalili_format_line', $posts);
    return rest_ensure_response($data);
}

function dalili_format_line(WP_Post $post): array {
    $station_ids_raw = get_field('stations_order', $post->ID) ?: [];
    $station_ids     = array_map(fn($id) => get_field('station_id', $id) ?: "st-$id", $station_ids_raw);

    return [
        'id'          => get_field('line_id', $post->ID) ?: "line-{$post->ID}",
        'name'        => $post->post_title,
        'color'       => get_field('line_color', $post->ID) ?: '#3b82f6',
        'status'      => get_field('line_status', $post->ID) ?: 'active',
        'description' => $post->post_content ? wp_strip_all_tags($post->post_content) : '',
        'stationIds'  => array_values($station_ids),
    ];
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

function dalili_get_alerts(WP_REST_Request $request): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_alert',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);

    $data = array_map('dalili_format_alert', $posts);
    return rest_ensure_response($data);
}

function dalili_format_alert(WP_Post $post): array {
    return [
        'id'     => "alert-{$post->ID}",
        'title'  => $post->post_title,
        'body'   => get_field('alert_body', $post->ID) ?: wp_strip_all_tags($post->post_content),
        'active' => (bool) get_field('alert_active', $post->ID),
        'type'   => get_field('alert_type', $post->ID) ?: 'info',
    ];
}

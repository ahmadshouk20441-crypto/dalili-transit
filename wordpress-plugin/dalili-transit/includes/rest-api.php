<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', 'dalili_register_rest_routes');
add_action('rest_api_init', 'dalili_add_cors_headers');

function dalili_add_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        if ($origin) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        return $value;
    });
}

function dalili_register_rest_routes() {
    $ns = 'dalili/v1';

    register_rest_route($ns, '/stations', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_stations',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/lines', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_lines',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/alerts', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_alerts',
        'permission_callback' => '__return_true',
    ]);

    // Single-request endpoint — React app fetches this on load
    register_rest_route($ns, '/network', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'dalili_get_network',
        'permission_callback' => '__return_true',
    ]);
}

// ─── Stations ───────────────────────────────────────────────────────────────

function dalili_get_stations(): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_station',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);
    return rest_ensure_response(array_map('dalili_format_station', $posts));
}

function dalili_format_station(WP_Post $post): array {
    // Collect lineIds from dalili_stop join records
    $stop_ids = get_posts([
        'post_type'      => 'dalili_stop',
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'post_status'    => 'publish',
        'meta_query'     => [['key' => 'station_ref', 'value' => $post->ID]],
    ]);

    $line_ids = [];
    foreach ($stop_ids as $stop_id) {
        $line_post_id = (int) get_post_meta($stop_id, 'line_ref', true);
        if (!$line_post_id) continue;
        $lid = get_post_meta($line_post_id, 'line_id', true) ?: "line-{$line_post_id}";
        if (!in_array($lid, $line_ids, true)) {
            $line_ids[] = $lid;
        }
    }

    return [
        'id'          => get_post_meta($post->ID, 'station_id', true) ?: "st-{$post->ID}",
        'name'        => get_post_meta($post->ID, 'name_ar', true) ?: $post->post_title,
        'name_en'     => get_post_meta($post->ID, 'name_en', true) ?: '',
        'x'           => (int) (get_post_meta($post->ID, 'svg_x', true) ?: 0),
        'y'           => (int) (get_post_meta($post->ID, 'svg_y', true) ?: 0),
        'status'      => get_post_meta($post->ID, 'status', true) ?: 'active',
        'description' => get_post_meta($post->ID, 'description_ar', true) ?: '',
        'lineIds'     => array_values($line_ids),
    ];
}

// ─── Lines ───────────────────────────────────────────────────────────────────

function dalili_get_lines(): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_line',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);
    return rest_ensure_response(array_map('dalili_format_line', $posts));
}

function dalili_format_line(WP_Post $post): array {
    // Get ordered station IDs from dalili_stop join records
    $stops = get_posts([
        'post_type'      => 'dalili_stop',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'meta_query'     => [['key' => 'line_ref', 'value' => $post->ID]],
        'meta_key'       => 'stop_order',
        'orderby'        => 'meta_value_num',
        'order'          => 'ASC',
    ]);

    $station_ids = [];
    foreach ($stops as $stop) {
        $sta_post_id = (int) get_post_meta($stop->ID, 'station_ref', true);
        if (!$sta_post_id) continue;
        $sid = get_post_meta($sta_post_id, 'station_id', true) ?: "st-{$sta_post_id}";
        $station_ids[] = $sid;
    }

    return [
        'id'              => get_post_meta($post->ID, 'line_id', true) ?: "line-{$post->ID}",
        'name'            => get_post_meta($post->ID, 'name_ar', true) ?: $post->post_title,
        'name_en'         => get_post_meta($post->ID, 'name_en', true) ?: '',
        'color'           => get_post_meta($post->ID, 'line_color', true) ?: '#3b82f6',
        'status'          => get_post_meta($post->ID, 'line_status', true) ?: 'active',
        'directionLabel'  => get_post_meta($post->ID, 'direction_label', true) ?: '',
        'description'     => get_post_meta($post->ID, 'line_description', true) ?: '',
        'stationIds'      => array_values($station_ids),
    ];
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

function dalili_get_alerts(): WP_REST_Response {
    $posts = get_posts([
        'post_type'      => 'dalili_alert',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);
    return rest_ensure_response(array_map('dalili_format_alert', $posts));
}

function dalili_format_alert(WP_Post $post): array {
    $line_id    = null;
    $station_id = null;

    $aff_line = (int) get_post_meta($post->ID, 'affected_line', true);
    if ($aff_line) {
        $line_id = get_post_meta($aff_line, 'line_id', true) ?: "line-{$aff_line}";
    }

    $aff_sta = (int) get_post_meta($post->ID, 'affected_station', true);
    if ($aff_sta) {
        $station_id = get_post_meta($aff_sta, 'station_id', true) ?: "st-{$aff_sta}";
    }

    return [
        'id'              => "alert-{$post->ID}",
        'title'           => get_post_meta($post->ID, 'title_ar', true) ?: $post->post_title,
        'message'         => get_post_meta($post->ID, 'message_ar', true) ?: '',
        'type'            => get_post_meta($post->ID, 'alert_type', true) ?: 'info',
        'status'          => get_post_meta($post->ID, 'alert_status', true) ?: 'active',
        'affectedLineId'  => $line_id,
        'affectedStationId' => $station_id,
        'startDate'       => get_post_meta($post->ID, 'start_date', true) ?: null,
        'endDate'         => get_post_meta($post->ID, 'end_date', true) ?: null,
    ];
}

// ─── Network (all-in-one) ─────────────────────────────────────────────────────

function dalili_get_network(): WP_REST_Response {
    $line_posts    = get_posts(['post_type' => 'dalili_line',    'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'title', 'order' => 'ASC']);
    $station_posts = get_posts(['post_type' => 'dalili_station', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'title', 'order' => 'ASC']);
    $alert_posts   = get_posts(['post_type' => 'dalili_alert',   'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'date',  'order' => 'DESC',
        'meta_query' => [['key' => 'alert_status', 'value' => 'active']]]);

    return rest_ensure_response([
        'lines'    => array_map('dalili_format_line',    $line_posts),
        'stations' => array_map('dalili_format_station', $station_posts),
        'alerts'   => array_map('dalili_format_alert',   $alert_posts),
    ]);
}

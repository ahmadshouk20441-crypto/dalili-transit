<?php
defined('ABSPATH') || exit;

add_action('init',         'dalili_register_post_types');
add_action('admin_menu',   'dalili_admin_menu');
add_action('save_post_dalili_stop', 'dalili_auto_title_stop', 10, 2);

// ─── Top-level admin menu ────────────────────────────────────────────────────

function dalili_admin_menu() {
    add_menu_page(
        __('دليلي للنقل', 'dalili-transit'),
        __('دليلي', 'dalili-transit'),
        'edit_posts',
        'dalili-transit',
        'dalili_admin_dashboard',
        'dashicons-location-alt',
        25
    );
}

function dalili_admin_dashboard() {
    echo '<div class="wrap"><h1>' . esc_html__('دليلي | لوحة تحكم النقل', 'dalili-transit') . '</h1>';
    echo '<p>' . esc_html__('استخدم القائمة الجانبية لإدارة المحطات والخطوط ونقاط التوقف والتنبيهات.', 'dalili-transit') . '</p>';
    $items = [
        __('المحطات', 'dalili-transit')        => 'dalili_station',
        __('خطوط النقل', 'dalili-transit')     => 'dalili_line',
        __('نقاط التوقف', 'dalili-transit')    => 'dalili_stop',
        __('التنبيهات', 'dalili-transit')      => 'dalili_alert',
    ];
    echo '<table class="wp-list-table widefat fixed striped" style="max-width:420px"><tbody>';
    foreach ($items as $label => $post_type) {
        $n = wp_count_posts($post_type)->publish ?? 0;
        echo '<tr><td><strong>' . esc_html($label) . '</strong></td><td>' . intval($n) . '</td></tr>';
    }
    echo '</tbody></table></div>';
}

// ─── CPT Registration ────────────────────────────────────────────────────────

function dalili_register_post_types() {

    // ── Stations ─────────────────────────────────────────────────
    register_post_type('dalili_station', [
        'labels' => [
            'name'               => __('المحطات', 'dalili-transit'),
            'singular_name'      => __('محطة', 'dalili-transit'),
            'add_new'            => __('إضافة محطة', 'dalili-transit'),
            'add_new_item'       => __('إضافة محطة جديدة', 'dalili-transit'),
            'edit_item'          => __('تعديل المحطة', 'dalili-transit'),
            'all_items'          => __('جميع المحطات', 'dalili-transit'),
            'search_items'       => __('بحث في المحطات', 'dalili-transit'),
            'not_found'          => __('لا توجد محطات', 'dalili-transit'),
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_rest'    => true,
        'supports'        => ['title'],
        'menu_icon'       => 'dashicons-location',
        'has_archive'     => false,
        'rewrite'         => false,
        'show_in_menu'    => 'dalili-transit',
    ]);

    // ── Transit Lines ─────────────────────────────────────────────
    register_post_type('dalili_line', [
        'labels' => [
            'name'               => __('خطوط النقل', 'dalili-transit'),
            'singular_name'      => __('خط نقل', 'dalili-transit'),
            'add_new'            => __('إضافة خط', 'dalili-transit'),
            'add_new_item'       => __('إضافة خط جديد', 'dalili-transit'),
            'edit_item'          => __('تعديل الخط', 'dalili-transit'),
            'all_items'          => __('جميع الخطوط', 'dalili-transit'),
            'search_items'       => __('بحث في الخطوط', 'dalili-transit'),
            'not_found'          => __('لا توجد خطوط', 'dalili-transit'),
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_rest'    => true,
        'supports'        => ['title'],
        'menu_icon'       => 'dashicons-chart-line',
        'has_archive'     => false,
        'rewrite'         => false,
        'show_in_menu'    => 'dalili-transit',
    ]);

    // ── Line Stops ────────────────────────────────────────────────
    // One record = one station on one line. Stores order + direction + notes.
    // Many-to-many: a station can be on many lines; a line has many stops.
    register_post_type('dalili_stop', [
        'labels' => [
            'name'               => __('نقاط التوقف', 'dalili-transit'),
            'singular_name'      => __('نقطة توقف', 'dalili-transit'),
            'add_new'            => __('إضافة توقف', 'dalili-transit'),
            'add_new_item'       => __('إضافة نقطة توقف', 'dalili-transit'),
            'edit_item'          => __('تعديل نقطة التوقف', 'dalili-transit'),
            'all_items'          => __('جميع نقاط التوقف', 'dalili-transit'),
            'not_found'          => __('لا توجد نقاط توقف', 'dalili-transit'),
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_rest'    => false,
        'supports'        => ['title'],
        'menu_icon'       => 'dashicons-list-view',
        'has_archive'     => false,
        'rewrite'         => false,
        'show_in_menu'    => 'dalili-transit',
    ]);

    // ── Alerts ────────────────────────────────────────────────────
    register_post_type('dalili_alert', [
        'labels' => [
            'name'               => __('التنبيهات', 'dalili-transit'),
            'singular_name'      => __('تنبيه', 'dalili-transit'),
            'add_new'            => __('إضافة تنبيه', 'dalili-transit'),
            'add_new_item'       => __('إضافة تنبيه جديد', 'dalili-transit'),
            'edit_item'          => __('تعديل التنبيه', 'dalili-transit'),
            'all_items'          => __('جميع التنبيهات', 'dalili-transit'),
            'not_found'          => __('لا توجد تنبيهات', 'dalili-transit'),
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_rest'    => false,
        'supports'        => ['title'],
        'menu_icon'       => 'dashicons-warning',
        'has_archive'     => false,
        'rewrite'         => false,
        'show_in_menu'    => 'dalili-transit',
    ]);
}

// ─── Admin list columns ──────────────────────────────────────────────────────

// Stations
add_filter('manage_dalili_station_posts_columns', function ($cols) {
    return [
        'cb'             => $cols['cb'],
        'title'          => __('اسم المحطة', 'dalili-transit'),
        'station_id_col' => __('المعرّف', 'dalili-transit'),
        'coords'         => __('الإحداثيات', 'dalili-transit'),
        'station_status' => __('الحالة', 'dalili-transit'),
        'date'           => $cols['date'],
    ];
});
add_action('manage_dalili_station_posts_custom_column', function ($col, $id) {
    if ($col === 'station_id_col')  { echo '<code>' . esc_html(get_field('station_id', $id) ?: '—') . '</code>'; }
    if ($col === 'coords') {
        $x = get_field('svg_x', $id); $y = get_field('svg_y', $id);
        echo ($x !== '' && $y !== '') ? esc_html("x=$x  y=$y") : '—';
    }
    if ($col === 'station_status') { dalili_status_badge(get_field('status', $id) ?: 'active'); }
}, 10, 2);

// Lines
add_filter('manage_dalili_line_posts_columns', function ($cols) {
    return [
        'cb'          => $cols['cb'],
        'title'       => __('اسم الخط', 'dalili-transit'),
        'line_id_col' => __('المعرّف', 'dalili-transit'),
        'line_color'  => __('اللون', 'dalili-transit'),
        'stop_count'  => __('عدد المحطات', 'dalili-transit'),
        'line_status' => __('الحالة', 'dalili-transit'),
        'date'        => $cols['date'],
    ];
});
add_action('manage_dalili_line_posts_custom_column', function ($col, $id) {
    if ($col === 'line_id_col')  { echo '<code>' . esc_html(get_field('line_id', $id) ?: '—') . '</code>'; }
    if ($col === 'line_color') {
        $c = get_field('line_color', $id) ?: '#888';
        echo '<span style="display:inline-block;width:20px;height:20px;border-radius:3px;background:' . esc_attr($c) . ';border:1px solid #ccc;vertical-align:middle;margin-inline-end:6px"></span>' . esc_html($c);
    }
    if ($col === 'stop_count') {
        echo count(get_posts(['post_type' => 'dalili_stop', 'posts_per_page' => -1, 'fields' => 'ids',
            'meta_query' => [['key' => 'line_ref', 'value' => $id]]]));
    }
    if ($col === 'line_status') { dalili_status_badge(get_field('line_status', $id) ?: 'active', 'line'); }
}, 10, 2);

// Stops
add_filter('manage_dalili_stop_posts_columns', function ($cols) {
    return [
        'cb'          => $cols['cb'],
        'title'       => __('التسمية', 'dalili-transit'),
        'stop_line'   => __('الخط', 'dalili-transit'),
        'stop_sta'    => __('المحطة', 'dalili-transit'),
        'stop_order'  => __('الترتيب', 'dalili-transit'),
        'stop_dir'    => __('الاتجاه', 'dalili-transit'),
        'date'        => $cols['date'],
    ];
});
add_action('manage_dalili_stop_posts_custom_column', function ($col, $id) {
    if ($col === 'stop_line')  { $li = get_field('line_ref', $id);    echo $li ? esc_html(get_the_title($li))    : '—'; }
    if ($col === 'stop_sta')   { $si = get_field('station_ref', $id); echo $si ? esc_html(get_the_title($si))   : '—'; }
    if ($col === 'stop_order') { echo esc_html(get_field('stop_order', $id) ?: '—'); }
    if ($col === 'stop_dir')   { echo esc_html(get_field('stop_direction', $id) ?: '—'); }
}, 10, 2);
add_filter('manage_edit-dalili_stop_sortable_columns', function ($c) {
    $c['stop_order'] = 'stop_order'; return $c;
});

// Alerts
add_filter('manage_dalili_alert_posts_columns', function ($cols) {
    return [
        'cb'            => $cols['cb'],
        'title'         => __('عنوان التنبيه', 'dalili-transit'),
        'alert_type'    => __('النوع', 'dalili-transit'),
        'alert_status'  => __('الحالة', 'dalili-transit'),
        'date'          => $cols['date'],
    ];
});
add_action('manage_dalili_alert_posts_custom_column', function ($col, $id) {
    if ($col === 'alert_type')   { echo esc_html(get_field('alert_type', $id) ?: '—'); }
    if ($col === 'alert_status') { dalili_status_badge(get_field('alert_status', $id) ?: 'active', 'alert'); }
}, 10, 2);

// ─── Helper: coloured status badge ──────────────────────────────────────────

function dalili_status_badge($value, $context = 'station') {
    $maps = [
        'station' => ['active' => ['نشطة', '#16a34a'],   'inactive' => ['غير نشطة', '#dc2626'], 'under_construction' => ['تحت الإنشاء', '#d97706']],
        'line'    => ['active' => ['نشط',   '#16a34a'],   'partial'  => ['جزئي',       '#d97706'], 'inactive' => ['متوقف', '#dc2626']],
        'alert'   => ['active' => ['نشط',   '#16a34a'],   'scheduled'=> ['مجدول',      '#0ea5e9'], 'expired'  => ['منتهي', '#94a3b8']],
    ];
    [$label, $color] = $maps[$context][$value] ?? ['—', '#888'];
    echo '<span style="color:' . esc_attr($color) . ';font-weight:600">● ' . esc_html($label) . '</span>';
}

// ─── Auto-generate Stop post title ──────────────────────────────────────────

function dalili_auto_title_stop($post_id, $post) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if ($post->post_status === 'auto-draft') return;

    $line_id    = get_field('line_ref',    $post_id);
    $station_id = get_field('station_ref', $post_id);
    $order      = get_field('stop_order',  $post_id);

    if (!$line_id || !$station_id) return;

    $title = get_the_title($line_id) . ' ← ' . get_the_title($station_id)
           . ($order ? " | #{$order}" : '');

    if ($post->post_title === $title) return;

    remove_action('save_post_dalili_stop', 'dalili_auto_title_stop', 10);
    wp_update_post(['ID' => $post_id, 'post_title' => $title, 'post_name' => sanitize_title($title)]);
    add_action('save_post_dalili_stop', 'dalili_auto_title_stop', 10, 2);
}

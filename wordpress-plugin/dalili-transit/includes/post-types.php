<?php
defined('ABSPATH') || exit;

add_action('init', 'dalili_register_post_types');

function dalili_register_post_types() {

    // ─── Stations ───────────────────────────────────────────────
    register_post_type('dalili_station', [
        'labels' => [
            'name'          => __('المحطات', 'dalili-transit'),
            'singular_name' => __('محطة', 'dalili-transit'),
            'add_new_item'  => __('إضافة محطة جديدة', 'dalili-transit'),
            'edit_item'     => __('تعديل المحطة', 'dalili-transit'),
            'all_items'     => __('جميع المحطات', 'dalili-transit'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor', 'thumbnail'],
        'menu_icon'    => 'dashicons-location',
        'has_archive'  => false,
        'rewrite'      => ['slug' => 'stations'],
    ]);

    // ─── Transit Lines ──────────────────────────────────────────
    register_post_type('dalili_line', [
        'labels' => [
            'name'          => __('خطوط النقل', 'dalili-transit'),
            'singular_name' => __('خط نقل', 'dalili-transit'),
            'add_new_item'  => __('إضافة خط جديد', 'dalili-transit'),
            'edit_item'     => __('تعديل الخط', 'dalili-transit'),
            'all_items'     => __('جميع الخطوط', 'dalili-transit'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor'],
        'menu_icon'    => 'dashicons-chart-line',
        'has_archive'  => false,
        'rewrite'      => ['slug' => 'transit-lines'],
    ]);

    // ─── Alerts ─────────────────────────────────────────────────
    register_post_type('dalili_alert', [
        'labels' => [
            'name'          => __('التنبيهات', 'dalili-transit'),
            'singular_name' => __('تنبيه', 'dalili-transit'),
            'add_new_item'  => __('إضافة تنبيه', 'dalili-transit'),
            'edit_item'     => __('تعديل التنبيه', 'dalili-transit'),
            'all_items'     => __('جميع التنبيهات', 'dalili-transit'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor'],
        'menu_icon'    => 'dashicons-warning',
        'has_archive'  => false,
        'rewrite'      => ['slug' => 'alerts'],
    ]);
}

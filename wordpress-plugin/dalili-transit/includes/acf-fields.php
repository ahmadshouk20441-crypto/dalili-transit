<?php
defined('ABSPATH') || exit;

/**
 * Register ACF field groups for Dalili CPTs.
 * Requires ACF Pro or ACF Free (v6+) with local JSON support.
 */
add_action('acf/init', 'dalili_register_acf_fields');

function dalili_register_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) return;

    // ─── Station Fields ─────────────────────────────────────────
    acf_add_local_field_group([
        'key'      => 'group_dalili_station',
        'title'    => 'بيانات المحطة',
        'fields'   => [
            [
                'key'           => 'field_station_id',
                'label'         => 'معرّف المحطة (ID)',
                'name'          => 'station_id',
                'type'          => 'text',
                'required'      => 1,
                'instructions'  => 'مثال: st-01',
            ],
            [
                'key'           => 'field_station_svg_x',
                'label'         => 'موضع X على الخريطة',
                'name'          => 'svg_x',
                'type'          => 'number',
                'required'      => 1,
                'min'           => 0,
                'max'           => 600,
            ],
            [
                'key'           => 'field_station_svg_y',
                'label'         => 'موضع Y على الخريطة',
                'name'          => 'svg_y',
                'type'          => 'number',
                'required'      => 1,
                'min'           => 0,
                'max'           => 600,
            ],
            [
                'key'           => 'field_station_lines',
                'label'         => 'الخطوط المرتبطة',
                'name'          => 'transit_lines',
                'type'          => 'relationship',
                'post_type'     => ['dalili_line'],
                'return_format' => 'id',
                'multiple'      => 1,
            ],
            [
                'key'           => 'field_station_description',
                'label'         => 'وصف المحطة',
                'name'          => 'station_description',
                'type'          => 'textarea',
                'rows'          => 2,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'dalili_station']]],
    ]);

    // ─── Transit Line Fields ────────────────────────────────────
    acf_add_local_field_group([
        'key'      => 'group_dalili_line',
        'title'    => 'بيانات الخط',
        'fields'   => [
            [
                'key'           => 'field_line_id',
                'label'         => 'معرّف الخط (ID)',
                'name'          => 'line_id',
                'type'          => 'text',
                'required'      => 1,
                'instructions'  => 'مثال: line-1',
            ],
            [
                'key'           => 'field_line_color',
                'label'         => 'لون الخط',
                'name'          => 'line_color',
                'type'          => 'color_picker',
                'required'      => 1,
                'default_value' => '#3b82f6',
            ],
            [
                'key'           => 'field_line_status',
                'label'         => 'حالة الخط',
                'name'          => 'line_status',
                'type'          => 'select',
                'choices'       => ['active' => 'نشط', 'partial' => 'جزئي', 'inactive' => 'متوقف'],
                'default_value' => 'active',
            ],
            [
                'key'           => 'field_line_stations_order',
                'label'         => 'ترتيب المحطات',
                'name'          => 'stations_order',
                'type'          => 'relationship',
                'post_type'     => ['dalili_station'],
                'return_format' => 'id',
                'multiple'      => 1,
                'instructions'  => 'رتّب المحطات بالترتيب الصحيح للخط',
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'dalili_line']]],
    ]);

    // ─── Alert Fields ───────────────────────────────────────────
    acf_add_local_field_group([
        'key'      => 'group_dalili_alert',
        'title'    => 'بيانات التنبيه',
        'fields'   => [
            [
                'key'           => 'field_alert_active',
                'label'         => 'تفعيل التنبيه',
                'name'          => 'alert_active',
                'type'          => 'true_false',
                'default_value' => 1,
                'ui'            => 1,
            ],
            [
                'key'           => 'field_alert_type',
                'label'         => 'نوع التنبيه',
                'name'          => 'alert_type',
                'type'          => 'select',
                'choices'       => ['info' => 'معلومة', 'warning' => 'تحذير'],
                'default_value' => 'info',
            ],
            [
                'key'           => 'field_alert_body',
                'label'         => 'نص التنبيه',
                'name'          => 'alert_body',
                'type'          => 'textarea',
                'rows'          => 3,
            ],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'dalili_alert']]],
    ]);
}

<?php
if (!defined('ABSPATH')) {
    exit;
}

// Uninstall logic
delete_option('website_price_estimator_version');
delete_option('website_price_estimator_options');
delete_transient('website_price_estimator_cache');
?>
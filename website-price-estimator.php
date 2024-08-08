<?php

/*
Plugin Name: Website Price Estimator
Description: The Multi-Step Form Price Estimator Plugin is designed to help users select features for their website and estimate the cost based on their selected currency. The plugin supports multiple Caribbean currencies and dynamically converts prices from USD to the selected currency. Shortcode [website_price_estimator]
Version: 1.1
Author: Orbtronics Limited [Software Developer Intern: Aaron Hazzard]
Author URI: https://www.orbtronics.co/
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: website-price-estimator
*/

/**
 * The `WebsitePriceEstimator` class is a WordPress plugin that provides a website price estimator tool. It allows users to select various features and functionalities, and provides an instant price estimate based on their selections.
 *
 * The plugin includes the following key features:
 * - Currency selection: Users can select from a variety of currencies to get the price estimate in their preferred currency.
 * - Feature selection: Users can select from a list of website features and functionalities, each with a corresponding price.
 * - Price calculation: The plugin calculates the total price based on the selected features and displays the summary.
 * - Responsive design: The plugin is designed to be mobile-responsive, providing a seamless user experience on various devices.
 *
 * The plugin is implemented as a WordPress plugin, with the main functionality defined in the `WebsitePriceEstimator` class. The class includes methods for enqueuing scripts and styles, as well as displaying the price estimation form.
 *
 * The plugin is licensed under the GPL v2 or later, and was developed by Orbtronics Limited with the help of a software developer intern, Aaron Hazzard.
 */




/**
 * The `display_form()` method is responsible for rendering the website price estimator form. It generates the HTML markup for the form, including the currency selection dropdown, the feature selection tables, and the summary section.
 *
 * The method uses output buffering to capture the generated HTML and return it as the content of the `[website_price_estimator]` shortcode. This allows the form to be easily embedded in any WordPress page or post.
 *
 * The form is divided into two steps: the first step allows the user to select the currency and the initial set of features, while the second step allows the user to select additional features. The "Next" and "Previous" buttons are used to navigate between the steps.
 *
 * The "Calculate" button triggers the display of the summary section, which shows the selected features and the total price estimate.
 *
 * @return string The HTML markup for the website price estimator form.
 */

// Ensure that the file is being run inside a WordPress environment for security.
if (!defined('ABSPATH'))
    exit;

if (!class_exists('WebsitePriceEstimator')) {

    class WebsitePriceEstimator
    {

        public function __construct()
        {
            // Hook to enqueue scripts and styles
            add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
            add_shortcode('website_price_estimator', array($this, 'display_form'));

        }

        public function enqueue_scripts()
        {
            // Enqueue GSAP
// The core GSAP library
    wp_enqueue_script( 'gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', array(), false, true );
    // ScrollTrigger - with gsap.js passed as a dependency
    wp_enqueue_script( 'gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', array('gsap-js'), false, true );
    // Your animation code file - with gsap.js passed as a dependency
    wp_enqueue_script( 'gsap-js2', get_template_directory_uri() . 'js/app.js', array('gsap-js'), false, true );
}

            // Enqueue your styles
            wp_enqueue_style('priceEstimatorStyle', plugins_url('/css/styles.css', __FILE__));

            // Enqueue your script, with jQuery and GSAP as dependencies
            wp_enqueue_script('priceEstimatorScript', plugins_url('/js/script.js', __FILE__), array('jquery', 'gsap'), null, true);
        }

        private function get_plugin_version()
        {
            if (function_exists('get_plugin_data')) {
                $plugin_data = get_plugin_data(__FILE__);
                return $plugin_data['Version'];
            }
            return '1.1'; // Fallback version
        }

        public static function update_version()
        {
            $current_version = get_option('website_price_estimator_version', '1.1');
            $new_version = '1.2'; // Increment this whenever you make changes

            if (version_compare($current_version, $new_version, '<')) {
                // Perform any necessary updates
                update_option('website_price_estimator_version', $new_version);

                // Clear any caches
                wp_cache_flush();
                delete_transient('website_price_estimator_cache');
            }
        }

        public static function deactivate()
        {
            // Log for debugging
            error_log('WebsitePriceEstimator plugin deactivated.');

            // Clear WordPress cache
            wp_cache_flush();

            // Clear any plugin-specific transients
            delete_transient('website_price_estimator_cache');

            // Optionally, you can also delete the options your plugin might have set
            delete_option('website_price_estimator_version');
            delete_option('website_price_estimator_options');

            // Flush rewrite rules
            flush_rewrite_rules();
        }


        public function display_form()
        {
            ob_start();
            ?>
            <form id="wpe-form" class="nextui-form">
                <div class="currency-switcher">
                    <label for="currency">Select Currency:</label>
                    <select name="currency" id="currency" class="select-currency">
                        <option value="USD">USD</option>
                        <option value="JMD">JMD</option>
                        <option value="CAD">CAD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="DOP">DOP</option>
                        <option value="HTG">HTG</option>
                        <option value="BBD">BBD</option>
                        <option value="BZD">BZD</option>
                        <option value="GYD">GYD</option>
                        <option value="TTD">TTD</option>
                        <option value="AWG">AWG</option>
                        <option value="BMD">BMD</option>
                        <option value="KYD">KYD</option>
                        <option value="ANG">ANG</option>
                        <option value="XCD">XCD</option>
                        <option value="CUP">CUP</option>
                        <option value="CUC">CUC</option>
                    </select>
                </div>
                <!-- Step 1 -->
                <div class="step step-1 active">
                    <h2>Step 1: Number of Pages</h2>
                    <label style="margin-top: 1rem" for="number-of-pages">How many pages do you envision for your website?</label>
                    <input type="text" id="number-of-pages" placeholder="Enter number of pages" class="number-input" />
                    <button class="next-step" type="button">Next</button>
                </div>

                <!-- Step 2 -->
                <div class="step step-2">
                    <h2>Step 2: Select Functionalities</h2>
                    <div class="features-list">
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="34" data-feature="Contact Form" />
                            <label>Contact Form</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="46" data-feature="Image Slider" />
                            <label>Image Slider</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="17" data-feature="Social Media Integration" />
                            <label>Social Media Integration</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="344" data-feature="E-commerce Functionality" />
                            <label>E-commerce Functionality</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="172" data-feature="Content Management System (CMS)" />
                            <label>Content Management System (CMS)</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="69" data-feature="Search Functionality" />
                            <label>Search Functionality</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="103" data-feature="Blog/News Section" />
                            <label>Blog/News Section</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="92" data-feature="User Registration/Login" />
                            <label>User Registration/Login</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="34" data-feature="Newsletter Subscription" />
                            <label>Newsletter Subscription</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="92" data-feature="Mobile Responsiveness" />
                            <label>Mobile Responsiveness</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="69" data-feature="SEO Optimization" />
                            <label>SEO Optimization</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="34"
                                data-feature="Analytics Integration (Google Analytics)" />
                            <label>Analytics Integration (Google Analytics)</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="69"
                                data-feature="Security Features (SSL Certificate, Firewall)" />
                            <label>Security Features (SSL Certificate, Firewall)</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="115"
                                data-feature="Integration with third-party APIs" />
                            <label>Integration with third-party APIs</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="745" data-feature="Any custom functionality" />
                            <label>Any custom functionality</label>
                        </div>
                        <div class="feature-item">
                            <input type="checkbox" class="feature" data-usd="50" data-feature="Additional Web Pages" />
                            <label>Additional Web Pages</label>
                        </div>
                    </div>
                    <div class="btn-wrapper">
                        <button class="previous-step" type="button">Previous</button>
                        <button class="next-step" type="button">Next</button>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="step step-3">
                    <h2>Step 3: Hosting & Maintenance Plans</h2>
                    <div class="plans">
                        <div class="plan-item">
                            <input type="checkbox" class="package-input" data-usd="45"
                                data-feature="Web Hosting and Cybersecurity Solutions" />
                            <label>Web Hosting and Cybersecurity Solutions: Starting from $45</label>
                        </div>
                        <div class="plan-item">
                            <input type="checkbox" class="package-input" data-usd="130" data-feature="3 Hour SLA" />
                            <label>Website Maintenance Package: 3 Hour SLA - $130/month</label>
                        </div>
                        <div class="plan-item">
                            <input type="checkbox" class="package-input" data-usd="220" data-feature="5 Hour SLA" />
                            <label>Website Maintenance Package: 5 Hour SLA - $220/month</label>
                        </div>
                        <div class="plan-item">
                            <input type="checkbox" class="package-input" data-usd="315" data-feature="8 Hour SLA" />
                            <label>Website Maintenance Package: 8 Hour SLA - $315/month</label>
                        </div>
                    </div>

                    <div class="btn-wrapper">
                        <button class="previous-step" type="button">Previous</button>

                        <div class="calculate-container-button">
                            <div class="hover bt-1"></div>
                            <div class="hover bt-2"></div>
                            <div class="hover bt-3"></div>
                            <div class="hover bt-4"></div>
                            <div class="hover bt-5"></div>
                            <div class="hover bt-6"></div>
                            <button class="calculate" type="button"></button>
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="summary-section" style="display: none">
                    <button class="previous-step-summary">Previous</button>

                    <div style="margin-top: 1rem; margin-bottom: 1rem;"><b>Total Price:<span id="total-price">$0.00</span></b>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Selected Feature/Package</th>
                                <!-- <th>Price</th> -->
                            </tr>
                        </thead>
                        <tbody id="summary-content">
                            <!-- Summary content will be populated here -->
                        </tbody>
                    </table>
                    <br />
                </div>
            </form>
            <?php
            return ob_get_clean();
        }



        // Static method to initialize the class
        public static function init()
        {
            self::update_version();
            new self();
        }

    }

    /*
        This action will be triggered once all plugins are loaded.
        It calls the 'init' static method of the 'WebsitePriceEstimator' class 
        when the 'plugins_loaded' action is triggered
    */
    add_action('plugins_loaded', array('WebsitePriceEstimator', 'init'));
    register_deactivation_hook(__FILE__, array('WebsitePriceEstimator', 'deactivate'));
}
?>
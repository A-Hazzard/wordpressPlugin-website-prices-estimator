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
            wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js', array(), '3.11.0', true);

            // Enqueue your styles
            // Enqueue GSAP
            wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js', array(), '3.11.0', true);

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
            return '1.0'; // Fallback version
        }

        public static function update_version()
        {
            $current_version = get_option('website_price_estimator_version', '1.0');
            $new_version = '1.1'; // Increment this whenever you make changes

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
            // Clear WordPress cache
            wp_cache_flush();

            // Clear any plugin-specific transients
            delete_transient('website_price_estimator_cache');

            // Optionally, you can also delete the options your plugin might have set
            // delete_option('website_price_estimator_options');
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
                <h2>Select Currency and Features</h2>
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
                <!-- Step 1: Currency Selection and Features -->
                <div class="step step-1">
                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Number of Pages</th>
                                <th>Functionality</th>
                                <!-- <th>Price</th> -->
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Contact Form</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="34" data-feature="Contact Form" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Image Slider</td>
                                <!-- <td class="price-col">$46</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="46" data-feature="Image Slider" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Social Media Integration</td>
                                <!-- <td class="price-col">$17</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="17" data-feature="Social Media Integration" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>E-commerce Functionality</td>
                                <!-- <td class="price-col">$344</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="344" data-feature="E-commerce Functionality" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Content Management System (CMS)</td>
                                <!-- <td class="price-col">$172</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="172"
                                        data-feature="Content Management System (CMS)" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Search Functionality</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="69" data-feature="Search Functionality" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Blog/News Section</td>
                                <!-- <td class="price-col">$103</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="103" data-feature="Blog/News Section" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>User Registration/Login</td>
                                <!-- <td class="price-col">$92</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="92" data-feature="User Registration/Login" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" class="next-step">Next</button>
                </div>

                <div class="step step-2 hidden">
                    <h2>Select Additional Features</h2>
                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Number of Pages</th>
                                <th>Functionality</th>
                                <!-- <th>Price</th> -->
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Newsletter Subscription</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="34" data-feature="Newsletter Subscription" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Mobile Responsiveness</td>
                                <!-- <td class="price-col">$92</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="92" data-feature="Mobile Responsiveness" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>SEO Optimization</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="69" data-feature="SEO Optimization" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Analytics Integration (Google Analytics)</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="34"
                                        data-feature="Analytics Integration (Google Analytics)" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Security Features (SSL Certificate, Firewall)</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="69"
                                        data-feature="Security Features (SSL Certificate, Firewall)" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Integration with third-party APIs</td>
                                <!-- <td class="price-col">$115</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="115"
                                        data-feature="Integration with third-party APIs" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Any custom functionality</td>
                                <!-- <td class="price-col">$745</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="745" data-feature="Any custom functionality" />
                                </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Additional Web Pages</td>
                                <!-- <td class="price-col">$50</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="50" data-feature="Additional Web Pages" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-wrapper">
                        <button type="button" class="previous-step">Previous</button>
                        <button type="button" class="next-step">Next</button>
                    </div>
                </div>
                <!-- Step 3: Remaining Features and Summary -->
                <div class="step step-3 hidden">
                    <h2>Select Additional Features</h2>
                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Number of Pages</th>
                                <th>Functionality</th>
                                <!-- <th>Price</th> -->
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1-3</td>
                                <td>Web Hosting and Cybersecurity Solutions:<br />
                                    <b>Starting from $45</b>
                                </td>

                                </td>
                                <!-- <td class="price-col">$45</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="45"
                                        data-feature="Web Hosting & Cybersecurity Solutions" />
                                </td>
                            </tr>
                            <tr>
                                <td>1-3</td>
                                <td class="package">Website Maintenance Packages <br />
                                    <b>Click for details</b>
                                    <div class="dropdown-content">
                                        <p class="menu-item" data-price="130">3 Hour SLA: Content updates, analytics tracking - $130
                                            USD/month</p>
                                        <p class="menu-item" data-price="220">5 Hour SLA: + Website backup saved on our servers,
                                            recovery, speed optimizations - $220 USD/month</p>
                                        <p class="menu-item" data-price="315">8 Hour SLA: + Security enforcement and SEO - $315
                                            USD/month</p>
                                    </div>
                                    <span class="price-col"></span>
                                </td>


                                <!-- <td class="price-col">$45</td> -->
                                <td class="package-input-wrapper">
                                    <input type="checkbox" class="feature" data-usd="" data-feature="" disabled />
                                </td>
                            </tr>
                            <tr>
                                <td>1-3</td>
                                <td>Impact Starter</td>
                                <!-- <td class="price-col">$250</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="250" data-feature="Impact Starter" />
                                </td>
                            </tr>
                            <tr>
                                <td>4-6</td>
                                <td>Growth Accelerator</td>
                                <!-- <td class="price-col">$350</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="350" data-feature="Growth Accelerator" />
                                </td>
                            </tr>
                            <tr>
                                <td>7-8</td>
                                <td>Enterprise Revolution</td>
                                <!-- <td class="price-col">$400</td> -->
                                <td>
                                    <input type="checkbox" class="feature" data-usd="400" data-feature="Enterprise Revolution" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="number" class="pages-input" min="9" value="9" style="width: 60px" />
                                </td>
                                <td>Global Implementation</td>
                                <td>
                                    <input type="checkbox" class="feature" data-usd="450" data-feature="Global Implementation" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-wrapper">
                        <button type="button" class="previous-step">Previous</button>
                        <button type="button" class="calculate" disabled>Calculate</button>
                    </div>

                    <!-- Summary -->
                    <div class="summary-section" style="display: none">
                        <button class="previous-step-summary">Previous</button>

                        <div style="margin-top: 1rem; margin-bottom: 1rem;"><b>Total Price:<span id="total-price">$0.00</span></b>
                        </div>

                <!-- Summary displays the total price and total number of features -->
                <div class="summary-section hidden">
                    <h3>Summary</h3>
                    <table id="summary-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                            </tr>
                        </thead>
                        <tbody id="summary">
                            <!-- Summary items will be inserted here -->
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td id="total-price">
                                    <!-- Total price will be inserted here -->
                                </td>
                            </tr>
                        </tfoot>
                    </table>
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
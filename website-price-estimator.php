<?php

/*
Plugin Name: Website Price Estimator
Description: The Multi-Step Form Price Estimator Plugin is designed to help users select features for their website and estimate the cost based on their selected currency. The plugin supports multiple Caribbean currencies and dynamically converts prices from USD to the selected currency.
Version: 1.0
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

            // Hook to display form
            add_shortcode('website_price_estimator', array($this, 'display_form'));
        }

        public function enqueue_scripts()
        {
            wp_enqueue_style('priceEstimatorStyle', plugins_url('/css/style.css', __FILE__));
            wp_enqueue_script('priceEstimatorScript', plugins_url('/js/script.js', __FILE__), array('jquery'), null, true);
        }

        public function display_form()
        {
            ob_start();
            ?>
            <form id="wpe-form" class="nextui-form">
                <!-- Step 1: Currency Selection and Features -->
                <div class="step step-1">
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


                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Functionality</th>
                                <!-- <th>Price</th> -->
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Contact Form</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td><input type="checkbox" class="feature" data-usd="34" data-feature="Contact Form"></td>
                            </tr>
                            <tr>
                                <td>Image Slider</td>
                                <!-- <td class="price-col">$46</td> -->
                                <td><input type="checkbox" class="feature" data-usd="46" data-feature="Image Slider"></td>
                            </tr>
                            <tr>
                                <td>Social Media Integration</td>
                                <!-- <td class="price-col">$17</td> -->
                                <td><input type="checkbox" class="feature" data-usd="17" data-feature="Social Media Integration">
                                </td>
                            </tr>
                            <tr>
                                <td>E-commerce Functionality</td>
                                <!-- <td class="price-col">$344</td> -->
                                <td><input type="checkbox" class="feature" data-usd="344" data-feature="E-commerce Functionality">
                                </td>
                            </tr>
                            <tr>
                                <td>Content Management System (CMS)</td>
                                <!-- <td class="price-col">$172</td> -->
                                <td><input type="checkbox" class="feature" data-usd="172"
                                        data-feature="Content Management System (CMS)"></td>
                            </tr>
                            <tr>
                                <td>Search Functionality</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td><input type="checkbox" class="feature" data-usd="69" data-feature="Search Functionality"></td>
                            </tr>
                            <tr>
                                <td>Blog/News Section</td>
                                <!-- <td class="price-col">$103</td> -->
                                <td><input type="checkbox" class="feature" data-usd="103" data-feature="Blog/News Section"></td>
                            </tr>
                            <tr>
                                <td>User Registration/Login</td>
                                <!-- <td class="price-col">$92</td> -->
                                <td><input type="checkbox" class="feature" data-usd="92" data-feature="User Registration/Login">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" class="next-step">Next</button>
                </div>
                <!-- Step 2: Remaining Features and Summary -->
                <div class="step step-2 hidden">
                    <h2>Select Additional Features</h2>
                    <table class="feature-table">
                        <thead>
                            <tr>
                                <th>Functionality</th>
                                <!-- <th>Price</th> -->
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Newsletter Subscription</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td><input type="checkbox" class="feature" data-usd="34" data-feature="Newsletter Subscription">
                                </td>
                            </tr>
                            <tr>
                                <td>Mobile Responsiveness</td>
                                <!-- <td class="price-col">$92</td> -->
                                <td><input type="checkbox" class="feature" data-usd="92" data-feature="Mobile Responsiveness"></td>
                            </tr>
                            <tr>
                                <td>SEO Optimization</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td><input type="checkbox" class="feature" data-usd="69" data-feature="SEO Optimization"></td>
                            </tr>
                            <tr>
                                <td>Analytics Integration (Google Analytics)</td>
                                <!-- <td class="price-col">$34</td> -->
                                <td><input type="checkbox" class="feature" data-usd="34"
                                        data-feature="Analytics Integration (Google Analytics)"></td>
                            </tr>
                            <tr>
                                <td>Security Features (SSL Certificate, Firewall)</td>
                                <!-- <td class="price-col">$69</td> -->
                                <td><input type="checkbox" class="feature" data-usd="69"
                                        data-feature="Security Features (SSL Certificate, Firewall)"></td>
                            </tr>
                            <tr>
                                <td>Integration with third-party APIs</td>
                                <!-- <td class="price-col">$115</td> -->
                                <td><input type="checkbox" class="feature" data-usd="115"
                                        data-feature="Integration with third-party APIs"></td>
                            </tr>
                            <tr>
                                <td>Any custom functionality</td>
                                <!-- <td class="price-col">$745</td> -->
                                <td><input type="checkbox" class="feature" data-usd="745" data-feature="Any custom functionality">
                                </td>
                            </tr>
                            <tr>
                                <td>Additional Web Pages</td>
                                <!-- <td class="price-col">$50</td> -->
                                <td><input type="checkbox" class="feature" data-usd="50" data-feature="Additional Web Pages"></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="button-wrapper">
                        <button type="button" class="previous-step">Previous</button>
                        <button type="button" class="calculate">Calculate</button>
                    </div>
                </div>
                <div class="summary-section hidden">
                    <h3>Summary</h3>
                    <table id="summary-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <!-- <th>Price</th> -->
                            </tr>
                        </thead>
                        <tbody id="summary">
                            <!-- Summary items will be inserted here -->
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td id="total-price"><!-- Total price will be inserted here --></td>
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
            new self();
        }
    }

    /*
        This action will be triggered once all plugins are loaded.
        It calls the 'init' static method of the 'WebsitePriceEstimator' class 
        when the 'plugins_loaded' action is triggered
    */
    add_action('plugins_loaded', array('WebsitePriceEstimator', 'init'));
}
?>
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
      wp_enqueue_script('gsap-js', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', array(), false, true);
      wp_enqueue_script('gsap-st', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', array('gsap-js'), false, true);

      // Enqueue Tailwind CSS and Font Awesome
      wp_enqueue_style('tailwind-css', 'https://cdn.tailwindcss.com');
      wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
      wp_enqueue_style('tailwind-custom-css', plugin_dir_url(__FILE__) . '/assets/css/output.css', array(), '1.0.0', 'all');

      // Enqueue the price estimator script
      wp_enqueue_script('priceEstimatorScript', plugins_url('/assets/js/script.js', __FILE__), array('jquery', 'gsap-js', 'gsap-st'), null, true);
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
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.js"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <!-- Mobile View -->
      <section class="text-left md:hidden relative">
        <header class="bg-blueTheme p-4 header">
          <h2 class="text-3xl text-left text-white w-[90%]" id="header-title">
            Take the first step towards your dream project
          </h2>
          <br />
          <p class="text-left text-[#D3D3D3] w-[90%]" id="header-description">
            Use our price estimator to get a project estimate tailored to your
            needs. It's quick, easy, and free.
          </p>
        </header>

        <div class="step step-1 h-[35rem]">
          <div class="text-lg mt-3 px-4 flex flex-col gap-2">
            <p>How many pages do you envision for your website?</p>
            <input type="text" name="pages" placeholder="1" min="1"
              class="pages-input w-2/3 rounded-md px-2 py-1 border focus:border-blueTheme" inputmode="numeric"
              pattern="[0-9]*" />

            <button class="first-next-step w-1/2 mt-3 px-4 py-2 text-white bg-yellowTheme rounded-md">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <img src="<?php echo plugins_url('assets/images/Mountain.svg', __FILE__); ?>" alt="mountain"
            class="w-full h-full" />
        </div>

        <div class="px-4 pb-4 mt-3 flex-col gap-2 step step-2 absolute hidden">
          <h3 class="text-h3">SELECT FUNCTIONALITIES</h3>
          <p class="text-grayTheme">
            From e-commerce capabilities to interactive galleries, pick what you
            need.
          </p>

          <div class="text-lg mt-2 flex flex-col gap-2">
            <div class="text-base flex flex-col gap-2">
              <div class="text-left">
                <input type="checkbox" id="contact-form" class="feature" data-usd="34" data-feature="Contact Form" />
                <label for="contact-form">Contact Form</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="image-slider" class="feature" data-usd="46" data-feature="Image Slider" />
                <label for="image-slider">Image Slider</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="social-media" class="feature" data-usd="17"
                  data-feature="Social Media Integration" />
                <label for="social-media">Social Media Integration</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="ecommerce" class="feature" data-usd="344"
                  data-feature="E-commerce Functionality" />
                <label for="ecommerce">E-commerce Functionality</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="cms" class="feature" data-usd="172"
                  data-feature="Content Management System (CMS)" />
                <label for="cms">Content Management System</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="search" class="feature" data-usd="69" data-feature="Search Functionality" />
                <label for="search">Search Functionality</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="blog" class="feature" data-usd="103" data-feature="Blog/News Section" />
                <label for="blog">Blog/News Section</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="user-registration" class="feature" data-usd="92"
                  data-feature="User Registration/Login" />
                <label for="user-registration">User Registration/Login</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="newsletter" class="feature" data-usd="34" data-feature="Newsletter Subscription" />
                <label for="newsletter">Newsletter Subscription</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="mobile-responsive" class="feature" data-usd="92"
                  data-feature="Mobile Responsiveness" />
                <label for="mobile-responsive">Mobile Responsiveness</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="seo" class="feature" data-usd="69" data-feature="SEO Optimization" />
                <label for="seo">SEO Optimization</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="analytics" class="feature" data-usd="34"
                  data-feature="Analytics Integration (Google Analytics)" />
                <label for="analytics">Analytics Integration</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="security" class="feature" data-usd="69"
                  data-feature="Security Features (SSL Certificate, Firewall)" />
                <label for="security">Security Features</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="third-party-api" class="feature" data-usd="115"
                  data-feature="Integration with third-party APIs" />
                <label for="third-party-api">Integration with third-party APIs</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="custom-functionality" class="feature" data-usd="745"
                  data-feature="Any custom functionality" />
                <label for="custom-functionality">Any custom functionality</label>
              </div>
              <div class="text-left">
                <input type="checkbox" id="additional-pages" class="feature" data-usd="50"
                  data-feature="Additional Web Pages" />
                <label for="additional-pages">Additional Web Pages</label>
              </div>
            </div>
          </div>

          <div class="mt-3 flex flex-row no-wrap gap-3">
            <button class="previous-step w-auto px-3 py-2 text-black bg-gray-300 rounded-md">
              <i class="fa-solid fa-arrow-left"></i> Previous
            </button>

            <button class="next-step w-auto px-3 py-2 text-white bg-yellowTheme rounded-md ml-auto">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div class="px-4 pb-4 mt-3 lex-col gap-2 step step-3 absolute hidden">
          <h3 class="text-h3">HOST & MANAGEMENT PLANS</h3>
          <p class="text-grayTheme">
            From hosting to maintenance, pick the plan that suits your needs.
          </p>

          <div class="plans text-[0.9rem] mt-2 flex flex-col">
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="45"
                data-feature="Web Hosting and Cybersecurity Solutions" />
              <label class="ml-2 mt-3">Web Hosting and Cybersecurity Solutions: <br />Starting from
                $45</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="130" data-feature="3 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />3 Hour SLA - $130/month</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="220" data-feature="5 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />5 Hour SLA - $220/month</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="315" data-feature="8 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />8 Hour SLA - $315/month</label>
            </div>
          </div>

          <div class="mt-3 flex flex-row no-wrap gap-3">
            <button class="previous-step w-auto px-3 py-2 text-black bg-gray-300 rounded-md">
              <i class="fa-solid fa-arrow-left"></i> Previous
            </button>

            <button class="details w-auto px-3 py-2 text-white bg-yellowTheme rounded-md ml-auto">
              Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- PC View -->
      <section
        class="text-left relative hidden md:flex flex-row w-[90%] xl:w-[60%] my-8 mx-auto rounded-md shadow-lg overflow-hidden">
        <!-- LEFT SIDE -->
         <header class="w-1/2 px-8 pt-8 flex flex-col bg-blueTheme relative header">
        <h2 class="text-white text-left text-3xl">
          Take the first step towards your dream project.
        </h2>
        <br />
        <p class="text-left text-[#D3D3D3]">
          Use our price estimator to get a project estimate tailored to your
          needs. It's quick, easy, and free.
        </p>

        <img src="<?php echo plugins_url('assets/images/staircase.svg', __FILE__); ?>" alt="staircase"
          class="w-[60%] absolute bottom-0" />
      </header>

        <!-- RIGHT SIDE -->
        <div class="step step-1 transition-height duration-300 ease-in-out">
          <div class="text-lg mt-3 px-4 flex flex-col gap-2">
            <p>How many pages do you envision for your website?</p>
            <input type="text" name="pages" placeholder="1" min="1"
              class="pages-input w-2/3 rounded-md px-2 py-1 border focus:border-blueTheme" inputmode="numeric"
              pattern="[0-9]*" />

            <button class="first-next-step w-1/2 mt-3 p-1 text-white bg-yellowTheme rounded-md">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <img src="<?php echo plugins_url('assets/images/Mountain.svg', __FILE__); ?>" alt="mountain"
            class="mountain w-full xl:w-[40rem] h-full object-contain" />
        </div>

        <div
          class="px-4 pb-4 mt-3 gap-2 step step-2 absolute right-0 top-0 bottom-0 w-1/2 hidden transition-height duration-2000 ease-in-out">
          <h3 class="text-h3">SELECT FUNCTIONALITIES</h3>
          <p class="text-grayTheme">
            From e-commerce capabilities to interactive galleries, pick what you
            need.
          </p>

          <div class="text-lg mt-2 flex flex-col gap-2">
            <div class="text-base flex flex-row gap-2">
              <div class="flex flex-col gap-2">
                <div class="text-left">
                  <input type="checkbox" id="contact-form" class="feature" data-usd="34" data-feature="Contact Form" />
                  <label for="contact-form">Contact Form</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="image-slider" class="feature" data-usd="46" data-feature="Image Slider" />
                  <label for="image-slider">Image Slider</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="social-media" class="feature" data-usd="17"
                    data-feature="Social Media Integration" />
                  <label for="social-media">Social Media Integration</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="ecommerce" class="feature" data-usd="344"
                    data-feature="E-commerce Functionality" />
                  <label for="ecommerce">E-commerce Functionality</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="cms" class="feature" data-usd="172"
                    data-feature="Content Management System (CMS)" />
                  <label for="cms">Content Management System</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="search" class="feature" data-usd="69" data-feature="Search Functionality" />
                  <label for="search">Search Functionality</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="blog" class="feature" data-usd="103" data-feature="Blog/News Section" />
                  <label for="blog">Blog/News Section</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="user-registration" class="feature" data-usd="92"
                    data-feature="User Registration/Login" />
                  <label for="user-registration">User Registration/Login</label>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div class="text-left">
                  <input type="checkbox" id="newsletter" class="feature" data-usd="34"
                    data-feature="Newsletter Subscription" />
                  <label for="newsletter">Newsletter Subscription</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="mobile-responsive" class="feature" data-usd="92"
                    data-feature="Mobile Responsiveness" />
                  <label for="mobile-responsive">Mobile Responsiveness</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="seo" class="feature" data-usd="69" data-feature="SEO Optimization" />
                  <label for="seo">SEO Optimization</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="analytics" class="feature" data-usd="34"
                    data-feature="Analytics Integration (Google Analytics)" />
                  <label for="analytics">Analytics Integration</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="security" class="feature" data-usd="69"
                    data-feature="Security Features (SSL Certificate, Firewall)" />
                  <label for="security">Security Features</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="third-party-api" class="feature" data-usd="115"
                    data-feature="Integration with third-party APIs" />
                  <label for="third-party-api">Integration with third-party APIs</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="custom-functionality" class="feature" data-usd="745"
                    data-feature="Any custom functionality" />
                  <label for="custom-functionality">Any custom functionality</label>
                </div>
                <div class="text-left">
                  <input type="checkbox" id="additional-pages" class="feature" data-usd="50"
                    data-feature="Additional Web Pages" />
                  <label for="additional-pages">Additional Web Pages</label>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3 flex flex-row no-wrap gap-3">
            <button class="previous-step w-auto px-3 py-2 text-black bg-gray-300 rounded-md">
              <i class="fa-solid fa-arrow-left"></i> Previous
            </button>

            <button class="next-step w-auto px-3 py-2 text-white bg-yellowTheme rounded-md ml-auto">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div
          class="px-4 pb-4 mt-3 gap-2 step step-3 absolute right-0 top-0 bottom-0 w-1/2 hidden transition-height duration-2000 ease-in-out">
          <h3 class="text-h3">HOST & MANAGEMENT PLANS</h3>
          <p class="text-grayTheme">
            From hosting to maintenance, pick the plan that suits your needs.
          </p>

          <div class="plans text-[0.9rem] mt-2 flex flex-col">
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="45"
                data-feature="Web Hosting and Cybersecurity Solutions" />
              <label class="ml-2 mt-3">Web Hosting and Cybersecurity Solutions: <br />Starting from
                $45</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="130" data-feature="3 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />3 Hour SLA - $130/month</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="220" data-feature="5 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />5 Hour SLA - $220/month</label>
            </div>
            <div class="plan-item flex items-center">
              <input type="checkbox" class="package-input" data-usd="315" data-feature="8 Hour SLA" />
              <label class="ml-2 mt-3">Website Maintenance Package: <br />8 Hour SLA - $315/month</label>
            </div>
          </div>

          <div class="mt-3 flex flex-row no-wrap gap-3">
            <button class="previous-step w-auto px-3 py-2 text-black bg-gray-300 rounded-md">
              <i class="fa-solid fa-arrow-left"></i> Previous
            </button>

            <button class="details w-auto px-3 py-2 text-white bg-yellowTheme rounded-md ml-auto">
              Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- SUMMARY MODAL -->
      <div class="modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white w-[95%] md:w-[60%] rounded-md shadow-lg">
          <div class="flex items-center px-4 py-2 rounded-t-md">
            <h2 class="text-h2 text-xl font-bold text-center flex-grow">
              PRICE SUMMARY
            </h2>
            <button class="close-modal ml-auto text-lg font-bold cursor-pointer flex items-center">
              x
            </button>
          </div>

          <div class="px-6 pb-6 flex flex-col items-center">
            <p class="text-sm text-center text-grayTheme mb-4">
              Choose the best options for your needs
            </p>




            <div class="lg:w-3/4">
              <div class="currency-input-container w-2/4 max-w-md mb-4">
                <select
                  class="currency-select w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellowTheme focus:border-transparent">
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
                  <option value="BSD">BSD</option>
                  <option value="CUP">CUP</option>
                  <option value="CUC">CUC</option>
                </select>
              </div>
              <div class="text-left text-sm w-full flex flex-col max-h-[60vh] overflow-y-auto">

              </div>

              <div class="mt-3 w-full flex flex-row justify-between items-center gap-3">
                <p class="total text-lg text-left text-[#3BA042]">Total: $134.45</p>

                <a class="bg-yellowTheme text-white shadow-md p-2 rounded-md"
                  href="https://outlook.office365.com/book/SoftwareConsultations@orbtronicsstlucia.com" target="_blank">
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(0);
          }
        }

        .animate-slide-right {
          animation: slideRight 1s linear forwards;
        }

        .modal {
          display: none;
        }

        @media (min-width: 1440px) {
          .step-1 .mountain {
            width: 50rem;
          }
        }
      </style>

      <script src="<?php echo plugins_url('assets/js/script.js', __FILE__); ?>"></script>
      <?php
      return ob_get_clean();
    }

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
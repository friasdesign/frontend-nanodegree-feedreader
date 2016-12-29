/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
  // Defining custom matchers ________________________________
  var customMatchers = {
    /*
     * This matcher ensures each element inside an array of objects has a
     * property `prop` being a non-empty string value, that is:
     *
     * - `prop` is a string.
     * - `prop` is not empty.
     * - `prop` is defined. 
     *
     * I've implemented this matcher since I've seen duplicated code in the test
     * cases 'have URL' and 'have name'.
     *
     * __Carlos__
     */
    allToHaveField: function() {
      return {
        compare: function(objects, prop) {
          // The result object passed to jasmine.
          var result = {};

          // Here we will store all error messages returned from
          // the iteration over each object in `objects` array.
          var errorMessages = [];

          // Ensure developer has defined the expected field.
          if(!prop) {
            throw new Error('Define expected field as argument for `allToHaveField` matcher.');
          }

          // Pass the test by default.
          result.pass = true;

          objects.forEach(function(object, idx) {
            var prefix = 'Object at index ' + idx + ', ';

            // Check if element is an object, naively implemented since `null`
            // will pass this check.
            if(typeof object !== 'object') {
              errorMessages.push(
                'Element at index ' + idx + ', is not an object.'
              );
              return;
            }
            
            // Ensures property is defined.
            if(object[prop] === undefined || object[prop] === null) {
              errorMessages.push(
                prefix + 'does not have defined property `' + prop + '`.'
              );
              return;
            }

            // Ensures property is string.
            if(typeof object[prop] != 'string') {
              errorMessages.push(
                prefix + 'has property `' + prop + '` not being a string.'
              );
              return;
            }

            // Ensure property is not empty string.
            if(object[prop].length === 0) {
              errorMessages.push(
                prefix + 'has property `' + prop + '` being an empty string.'
              );
              return;
            }
          });

          // Pass if error message returned.
          if(errorMessages.length > 0) {
            result.pass = false;
            result.message = errorMessages.join('\n');
          }

          return result;
        }
      };
    }
  };

  /* This is our first test suite - a test suite just contains
  * a related set of tests. This suite is all about the RSS
  * feeds definitions, the allFeeds variable in our application.
  */
  describe('RSS Feeds', function() {
    beforeAll(function() {
      jasmine.addMatchers(customMatchers);
    });

    /* This is our first test - it tests to make sure that the
     * allFeeds variable has been defined and that it is not
     * empty. Experiment with this before you get started on
     * the rest of this project. What happens when you change
     * allFeeds in app.js to be an empty array and refresh the
     * page?
     */
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });


    /* Write a test that loops through each feed
     * in the allFeeds object and ensures it has a URL defined
     * and that the URL is not empty.
     *
     * --DONE--
     */
    it('have URL', function() {
      expect(allFeeds).allToHaveField('url');
    });


    /* Write a test that loops through each feed
     * in the allFeeds object and ensures it has a name defined
     * and that the name is not empty.
     *
     * --DONE--
     */
    it('have name', function() {
      expect(allFeeds).allToHaveField('name');
    });
  });


  // Write a new test suite named "The menu" --DONE--
  describe('The menu', function() {
    // Here we hold a reference to the body element.
    var bodyReference;

    // Hold reference to menu icon.
    var menuIcon;

    /*
     * This function returns a list of all classes of a given element as array.
     */
    var getClassesAsArray = function(JQelement) {
      // Return all classes of passed JQelement as array, this way we get a 
      // further readable error message if the test fails.
      return JQelement.attr('class').split(' ');
    };

    beforeAll(function() {
      bodyReference = $('body');
      menuIcon = $('.menu-icon-link');
    });

    /* Write a test that ensures the menu element is
     * hidden by default. You'll have to analyze the HTML and
     * the CSS to determine how we're performing the
     * hiding/showing of the menu element.
     *
     * --DONE--
     */
    it('is hidden by default', function() {
      /*
       * I'm using this approach instead of:
       * `expect(bodyReference.hasClass('menu-hidden')).toBe(true)`
       * because the latter provides a dull error message:
       * 'Expected false to be true'
       * Which is not very informative.
       */
      expect(getClassesAsArray(bodyReference)).toContain('menu-hidden');
    });

     /* Write a test that ensures the menu changes
      * visibility when the menu icon is clicked. This test
      * should have two expectations: does the menu display when
      * clicked and does it hide when clicked again.
      *
      * --DONE--
      */  
    it('toggles when clicked', function() {
      menuIcon.click();
      expect(getClassesAsArray(bodyReference)).not.toContain('menu-hidden');

      menuIcon.click();
      expect(getClassesAsArray(bodyReference)).toContain('menu-hidden');
    });
  });

  /* Write a new test suite named "Initial Entries" -DONE- */
  describe('Initial Entries', function() {
    /* Write a test that ensures when the loadFeed
     * function is called and completes its work, there is at least
     * a single .entry element within the .feed container.
     * Remember, loadFeed() is asynchronous so this test will require
     * the use of Jasmine's beforeEach and asynchronous done() function.
     * -DONE-
     */
    
    beforeEach(function(done){
      loadFeed(0, done);
    });

    it('has loaded at least one element', function() {
      expect($('.feed').find('.entry').length).not.toBe(0);
    });
    
  });

  /* Write a new test suite named "New Feed Selection"
     -DONE-
   */
  describe('New Feed Selection', function() {
    
    beforeEach(function(done){
      loadFeed(0, done);
    });
    
    /* Write a test that ensures when a new feed is loaded
     * by the loadFeed function that the content actually changes.
     * Remember, loadFeed() is asynchronous.
     *
     * --DONE--
     */
    it('changes feeds', function(done) {
      // Test comparing only the titles as strings.
      var firstOldEntryTitle = $('.entry h2').first().text(),
          firstNewEntryTitle;

      loadFeed(1, function() {
        firstNewEntryTitle = $('.entry h2').first().text();
        expect(firstOldEntryTitle).not.toBe(firstNewEntryTitle);
        done();
      });

    });

  });

}());

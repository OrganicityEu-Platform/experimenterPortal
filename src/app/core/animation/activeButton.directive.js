(function() {
  'use strict';

  angular.module('app.components')
    .directive('activeButton', activeButton);

    /**
     * Used to highlight and unhighlight buttons on entity menu
     *
     * It attaches click handlers dynamically
     */

    activeButton.$inject = ['$timeout', '$window'];
    function activeButton($timeout, $window) {
      return {
        link: link,
        restrict: 'A'

      };

      ////////////////////////////

      function link(scope, element) {
        var childrens = element.children();
        var container;

        $timeout(function() {
          var navbar = angular.element('.stickNav');
          var entityMenu = angular.element('.entity_menu');
          var entityOverview = angular.element('.entity_overview');
          var entityDashboard = angular.element('.entity_chart');
          var entityDetails = angular.element('.entity_details');
          var entityOwner = angular.element('.entity_owner');
          var entityComments = angular.element('.entity_comments');

          container = {
            navbar: {
              height: navbar.height()
            },
            entityMenu: {
              height: entityMenu.height()
            },
            entityOverview: {
              height: entityOverview.height(),
              offset: entityOverview.offset().top,
              buttonOrder: 0
            },
            entityDashboard: {
              height: entityDashboard.height(),
              offset: entityDashboard.offset().top,
              buttonOrder: 40
            },
            entityDetails: {
              height: entityDetails.height(),
              offset: entityDetails.offset() ? entityDetails.offset().top : 0,
              buttonOrder: 1
            },
            entityOwner: {
              height: entityOwner.height(),
              offset: entityOwner.offset() ? entityOwner.offset().top : 0,
              buttonOrder: 2
            },
            entityComments: {
              height: entityComments.height(),
              offset: entityComments.offset() ? entityComments.offset().top : 0,
              buttonOrder: 3
            }
          };
        }, 1000);

        function scrollTo(offset) {
          if(!container) {
            return;
          }
          angular.element($window).scrollTop(offset - container.navbar.height - container.entityMenu.height);
        }

        function getButton(buttonOrder) {
          return childrens[buttonOrder];
        }

        function unHighlightButtons() {
          //remove border, fill and stroke of every icon
          var activeButton = angular.element('.md-button.button_active');
          if(activeButton.length) {
            activeButton.removeClass('button_active');

            var strokeContainer = activeButton.find('.stroke_container');
            strokeContainer.css('stroke', 'none');
            strokeContainer.css('stroke-width', '1');

            var fillContainer = strokeContainer.find('.fill_container');
            fillContainer.css('fill', '#82A7B0');
          }
        }

        function highlightButton(button) {
          var clickedButton = angular.element(button);
          //add border, fill and stroke to every icon
          clickedButton.addClass('button_active');

          var strokeContainer = clickedButton.find('.stroke_container');
          strokeContainer.css('stroke', 'white');
          strokeContainer.css('stroke-width', '0.01px');

          var fillContainer = strokeContainer.find('.fill_container');
          fillContainer.css('fill', 'white');
        }

        //attach event handlers for clicks for every button and scroll to a section when clicked
        _.each(childrens, function(button) {
          angular.element(button).on('click', function() {
            var buttonOrder = angular.element(this).index();
            for(var elem in container) {
              if(container[elem].buttonOrder === buttonOrder) {
                var offset = container[elem].offset;
                scrollTo(offset);
                angular.element($window).trigger('scroll');
              }
            }
          });
        });

        var currentSection;

        //on scroll, check if window is on a section
        angular.element($window).on('scroll', function() {
          if(!container) return;

          var windowPosition = document.body.scrollTop;
          var appPosition = windowPosition + container.navbar.height + container.entityMenu.height;
          var button;
          if(currentSection !== 'none' && appPosition <= container.entityOverview.offset) {
            button = getButton(container.entityOverview.buttonOrder);
            unHighlightButtons();
            currentSection = 'none';
          } else if(currentSection !== 'overview' && appPosition >= container.entityOverview.offset && appPosition <= container.entityOverview.offset + container.entityOverview.height) {
            button = getButton(container.entityOverview.buttonOrder);
            unHighlightButtons();
            highlightButton(button);
            currentSection = 'overview';
          } else if(currentSection !== 'details' && appPosition >= container.entityDetails.offset && appPosition <= container.entityDetails.offset + container.entityDetails.height) {
            button = getButton(container.entityDetails.buttonOrder);
            unHighlightButtons();
            highlightButton(button);
            currentSection = 'details';
          } else if(currentSection !== 'owner' && appPosition >= container.entityOwner.offset && appPosition <= container.entityOwner.offset + container.entityOwner.height) {
            button = getButton(container.entityOwner.buttonOrder);
            unHighlightButtons();
            highlightButton(button);
            currentSection = 'owner';
          } else if(currentSection !== 'comments' && appPosition >= container.entityComments.offset && appPosition <= container.entityComments.offset + container.entityOwner.height) {
            button = getButton(container.entityComments.buttonOrder);
            unHighlightButtons();
            highlightButton(button);
            currentSection = 'comments';
          }
        });
      }
    }
})();

/// <reference path="jquery.d.ts" />
var FoursquareManager = /** @class */ (function () {
    function FoursquareManager(foursquareWrapper) {
        var _this = this;
        this.foursquareApiError = "<div class=\"col-sm-12\">\n    <div class=\"alert alert-danger\" role=\"alert\">Oops! It looks like there's been an error. Please try searching a different name or place.</div>\n</div>";
        this.foursquareApiParams = { client_id: 'X4PBVD0T5QWQM2OCNLDHSAINWUMB5FGDQB0ATDI1FYLJARKB', client_secret: 'UYT4ODX1I1FBK24V5TXTFMSX4D0KUNCFTEJDQ00RU245HMZ2', limit: 15, v: '20180129' };
        this.foursquareFormWrapper = foursquareWrapper.find('.form-wrapper');
        this.foursquareSearchForm = this.foursquareFormWrapper.find('form');
        this.foursquareSearchInput = this.foursquareSearchForm.find('input');
        this.venuesWrapper = foursquareWrapper.find('.venues-wrapper .row');
        // focus on the input field on load
        this.foursquareSearchInput.focus();
        // on form submit
        this.foursquareSearchForm.on('submit', function (e) {
            e.preventDefault();
            _this.submitForm();
        });
    }
    FoursquareManager.prototype.submitForm = function () {
        // set input value as 'near' key value for api query
        this.foursquareApiParams['near'] = this.foursquareSearchInput.val();
        // query api
        this.getPlacesFromResource(this.foursquareApiParams);
    };
    FoursquareManager.prototype.getPlacesFromResource = function (params) {
        // ajax call to foursquare api
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/explore',
            timeout: 2000,
            dataType: 'json',
            type: 'GET',
            data: params,
            context: this,
            beforeSend: this.resetVenues,
            success: this.placesResourceSuccess,
            complete: this.placesResourceComplete
        });
    };
    FoursquareManager.prototype.placesResourceSuccess = function (data) {
        var venuesHTML = "", recommendedPlaces = data.response.groups[0].items;
        // return the html markup for each venue
        recommendedPlaces.forEach(function (venue) {
            venuesHTML += FoursquareManager.getVenueHtml(venue);
        });
        // append the markup
        this.venuesWrapper.append(venuesHTML);
    };
    FoursquareManager.prototype.placesResourceComplete = function (data, textStatus) {
        // display an error if api response is not 'success'
        if (textStatus != 'success') {
            this.venuesWrapper.append(this.foursquareApiError);
        }
    };
    FoursquareManager.prototype.resetVenues = function () {
        // remove existing venues before repopulating
        this.venuesWrapper.empty();
    };
    FoursquareManager.getVenueHtml = function (venue) {
        var categoryIcon = venue.venue.categories[0].icon.prefix + 'bg_32' + venue.venue.categories[0].icon.suffix;
        var venueHTML = "<div class=\"col-sm-4\">\n    <div class=\"card\">\n        <h5 class=\"card-header\" style=\"background-image: url(" + categoryIcon + ");\">" + venue.venue.name + "</h5>\n        <div class=\"card-body\">\n            <p class=\"card-text\">" + venue.venue.location.formattedAddress + "</p>";
        if (venue.tips)
            venueHTML += "<blockquote class=\"blockquote text-muted\">" + venue.tips[0].text + "</blockquote>";
        if (venue.venue.url)
            venueHTML += "<a href=\"" + venue.venue.url + "\" class=\"card-link\" target=\"_blank\">Find out more</a>";
        venueHTML += "</div>\n    </div>\n</div>\n";
        return venueHTML;
    };
    return FoursquareManager;
}());
var foursquareWrapper = $('.foursquare-wrapper');
new FoursquareManager(foursquareWrapper);

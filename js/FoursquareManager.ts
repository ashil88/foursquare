/// <reference path="jquery.d.ts" />

class FoursquareManager {

    private foursquareApiParams: object;
    private foursquareFormWrapper: JQuery;
    private foursquareSearchForm: JQuery;
    private foursquareSearchInput: JQuery;
    private venuesWrapper: JQuery;

    constructor(foursquareWrapper: JQuery) {
        this.foursquareApiParams = {client_id: 'X4PBVD0T5QWQM2OCNLDHSAINWUMB5FGDQB0ATDI1FYLJARKB', client_secret: 'UYT4ODX1I1FBK24V5TXTFMSX4D0KUNCFTEJDQ00RU245HMZ2', limit: 15, v: '20180129'};
        this.foursquareFormWrapper = foursquareWrapper.find('.form-wrapper');
        this.foursquareSearchForm = this.foursquareFormWrapper.find('form');
        this.foursquareSearchInput = this.foursquareSearchForm.find('input');
        this.venuesWrapper = foursquareWrapper.find('.venues-wrapper .row');

        // focus on the input field on load
        this.foursquareSearchInput.focus();

        // on form submit
        this.foursquareSearchForm.on('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    private submitForm() {
        this.foursquareApiParams['near'] = this.foursquareSearchInput.val();

        // query api
        this.getPlacesFromResource(this.foursquareApiParams);
    }

    private getPlacesFromResource(params?: object) {
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/explore',
            timeout: 2000,
            dataType: 'json',
            type: 'GET',
            data: params,
            context: this,
            // beforeSend: this.resetVenues,
            success: this.placesResourceSuccess,
            // complete: this.placesResourceComplete
        });
    }

    private placesResourceSuccess(data) {
        let venuesHTML = ``,
            {response : {groups : [{items : recommendedPlaces}]}} = data;

        recommendedPlaces.forEach((venue) => {
            venuesHTML += FoursquareManager.getVenueHtml(venue);
        });

        this.venuesWrapper.append(venuesHTML);
    }

    private static getVenueHtml(venue) {
        let venueHTML = `<div class="col-sm-4">
    <div class="card">
        <h5 class="card-header">${venue.venue.name}</h5>
        <div class="card-body">
            <p class="card-text">${venue.venue.location.formattedAddress}</p>`;

        if (venue.tips) venueHTML += `<blockquote class="blockquote text-muted">${venue.tips[0].text}</blockquote>`;

        venueHTML += `<a href="#" class="card-link">Go somewhere</a>
        </div>
    </div>
</div>
`;
        return venueHTML;
    }
}

const foursquareWrapper: JQuery = $('.foursquare-wrapper');
new FoursquareManager(foursquareWrapper);
/// <reference path="jquery.d.ts" />

class FoursquareManager {
    constructor(foursquareWrapper: JQuery) {

        this.getPlacesFromResource();
    }

    private getPlacesFromResource(params?: object) {
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/explore',
            timeout: 2000,
            dataType: 'json',
            type: 'GET',
            data: {client_id: 'X4PBVD0T5QWQM2OCNLDHSAINWUMB5FGDQB0ATDI1FYLJARKB', client_secret: 'UYT4ODX1I1FBK24V5TXTFMSX4D0KUNCFTEJDQ00RU245HMZ2', limit: 15, v: '20180129', near: 'wallington,uk'},
            context: this,
            // beforeSend: this.resetVenues,
            success: this.placesResourceSuccess,
            // complete: this.placesResourceComplete
        });
    }

    private placesResourceSuccess(data) {
        let recommendedPlaces = data.response.groups[0].items;

        console.log(recommendedPlaces);
    }
}

const foursquareWrapper: JQuery = $('.foursquare-wrapper');
new FoursquareManager(foursquareWrapper);
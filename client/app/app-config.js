(function (angular, app) {

	app.constant('appConfig', {
        appTitle: 'Grafika',
        appVersion: '0.9.0',
        baseUrl: '', // injected by app-controller
        defaultBaseUrl: 'https://grafika.herokuapp.com/',  // default url if baseUrl is localhost
        apiBaseUrl: '/api/',  // local
        resourceBaseUrl: 'https://s3.amazonaws.com/grafika/resources/',
        userBaseUrl: 'https://s3.amazonaws.com/grafika/users/',
        animation: {
            categories: [{name: 'All', type: undefined}, {name: 'Animation', type: 'animation' }, {name: 'Entertainment', type: 'entertainment' }, {name: 'Fun', type: 'fun' }, {name: 'My First', type: 'my first' }],
            types: [{name: 'All', type: undefined }, {name: 'Private only', type: 'private-only' }, {name: 'Public only', type: 'public-only' }],
            sorters: [{name: 'Most Viewed', type: 'views' }, {name: 'Newest', type: 'newest' }, {name: 'Top rated', type: 'rating' }]
        },
        fetchSize: 10,
        drawing: {
            backgroundColor: '#ffffff',
            foregroundColor: '#000000',
            brushSize: 2,
            graphic: 'Freeform',
            animationWidth: 800,
            animationHeight: 400,
            timer: 1000,
            repeatAnimation: false,
            category: 'Animation',
            imageQuality: 0.8,  // used in toDataUrl()
        },
        playback: {
            bufferCount: 25
        },
        defaultAvatar: '/assets/img/ic_user.png',
        defaultBackdrop: '/assets/img/ic_backdrop.png',
        prefs: {
            drawing: {
                timer: 1000,
                author: 'Anonymous',
                isPublic: true
            },
            playback: {
                
            }
        },
        routes: []  // set by routes.js
    });
})(window.angular, window.angular.app);

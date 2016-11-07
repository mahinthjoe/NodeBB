"use strict";
<<<<<<< HEAD
/*global io, templates, translator, ajaxify, utils, bootbox, RELATIVE_PATH, config, Visibility*/

var	socket,
	app = app || {};

app.isFocused = true;
app.isConnected = false;
=======
/*global templates, ajaxify, utils, bootbox, overrides, socket, config, Visibility*/

var app = app || {};

app.isFocused = true;
>>>>>>> upstream/master
app.currentRoom = null;
app.widgets = {};
app.cacheBuster = null;

(function () {
<<<<<<< HEAD
	var showWelcomeMessage = false;
	var reconnecting = false;

	function socketIOConnect() {
		var ioParams = {
			reconnectionAttempts: config.maxReconnectionAttempts,
			reconnectionDelay: config.reconnectionDelay,
			transports: config.socketioTransports,
			path: config.relative_path + '/socket.io'
		};

		socket = io(config.websocketAddress, ioParams);
		reconnecting = false;

		socket.on('event:connect', function () {
			app.showLoginMessage();
			app.replaceSelfLinks();
			$(window).trigger('action:connected');
			app.isConnected = true;
		});

		socket.on('connect', onSocketConnect);

		socket.on('event:disconnect', function() {
			$(window).trigger('action:disconnected');
			app.isConnected = false;
			socket.connect();
		});

		socket.on('reconnecting', function (attempt) {
			reconnecting = true;
			var reconnectEl = $('#reconnect');

			if (!reconnectEl.hasClass('active')) {
				reconnectEl.html('<i class="fa fa-spinner fa-spin"></i>');
			}

			reconnectEl.addClass('active').removeClass("hide").tooltip({
				placement: 'bottom'
			});
		});

		socket.on('event:banned', function() {
			app.alert({
				title: '[[global:alert.banned]]',
				message: '[[global:alert.banned.message]]',
				type: 'danger',
				timeout: 1000
			});

			setTimeout(function() {
				window.location.href = config.relative_path + '/';
			}, 1000);
		});

		socket.on('event:alert', function(data) {
			app.alert(data);
		});

		socket.on('reconnect_failed', function() {
			// Wait ten times the reconnection delay and then start over
			setTimeout(socket.connect.bind(socket), parseInt(config.reconnectionDelay, 10) * 10);
		});
	}

	function onSocketConnect(data) {
		if (reconnecting) {
			var reconnectEl = $('#reconnect');

			reconnectEl.tooltip('destroy');
			reconnectEl.html('<i class="fa fa-check"></i>');
			reconnecting = false;

			// Rejoin room that was left when we disconnected
			var	url_parts = window.location.pathname.slice(RELATIVE_PATH.length).split('/').slice(1);
			var room;

			switch(url_parts[0]) {
				case 'user':
					room = 'user/' + ajaxify.variables.get('theirid');
				break;
				case 'topic':
					room = 'topic_' + url_parts[1];
				break;
				case 'category':
					room = 'category_' + url_parts[1];
				break;
				case 'recent':	// intentional fall-through
				case 'unread':
					room = 'recent_posts';
				break;
				case 'admin':
					room = 'admin';
				break;
				case 'home':
					room = 'home';
				break;
			}
			app.currentRoom = '';
			app.enterRoom(room);

			socket.emit('meta.reconnected');

			app.isConnected = true;
			$(window).trigger('action:reconnected');

			setTimeout(function() {
				reconnectEl.removeClass('active').addClass('hide');
			}, 3000);
		}
	}

	app.logout = function() {
		require(['csrf'], function(csrf) {
			$.ajax(RELATIVE_PATH + '/logout', {
				type: 'POST',
				headers: {
					'x-csrf-token': csrf.get()
				},
				success: function() {
					window.location.href = RELATIVE_PATH + '/';
				}
			});
=======
	var showWelcomeMessage = !!utils.params().loggedin;
	var showBannedMessage = !!utils.params().banned && app.user && app.user.uid === 0;

	templates.setGlobal('config', config);

	app.cacheBuster = config['cache-buster'];

	bootbox.setDefaults({
		locale: config.userLang
	});

	app.load = function () {
		app.loadProgressiveStylesheet();

		var url = ajaxify.start(window.location.pathname.slice(1) + window.location.search + window.location.hash);
		ajaxify.updateHistory(url, true);
		ajaxify.parseData();
		ajaxify.end(url, app.template);

		handleStatusChange();

		if (config.searchEnabled) {
			app.handleSearch();
		}

		$('body').on('click', '#new_topic', function () {
			app.newTopic();
		});

		require(['components'], function (components) {
			components.get('user/logout').on('click', app.logout);
		});

		Visibility.change(function (event, state) {
			if (state === 'visible') {
				app.isFocused = true;
				app.alternatingTitle('');
			} else if (state === 'hidden') {
				app.isFocused = false;
			}
		});

		overrides.overrideBootbox();
		overrides.overrideTimeago();
		createHeaderTooltips();
		app.showEmailConfirmWarning();
		app.showCookieWarning();

		socket.removeAllListeners('event:nodebb.ready');
		socket.on('event:nodebb.ready', function (data) {
			if (!app.cacheBuster || app.cacheBuster !== data['cache-buster']) {
				app.cacheBuster = data['cache-buster'];

				app.alert({
					alert_id: 'forum_updated',
					title: '[[global:updated.title]]',
					message: '[[global:updated.message]]',
					clickfn: function () {
						window.location.reload();
					},
					type: 'warning'
				});
			}
		});

		require(['taskbar', 'helpers', 'forum/pagination'], function (taskbar, helpers, pagination) {
			taskbar.init();

			// templates.js helpers
			helpers.register();

			pagination.init();

			$(window).trigger('action:app.load');
		});
	};

	app.logout = function () {
		$(window).trigger('action:app.logout');
		$.ajax(config.relative_path + '/logout', {
			type: 'POST',
			headers: {
				'x-csrf-token': config.csrf_token
			},
			success: function () {
				var payload = {
					next: config.relative_path + '/'
				};

				$(window).trigger('action:app.loggedOut', payload);
				window.location.href = payload.next;
			}
>>>>>>> upstream/master
		});
	};

	app.alert = function (params) {
<<<<<<< HEAD
		require(['alerts'], function(alerts) {
=======
		require(['alerts'], function (alerts) {
>>>>>>> upstream/master
			alerts.alert(params);
		});
	};

<<<<<<< HEAD
	app.removeAlert = function(id) {
		require(['alerts'], function(alerts) {
=======
	app.removeAlert = function (id) {
		require(['alerts'], function (alerts) {
>>>>>>> upstream/master
			alerts.remove(id);
		});
	};

	app.alertSuccess = function (message, timeout) {
		app.alert({
			title: '[[global:alert.success]]',
			message: message,
			type: 'success',
<<<<<<< HEAD
			timeout: timeout ? timeout : 2000
=======
			timeout: timeout ? timeout : 5000
>>>>>>> upstream/master
		});
	};

	app.alertError = function (message, timeout) {
<<<<<<< HEAD
=======
		if (message === '[[error:invalid-session]]') {
			return app.handleInvalidSession();
		}

>>>>>>> upstream/master
		app.alert({
			title: '[[global:alert.error]]',
			message: message,
			type: 'danger',
<<<<<<< HEAD
			timeout: timeout ? timeout : 5000
		});
	};

	app.enterRoom = function (room) {
		if (socket) {
			if (app.currentRoom === room) {
				return;
			}

			socket.emit('meta.rooms.enter', {
				enter: room,
				username: app.user.username,
				userslug: app.user.userslug,
				picture: app.user.picture
			});

			app.currentRoom = room;
		}
	};

	function highlightNavigationLink() {
		var path = window.location.pathname,
			parts = path.split('/'),
			active = parts[parts.length - 1];

		$('#main-nav li').removeClass('active');
		if (active) {
			$('#main-nav li a').each(function () {
				var href = $(this).attr('href');
				if (active === "sort-posts" || active === "sort-reputation" || active === "search" || active === "latest" || active === "online") {
					active = 'users';
				}

				if (href && href.match(active)) {
					$(this.parentNode).addClass('active');
					return false;
				}
			});
		}
	}

	app.createUserTooltips = function() {
		$('img[title].teaser-pic,img[title].user-img').each(function() {
			$(this).tooltip({
				placement: 'top',
				title: $(this).attr('title')
			});
		});
	};

	app.createStatusTooltips = function() {
		$('body').tooltip({
			selector:'.fa-circle.status',
			placement: 'top'
		});
	};

	app.replaceSelfLinks = function(selector) {
		selector = selector || $('a');
		selector.each(function() {
=======
			timeout: timeout ? timeout : 10000
		});
	};

	app.handleInvalidSession = function () {
		if (app.flags && app.flags._sessionRefresh) {
			return;
		}

		app.flags = app.flags || {};
		app.flags._sessionRefresh = true;

		require(['translator'], function (translator) {
			translator.translate('[[error:invalid-session-text]]', function (translated) {
				bootbox.alert({
					title: '[[error:invalid-session]]',
					message: translated,
					closeButton: false,
					callback: function () {
						window.location.reload();
					}
				});
			});
		});
	};

	app.enterRoom = function (room, callback) {
		callback = callback || function () {};
		if (socket && app.user.uid && app.currentRoom !== room) {
			var previousRoom = app.currentRoom;
			app.currentRoom = room;
			socket.emit('meta.rooms.enter', {
				enter: room
			}, function (err) {
				if (err) {
					app.currentRoom = previousRoom;
					return app.alertError(err.message);
				}

				callback();
			});
		}
	};

	app.leaveCurrentRoom = function () {
		if (!socket) {
			return;
		}
		socket.emit('meta.rooms.leaveCurrent', function (err) {
			if (err) {
				return app.alertError(err.message);
			}
			app.currentRoom = '';
		});
	};

	function highlightNavigationLink() {
		var path = window.location.pathname;
		$('#main-nav li').removeClass('active');
		if (path) {
			$('#main-nav li').removeClass('active').find('a[href="' + path + '"]').parent().addClass('active');
		}
	}

	app.createUserTooltips = function (els, placement) {
		els = els || $('body');
		els.find('.avatar,img[title].teaser-pic,img[title].user-img,div.user-icon,span.user-icon').each(function () {
			if (!utils.isTouchDevice()) {
				$(this).tooltip({
					placement: placement || $(this).attr('title-placement') || 'top',
					title: $(this).attr('title')
				});
			}
		});
	};

	app.createStatusTooltips = function () {
		if (!utils.isTouchDevice()) {
			$('body').tooltip({
				selector:'.fa-circle.status',
				placement: 'top'
			});
		}
	};

	app.replaceSelfLinks = function (selector) {
		selector = selector || $('a');
		selector.each(function () {
>>>>>>> upstream/master
			var href = $(this).attr('href');
			if (href && app.user.userslug && href.indexOf('user/_self_') !== -1) {
				$(this).attr('href', href.replace(/user\/_self_/g, 'user/' + app.user.userslug));
			}
		});
	};

	app.processPage = function () {
		highlightNavigationLink();

<<<<<<< HEAD
		$('span.timeago').timeago();
=======
		$('.timeago').timeago();
>>>>>>> upstream/master

		utils.makeNumbersHumanReadable($('.human-readable-number'));

		utils.addCommasToNumbers($('.formatted-number'));

		app.createUserTooltips();

		app.createStatusTooltips();

		app.replaceSelfLinks();

		// Scroll back to top of page
		window.scrollTo(0, 0);
	};

<<<<<<< HEAD
	app.showLoginMessage = function () {
		function showAlert() {
			app.alert({
				type: 'success',
				title: '[[global:welcome_back]] ' + app.user.username + '!',
				message: '[[global:you_have_successfully_logged_in]]',
				timeout: 5000
			});
=======
	app.showMessages = function () {
		var messages = {
			login: {
				format: 'alert',
				title: '[[global:welcome_back]] ' + app.user.username + '!',
				message: '[[global:you_have_successfully_logged_in]]'
			},
			banned: {
				format: 'modal',
				title: '[[error:user-banned]]',
				message: '[[error:user-banned-reason, ' + utils.params().banned + ']]'
			}
		};

		function showAlert(type) {
			switch (messages[type].format) {
				case 'alert':
					app.alert({
						type: 'success',
						title: messages[type].title,
						message: messages[type].message,
						timeout: 5000
					});
					break;

				case 'modal':
					require(['translator'], function (translator) {
						translator.translate(messages[type].message, function (translated) {
							bootbox.alert({
								title: messages[type].title,
								message: translated
							});
						});
					});
					break;
			}
>>>>>>> upstream/master
		}

		if (showWelcomeMessage) {
			showWelcomeMessage = false;
			if (document.readyState !== 'complete') {
<<<<<<< HEAD
				$(document).ready(showAlert);
			} else {
				showAlert();
			}
		}
	};

	app.openChat = function (username, touid) {
		if (username === app.user.username) {
			return app.alertError('[[error:cant-chat-with-yourself]]');
		}

=======
				$(document).ready(showAlert.bind(null, 'login'));
			} else {
				showAlert('login');
			}
		}

		if (showBannedMessage) {
			showBannedMessage = false;
			if (document.readyState !== 'complete') {
				$(document).ready(showAlert.bind(null, 'banned'));
			} else {
				showAlert('banned');
			}
		}
	};

	app.openChat = function (roomId, uid) {
>>>>>>> upstream/master
		if (!app.user.uid) {
			return app.alertError('[[error:not-logged-in]]');
		}

		require(['chat'], function (chat) {
			function loadAndCenter(chatModal) {
				chat.load(chatModal.attr('UUID'));
				chat.center(chatModal);
				chat.focusInput(chatModal);
			}

<<<<<<< HEAD
			if (!chat.modalExists(touid)) {
				chat.createModal(username, touid, loadAndCenter);
			} else {
				loadAndCenter(chat.getModal(touid));
=======
			if (chat.modalExists(roomId)) {
				loadAndCenter(chat.getModal(roomId));
			} else {
				socket.emit('modules.chats.loadRoom', {roomId: roomId, uid: uid || app.user.uid}, function (err, roomData) {
					if (err) {
						return app.alertError(err.message);
					}
					roomData.users = roomData.users.filter(function (user) {
						return user && parseInt(user.uid, 10) !== parseInt(app.user.uid, 10);
					});
					roomData.uid = uid || app.user.uid;
					chat.createModal(roomData, loadAndCenter);
				});
>>>>>>> upstream/master
			}
		});
	};

<<<<<<< HEAD
=======
	app.newChat = function (touid, callback) {
		callback = callback || function () {};
		if (!app.user.uid) {
			return app.alertError('[[error:not-logged-in]]');
		}

		if (parseInt(touid, 10) === parseInt(app.user.uid, 10)) {
			return app.alertError('[[error:cant-chat-with-yourself]]');
		}

		socket.emit('modules.chats.newRoom', {touid: touid}, function (err, roomId) {
			if (err) {
				return app.alertError(err.message);
			}

			if (!ajaxify.data.template.chats) {
				app.openChat(roomId);
			} else {
				ajaxify.go('chats/' + roomId);
			}

			callback(false, roomId);
		});
	};

>>>>>>> upstream/master
	var	titleObj = {
			active: false,
			interval: undefined,
			titles: []
		};

	app.alternatingTitle = function (title) {
		if (typeof title !== 'string') {
			return;
		}

		if (title.length > 0 && !app.isFocused) {
			if (!titleObj.titles[0]) {
				titleObj.titles[0] = window.document.title;
			}

<<<<<<< HEAD
			translator.translate(title, function(translated) {
				titleObj.titles[1] = translated;
				if (titleObj.interval) {
					clearInterval(titleObj.interval);
				}

				titleObj.interval = setInterval(function() {
					var title = titleObj.titles[titleObj.titles.indexOf(window.document.title) ^ 1];
					if (title) {
						window.document.title = $('<div/>').html(title).text();
					}
				}, 2000);
=======
			require(['translator'], function (translator) {
				translator.translate(title, function (translated) {
					titleObj.titles[1] = translated;
					if (titleObj.interval) {
						clearInterval(titleObj.interval);
					}

					titleObj.interval = setInterval(function () {
						var title = titleObj.titles[titleObj.titles.indexOf(window.document.title) ^ 1];
						if (title) {
							window.document.title = $('<div/>').html(title).text();
						}
					}, 2000);
				});
>>>>>>> upstream/master
			});
		} else {
			if (titleObj.interval) {
				clearInterval(titleObj.interval);
			}
			if (titleObj.titles[0]) {
				window.document.title = $('<div/>').html(titleObj.titles[0]).text();
			}
		}
	};

<<<<<<< HEAD
	app.refreshTitle = function(url) {
		if (!url) {
			var a = document.createElement('a');
			a.href = document.location;
			url = a.pathname.slice(1);
		}

		socket.emit('meta.buildTitle', url, function(err, title, numNotifications) {
			if (err) {
				return;
			}
			titleObj.titles[0] = (numNotifications > 0 ? '(' + numNotifications + ') ' : '') + title;
			app.alternatingTitle('');
		});
	};

	app.toggleNavbar = function(state) {
=======
	app.refreshTitle = function (title) {
		if (!title) {
			return;
		}
		require(['translator'], function (translator) {
			title = config.titleLayout.replace(/&#123;/g, '{').replace(/&#125;/g, '}')
				.replace('{pageTitle}', function () { return title; })
				.replace('{browserTitle}', function () { return config.browserTitle; });

			translator.translate(title, function (translated) {
				titleObj.titles[0] = translated;
				app.alternatingTitle('');
			});
		});
	};

	app.toggleNavbar = function (state) {
>>>>>>> upstream/master
		var navbarEl = $('.navbar');
		if (navbarEl) {
			navbarEl.toggleClass('hidden', !!!state);
		}
	};

<<<<<<< HEAD
	app.exposeConfigToTemplates = function() {
		$(document).ready(function() {
			templates.setGlobal('loggedIn', config.loggedIn);
			templates.setGlobal('relative_path', RELATIVE_PATH);
			for(var key in config) {
				if (config.hasOwnProperty(key)) {
					templates.setGlobal('config.' + key, config[key]);
				}
			}
		});
	};

	function createHeaderTooltips() {
		if (utils.findBootstrapEnvironment() === 'xs') {
			return;
		}
		$('#header-menu li a[title]').each(function() {
			$(this).tooltip({
				placement: 'bottom',
				title: $(this).attr('title')
			});
		});

		$('#search-form').parent().tooltip({
			placement: 'bottom',
			title: $('#search-button i').attr('title')
		});

		$('#user_dropdown').tooltip({
			placement: 'bottom',
			title: $('#user_dropdown').attr('title')
		});
	}

	function handleSearch() {
=======
	function createHeaderTooltips() {
		var env = utils.findBootstrapEnvironment();
		if (env === 'xs' || env === 'sm') {
			return;
		}
		$('#header-menu li a[title]').each(function () {
			if (!utils.isTouchDevice()) {
				$(this).tooltip({
					placement: 'bottom',
					trigger: 'hover',
					title: $(this).attr('title')
				});
			}
		});

		if (!utils.isTouchDevice()) {
			$('#search-form').parent().tooltip({
				placement: 'bottom',
				trigger: 'hover',
				title: $('#search-button i').attr('title')
			});
		}

		if (!utils.isTouchDevice()) {
			$('#user_dropdown').tooltip({
				placement: 'bottom',
				trigger: 'hover',
				title: $('#user_dropdown').attr('title')
			});
		}
	}

	app.handleSearch = function () {
>>>>>>> upstream/master
		var searchButton = $("#search-button"),
			searchFields = $("#search-fields"),
			searchInput = $('#search-fields input');

<<<<<<< HEAD
		$('#search-form').on('submit', dismissSearch);
		searchInput.on('blur', dismissSearch);

		function dismissSearch(){
			searchFields.hide();
			searchButton.show();
		}

		function prepareSearch() {
			searchFields.removeClass('hide').show();
			searchButton.hide();
			searchInput.focus();
		}

		searchButton.on('click', function(e) {
=======
		$('#search-form .advanced-search-link').on('mousedown', function () {
			ajaxify.go('/search');
		});

		$('#search-form').on('submit', dismissSearch);
		searchInput.on('blur', dismissSearch);

		function dismissSearch() {
			searchFields.addClass('hidden');
			searchButton.removeClass('hidden');
		}

		searchButton.on('click', function (e) {
>>>>>>> upstream/master
			if (!config.loggedIn && !config.allowGuestSearching) {
				app.alert({
					message:'[[error:search-requires-login]]',
					timeout: 3000
				});
				ajaxify.go('login');
				return false;
			}
			e.stopPropagation();

<<<<<<< HEAD
			prepareSearch();
			return false;
		});

		require(['search', 'mousetrap'], function(search, Mousetrap) {
			$('#search-form').on('submit', function (e) {
				e.preventDefault();
				var input = $(this).find('input');

				search.query({term: input.val()}, function() {
					input.val('');
				});
			});

			$('.topic-search')
				.on('click', '.prev', function() {
					search.topicDOM.prev();
				})
				.on('click', '.next', function() {
					search.topicDOM.next();
				});

			Mousetrap.bind('ctrl+f', function(e) {
				if (config.topicSearchEnabled) {
					// If in topic, open search window and populate, otherwise regular behaviour
					var match = ajaxify.currentPage.match(/^topic\/([\d]+)/),
						tid;
					if (match) {
						e.preventDefault();
						tid = match[1];
						searchInput.val('in:topic-' + tid + ' ');
						prepareSearch();
					}
				}
			});
		});
	}

	function collapseNavigationOnClick() {
		$('#nav-dropdown').off('click').on('click', '#main-nav a, #user-control-list a, #logged-out-menu li a, #logged-in-menu .visible-xs, #chat-list a', function() {
			if($('.navbar .navbar-collapse').hasClass('in')) {
				$('.navbar-header button').click();
			}
		});
	}

	function handleStatusChange() {
		$('#user-control-list .user-status').off('click').on('click', function(e) {
			var status = $(this).attr('data-status');
			socket.emit('user.setStatus', status, function(err, data) {
				if(err) {
					return app.alertError(err.message);
				}
				$('#logged-in-menu #user_label #user-profile-link>i').attr('class', 'fa fa-circle status ' + status);
=======
			app.prepareSearch();
			return false;
		});

		$('#search-form').on('submit', function () {
			var input = $(this).find('input');
			require(['search'], function (search) {
				var data = search.getSearchPreferences();
				data.term = input.val();
				search.query(data, function () {
					input.val('');
				});
			});
			return false;
		});
	};

	app.prepareSearch = function () {
		$("#search-fields").removeClass('hidden');
		$("#search-button").addClass('hidden');
		$('#search-fields input').focus();
	};

	function handleStatusChange() {
		$('[component="header/usercontrol"] [data-status]').off('click').on('click', function (e) {
			var status = $(this).attr('data-status');
			socket.emit('user.setStatus', status, function (err) {
				if(err) {
					return app.alertError(err.message);
				}
				$('[data-uid="' + app.user.uid + '"] [component="user/status"], [component="header/profilelink"] [component="user/status"]')
					.removeClass('away online dnd offline')
					.addClass(status);

				app.user.status = status;
>>>>>>> upstream/master
			});
			e.preventDefault();
		});
	}

<<<<<<< HEAD
	app.load = function() {
		$('document').ready(function () {
			var url = ajaxify.start(window.location.pathname.slice(1), true, window.location.search);
			ajaxify.end(url, app.template);

			collapseNavigationOnClick();

			handleStatusChange();

			if (config.searchEnabled) {
				handleSearch();
			}

			$('#logout-link').on('click', app.logout);

			Visibility.change(function(e, state){
				if (state === 'visible') {
					app.isFocused = true;
					app.alternatingTitle('');
				} else if (state === 'hidden') {
					app.isFocused = false;
				}
			});

			createHeaderTooltips();
			app.showEmailConfirmWarning();

			socket.removeAllListeners('event:nodebb.ready');
			socket.on('event:nodebb.ready', function(cacheBusters) {
				if (
					!app.cacheBusters ||
					app.cacheBusters.general !== cacheBusters.general ||
					app.cacheBusters.css !== cacheBusters.css ||
					app.cacheBusters.js !== cacheBusters.js
				) {
					app.cacheBusters = cacheBusters;

					app.alert({
						alert_id: 'forum_updated',
						title: '[[global:updated.title]]',
						message: '[[global:updated.message]]',
						clickfn: function() {
							window.location.reload();
						},
						type: 'warning'
					});
				}
			});

			require(['taskbar', 'helpers'], function(taskbar, helpers) {
				taskbar.init();

				// templates.js helpers
				helpers.register();
			});
		});
	};

	app.showEmailConfirmWarning = function(err) {
		if (!config.requireEmailConfirmation || !app.user.uid) {
			return;
		}
		if (!app.user.email) {
			app.alert({
				alert_id: 'email_confirm',
				message: '[[error:no-email-to-confirm]]',
				type: 'warning',
				timeout: 0,
				clickfn: function() {
					app.removeAlert('email_confirm');
					ajaxify.go('user/' + app.user.userslug + '/edit');
				}
			});
		} else if (!app.user['email:confirmed']) {
			app.alert({
				alert_id: 'email_confirm',
				message: err ? err.message : '[[error:email-not-confirmed]]',
				type: 'warning',
				timeout: 0,
				clickfn: function() {
					app.removeAlert('email_confirm');
					socket.emit('user.emailConfirm', {}, function(err) {
						if (err) {
							return app.alertError(err.message);
						}
						app.alertSuccess('[[notifications:email-confirm-sent]]');
					});
				}
			});
		}
	};

	showWelcomeMessage = window.location.href.indexOf('loggedin') !== -1;

	app.exposeConfigToTemplates();

	socketIOConnect();

	app.cacheBuster = config['cache-buster'];

	require(['csrf'], function(csrf) {
		csrf.set(config.csrf_token);
	});

	bootbox.setDefaults({
		locale: config.userLang
	});

	app.alternatingTitle('');

=======
	app.updateUserStatus = function (el, status) {
		if (!el.length) {
			return;
		}

		require(['translator'], function (translator) {
			translator.translate('[[global:' + status + ']]', function (translated) {
				el.removeClass('online offline dnd away')
					.addClass(status)
					.attr('title', translated)
					.attr('data-original-title', translated);
			});
		});
	};

	app.newTopic = function (cid, tags) {
		$(window).trigger('action:composer.topic.new', {
			cid: cid || ajaxify.data.cid || 0,
			tags: tags || (ajaxify.data.tag ? [ajaxify.data.tag] : [])
		});
	};

	app.loadJQueryUI = function (callback) {
		if (typeof $().autocomplete === 'function') {
			return callback();
		}

		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = config.relative_path + '/vendor/jquery/js/jquery-ui.js' + (app.cacheBuster ? '?v=' + app.cacheBuster : '');
		scriptEl.onload = callback;
		document.head.appendChild(scriptEl);
	};

	app.showEmailConfirmWarning = function (err) {
		if (!config.requireEmailConfirmation || !app.user.uid) {
			return;
		}
		var msg = {
			alert_id: 'email_confirm',
			type: 'warning',
			timeout: 0
		};

		if (!app.user.email) {
			msg.message = '[[error:no-email-to-confirm]]';
			msg.clickfn = function () {
				app.removeAlert('email_confirm');
				ajaxify.go('user/' + app.user.userslug + '/edit');
			};
			app.alert(msg);
		} else if (!app.user['email:confirmed'] && !app.user.isEmailConfirmSent) {
			msg.message = err ? err.message : '[[error:email-not-confirmed]]';
			msg.clickfn = function () {
				app.removeAlert('email_confirm');
				socket.emit('user.emailConfirm', {}, function (err) {
					if (err) {
						return app.alertError(err.message);
					}
					app.alertSuccess('[[notifications:email-confirm-sent]]');
				});
			};

			app.alert(msg);
		} else if (!app.user['email:confirmed'] && app.user.isEmailConfirmSent) {
			msg.message = '[[error:email-not-confirmed-email-sent]]';
			app.alert(msg);
		}
	};

	app.parseAndTranslate = function (template, blockName, data, callback) {
		require(['translator'], function (translator) {
			function translate(html, callback) {
				translator.translate(html, function (translatedHTML) {
					translatedHTML = translator.unescape(translatedHTML);
					callback($(translatedHTML));
				});
			}

			if (typeof blockName === 'string') {
				templates.parse(template, blockName, data, function (html) {
					translate(html, callback);
				});
			} else {
				callback = data;
				data = blockName;
				templates.parse(template, data, function (html) {
					translate(html, callback);
				});
			}
		});
	};

	app.loadProgressiveStylesheet = function () {
		var linkEl = document.createElement('link');
		linkEl.rel = 'stylesheet';
		linkEl.href = config.relative_path + '/js-enabled.css';

		document.head.appendChild(linkEl);
	};

	app.showCookieWarning = function () {
		if (!config.cookies.enabled) {
			// Only show warning if enabled (obviously)
			return;
		} else if (window.location.pathname.startsWith(config.relative_path + '/admin')) {
			// No need to show cookie consent warning in ACP
			return;
		}

		var consentConfig = {
			"palette": {
				"popup": {
					"background": config.cookies.palette.background,
					"text": config.cookies.palette.text
				},
				"button": {
					"background": config.cookies.palette.button,
					"text": config.cookies.palette.buttonText
				}
			},
			"theme": config.cookies.style,
			"position": config.cookies.position,
			"content": {
				"dismiss": config.cookies.dismiss,
				"link": config.cookies.link
			}
		};

		if (config.cookies.message) {
			consentConfig.content.message = config.cookies.message;
		}

		window.cookieconsent.initialise(consentConfig);
	};
>>>>>>> upstream/master
}());

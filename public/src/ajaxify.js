"use strict";
<<<<<<< HEAD

var ajaxify = ajaxify || {};

$(document).ready(function() {

	/*global app, templates, utils, socket, translator, config, RELATIVE_PATH*/

	var location = document.location || window.location,
		rootUrl = location.protocol + '//' + (location.hostname || location.host) + (location.port ? ':' + location.port : ''),
		apiXHR = null;
=======
/*global app, bootbox, templates, socket, config, RELATIVE_PATH*/

var ajaxify = ajaxify || {};

$(document).ready(function () {
	var location = document.location || window.location;
	var rootUrl = location.protocol + '//' + (location.hostname || location.host) + (location.port ? ':' + location.port : '');
	var apiXHR = null;
	var ajaxifyTimer;

	var translator;
	var retry = true;
	var previousBodyClass = '';

	// Dumb hack to fool ajaxify into thinking translator is still a global
	// When ajaxify is migrated to a require.js module, then this can be merged into the "define" call
	require(['translator'], function (_translator) {
		translator = _translator;
	});
>>>>>>> upstream/master

	$(window).on('popstate', function (ev) {
		ev = ev.originalEvent;

<<<<<<< HEAD
		if (ev !== null && ev.state && ev.state.url !== undefined) {
			ajaxify.go(ev.state.url, function() {
				$(window).trigger('action:popstate', {url: ev.state.url});
			}, true);
=======
		if (ev !== null && ev.state) {
			if (ev.state.url === null && ev.state.returnPath !== undefined) {
				window.history.replaceState({
					url: ev.state.returnPath
				}, ev.state.returnPath, config.relative_path + '/' + ev.state.returnPath);
			} else if (ev.state.url !== undefined) {
				ajaxify.go(ev.state.url, function () {
					$(window).trigger('action:popstate', {url: ev.state.url});
				}, true);
			}
>>>>>>> upstream/master
		}
	});

	ajaxify.currentPage = null;

	ajaxify.go = function (url, callback, quiet) {
<<<<<<< HEAD
		if (ajaxify.handleACPRedirect(url)) {
			return false;
		}

		app.enterRoom('');
=======
		if (!socket.connected) {
			if (ajaxify.reconnectAction) {
				$(window).off('action:reconnected', ajaxify.reconnectAction);
			}
			ajaxify.reconnectAction = function (e) {
				ajaxify.go(url, callback, quiet);
				$(window).off(e);
			};
			$(window).on('action:reconnected', ajaxify.reconnectAction);
		}

		// Abort subsequent requests if clicked multiple times within a short window of time
		if (ajaxifyTimer && (Date.now() - ajaxifyTimer) < 500) {
			return true;
		}
		ajaxifyTimer = Date.now();

		if (ajaxify.handleRedirects(url)) {
			return true;
		}

		app.leaveCurrentRoom();
>>>>>>> upstream/master

		$(window).off('scroll');

		if ($('#content').hasClass('ajaxifying') && apiXHR) {
			apiXHR.abort();
		}

<<<<<<< HEAD
		url = ajaxify.start(url, quiet);

		$('#footer, #content').removeClass('hide').addClass('ajaxifying');

		var	startTime = (new Date()).getTime();

		ajaxify.variables.flush();
		ajaxify.loadData(url, function(err, data) {
=======
		if (!window.location.pathname.match(/\/(403|404)$/g)) {
			app.previousUrl = window.location.href;
		}

		url = ajaxify.start(url);

		// If any listeners alter url and set it to an empty string, abort the ajaxification
		if (url === null) {
			$(window).trigger('action:ajaxify.end', {url: url, tpl_url: ajaxify.data.template.name, title: ajaxify.data.title});
			return false;
		}

		previousBodyClass = ajaxify.data.bodyClass;
		$('#footer, #content').removeClass('hide').addClass('ajaxifying');

		ajaxify.loadData(url, function (err, data) {

			if (!err || (err && err.data && (parseInt(err.data.status, 10) !== 302 && parseInt(err.data.status, 10) !== 308))) {
				ajaxify.updateHistory(url, quiet);
			}

>>>>>>> upstream/master
			if (err) {
				return onAjaxError(err, url, callback, quiet);
			}

<<<<<<< HEAD
			app.template = data.template.name;

			translator.load(config.defaultLang, data.template.name);

			renderTemplate(url, data.template.name, data, startTime, callback);

			require(['search'], function(search) {
				search.topicDOM.end();
=======
			retry = true;
			app.template = data.template.name;

			require(['translator'], function (translator) {
				translator.load(config.defaultLang, data.template.name);
				renderTemplate(url, data.template.name, data, callback);
>>>>>>> upstream/master
			});
		});

		return true;
	};

<<<<<<< HEAD
	ajaxify.handleACPRedirect = function(url) {
		// If ajaxifying into an admin route from regular site, do a cold load.
		url = ajaxify.removeRelativePath(url.replace(/\/$/, ''));
		if (url.indexOf('admin') === 0 && window.location.pathname.indexOf('/admin') !== 0) {
			window.open(RELATIVE_PATH + '/' + url, '_blank');
			return true;
		}
		return false;
	}

	ajaxify.start = function(url, quiet, search) {
		url = ajaxify.removeRelativePath(url.replace(/\/$/, ''));
		var hash = window.location.hash;
		search = search || '';

		$(window).trigger('action:ajaxify.start', {url: url});

		ajaxify.currentPage = url;

		if (window.history && window.history.pushState) {
			window.history[!quiet ? 'pushState' : 'replaceState']({
				url: url + search + hash
			}, url, RELATIVE_PATH + '/' + url + search + hash);
		}
		return url;
	};

	function onAjaxError(err, url, callback, quiet) {
		var data = err.data,
			textStatus = err.textStatus;

		if (data) {
			var status = parseInt(data.status, 10);

			if (status === 403 || status === 404 || status === 500) {
				$('#footer, #content').removeClass('hide').addClass('ajaxifying');
				return renderTemplate(url, status.toString(), data.responseJSON, (new Date()).getTime(), callback);
			} else if (status === 401) {
				app.alertError('[[global:please_log_in]]');
				app.previousUrl = url;
				return ajaxify.go('login');
			} else if (status === 302) {
				if (data.responseJSON.external) {
					window.location.href = data.responseJSON.external;
				} else if (typeof data.responseJSON === 'string') {
=======
	ajaxify.handleRedirects = function (url) {
		url = ajaxify.removeRelativePath(url.replace(/\/$/, '')).toLowerCase();
		var isClientToAdmin = url.startsWith('admin') && window.location.pathname.indexOf(RELATIVE_PATH + '/admin') !== 0;
		var isAdminToClient = !url.startsWith('admin') && window.location.pathname.indexOf(RELATIVE_PATH + '/admin') === 0;
		var uploadsOrApi = url.startsWith('uploads') || url.startsWith('api');
		if (isClientToAdmin || isAdminToClient || uploadsOrApi) {
			window.open(RELATIVE_PATH + '/' + url, '_top');
			return true;
		}
		return false;
	};


	ajaxify.start = function (url) {
		url = ajaxify.removeRelativePath(url.replace(/^\/|\/$/g, ''));

		var payload = {
			url: url
		};

		$(window).trigger('action:ajaxify.start', payload);

		return payload.url;
	};

	ajaxify.updateHistory = function (url, quiet) {
		ajaxify.currentPage = url.split(/[?#]/)[0];
		if (window.history && window.history.pushState) {
			window.history[!quiet ? 'pushState' : 'replaceState']({
				url: url
			}, url, RELATIVE_PATH + '/' + url);
		}
	};

	function onAjaxError(err, url, callback, quiet) {
		var data = err.data;
		var textStatus = err.textStatus;

		if (data) {
			var status = parseInt(data.status, 10);
			if (status === 403 || status === 404 || status === 500 || status === 502 || status === 503) {
				if (status === 502 && retry) {
					retry = false;
					ajaxifyTimer = undefined;
					return ajaxify.go(url, callback, quiet);
				}
				if (status === 502) {
					status = 500;
				}
				if (data.responseJSON) {
					data.responseJSON.config = config;
				}

				$('#footer, #content').removeClass('hide').addClass('ajaxifying');
				return renderTemplate(url, status.toString(), data.responseJSON || {}, callback);
			} else if (status === 401) {
				app.alertError('[[global:please_log_in]]');
				app.previousUrl = url;
				window.location.href = config.relative_path + '/login';
				return;
			} else if (status === 302 || status === 308) {
				if (data.responseJSON && data.responseJSON.external) {
					window.location.href = data.responseJSON.external;
				} else if (typeof data.responseJSON === 'string') {
					ajaxifyTimer = undefined;
>>>>>>> upstream/master
					ajaxify.go(data.responseJSON.slice(1), callback, quiet);
				}
			}
		} else if (textStatus !== 'abort') {
			app.alertError(data.responseJSON.error);
		}
	}

<<<<<<< HEAD
	function renderTemplate(url, tpl_url, data, startTime, callback) {
		var animationDuration = parseFloat($('#content').css('transition-duration')) || 0.2;
		$(window).trigger('action:ajaxify.loadingTemplates', {});

		templates.parse(tpl_url, data, function(template) {
			translator.translate(template, function(translatedTemplate) {
				setTimeout(function() {
					$('#content').html(translatedTemplate);

					ajaxify.end(url, tpl_url);

					if (typeof callback === 'function') {
						callback();
					}

					$('#content, #footer').removeClass('ajaxifying');

					app.refreshTitle(url);
				}, animationDuration * 1000 - ((new Date()).getTime() - startTime));
=======
	function renderTemplate(url, tpl_url, data, callback) {
		$(window).trigger('action:ajaxify.loadingTemplates', {});

		templates.parse(tpl_url, data, function (template) {
			translator.translate(template, function (translatedTemplate) {
				translatedTemplate = translator.unescape(translatedTemplate);
				$('body').removeClass(previousBodyClass).addClass(data.bodyClass);
				$('#content').html(translatedTemplate);

				ajaxify.end(url, tpl_url);

				if (typeof callback === 'function') {
					callback();
				}

				$('#content, #footer').removeClass('ajaxifying');

				app.refreshTitle(data.title);
>>>>>>> upstream/master
			});
		});
	}

<<<<<<< HEAD
	ajaxify.end = function(url, tpl_url) {
		ajaxify.variables.parse();

		ajaxify.loadScript(tpl_url);

		ajaxify.widgets.render(tpl_url, url, function() {
			$(window).trigger('action:ajaxify.end', {url: url});
		});

		$(window).trigger('action:ajaxify.contentLoaded', {url: url});

		app.processPage();
	};

	ajaxify.removeRelativePath = function(url) {
		if (url.indexOf(RELATIVE_PATH.slice(1)) === 0) {
=======
	ajaxify.end = function (url, tpl_url) {
		function done() {
			if (--count === 0) {
				$(window).trigger('action:ajaxify.end', {url: url, tpl_url: tpl_url, title: ajaxify.data.title});
			}
		}
		var count = 2;

		ajaxify.loadScript(tpl_url, done);

		ajaxify.widgets.render(tpl_url, url, done);

		$(window).trigger('action:ajaxify.contentLoaded', {url: url, tpl: tpl_url});

		app.processPage();

		var timeElapsed = Date.now() - ajaxifyTimer;
		if (config.environment === 'development' && !isNaN(timeElapsed)) {
			console.info('[ajaxify /' + url + '] Time elapsed:', timeElapsed + 'ms');
		}
	};

	ajaxify.parseData = function () {
		var dataEl = $('#ajaxify-data');
		if (dataEl.length) {
			ajaxify.data = JSON.parse(dataEl.text());
			dataEl.remove();
		}
	};

	ajaxify.removeRelativePath = function (url) {
		if (url.startsWith(RELATIVE_PATH.slice(1))) {
>>>>>>> upstream/master
			url = url.slice(RELATIVE_PATH.length);
		}
		return url;
	};

<<<<<<< HEAD
	ajaxify.refresh = function() {
		ajaxify.go(ajaxify.currentPage);
	};

	ajaxify.loadScript = function(tpl_url, callback) {
		var location = !app.inAdmin ? 'forum/' : '';

		require([location + tpl_url], function(script) {
=======
	ajaxify.refresh = function (callback) {
		ajaxify.go(ajaxify.currentPage + window.location.search + window.location.hash, callback, true);
	};

	ajaxify.loadScript = function (tpl_url, callback) {
		var location = !app.inAdmin ? 'forum/' : '';

		if (tpl_url.startsWith('admin')) {
			location = '';
		}
		var data = {
			tpl_url: tpl_url,
			scripts: [location + tpl_url]
		};

		$(window).trigger('action:script.load', data);

		require(data.scripts, function (script) {
>>>>>>> upstream/master
			if (script && script.init) {
				script.init();
			}

			if (callback) {
				callback();
			}
		});
	};

<<<<<<< HEAD
	ajaxify.loadData = function(url, callback) {
=======
	ajaxify.loadData = function (url, callback) {
>>>>>>> upstream/master
		url = ajaxify.removeRelativePath(url);

		$(window).trigger('action:ajaxify.loadingData', {url: url});

		apiXHR = $.ajax({
			url: RELATIVE_PATH + '/api/' + url,
			cache: false,
<<<<<<< HEAD
			success: function(data) {
=======
			headers: {
				'X-Return-To': app.previousUrl
			},
			success: function (data) {
>>>>>>> upstream/master
				if (!data) {
					return;
				}

<<<<<<< HEAD
				data.relative_path = RELATIVE_PATH;

				if (callback) {
					callback(null, data);
				}
			},
			error: function(data, textStatus) {
=======
				ajaxify.data = data;
				data.config = config;

				$(window).trigger('action:ajaxify.dataLoaded', {url: url, data: data});

				callback(null, data);
			},
			error: function (data, textStatus) {
>>>>>>> upstream/master
				if (data.status === 0 && textStatus === 'error') {
					data.status = 500;
				}
				callback({
					data: data,
					textStatus: textStatus
				});
			}
		});
	};

<<<<<<< HEAD
	ajaxify.loadTemplate = function(template, callback) {
=======
	ajaxify.loadTemplate = function (template, callback) {
>>>>>>> upstream/master
		if (templates.cache[template]) {
			callback(templates.cache[template]);
		} else {
			$.ajax({
				url: RELATIVE_PATH + '/templates/' + template + '.tpl' + (config['cache-buster'] ? '?v=' + config['cache-buster'] : ''),
				type: 'GET',
<<<<<<< HEAD
				success: function(data) {
					callback(data.toString());
				},
				error: function(error) {
=======
				success: function (data) {
					callback(data.toString());
				},
				error: function (error) {
>>>>>>> upstream/master
					throw new Error("Unable to load template: " + template + " (" + error.statusText + ")");
				}
			});
		}
	};

	function ajaxifyAnchors() {
<<<<<<< HEAD
		templates.registerLoader(ajaxify.loadTemplate);

		if (!window.history || !window.history.pushState) {
			return; // no ajaxification for old browsers
		}

		function hrefEmpty(href) {
			return href === undefined || href === '' || href === 'javascript:;' || href === window.location.href + "#" || href.slice(0, 1) === "#";
		}

		// Enhancing all anchors to ajaxify...
		$(document.body).on('click', 'a', function (e) {
			if (this.target !== '') {
				return;
			} else if (hrefEmpty(this.href) || this.protocol === 'javascript:' || $(this).attr('data-ajaxify') === 'false') {
				return e.preventDefault();
			}

			if (!window.location.pathname.match(/\/(403|404)$/g)) {
				app.previousUrl = window.location.href;
			}

			if (!e.ctrlKey && !e.shiftKey && !e.metaKey && e.which === 1) {
				if (this.host === '' || this.host === window.location.host) {
					// Internal link
					var url = this.href.replace(rootUrl + '/', '');

					if(window.location.pathname === this.pathname && this.hash) {
						if (this.hash !== window.location.hash) {
							window.location.hash = this.hash;
						}

						e.preventDefault();
					} else {
						if (ajaxify.go(url)) {
							e.preventDefault();
						}
					}
				} else if (window.location.pathname !== '/outgoing') {
					// External Link
					if (config.openOutgoingLinksInNewTab) {
						window.open(this.href, '_blank');
						e.preventDefault();
					} else if (config.useOutgoingLinksPage) {
						ajaxify.go('outgoing?url=' + encodeURIComponent(this.href));
						e.preventDefault();
					}
				}
			}
		});
	}

	ajaxifyAnchors();
	app.load();
	templates.cache['500'] = $('.tpl-500').html();
=======
		function hrefEmpty(href) {
			return href === undefined || href === '' || href === 'javascript:;';
		}

		var contentEl = document.getElementById('content');

		// Enhancing all anchors to ajaxify...
		$(document.body).on('click', 'a', function (e) {
			var _self = this;
			var process = function () {
				if (!e.ctrlKey && !e.shiftKey && !e.metaKey && e.which === 1) {
					if (internalLink) {
						var pathname = this.href.replace(rootUrl + RELATIVE_PATH + '/', '');

						// Special handling for urls with hashes
						if (window.location.pathname === this.pathname && this.hash.length) {
							window.location.hash = this.hash;
						} else {
							if (ajaxify.go(pathname)) {
								e.preventDefault();
							}
						}
					} else if (window.location.pathname !== '/outgoing') {
						if (config.openOutgoingLinksInNewTab && $.contains(contentEl, this)) {
							window.open(this.href, '_blank');
							e.preventDefault();
						} else if (config.useOutgoingLinksPage) {
							ajaxify.go('outgoing?url=' + encodeURIComponent(this.href));
							e.preventDefault();
						}
					}
				}
			};

			if (this.target !== '' || (this.protocol !== 'http:' && this.protocol !== 'https:')) {
				return;
			}

			var internalLink = utils.isInternalURI(this, window.location, RELATIVE_PATH);

			if ($(this).attr('data-ajaxify') === 'false') {
				if (!internalLink) {
					return;
				} else {
					return e.preventDefault();
				}
			}

			// Default behaviour for rss feeds
			if (internalLink && $(this).attr('href').endsWith('.rss')) {
				return;
			}

			if (hrefEmpty(this.href) || this.protocol === 'javascript:' || $(this).attr('href') === '#') {
				return e.preventDefault();
			}

			if (app.flags && app.flags.hasOwnProperty('_unsaved') && app.flags._unsaved === true) {
				translator.translate('[[global:unsaved-changes]]', function (text) {
					bootbox.confirm(text, function (navigate) {
						if (navigate) {
							app.flags._unsaved = false;
							process.call(_self);
						}
					});
				});
				return e.preventDefault();
			}

			process.call(_self);
		});
	}

	templates.registerLoader(ajaxify.loadTemplate);

	if (window.history && window.history.pushState) {
		// Progressive Enhancement, ajaxify available only to modern browsers
		ajaxifyAnchors();
	}

	app.load();

	$('[type="text/tpl"][data-template]').each(function () {
		templates.cache[$(this).attr('data-template')] = $('<div/>').html($(this).html()).text();
		$(this).parent().remove();
	});
>>>>>>> upstream/master

});
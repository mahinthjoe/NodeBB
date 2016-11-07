"use strict";

<<<<<<< HEAD
var async = require('async'),
	validator = require('validator'),

	_ = require('underscore'),
	db = require('./database'),
	posts = require('./posts'),
	utils = require('../public/src/utils'),
	plugins = require('./plugins'),
	user = require('./user'),
	categories = require('./categories'),
	privileges = require('./privileges');

(function(Topics) {

=======
var async = require('async');
var _ = require('underscore');

var db = require('./database');
var posts = require('./posts');
var utils = require('../public/src/utils');
var plugins = require('./plugins');
var user = require('./user');
var categories = require('./categories');
var privileges = require('./privileges');
var social = require('./social');

(function (Topics) {

	require('./topics/data')(Topics);
>>>>>>> upstream/master
	require('./topics/create')(Topics);
	require('./topics/delete')(Topics);
	require('./topics/unread')(Topics);
	require('./topics/recent')(Topics);
	require('./topics/popular')(Topics);
	require('./topics/user')(Topics);
	require('./topics/fork')(Topics);
	require('./topics/posts')(Topics);
	require('./topics/follow')(Topics);
	require('./topics/tags')(Topics);
	require('./topics/teaser')(Topics);
	require('./topics/suggested')(Topics);
<<<<<<< HEAD

	Topics.exists = function(tid, callback) {
		db.isSortedSetMember('topics:tid', tid, callback);
	};

	Topics.getTopicData = function(tid, callback) {
		db.getObject('topic:' + tid, function(err, topic) {
			if (err || !topic) {
				return callback(err);
			}
			modifyTopic(topic, callback);
		});
	};

	Topics.getTopicsData = function(tids, callback) {
		var keys = [];

		for (var i=0; i<tids.length; ++i) {
			keys.push('topic:' + tids[i]);
		}

		db.getObjects(keys, function(err, topics) {
			if (err) {
				return callback(err);
			}
			async.map(topics, modifyTopic, callback);
		});
	};

	function modifyTopic(topic, callback) {
		if (!topic) {
			return callback(null, topic);
		}
		topic.title = validator.escape(topic.title);
		topic.relativeTime = utils.toISOString(topic.timestamp);
		callback(null, topic);
	}

	Topics.getPageCount = function(tid, uid, callback) {
		Topics.getTopicField(tid, 'postcount', function(err, postCount) {
=======
	require('./topics/tools')(Topics);
	require('./topics/thumb')(Topics);

	Topics.exists = function (tid, callback) {
		db.isSortedSetMember('topics:tid', tid, callback);
	};

	Topics.getPageCount = function (tid, uid, callback) {
		Topics.getTopicField(tid, 'postcount', function (err, postCount) {
>>>>>>> upstream/master
			if (err) {
				return callback(err);
			}
			if (!parseInt(postCount, 10)) {
				return callback(null, 1);
			}
<<<<<<< HEAD
			user.getSettings(uid, function(err, settings) {
=======
			user.getSettings(uid, function (err, settings) {
>>>>>>> upstream/master
				if (err) {
					return callback(err);
				}

				callback(null, Math.ceil((parseInt(postCount, 10) - 1) / settings.postsPerPage));
			});
		});
	};

<<<<<<< HEAD
	Topics.getTidPage = function(tid, uid, callback) {
=======
	Topics.getTidPage = function (tid, uid, callback) {
>>>>>>> upstream/master
		if(!tid) {
			return callback(new Error('[[error:invalid-tid]]'));
		}

		async.parallel({
<<<<<<< HEAD
			index: function(next) {
				categories.getTopicIndex(tid, next);
			},
			settings: function(next) {
				user.getSettings(uid, next);
			}
		}, function(err, results) {
			if(err) {
=======
			index: function (next) {
				categories.getTopicIndex(tid, next);
			},
			settings: function (next) {
				user.getSettings(uid, next);
			}
		}, function (err, results) {
			if (err) {
>>>>>>> upstream/master
				return callback(err);
			}
			callback(null, Math.ceil((results.index + 1) / results.settings.topicsPerPage));
		});
	};

<<<<<<< HEAD
	Topics.getCategoryData = function(tid, callback) {
		Topics.getTopicField(tid, 'cid', function(err, cid) {
			if (err) {
				callback(err);
			}

			categories.getCategoryData(cid, callback);
		});
	};

	Topics.getTopicsFromSet = function(set, uid, start, end, callback) {
		async.waterfall([
			function(next) {
				db.getSortedSetRevRange(set, start, end, next);
			},
			function(tids, next) {
				Topics.getTopics(tids, uid, next);
			},
			function(topics, next) {
				next(null, {topics: topics, nextStart: end + 1});
=======
	Topics.getTopicsFromSet = function (set, uid, start, stop, callback) {
		async.waterfall([
			function (next) {
				db.getSortedSetRevRange(set, start, stop, next);
			},
			function (tids, next) {
				Topics.getTopics(tids, uid, next);
			},
			function (topics, next) {
				next(null, {topics: topics, nextStart: stop + 1});
>>>>>>> upstream/master
			}
		], callback);
	};

<<<<<<< HEAD
	Topics.getTopics = function(tids, uid, callback) {
		async.waterfall([
			function(next) {
				privileges.topics.filter('read', tids, uid, next);
			},
			function(tids, next) {
=======
	Topics.getTopics = function (tids, uid, callback) {
		async.waterfall([
			function (next) {
				privileges.topics.filterTids('read', tids, uid, next);
			},
			function (tids, next) {
>>>>>>> upstream/master
				Topics.getTopicsByTids(tids, uid, next);
			}
		], callback);
	};

<<<<<<< HEAD
	Topics.getTopicsByTids = function(tids, uid, callback) {
=======
	Topics.getTopicsByTids = function (tids, uid, callback) {
>>>>>>> upstream/master
		if (!Array.isArray(tids) || !tids.length) {
			return callback(null, []);
		}

<<<<<<< HEAD
		Topics.getTopicsData(tids, function(err, topics) {
			function mapFilter(array, field) {
				return array.map(function(topic) {
					return topic && topic[field] && topic[field].toString();
				}).filter(function(value, index, array) {
					return utils.isNumber(value) && array.indexOf(value) === index;
				});
			}

			if (err) {
				return callback(err);
			}

			var uids = mapFilter(topics, 'uid');
			var cids = mapFilter(topics, 'cid');

			async.parallel({
				teasers: function(next) {
					Topics.getTeasers(topics, next);
				},
				users: function(next) {
					user.getMultipleUserFields(uids, ['uid', 'username', 'userslug', 'picture'], next);
				},
				categories: function(next) {
					categories.getMultipleCategoryFields(cids, ['cid', 'name', 'slug', 'icon', 'bgColor', 'color', 'disabled'], next);
				},
				hasRead: function(next) {
					Topics.hasReadTopics(tids, uid, next);
				},
				tags: function(next) {
					Topics.getTopicsTagsObjects(tids, next);
				}
			}, function(err, results) {
				if (err) {
					return callback(err);
				}

				var users = _.object(uids, results.users);
				var categories = _.object(cids, results.categories);

				for (var i=0; i<topics.length; ++i) {
=======
		var uids, cids, topics;

		async.waterfall([
			function (next) {
				Topics.getTopicsData(tids, next);
			},
			function (_topics, next) {
				function mapFilter(array, field) {
					return array.map(function (topic) {
						return topic && topic[field] && topic[field].toString();
					}).filter(function (value, index, array) {
						return utils.isNumber(value) && array.indexOf(value) === index;
					});
				}

				topics = _topics;
				uids = mapFilter(topics, 'uid');
				cids = mapFilter(topics, 'cid');

				async.parallel({
					users: function (next) {
						user.getUsersFields(uids, ['uid', 'username', 'fullname', 'userslug', 'reputation', 'postcount', 'picture', 'signature', 'banned', 'status'], next);
					},
					categories: function (next) {
						categories.getCategoriesFields(cids, ['cid', 'name', 'slug', 'icon', 'image', 'bgColor', 'color', 'disabled'], next);
					},
					hasRead: function (next) {
						Topics.hasReadTopics(tids, uid, next);
					},
					isIgnored: function (next) {
						Topics.isIgnoring(tids, uid, next);
					},
					bookmarks: function (next) {
						Topics.getUserBookmarks(tids, uid, next);
					},
					teasers: function (next) {
						Topics.getTeasers(topics, next);
					},
					tags: function (next) {
						Topics.getTopicsTagsObjects(tids, next);
					}
				}, next);
			},
			function (results, next) {
				var users = _.object(uids, results.users);
				var categories = _.object(cids, results.categories);

				for (var i = 0; i < topics.length; ++i) {
>>>>>>> upstream/master
					if (topics[i]) {
						topics[i].category = categories[topics[i].cid];
						topics[i].user = users[topics[i].uid];
						topics[i].teaser = results.teasers[i];
						topics[i].tags = results.tags[i];

						topics[i].isOwner = parseInt(topics[i].uid, 10) === parseInt(uid, 10);
						topics[i].pinned = parseInt(topics[i].pinned, 10) === 1;
						topics[i].locked = parseInt(topics[i].locked, 10) === 1;
						topics[i].deleted = parseInt(topics[i].deleted, 10) === 1;
<<<<<<< HEAD
						topics[i].unread = !results.hasRead[i];
						topics[i].unreplied = parseInt(topics[i].postcount, 10) <= 1;
					}
				}

				topics = topics.filter(function(topic) {
					return topic &&	topic.category && !topic.category.disabled;
				});

				plugins.fireHook('filter:topics.get', {topics: topics, uid: uid}, function(err, topicData) {
					callback(err, topicData.topics);
				});
			});
		});
	};

	Topics.getTopicWithPosts = function(tid, set, uid, start, end, reverse, callback) {
		Topics.getTopicData(tid, function(err, topicData) {
			if (err || !topicData) {
				return callback(err || new Error('[[error:no-topic]]'));
			}

			async.parallel({
				posts: async.apply(getMainPostAndReplies, topicData, set, uid, start, end, reverse),
				category: async.apply(Topics.getCategoryData, tid),
				threadTools: async.apply(plugins.fireHook, 'filter:topic.thread_tools', {topic: topicData, uid: uid, tools: []}),
				tags: async.apply(Topics.getTopicTagsObjects, tid),
				isFollowing: async.apply(Topics.isFollowing, [tid], uid)
			}, function(err, results) {
				if (err) {
					return callback(err);
				}

				topicData.posts = results.posts;
				topicData.category = results.category;
				topicData.thread_tools = results.threadTools.tools;
				topicData.tags = results.tags;
				topicData.isFollowing = results.isFollowing[0];
=======
						topics[i].ignored = results.isIgnored[i];
						topics[i].unread = !results.hasRead[i] && !results.isIgnored[i];
						topics[i].bookmark = results.bookmarks[i];
						topics[i].unreplied = !topics[i].teaser;

						topics[i].icons = [];
					}
				}

				topics = topics.filter(function (topic) {
					return topic &&	topic.category && !topic.category.disabled;
				});

				plugins.fireHook('filter:topics.get', {topics: topics, uid: uid}, next);
			},
			function (data, next) {
				next(null, data.topics);
			}
		], callback);
	};

	Topics.getTopicWithPosts = function (topicData, set, uid, start, stop, reverse, callback) {
		async.waterfall([
			function (next) {
				async.parallel({
					posts: async.apply(getMainPostAndReplies, topicData, set, uid, start, stop, reverse),
					category: async.apply(Topics.getCategoryData, topicData.tid),
					threadTools: async.apply(plugins.fireHook, 'filter:topic.thread_tools', {topic: topicData, uid: uid, tools: []}),
					isFollowing: async.apply(Topics.isFollowing, [topicData.tid], uid),
					isIgnoring: async.apply(Topics.isIgnoring, [topicData.tid], uid),
					bookmark: async.apply(Topics.getUserBookmark, topicData.tid, uid),
					postSharing: async.apply(social.getActivePostSharing),
					related: function (next) {
						async.waterfall([
							function (next) {
								Topics.getTopicTagsObjects(topicData.tid, next);
							},
							function (tags, next) {
								topicData.tags = tags;
								Topics.getRelatedTopics(topicData, uid, next);
							}
						], next);
					}
				}, next);
			},
			function (results, next) {
				topicData.posts = results.posts;
				topicData.category = results.category;
				topicData.thread_tools = results.threadTools.tools;
				topicData.isFollowing = results.isFollowing[0];
				topicData.isNotFollowing = !results.isFollowing[0] && !results.isIgnoring[0];
				topicData.isIgnoring = results.isIgnoring[0];
				topicData.bookmark = results.bookmark;
				topicData.postSharing = results.postSharing;
				topicData.related = results.related || [];
>>>>>>> upstream/master

				topicData.unreplied = parseInt(topicData.postcount, 10) === 1;
				topicData.deleted = parseInt(topicData.deleted, 10) === 1;
				topicData.locked = parseInt(topicData.locked, 10) === 1;
				topicData.pinned = parseInt(topicData.pinned, 10) === 1;

<<<<<<< HEAD
				plugins.fireHook('filter:topic.get', {topic: topicData, uid: uid}, function(err, data) {
					callback(err, data ? data.topic : null);
				});
			});
		});
	};

	function getMainPostAndReplies(topic, set, uid, start, end, reverse, callback) {
		async.waterfall([
			function(next) {
				posts.getPidsFromSet(set, start, end, reverse, next);
			},
			function(pids, next) {
=======
				topicData.icons = [];

				plugins.fireHook('filter:topic.get', {topic: topicData, uid: uid}, next);
			},
			function (data, next) {
				next(null, data.topic);
			}
		], callback);
	};

	function getMainPostAndReplies(topic, set, uid, start, stop, reverse, callback) {
		async.waterfall([
			function (next) {
				posts.getPidsFromSet(set, start, stop, reverse, next);
			},
			function (pids, next) {
>>>>>>> upstream/master
				if ((!Array.isArray(pids) || !pids.length) && !topic.mainPid) {
					return callback(null, []);
				}

<<<<<<< HEAD
				if (topic.mainPid) {
=======
				if (topic.mainPid && start === 0) {
>>>>>>> upstream/master
					pids.unshift(topic.mainPid);
				}
				posts.getPostsByPids(pids, uid, next);
			},
<<<<<<< HEAD
			function(posts, next) {
				var indices = Topics.calculatePostIndices(start, end, topic.postcount, reverse);
				posts.forEach(function(post, index) {
					if (post) {
						post.index = indices[index] - 1;
					}
				});

				Topics.addPostData(posts, uid, callback);
			}
		]);
	}

	Topics.getMainPost = function(tid, uid, callback) {
		Topics.getMainPosts([tid], uid, function(err, mainPosts) {
=======
			function (posts, next) {
				if (!posts.length) {
					return next(null, []);
				}
				var replies = posts;
				if (topic.mainPid && start === 0) {
					posts[0].index = 0;
					replies = posts.slice(1);
				}

				Topics.calculatePostIndices(replies, start, stop, topic.postcount, reverse);

				Topics.addPostData(posts, uid, next);
			}
		], callback);
	}

	Topics.getMainPost = function (tid, uid, callback) {
		Topics.getMainPosts([tid], uid, function (err, mainPosts) {
>>>>>>> upstream/master
			callback(err, Array.isArray(mainPosts) && mainPosts.length ? mainPosts[0] : null);
		});
	};

<<<<<<< HEAD
	Topics.getMainPids = function(tids, callback) {
		Topics.getTopicsFields(tids, ['mainPid'], function(err, topicData) {
=======
	Topics.getMainPids = function (tids, callback) {
		if (!Array.isArray(tids) || !tids.length) {
			return callback(null, []);
		}

		Topics.getTopicsFields(tids, ['mainPid'], function (err, topicData) {
>>>>>>> upstream/master
			if (err) {
				return callback(err);
			}

<<<<<<< HEAD
			var mainPids = topicData.map(function(topic) {
				return topic ? topic.mainPid : null;
=======
			var mainPids = topicData.map(function (topic) {
				return topic && topic.mainPid;
>>>>>>> upstream/master
			});
			callback(null, mainPids);
		});
	};

<<<<<<< HEAD
	Topics.getMainPosts = function(tids, uid, callback) {
		Topics.getMainPids(tids, function(err, mainPids) {
=======
	Topics.getMainPosts = function (tids, uid, callback) {
		Topics.getMainPids(tids, function (err, mainPids) {
>>>>>>> upstream/master
			if (err) {
				return callback(err);
			}
			getMainPosts(mainPids, uid, callback);
		});
	};

	function getMainPosts(mainPids, uid, callback) {
<<<<<<< HEAD
		posts.getPostsByPids(mainPids, uid, function(err, postData) {
			if (err) {
				return callback(err);
			}
			postData.forEach(function(post) {
=======
		posts.getPostsByPids(mainPids, uid, function (err, postData) {
			if (err) {
				return callback(err);
			}
			postData.forEach(function (post) {
>>>>>>> upstream/master
				if (post) {
					post.index = 0;
				}
			});
			Topics.addPostData(postData, uid, callback);
		});
	}

<<<<<<< HEAD
	Topics.getTopicField = function(tid, field, callback) {
		db.getObjectField('topic:' + tid, field, callback);
	};

	Topics.getTopicFields = function(tid, fields, callback) {
		db.getObjectFields('topic:' + tid, fields, callback);
	};

	Topics.getTopicsFields = function(tids, fields, callback) {
		if (!Array.isArray(tids) || !tids.length) {
			return callback(null, []);
		}
		var keys = tids.map(function(tid) {
			return 'topic:' + tid;
		});
		db.getObjectsFields(keys, fields, callback);
	};

	Topics.setTopicField = function(tid, field, value, callback) {
		db.setObjectField('topic:' + tid, field, value, callback);
	};

	Topics.isLocked = function(tid, callback) {
		Topics.getTopicField(tid, 'locked', function(err, locked) {
=======
	Topics.getUserBookmark = function (tid, uid, callback) {
		db.sortedSetScore('tid:' + tid + ':bookmarks', uid, callback);
	};

	Topics.getUserBookmarks = function (tids, uid, callback) {
		if (!parseInt(uid, 10)) {
			return callback(null, tids.map(function () {
				return null;
			}));
		}
		db.sortedSetsScore(tids.map(function (tid) {
			return 'tid:' + tid + ':bookmarks';
		}), uid, callback);
	};

	Topics.setUserBookmark = function (tid, uid, index, callback) {
		db.sortedSetAdd('tid:' + tid + ':bookmarks', index, uid, callback);
	};

	Topics.isLocked = function (tid, callback) {
		Topics.getTopicField(tid, 'locked', function (err, locked) {
>>>>>>> upstream/master
			callback(err, parseInt(locked, 10) === 1);
		});
	};

<<<<<<< HEAD
	Topics.search = function(tid, term, callback) {
=======
	Topics.search = function (tid, term, callback) {
>>>>>>> upstream/master
		if (plugins.hasListeners('filter:topic.search')) {
			plugins.fireHook('filter:topic.search', {
				tid: tid,
				term: term
			}, callback);
		} else {
			callback(new Error('no-plugins-available'), []);
		}
	};

<<<<<<< HEAD
=======
	Topics.getTopicBookmarks = function (tid, callback) {
		db.getSortedSetRangeWithScores(['tid:' + tid + ':bookmarks'], 0, -1, callback);
	};

	Topics.updateTopicBookmarks = function (tid, pids, callback) {
		var maxIndex;

		async.waterfall([
			function (next) {
				Topics.getPostCount(tid, next);
			},
			function (postcount, next) {
				maxIndex = postcount;
				Topics.getTopicBookmarks(tid, next);
			},
			function (bookmarks, next) {
				var forkedPosts = pids.map(function (pid) {
					return {pid: pid, tid: tid};
				});

				var uidData = bookmarks.map(function (bookmark) {
					return {
						uid: bookmark.value,
						bookmark: bookmark.score
					};
				});

				async.eachLimit(uidData, 50, function (data, next) {
					posts.getPostIndices(forkedPosts, data.uid, function (err, postIndices) {
						if (err) {
							return next(err);
						}

						var bookmark = data.bookmark;
						bookmark = bookmark < maxIndex ? bookmark : maxIndex;

						for (var i = 0; i < postIndices.length && postIndices[i] < data.bookmark; ++i) {
							--bookmark;
						}

						if (parseInt(bookmark, 10) !== parseInt(data.bookmark, 10)) {
							Topics.setUserBookmark(tid, data.uid, bookmark, next);
						} else {
							next();
						}
					});
				}, next);
			}
		], function (err) {
			callback(err);
		});
	};
>>>>>>> upstream/master
}(exports));

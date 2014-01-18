/*
Store Install v0.2
Copyright (c) 2013 Rémy Boulanouar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($) {
	$(document).ready(function() {
		$('.storeinstall').each(function() {
			var url = "";

			// Firefox marketplace test
			if($(this).attr('data-id') === undefined) {
				url = "https://addons.mozilla.org/en/firefox/addon/" + $(this).attr('data-name');
			}else {
				url = "https://chrome.google.com/webstore/detail/" + $(this).attr('data-name') + "/" + $(this).attr('data-id');
			}

			makeButton(url, this, {
				isChromeStore: $(this).attr('data-id') !== undefined ? true : false,
				display: $(this).attr('data-display') || 'none',
				annotation: $(this).attr('data-annotation') || 'name',
				url: $(this).attr('data-url') || 'yes',
				size: $(this).attr('data-size') || 'standard'
			});
		});
	});

	// Make a button with the number of installation
	function makeButton(url, tag, options) {
		$.getJSON("http://query.yahooapis.com/v1/public/yql?" +
			"q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(url) +
			"%22&format=json'&callback=?",
			function (data) {
				// Parse HTML Chrome page
				var nbInstall = $('<div/>');

				var user = ""; // Number of installation
				var name = ""; // Name of the extension
				var img = "";  // Url of the image of the extension

				if(options.isChromeStore) {
					nbInstall.html(filterData(data.results[0]));
					nbInstall.html(nbInstall.children('noscript').last().html());
					nbInstall.html(nbInstall.text());

					user = $('span:contains(" users")', nbInstall).text();
					user = user.substring(0, user.indexOf(' '));
					name = $('h1:first-child()', nbInstall).text();
					img = $('img:first-child()', nbInstall).attr('src');
				}else {
					nbInstall.html(data.results[0]);
					user = $('#daily-users', nbInstall).text().trim();
					user = user.substring(0, user.indexOf(' '));
					name = $("#addon h1 span:first-child()", nbInstall).text();
					img = $("#addon-icon", nbInstall).attr('src');
				}

				// Add information about installation
				$(nbInstall).html(user).css({
					'font-size': '11px',
					'font-family': 'Roboto, Arial',
					'border': '1px solid #ccc',
					'min-width': '10px',
					'background-color': '#fff',
					'margin-left': '5px',
					'position': 'relative',
					'text-align': 'center',
					'-moz-border-radius': '3px',
					'-webkit-border-radius': '3px',
					'padding-left': '2px',
					'padding-right': '2px',
					'line-height': '1.428571429'
				});

				// Append information about the nice border
				var arrow = $('<div/>');
				arrow.css({
					'border-color': 'transparent #fff transparent transparent',
					'border-style': 'solid',
					'border-width': '5px',
					'height': '0',
					'width': '0',
					'position': 'absolute',
					'left': '-9px',
					'top': '2px'
				});
				var arrowBorder = $('<div/>');
				arrowBorder.css({
					'border-color': 'transparent #ccc transparent transparent',
					'border-style': 'solid',
					'border-width': '5px',
					'height': '0',
					'width': '0',
					'position': 'absolute',
					'left': '-10px',
					'top': '2px'
				});
				$(nbInstall).append(arrowBorder).append(arrow);

				// Handle "data-annotation"
				if(options.annotation !== 'none' && options.annotation !== 'icon') {
					var annotation = $('<div/>');
					annotation.text(name).css({
						'font-size': '11px',
						'font-family': 'Roboto, Arial',
						'border': '1px solid #ccc',
						'min-width': '10px',
						'background-color': '#fff',
						'margin-left': '5px',
						'position': 'relative',
						'text-align': 'center',
						'-moz-border-radius': '3px',
						'-webkit-border-radius': '3px',
						'padding-left': '2px',
						'padding-right': '2px',
						'line-height': '1.428571429'
					});

					// Handle "data-url"
					if(options.url == 'yes') {
						var link = $("<a/>").attr({
							'href': url,
							'target': '_blank'});
						link.append(annotation);
						$(tag).prepend(link);
					}else {
						$(tag).append(annotation);
					}
				}
				if(options.annotation === 'icon' || options.annotation === 'both') {
					var icon = $('<img/>').attr('src', img).css('margin-right', '-5px');
					// Adjust in case of icon only
					if(options.annotation === 'icon') {
						icon.css('margin-right', '-2px');
					}

					// Handle "data-url"
					if(options.url === 'yes') {
						var link = $("<a/>").attr({
							'href': url,
							'target': '_blank'});
						link.append(icon);
						$(tag).prepend(link);
					}else {
						$(tag).prepend(icon);
					}
				}

				// Handle "data-display"
				if(options.display == 'inline') {
					$(tag).css('display', 'inline');
				}else {
					$(tag).css('display', 'inline-block');
				}

				// Add the box containing the number of install
				$(tag).append(nbInstall);
				$(tag).find('div').css('display', 'inline-block');

				// Handle "data-size"
				switch(options.size) {
					case "standard":
						$(nbInstall).css({'font-size': '14px'});
						if(annotation !== undefined) {
							annotation.css({'font-size': '14px'});
						}
						arrow.css({'top': '5px'});
						arrowBorder.css({'top': '5px'});
						break;
					case "tall":
						$(nbInstall).css({
							'font-size': '16px',
							'display': 'block'
						});
						if(icon !== undefined) {
							// Be sure that the image is loaded to compute width
							icon.load(function() {
								icon.css({
									'left': (($(nbInstall).width()/2 + 8.5) - icon.width()/2) + 'px',
									'position': 'relative'
								});
							});
						}
						if(annotation !== undefined) {
							annotation.css({
								'font-size': '16px',
								'display': 'block'
							});

							$(nbInstall).css({'margin-top': '6px'});
						}
						arrow.css({
							'top': '-9px',
							'border-color': 'transparent transparent #fff transparent',
							'left': ($(nbInstall).width()/2 - 2.5) + 'px'
						});
						arrowBorder.css({
							'top': '-10px',
							'border-color': 'transparent transparent #ccc transparent',
							'left': ($(nbInstall).width()/2 - 2.5) + 'px'
						});
						break;
					default:
				}




				// Remove all useless tag
				$(tag).removeAttr('data-annotation')
					  .removeAttr('data-url')
					  .removeAttr('data-name')
					  .removeAttr('data-id')
					  .removeAttr('data-display')
					  .removeAttr('data-size');
			}
		);
	}

	// Delete some information and arrange some others
	function filterData(data){
		if(data === undefined) return data;
		data = data.replace(/<noscript[^>]*>"([\S\s]*?)"<\/noscript>/g,'$1');
		data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
		data = data.replace(/<script.*\/>/,'');
		return data;
	}

	function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}(jQuery));
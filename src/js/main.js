$(function(){
	function showModal(title, content) {
		/*console.log(title, "\r\n", content);*/
	}
	$.fn.fallbackCopyTextToClipboard = function(text) {
		var textArea = document.createElement("textarea");
		textArea.type = 'text';
		textArea.value = text.replace(/\n/g, "\r\n");
		document.body.appendChild(textArea);
		$(textArea).css({
			'opacity': '0px',
			'position': 'fixed',
			'top': '0px',
			'left': '0px'
		});
		textArea.focus();
		textArea.select();
		try {
			var successful = document.execCommand('copy');
			successful ? (
				showModal("Успешно textarea", text)
			) : (
				showModal("Ошибка", "Ваш браузер не поддерживает копирование в буфер обмена.")
			);
		} catch (err) {
			showModal("Ошибка", "Ваш браузер не поддерживает копирование в буфер обмена.");
		}
		document.body.removeChild(textArea);
	};
	$.fn.copyTextToClipboard = function(text) {
		if (!navigator.clipboard) {
			$.fn.fallbackCopyTextToClipboard(text);
			return;
		}
		var txt = text.replace(/\n/g, "\r\n");
		navigator.clipboard.writeText(txt).then(function() {
			showModal("Успешно clipboard", txt);
		}, function(err) {
			$.fn.fallbackCopyTextToClipboard(text);
		});
	};
	$("pre.prettyprint").each(function(a, b){
		var tpl = '<div class="codewrapper"><div class="codewrapper-buttons"><div class="codewrapper-buttons-row"><span class="btn-code copy"></span><span class="btn-code collapse" data-content="Развернуть"></span></div></div>' + b.outerHTML + '</div></div>';
		$(b).replaceWith(tpl);
	});
	prettyPrint();
	var $codes = $('.codewrapper').on('click', '.btn-code.collapse', function(e){
		var $this = $(e.delegateTarget),
			$pre = $('pre.prettyprint', $this),
			$btn = $(e.target);
		$([$this, $pre]).toggleClass('collapse');
		$btn.attr({
			"data-content": $this.hasClass('collapse') ? "Свернуть" : "Развернуть"
		});
	}).on('click', '.btn-code.copy', function(e){
		var $this = $(e.delegateTarget),
			$pre = $('pre.prettyprint', $this),
			text = $pre[0].innerText;
		$.fn.copyTextToClipboard(text);
	});
	$(window).on('resize.collapse--view', function(e){
		$codes.each(function(a, b){
			var $pre = $('pre.prettyprint', b)[0],
				$btn = $($('.btn-code.collapse', b)[0]);
			$pre && (
				a == 2 && console.log($pre.scrollHeight, $pre.offsetHeight),
				($pre.scrollHeight > $pre.offsetHeight) ? (
					!$(b).hasClass('view--collapse') && $(b).addClass('view--collapse')
				) : (
					!$(b).hasClass('collapse') && $(b).removeClass('view--collapse')
				)
			);
		});
		/*$(window).unbind('.collapse--view');*/
	}).trigger('resize.collapse--view');
});
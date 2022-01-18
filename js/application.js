(function($) {

	var baseurl = 'http://alzheimer.icm-institute.org/';
	var ajaxurl = baseurl + 'ajax.php';
	var timer = setInterval(entete, 3000);

	if (isTouchDevice() === true){
		$('body').addClass('isMobile');
	}


	//## [  ] DEPLOIEMENT AUTOMATIQUE EN CAS D'ANCRE
	if (window.location.hash == '#comprendre'){
		$('.column').stop().addClass('open');
		$('#comprendre').find('.content').stop().slideDown();
	}

	//## [OK] INITIALISATION DES SOUVENIRS QUI TOMBENT
	var timer = window.setTimeout(loop(1), 500);
	$('#visuel').load(function() {
	 	$('#jeanne').find('.grid figure').fadeIn('400');
	});

	// Préparation au tremblement des images
	$('.stand').jrumble({x: 2, y: 2, rotation: 2, speed: 50});


	//## [OK] NAVIGATION ANIMÉE DEPUIS LE HEADER
	$('#header').on('click', '.anchor', function(e){

		e.preventDefault();

		var headHeight = ($('#header').height() * 1.2);
		var hashAnchor = $(this).attr('href');
		var destScroll = ($(hashAnchor).offset().top - headHeight);
		var elemClickr = $(this);

		$('html, body').animate({
			scrollTop: destScroll
		}, 800, 'easeOutQuad', function(){

			if (hashAnchor == '#decouvrir'){
				$(hashAnchor).find('.triggerVideo').trigger('click');
			}

			if (hashAnchor == '#comprendre'){
				$(hashAnchor).find('.column').stop().addClass('open');
				$(hashAnchor).find('.content').stop().slideDown();
			}

		});

	});


	//## [OK] AFFICHAGE DE L'OMBRE PORTÉ DU HEADER SI ON EST EN TRAIN DE SCROLLER
	$(window).on('scroll', function(){
		var pos = $(document).scrollTop();
		if (pos > 0) $('#header').addClass('shade');
		else $('#header').removeClass('shade');
	});


	//## [OK] CONTRÔLE DE LA VIDEO PAR L'API YOUTUBE
	if ($('body').hasClass('isMobile')) {

		$('#decouvrir').on('click', '.triggerVideo', function(e){
			e.preventDefault();
			player.playVideo();
			$('#decouvrir').find('figure, .playButton, .triggerVideo').fadeOut(400);
		});

	} else {

		$('#decouvrir').on('mouseenter', '.triggerVideo', function(){
			$('#decouvrir').find('.wrapper').addClass('hover');
		}).on('mouseleave', '.triggerVideo', function(){
			$('#decouvrir').find('.wrapper').removeClass('hover');
		}).on('click', '.triggerVideo', function(e){
			e.preventDefault();
			player.playVideo();
			$('#decouvrir').find('figure, .playButton, .triggerVideo').fadeOut(400);
		});

	}


	//## [OK] OUVERTURE DES BLOCKS EN SYNCHRONISÉ
	$('#comprendre').on('click', '.openBlocks', function(e){
		e.preventDefault();
		e.stopPropagation();
		console.log('open blocks');
		$('#comprendre').find('.column').stop().toggleClass('open');
		$('#comprendre').find('.content').stop().slideToggle();
	});



	$('body').on('click', '.share a', function(){

		// Définition des variables
		var rel = $(this).attr('rel'), 
			ref = encodeURI(baseurl), 
			txt = encodeURI('Chaque année, 225 000 nouveaux cas de la maladie d’Alzheimer sont diagnostiquées en France.');

		// Préparation de l'URL de partage
		switch(rel){

			case 'facebook': 
				win = true;
				opn = 'https://www.facebook.com/sharer/sharer.php?u=' + ref;
				break;

			// [OK]
			case 'twitter': 
				win = true;
				opn = 'http://twitter.com/share?text=' + txt + '&url=' + ref;
				break;

		}

		if (opn != '' && !win)
			window.open(opn);
		else if (opn != '' && win)
			window.open(opn, rel, "toolbar=no, scrollbars=no, resizable=no, top=500, left=500, width=640, height=320");

		return false;

	});



	//## [OK] FORMULAIRE D'INSCRIPTION
	function processForm(e) {
		
		if (e.preventDefault) e.preventDefault();

		// Récupération des variables
		var civ = $('#civilite').val();
		var pre = $('#prenom').val();
		var nom = $('#nom').val();
		var mel = $('#email').val();

		// Appel des informations en AJAX
		$.ajax({
			type: 'POST', 
			url: ajaxurl, 
			data: {
				'act': 'post', 
				'civ': civ, 
				'pre': pre, 
				'nom': nom, 
				'mel': mel
			}, 
			dataType: 'json'
		}).done(function(datas){
			
			if (datas.err == 0){
				$('#civilite').val('');
				$('#prenom').val('');
				$('#nom').val('');
				$('#email').val('');
				$('#inscription').find('.messg').empty().html(datas.msg);
			}

		});

		return false;

	}

	var form = document.getElementById('inscription');
	if (form.attachEvent) form.attachEvent("submit", processForm);
	else form.addEventListener("submit", processForm);



})(jQuery);

function isTouchDevice(){
	return !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);
}


var player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		videoId: 'uVDPSZPytcw',
		playerVars: { color: 'white' },
		events: { onReady: initialize }
	});
}
function initialize(){}


function loop(num) {
	var rnd = getRandomIntInclusive(300,600);
	var nxt = (num + 1);

	if ($('figure[data-num="'+num+'"]').length > 1 && $('#jeanne').find('.fine').not(':visible')){
		// $('#jeanne').find('.init').hide();
		// $('#jeanne').find('.fine').show();
	}

	if (num > 16){
		window.clearTimeout();
		// startPulse();
	} else {
		setTimeout(function() {
			forget(num);
			loop(nxt);
		}, rnd);
	}
};


function startPulse () {
	$('.stand').eq(getRandomIntInclusive(1,$('.stand').length)).addClass('pulse').trigger('startRumble');
	setTimeout(stopPulse, 1000);
}


function stopPulse () {
	$('.stand.pulse').trigger('stopRumble');
}


function forget(num){

	// Pour chaque element, on lance l'animation
	$('figure[data-num="'+num+'"]').each(function(){

		var elem = $(this), 
			imag = elem.find('img'), 
			hght = $('#jeanne').outerHeight();

		if (imag.hasClass('stand')) return false;

		// Définition des variables pour l'animation
		var unclp = getRandomIntInclusive(-25,25);								// Angle de décrochage
		var time1 = (getRandomIntInclusive(500,1000) / 1000);					// Temps d'animation du décrochage
		var rotat = getRandomIntInclusive(-165,165);							// Angle de rotation de la chute
		var time2 = (getRandomIntInclusive(500,800) / 1000);					// Temps d'animation de la chute
		var dlay2 = 'unclip+='+(getRandomIntInclusive(500,800) / 1000);			// Temps d'attente avant la chute

		elem.css('z-index','2500');
		var tl = new TimelineLite({paused: true});
			// tl.add(TweenLite.set(elem, {scale: 1, rotation: 0, y: 0}) );
			// tl.add(TweenLite.to(elem, time1, {rotation: unclp, transformOrigin: 'top ' + (unclp > 0 ? 'left' : 'right'), ease: Elastic.easeOut}), 'unclip');
			// tl.add(TweenLite.to(elem, time2, {css:{top:(hght*.95)+'px', opacity: 0}, ease: Circ.easeOut}), dlay2 );
			// tl.add(TweenLite.to(elem, time2, {css:{top:(hght*.95)+'px'}, ease: Bounce.easeOut}), dlay2 );
			tl.add(TweenLite.to(elem, time2, {css:{opacity: 0}, ease: Circ.easeOut}), dlay2 );

			tl.play();

	});

}


function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min +1)) + min;
}


function entete () {
	$('#jeanne').find('.init').toggle();
	$('#jeanne').find('.fine').toggle();
}
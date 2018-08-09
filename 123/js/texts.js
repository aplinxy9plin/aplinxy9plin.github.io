"use strict";

//console.log("language :" + _language);

function setText(selector, text)
{
/*
	//console.log(selector  + " -> " + text);
	if (document.querySelector("[data-text='"+selector+"']"))
	{
		document.querySelector("[data-text='"+selector+"']").textContent = text;
	}
*/
	var j;
	for(j = 0;j<document.querySelectorAll("[data-text='"+selector+"']").length;j++)
		document.querySelectorAll("[data-text='"+selector+"']")[j].textContent = text;
}

var _texts = {};

if (_language == "fr" || _language == "fr-FR")
{
	_texts = {
		betterOnMobile:"La réalité augmentée, c'est mieux sur téléphone",
		visitOnMobile:"Avec le navigateur internet de votre téléphone, visitez ",
		continueAnyway:"Continuer sur cet écran",
		print:"Imprimer le motif R.A.",
		allowAccess: "Veuillez autoriser l'accès à la caméra",
		noAccess:"pas d'accès à la caméra",
		yesCamera:"L'accès à votre caméra est necéssaire",
		noCamera:"Il semble que votre appareil n'a pas de caméra connectée",
		tryAgain:"réessayer",
		displayThePattern:"afficher le motif R.A.",
		loadingTheMagic:"Chargement",
		direct:"Pointez la caméra vers ce motif",
		directMultiple:"Pointez la caméra vers ces motifs",
		iDontHave:"Je ne l'ai pas",
		onAnother:"Avec un autre téléphone ou un ordinateur, visitez "+_domainMin+"/p pour afficher le motif R.A.",
		visitThisLink: "Visitez ce lien avec le navigateur internet de votre téléphone \net dirigez la caméra ici.",
		visitThisLinkPattern: "Visitez ce lien avec le navigateur internet de votre téléphone \net dirigez la caméra sur ce motif.",
		flat: "à plat",
		vertical: "vertical",
		discoverMoreOnTheHome:"Découvrez d'autres scènes sur la page d'accueil",
		discoverMore:"Découvrir d'autres scènes",
		joinTheCommunityTop:"Rejoignez la communauté et publiez vos modèles 3D",
		joinTheCommunity:"Rejoignez la communauté et publiez vos modèles 3D",
		joinNow:"Rejoindre la communauté",
		help:"aide",
		//tools
		shareThePhotoByEmail:"Envoyer la photo via email",
		yourPhotoHasBeenSent:"La photo a été envoyée"
	}

}

if (_language == "pl" || _language == "pl-PL")
{
	_texts = {
		betterOnMobile:"Rozszerzona rzeczwistość jest lepsza na urządzeniach mobilnych",
		visitOnMobile:"Odwiedź na swoim telefonie: ",
		continueAnyway:"kontynuuj mimo to",
		print:"Wydrukuj wzór AR",
		allowAccess: "Zezwól na dostęp do kamery",
		noAccess:"Brak dostępu do kamery",
		yesCamera:"Dostęp do kamery urządzenia jest niezbędny, jeśli chcesz doświadczyć rozszerzonej rzeczywistości",
		noCamera:"Przepraszamy, nie wykryto kamery. Podłącz kamerę i spróbuj ponownie.",
		tryAgain:"spróbuj ponownie",
		displayThePattern:"wyświetl wzór AR",
		loadingTheMagic:"Ładowanie",//"Ładujemy magię",
		direct:"Skieruj kamerę na ten wzór",
		directMultiple:"Skieruj kamerę na ten wzór",
		iDontHave:"Nie mam go",
		onAnother:"Żeby wyświetlić wzór AR, odwiedź "+_domainMin+"/p na innym telefonie lub komputerze",
		visitThisLink: "Otwórz link w przeglądarce na telefonie \ni skieruj kamerę tutaj.",
		visitThisLinkPattern:"Otwórz link w przeglądarce na telefonie \ni skieruj kamerę na ten wzór.",
		flat: "płaski",
		vertical: "pionowy",
		discoverMoreOnTheHome:"Odkryj więcej na stronie głównej",
		discoverMore:"Odkryj więcej",
		joinTheCommunityTop:"Dołącz do społeczności i dodaj swoje modele 3D!",
		joinTheCommunity:"Dołącz do społeczności i dodaj swoje modele",
		joinNow:"Dołącz teraz",
		help:"pomoc"
	}

}


var k;
for (k in _texts)setText(k, _texts[k]);

function getText(findKey)
{
	var k;
	for (k in _texts) {
		if (findKey == k)return(_texts[k]);
	}

	return null;
}

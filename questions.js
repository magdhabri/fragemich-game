function normalizeMojibakeText(text) {
	if (!/[ÃÂâ]/.test(text)) {
		return text;
	}

	try {
		return decodeURIComponent(escape(text));
	} catch (error) {
		return text;
	}
}

const MINUS_QUESTION_POOL = [
			{ question: "Wie viele Knochen hat ein erwachsener Mensch?", answer: "206" },
			{ question: "Wie schnell ist Licht ungefaehr (km/s)?", answer: "300.000 km/s" },
			{ question: "Welches Organ produziert Insulin?", answer: "Bauchspeicheldruese" },
			{ question: "Wie viele Sekunden hat ein Tag?", answer: "86.400" },
			{ question: "Wie viele Augen hat eine Spinne?", answer: "8" },
			{ question: "Wie viele Beine hat eine Spinne?", answer: "8" },
			{ question: "Wie viele Punkte hat ein Wuerfel insgesamt?", answer: "21" },
			{ question: "Wie viele Chromosomen hat ein Mensch?", answer: "46" },
			{ question: "Wie viele Felder hat ein Schachbrett?", answer: "64" },
			{ question: "Was ist die Hauptstadt von Australien?", answer: "Canberra" },
			{ question: "Was ist die Hauptaufgabe der roten Blutkoerperchen?", answer: "Sauerstofftransport" },
			{ question: "Welcher Planet ist am weitesten von der Sonne entfernt?", answer: "Neptun" },
			{ question: "Wer schrieb Romeo und Julia?", answer: "Shakespeare" },
			{ question: "Welches Tier hat die laengste Traechtigkeitsdauer?", answer: "Elefant (ca. 22 Monate)" },
			{ question: "Welches Organ produziert Insulin?", answer: "BauchspeicheldrÃ¼se" },
			{ question: "Wer erfand das Telefon?", answer: "Alexander Graham Bell" },
			{ question: "Welcher Fluss fliesst durch London?", answer: "Themse" },
			{ question: "Was bedeutet das Kuerzel HTML?", answer: "HyperText Markup Language" },
			{ question: "Welche Zelle hat keinen Zellkern?", answer: "Rote Blutkoerperchen (Erythrozyten)" },
			{ question: "Wie viele Laender gibt es weltweit ungefaehr?", answer: "195" },
			{ question: "Wie viele Mal hat Brasilien die Fussball-WM gewonnen?", answer: "5" },
			{ question: "Wie viele Elemente hat das Periodensystem aktuell?", answer: "118" },
			{ question: "Wie hoch ist die Lichtgeschwindigkeit?", answer: "ca. 300.000 km/s" },
			{ question: "Wie viele Sterne hat die chinesische Flagge?", answer: "5" },
			{ question: "Wann entdeckte Christoph Kolumbus Amerika? Antwort?", answer: "1492" },
			{ question: "Wie viele Liter Blut hat ein erwachsener Mensch ungefaehr?", answer: "5 Liter" },
			{ question: "Wie viele Muskeln hat der menschliche Koerper?", answer: "ueber 600" },
			{ question: "Wann begann die FranzÃ¶sische Revolution?", answer: "1789" },
			{ question: "Wann endete der Zweite Weltkrieg?", answer: "1945" },
			{ question: "In welchem Jahr landete der erste Mensch auf dem Mond?", answer: "1969" },
			{ question: "Wann wurde die EU gegrÃ¼ndet?", answer: "1993" },
			{ question: "Wann wurde der Euro eingefÃ¼hrt?", answer: "2002" }
			
		].map((entry) => ({
			question: normalizeMojibakeText(entry.question),
			answer: normalizeMojibakeText(entry.answer)
		}));


		const AUCTION_QUESTION_POOL = [
			"Wie viele Laender in Afrika kannst du in 30 Sekunden nennen?",
			"Wie viele Fussballmannschaften in Europa kannst du in 30 Sekunden nennen?",
			"Wie viele Bahnhaltestellen in Hannover kannst du in 30 Sekunden nennen?",
			"Wie viele Bahnhaltestellen in Hannover kannst du in 30 Sekunden nennen?",
			"Wie viele HauptstÃ¤dte kannst du in 30 Sekunden nennen?",
			"Wie viele Laender, deren Name mit 'stan' endet, kannst du in 30 Sekunden nennen?",
			"Wie viele Laender in der arabischen Welt kannst du in 30 Sekunden nennen?",
			"Wie viele Hormonarten des menschlichen Koerpers kannst du in 30 Sekunden nennen?",
			"Wie viele Organe des menschlichen Koerpers kannst du in 30 Sekunden nennen?",
			"Wie viele Programmiersprachen, die mit einem Buchstaben beginnen, kannst du in 30 Sekunden nennen?",
			"Wie viele Laender, die mehr als 100 Millionen Einwohner haben, kannst du nennen?",
			"Wie viele Bahnhaltestellen in Hannover kannst du in 30 Sekunden nennen?",
			"Wie viele LÃ¤nder in Asien kannst du in 30 Sekunden nennen?",
			"Wie viele Bahnhaltestellen in Hannover kannst du in 30 Sekunden nennen?",
			"Wie viele deutsche StÃ¤dte kannst du in 30 Sekunden nennen?",
			"Wie viele Tiere kannst du in 30 Sekunden nennen?",
			"Wie viele Sprachen kannst du in 30 Sekunden nennen?",
			"Wie viele Farben kannst du in 30 Sekunden nennen?",
			"Wie viele Zahlen zwischen 1 und 100 kannst du in 30 Sekunden nennen?",
			"Wie viele MÃ¶belstÃ¼cke kannst du in 30 Sekunden nennen?"
		
		].map((entry) => normalizeMojibakeText(entry));

		const QUESTION_BANK_RAW = `Hauptstadt Deutschland? â€” Berlin
Was ist das Groesste Land? â€” Russland
Was ist der Hoechste Berg? â€” Everest
Welche Hauptstadt liegt am hoechsten ueber dem Meeresspiegel? â€” La Paz (Bolivien)
Wer erfand das World Wide Web? â€” Tim Berners-Lee
Welches Tier hat den hoechsten Blutdruck? â€” Giraffe
In welcher Hauptstadt steht die Statue der kleinen Meerjungfrau? â€” Kopenhagen
In welchem Land wurde die Demokratie erfunden? â€” Griechenland
Welche Sprache hat die meisten Muttersprachler weltweit? â€” Mandarin-Chinesisch
Welches Element hat die hoechste Schmelztemperatur? â€” Wolfram
Welcher Komponist wurde taubstumm und schrieb trotzdem Sinfonien? â€” Beethoven
Welche Stadt war die erste Hauptstadt der USA? â€” Philadelphia
Welcher Kuenstler schnitt sich ein Ohr ab? â€” Van Gogh
Wie hieÃŸ der argentinische FuÃŸballstar Maradona mit Vornamen? â€” Diego
Welches Gas macht Luftballons leichter als Luft? â€” Helium
Was ist die kleinste Einheit eines chemischen Elements? â€” Atom
Wie nennt man einen Winkel, der groesser als 180 Grad ist? â€” Reflex- oder ueberstumpfer Winkel
Welches Land hat die aelteste noch existierende Verfassung? â€” USA
was ist der Groesster Ozean? â€” Pazifik
Was ist die Hauptstadt von Griechenland? â€” Athen
Nenne ein bekanntes deutsches Auto. â€” Audi
Welches Tier lebt im Zoo und isst viele Bananen? â€” Affe
Nenne eine bekannte SÃ¤ngerin aus dem Libanon. â€” Fairuz
Nenne ein Nachbarland von Deutschland. â€” Belgien
Welches Tier lebt in der Antarktis? â€” Pinguin
Welche Sportart spielt man mit einem Ball und einem Korb? â€” Basketball
Nenne eine bekannte Insel in Indonesien. â€” Bali
Nenne ein groÃŸes Land in Asien. â€” China
Welche bekannte Stadt gibt es in den USA, in der viele Filme spielen? â€” Chicago
Nenne ein GetrÃ¤nk, das sehr oft verkauft wird. â€” Cola
Was ist die Hauptstadt von Irland? â€” Dublin
Welches Tier lebt im Meer und ist freundlich zu Menschen? â€” Delfin
Nenne einen groÃŸen Fluss in Europa. â€” Donau
Welche Sportart spielt man mit Pfeilen? â€” Darts
Welches groÃŸe Tier lebt in Afrika? â€” Elefant
Nenne einen Fluss in Deutschland. â€” Elbe
Welches Tier ist schlau und lebt im Wald? â€” Fuchs
Welches Tier hat einen langen Hals? â€” Giraffe
Aus welchem Land kommt die Sportart Judo? â€” Japan
Welche Insel gehÃ¶rt zu Indonesien und gab einer Programmiersprache ihren Namen? â€” Java
Nenne ein italienisches Gericht. â€” Lasagne
Was ist die Hauptstadt von Finnland? â€” Helsinki
Was ist die Hauptstadt von Schweden? â€” Stockholm
Was ist die Hauptstadt von Tschechien? â€” Prag
Was ist die Hauptstadt von Kroatien? â€” Zagreb
Was ist der grÃ¶ÃŸte Vulkan? â†’ Mauna Loa
Was ist der tiefste Punkt der Erde? â†’ Marianengraben
Was ist der grÃ¶ÃŸte Wald der Welt? â†’ Amazonas-Regenwald
In welchem Land liegt der Amazonas grÃ¶ÃŸtenteils? â†’ Brasilien
Auf welchem Kontinent liegt die Sahara? â†’ Afrika
Wo liegen die Alpen? â†’ Europa
Wo liegt der Himalaya? â†’ Asien
Wo befindet sich der Nordpol? â†’ Arktis
Wo befindet sich der SÃ¼dpol? â†’ Antarktis
Wer hat das Internet erfunden? â†’ Tim Berners-Lee
Welche Firma entwickelte den Computer frÃ¼h? â†’ IBM
Welche Firma stellt das iPhone her? â†’ Apple
Welche Firma entwickelt Windows? â†’ Microsoft
Wer grÃ¼ndete Tesla? â†’ Elon Musk
Wer grÃ¼ndete Facebook? â†’ Mark Zuckerberg
Wer grÃ¼ndete Google? â†’ Larry Page
Wer kaufte YouTube? â†’ Google
Wer grÃ¼ndete Amazon? â†’ Jeff Bezos
Wer ist ein berÃ¼hmter FuÃŸballspieler aus Argentinien? â†’ Messi
Wer ist ein berÃ¼hmter Tennisspieler? â†’ Roger Federer
Wer ist eine Box-Legende? â†’ Muhammad Ali
Wer hÃ¤lt viele Schwimmrekorde? â†’ Michael Phelps
Wer ist ein berÃ¼hmter Golfspieler? â†’ Tiger Woods
Wer ist ein berÃ¼hmter Formel-1-Fahrer? â†’ Michael Schumacher
Welche Liga ist im Eishockey bekannt? â†’ NHL
Welches Land ist stark im Handball? â†’ Deutschland
Was ist die Hauptstadt von PalÃ¤stina? â€” Jerusalem
Welcher See liegt zwischen Deutschland, Ã–sterreich und der Schweiz? â€” Bodensee
Nenne einen Stadtstaat in Europa. â€” Monaco
Welcher Fluss ist die Grenze zwischen Texas und Mexiko? â€” Rio Grande
Welcher Fluss ist der lÃ¤ngste in Afrika? â€” Nil
Welcher Fluss ist der lÃ¤ngste in SÃ¼damerika? â€” Amazonas
Nenne ein Land, das an zwei Ozeane grenzt. â€” Panama
Welches Land ist das bevÃ¶lkerungsreichste Afrikas? â€” Nigeria
Welches Land ist bekannt fÃ¼r seine Uhrenindustrie? â€” Schweiz
Welches Land ist bekannt fÃ¼r seine Autos wie Ferrari? â€” Italien
Was ist die chemische Bezeichnung fÃ¼r Kochsalz? â€” NaCl
Welches Element hat das Symbol â€žPbâ€œ? â€” Blei
Welches Element hat das Symbol â€žAuâ€œ? â€” Gold
Welches Element hat das Symbol â€žAgâ€œ? â€” Silber
Welches Gas ist fÃ¼r den Treibhauseffekt am bekanntesten? â€” COâ‚‚
Welches flÃ¼ssige Metall ist bei Raumtemperatur flÃ¼ssig? â€” Quecksilber
Welcher Knochen ist der lÃ¤ngste im menschlichen KÃ¶rper? â€” Oberschenkelknochen
Wie viele Chromosomen hat ein Mensch normalerweise? â€” 46
Wie nennt man die Vererbungslehre? â€” Genetik
Was ist der flÃ¼ssige Bestandteil des Blutes? â€” Plasma
Wer entwickelte die RelativitÃ¤tstheorie? â€” Einstein
Wer war der erste Mensch auf dem Mond? â€” Armstrong
Wer war der britische Premierminister im Zweiten Weltkrieg? â€” Churchill
Welcher Kommunist fÃ¼hrte die Russische Revolution an? â€” Lenin
In welchem Jahr begann der Erste Weltkrieg? â€” 1914
In welchem Jahr endete der Zweite Weltkrieg? â€” 1945
Welches GebÃ¤ude in Berlin ist Sitz des Bundestages? â€” Reichstag
Welche Farbe hat die sozialdemokratische Partei in Deutschland? â€” Rot
Wo finden die Olympischen Sommerspiele 2028 statt? â€”  USA
Welches Land gewann die FuÃŸball-WM 2014? â€” Deutschland
Welches Land gewann die FuÃŸball-WM 2018? â€” Frankreich
Welches Land gewann die FuÃŸball-WM 2022? â€” Argentinien
Welcher deutsche FuÃŸballverein hat die meisten Meistertitel? â€” Bayern
Wer hÃ¤lt den Rekord fÃ¼r die meisten Tore in einer Bundesliga-Saison? â€” Lewandowski
Wie viele Spieler hat eine FuÃŸballmannschaft auf dem Feld? â€” 11
Wie viele Spieler hat eine Basketballmannschaft auf dem Feld? â€” 5
Wie heiÃŸt das Spielfeld beim Eishockey? â€” Eisbahn
Was wird beim Boxen vergeben? â€” GÃ¼rtel
Welches Bild lÃ¤chelt geheimnisvoll? â€” Mona Lisa
Wer malte die â€žSternennachtâ€œ? â€” Van Gogh
Wer schrieb â€žFaustâ€œ? â€” Goethe
Wer schrieb â€žDie Verwandlungâ€œ? â€” Kafka
Wer schrieb â€ž1984â€œ? â€” Orwell
Welcher Bildhauer schuf den David? â€” Michelangelo
Welcher Komponist schrieb die â€žNeunte Sinfonieâ€œ? â€” Beethoven
Welche Band sang â€žStairway to Heavenâ€œ? â€” Led Zeppelin
Welcher SÃ¤nger sang â€žPurple Rainâ€œ? â€” Prince
Welcher Musiker wurde â€žKing of Popâ€œ genannt? â€” Jackson
Welcher Schauspieler spielte Captain Jack Sparrow? â€” Depp
Welcher Schauspieler spielte â€žRockyâ€œ? â€” Stallone
Welche Stadt gilt als â€žFilmstadtâ€œ in Indien? â€” Mumbai
Welches Instrument hat sechs Saiten? â€” Gitarre
Welche Stadt ist fÃ¼r Christen, Juden und Muslime heilig? â€” Jerusalem
Welches Buch ist die heilige Schrift im Judentum? â€” Thora
Wie heiÃŸt der irdische Vater von Jesus? â€” Josef
Welche Frucht enthÃ¤lt die meisten Proteine? â€” Avocado
Welches GetrÃ¤nk wird aus Gerste und Hopfen hergestellt? â€” Bier
Welches GebÃ¤ck kommt aus Wien? â€” Croissant
Welches GewÃ¼rz ist am teuersten? â€” Safran
Welches Unternehmen ist bekannt fÃ¼r Elektroautos? â€” Tesla
Welches Unternehmen ist bekannt fÃ¼r die Suchmaschine? â€” Google
Welches Betriebssystem von Microsoft ist weit verbreitet? â€” Windows
Welches Unternehmen ist der grÃ¶ÃŸte Online-VersandhÃ¤ndler? â€” Amazon
Welche WÃ¤hrung gibt es in China? â€” Yuan
Welche WÃ¤hrung gibt es in Indien? â€” Rupie
Welches Tier kann seinen Schwanz abwerfen? â€” Eidechse
Welches Tier ist das Symbol fÃ¼r Treue? â€” Schwan
Welches Tier ist der â€žKÃ¶nig der Tiereâ€œ? â€” LÃ¶we
Welches Tier ist ein nachtaktiver Raubvogel? â€” Eule
Welches Tier ist ein groÃŸer Menschenaffe? â€” Gorilla
Welches Tier ist bekannt fÃ¼r seine SchwimmhÃ¤ute und den Schnabel? â€” Ente
Welches Tier ist bekannt fÃ¼r seinen Stachel? â€” Igel
Wie viele Kontinente gibt es? â€” 7
Wie viele Ozeane gibt es? â€” 5
Wie heiÃŸt der vierte Planet von der Sonne? â€” Mars
Wie heiÃŸt der sechste Planet von der Sonne? â€” Saturn
Welches Instrument misst den Luftdruck? â€” Barometer
Welches Zeichen steht in der Physik fuer elektrische Spannung? â€” Volt (V)
Wie heisst der Prozess, bei dem ein Feststoff direkt zu Gas wird? â€” Sublimation
Wie nennt man den Raum ausserhalb der Erdatmosphaere? â€” Vakuum
Wie nennt man die Umwandlung von Wasser in Wasserdampf? â€” Verdunstung / Verdampfung
Welches Zeichen beschreibt in der Mathematik die Wurzel? â€” Radikalzeichen (âˆš)
Welches Konzept beschreibt in der Informatik unendliche Wiederholung? â€” Rekursion
Wie heisst der Vorgang, bei dem Licht an einer Grenzflaeche gebrochen wird? â€” Refraktion
Wer ist der schnellste Mensch? â†’ Usain Bolt
Welche Mannschaft gewann die FuÃŸball-WM 2022? â†’ Argentinien
Wer ist eine Basketball-Legende? â†’ Michael Jordan
Wer war Tennis-Weltrangliste Nummer 1? â†’ Novak Djokovic
Was ist die grÃ¶ÃŸte Religion der Welt? â†’ Christentum
Wer ist der Prophet im Islam? â†’ Mohammed
Welche Sprache wurde ursprÃ¼nglich fÃ¼r die Bibel verwendet? â†’ HebrÃ¤isch
Wer ist ein Gott im Hinduismus? â†’ Brahma
Wo stammt Buddha ursprÃ¼nglich her? â†’ Indien
Was ist das heilige Buch des Judentums? â†’ Tora
Was ist das Symbol des Christentums? â†’ Kreuz
Was ist das heilige Buch im Islam? â†’ Koran
Was ist das grÃ¶ÃŸte Tier der Welt? â†’ Blauwal
Was ist das schnellste Tier der Welt? â†’ Gepard
Was ist der grÃ¶ÃŸte Planet? â†’ Jupiter
Was ist der kleinste Planet? â†’ Merkur
Welcher Planet wird der â€žrote Planetâ€œ genannt? â†’ Mars
Was ist der natÃ¼rliche Satellit der Erde? â†’ Mond

Was ist die chemische Formel von Wasser? â†’ Hâ‚‚O
Was ist die chemische Formel von Salz? â†’ NaCl
Wer hÃ¤lt viele Formel-1-Rekorde? â†’ Lewis Hamilton
Was ist das grÃ¶ÃŸte Stadion der Welt? â†’ Rungrado-Stadion
Wo fanden die ersten Olympischen Spiele statt? â†’ Griechenland
Was ist die Hauptstadt von Brasilien? â†’ BrasÃ­lia
Was ist die Hauptstadt von Argentinien? â†’ Buenos Aires
Was ist die Hauptstadt der TÃ¼rkei? â†’ Ankara
Was ist die Hauptstadt von Griechenland? â†’ Athen
Was ist die Hauptstadt der Niederlande? â†’ Amsterdam
Was ist die Hauptstadt von Belgien? â†’ BrÃ¼ssel
Was ist die Hauptstadt der Schweiz? â†’ Bern
Was ist die Hauptstadt von Ã–sterreich? â†’ Wien
Was ist die Hauptstadt von Polen? â†’ Warschau
Was ist die Hauptstadt von Schweden? â†’ Stockholm
Was ist die Hauptstadt von Norwegen? â†’ Oslo
Was ist die Hauptstadt von Finnland? â†’ Helsinki
Wer war der erste Mensch auf dem Mond? â†’ Neil Armstrong
Was ist die Hauptstadt von Frankreich? â†’ Paris
Was ist die Hauptstadt von Spanien? â†’ Madrid
Was ist die Hauptstadt von Italien? â†’ Rom
Was ist die Hauptstadt von Japan? â†’ Tokio
Was ist die Hauptstadt der USA? â†’ Washington, D.C.
Was ist der grÃ¶ÃŸte Kontinent? â†’ Asien
Was ist der lÃ¤ngste Fluss der Welt? â†’ Nil
Was ist die grÃ¶ÃŸte Insel der Welt? â†’ GrÃ¶nland
Was ist der grÃ¶ÃŸte See der Welt? â†’ Kaspisches Meer
Was ist die Hauptstadt von Kanada? â†’ Ottawa
Was ist die Hauptstadt von China? â†’ Peking
Was ist die Hauptstadt von Russland? â†’ Moskau
Was ist die Hauptstadt von Indien? â†’ Neu-Delhi
Was ist die Hauptstadt von Ã„gypten? â†’ Kairo
Wie heiÃŸt die Meerenge, die Spanien von Marokko trennt? â€” Gibraltar
In welcher Stadt befindet sich der Hauptsitz der Vereinten Nationen (UN)? â€” New York City
Welches Organ im menschlichen KÃ¶rper ist als einziges in der Lage, sich fast vollstÃ¤ndig zu regenerieren? â€” Leber
Wie nennt man die kleinste biologische Einheit, die alle Merkmale des Lebens aufweist? â€” Zelle
Welche Zivilisation nutzte als erste die Keilschrift? â€” Sumerer
Wer war der erste PrÃ¤sident der Bundesrepublik Deutschland? â€” Theodor Heuss
Wie hieÃŸ die Friedenskonferenz, die den DreiÃŸigjÃ¤hrigen Krieg beendete? â€” WestfÃ¤lischer Friede
In welcher Programmiersprache wurde der ursprÃ¼ngliche Kern von Unix geschrieben? â€” C
Was bedeutet die AbkÃ¼rzung â€žHTTPâ€œ am Anfang von Webadressen? â€” Hypertext Transfer Protocol
Wie hieÃŸ der erste Computer, der 1941 von Konrad Zuse fertiggestellt wurde? â€” Z3
Welches Protein ist im menschlichen KÃ¶rper am hÃ¤ufigsten vertreten? â€” Kollagen
Welches Element ist das schwerste natÃ¼rlich vorkommende Element im Universum? â€” Uran
Welche Zellorganellen besitzen ihre eigene DNA und werden nur mÃ¼tterlicherseits vererbt? â€” Mitochondrien
Welcher Vertrag besiegelte 1919 das Ende des Ersten Weltkriegs? â€” Versailles
Wer gilt als der BegrÃ¼nder der modernen Ã–konomie und schrieb â€žDer Wohlstand der Nationenâ€œ? â€” Adam Smith
Welcher Philosoph prÃ¤gte den Satz â€žIch weiÃŸ, dass ich nichts weiÃŸâ€œ? â€” Sokrates
Welches Land hat die meisten Inseln weltweit? â€” Schweden
Wie nennt man in der Musik eine Komposition fÃ¼r zwei Interpreten? â€” Duett
Wie nennt man den Zustand, wenn die Inflationsrate sinkt und die Preise allgemein fallen? â€” Deflation
Welches Land hat das hÃ¶chste Bruttoinlandsprodukt (BIP) pro Kopf? â€” Luxemburg
Wie heiÃŸt das Protein, das fÃ¼r den Sauerstofftransport in den Muskeln (nicht im Blut) verantwortlich ist? â€” Myoglobin
Wie viele Tasten hat ein Standard-Klavier normalerweise? â€” 88
Welche Farbe hat das Blut von Kraken? â€” Blau
Was war die erste WÃ¤hrung der Bundesrepublik Deutschland vor der EinfÃ¼hrung der D-Mark (1948)? â€” Reichsmark
Welcher Teil des menschlichen Gehirns ist primÃ¤r fÃ¼r das Gleichgewicht zustÃ¤ndig? â€” Kleinhirn (Cerebellum)
Wie nennt man ein Teilchen, das aus einem Quark und einem Antiquark besteht? â€” Meson
Welches chemische Element ist nach dem Geburtsland von Marie Curie benannt? â€” Polonium
Was ist die einzige Zahl, die im rÃ¶mischen Zahlensystem kein eigenes Symbol hat? â€” Null
Wie nennt man die indische philosophische Lehre, die geistige und kÃ¶rperliche Ãœbungen zur Vereinigung von KÃ¶rper und Geist nutzt? â€” Yoga
Welches Spielzeug besteht aus zwei Scheiben, die durch eine Achse verbunden sind, um die sich eine Schnur wickelt? â€” Yo-Yo
Wie heiÃŸt die grÃ¶ÃŸte Video-Plattform im Internet? â€” YouTube
Welche seltene Farbe haben manche Diamanten, die besonders wertvoll sind? â€” Yellow
Wie nennt man einen Berg, der Lava und Asche ausstÃ¶ÃŸt? â€” Vulkan
Wie nennt man die physikalische Einheit fÃ¼r die elektrische Leistung? â€” Watt
Wie nennt man ein riesiges, zusammenhÃ¤ngendes Gebiet mit sehr vielen BÃ¤umen? â€” Wald
Wie hieÃŸ die deutsche Republik, die zwischen dem Ende des Ersten Weltkriegs (1918) und der NS-Zeit (1933) existierte? â€” Weimarer Republik
Wie nennt man den wirtschaftlichen Aufstieg Deutschlands nach dem Zweiten Weltkrieg? â€” Wirtschaftswunder
Welches BÃ¼ndnis war wÃ¤hrend des Kalten Krieges das GegenstÃ¼ck zur NATO? â€” Warschauer Pakt
Wie hieÃŸ der erste BundesprÃ¤sident der USA mit Nachnamen? â€” Washington
Welches Tier ist das grÃ¶ÃŸte SÃ¤ugetier der Erde? â€” Wal
Wie heiÃŸt die MaÃŸeinheit fÃ¼r die magnetische Flussdichte? â€” Tesla
Wie hieÃŸ das berÃ¼hmte Passagierschiff, das 1912 auf seiner Jungfernfahrt mit einem Eisberg kollidierte? â€” Titanic
Welcher berÃ¼hmte italienische Nachtisch besteht aus LÃ¶ffelbiscuits, Mascarpone und Espresso? â€” Tiramisu
Wie hieÃŸ der japanische MilitÃ¤radel, der bis ins 19. Jahrhundert das Land beherrschte? â€” Samurai
Wie heiÃŸt die MaÃŸeinheit, mit der frÃ¼her die Strahlendosis gemessen wurde? â€” RÃ¶ntgen
Wie nennt man die kleinste Einheit der Erbinformation in der Biologie, wenn sie als Botenstoff dient? â€” RNA
Welcher Fluss ist der wasserreichste und lÃ¤ngste in Deutschland? â€” Rhein
Wie nennt man eine Staatsform, bei der das Volk (theoretisch) die oberste Gewalt innehat und kein Monarch an der Spitze steht? â€” Republik
Wie heiÃŸt der Fachbegriff fÃ¼r den RÃ¼ckfall eines TÃ¤ters in kriminelle Verhaltensweisen? â€” Rezidiv
Wie nennt man die offizielle Beglaubigung einer Unterschrift oder eines Dokuments? â€” Registrierung
Wie nennt man in der Physik Wellen, deren Frequenz Ã¼ber dem menschlichen HÃ¶rbereich liegt? â€” Ultraschall
Welches chemische Element mit der Ordnungszahl 92 ist das schwerste natÃ¼rlich vorkommende Element und wird in Kernkraftwerken genutzt? â€” Uran
Wie nennt man in der Literatur eine ideale, perfekte Gesellschaft, die es in der RealitÃ¤t (noch) nicht gibt? â€” Utopie
Wie nennt man das Recht, das jedem Menschen zusteht, unabhÃ¤ngig von Herkunft oder Status? â€” Universalrecht (Menschenrechte)
Wie hieÃŸ der berÃ¼hmte BÃ¼rgerrechtler, der 1963 die Rede â€žI Have a Dreamâ€œ hielt? â€” Martin Luther King
Wie nennt man in der Physik das PhÃ¤nomen, bei dem Licht beim Ãœbergang von einem Medium in ein anderes seine Richtung Ã¤ndert? â€” Lichtbrechung
Welches Organ des menschlichen KÃ¶rpers ist fÃ¼r den Gasaustausch zustÃ¤ndig? â€” Lunge
Wie heiÃŸt das Metall mit der Ordnungszahl 3, das das leichteste aller Festelemente ist und oft in Batterien steckt? â€” Lithium
Welche physikalische Einheit gibt die Entfernung an, die das Licht in einem Jahr zurÃ¼cklegt? â€” Lichtjahr
Wie nennt man eine kurze, einprÃ¤gsame Melodie, die oft mit einem bestimmten Produkt oder einer Marke assoziiert wird? â€” Logo
Wie nennt man in der Biologie die kleinste lebende Einheit aller Organismen? â€” Kern
Wie nennt man eine kÃ¼nstlich angelegte WasserstraÃŸe fÃ¼r Schiffe? â€” Kanal
Wie nennt man den wirtschaftlichen Wettbewerb zwischen Unternehmen? â€” Konkurrenz
Wie hieÃŸ der erste Bundeskanzler der Bundesrepublik Deutschland? â€” Konrad Adenauer
Welches HeiÃŸgetrÃ¤nk wird aus den gerÃ¶steten Bohnen einer tropischen Pflanze gewonnen? â€” Kaffee
Wie heiÃŸt die Fachbezeichnung fÃ¼r das zweitgrÃ¶ÃŸte Zeitalter der Erdgeschichte, in dem die Dinosaurier ihre BlÃ¼tezeit hatten? â€” Jura
Welcher Planet ist der grÃ¶ÃŸte in unserem Sonnensystem? â€” Jupiter
Wie heiÃŸt die Hauptstadt von Indonesien? â€” Jakarta
Wie nennt man eine Musikrichtung, die um 1900 in den USA entstand und fÃ¼r Improvisation bekannt ist? â€” Jazz
Wie heiÃŸt die robuste blaue Hose aus Baumwollstoff, die ursprÃ¼nglich als Arbeitshose fÃ¼r GoldgrÃ¤ber erfunden wurde? â€” Jeans
Wie nennt man jemanden, der beruflich Ã¼ber aktuelle Ereignisse berichtet? â€” Journalist
Wie nennt man den roten Farbstoff in den roten BlutkÃ¶rperchen, der fÃ¼r den Sauerstofftransport zustÃ¤ndig ist? â€” HÃ¤moglobin
Welcher Teil des menschlichen Gehirns ist fÃ¼r die Steuerung der KÃ¶rpertemperatur und des Hormonhaushalts zustÃ¤ndig? â€” Hypothalamus
Welches Gebirge im Norden Indiens beherbergt den Mount Everest, den hÃ¶chsten Berg der Welt? â€” Himalaya
Wie nennt man den Ãœbergang zwischen der ErdoberflÃ¤che und dem Himmel, den man in der Ferne sieht? â€” Horizont
In welcher deutschen Stadt befindet sich der grÃ¶ÃŸte Seehafen des Landes? â€” Hamburg
Wie nennt man eine Herrschaftsform, bei der die oberste Gewalt bei einer einzelnen Person liegt? â€” Herrschaft
Wie heiÃŸt die Kraft, mit der sich Massen gegenseitig anziehen und die uns auf der Erde hÃ¤lt? â€” Gravitation
Wie nennt man einen riesigen, flieÃŸenden Eisstrom im Hochgebirge oder in den Polargebieten? â€” Gletscher
Wie hieÃŸ der berÃ¼hmte indische FreiheitskÃ¤mpfer, der fÃ¼r seinen gewaltlosen Widerstand bekannt war? â€” Gandhi
Wie nennt man in der Kunst die Darstellung von menschlichen Gesichtern oder KÃ¶rpern? â€” Genre
Wie nennt man eine Staatsform, bei der die Macht bei einem Diktator liegt und die durch Nationalismus geprÃ¤gt ist? â€” Faschismus
Wie nennt man in der Fotografie und im Film die SchÃ¤rfeneinstellung? â€” Fokus
Wie nennt man das negativ geladene Elementarteilchen, das den Atomkern umkreist? â€” Elektron
Wie nennt man in der Biologie die allmÃ¤hliche VerÃ¤nderung der vererbbaren Merkmale einer Population Ã¼ber Generationen hinweg? â€” Evolution
Wie nennt man in der Physik das VerhÃ¤ltnis von Masse zu Volumen eines Stoffes? â€” Dichte
Welcher Stoff wurde von Alfred Nobel erfunden und revolutionierte den Bergbau sowie die KriegsfÃ¼hrung? â€” Dynamit
Wie nennt man eine Regierungsform, bei der ein einzelner Herrscher uneingeschrÃ¤nkte Macht besitzt? â€” Diktatur
Wie heiÃŸt die Staatsform, in der die Macht vom Volk ausgeht (Gegenteil der Diktatur)? â€” Demokratie
Wie nennt man den Zeitraum von zehn Jahren? â€” Dekade
Wie nennt man in der Literatur ein Werk, das fÃ¼r die BÃ¼hne geschrieben wurde? â€” Drama
Wie heiÃŸt die MaÃŸeinheit fÃ¼r die elektrische Ladung? â€” Coulomb
Welches Land in SÃ¼damerika ist extrem lang und schmal? â€” Chile
Welcher berÃ¼hmte Seefahrer erreichte 1492 Amerika, wÃ¤hrend er einen Seeweg nach Indien suchte? â€” Christopher Kolumbus
Wie nennt man ein politisches System, das auf dem Gemeineigentum beruht? â€” Communismus
Wie nennt man die kleinsten einzelligen Mikroorganismen, die keinen Zellkern besitzen und Ã¼berall auf der Erde vorkommen? â€” Bakterien
Wie hieÃŸ die berÃ¼hmte deutsche Kunst- und Designschule, die 1919 in Weimar gegrÃ¼ndet wurde? â€” Bauhaus
Wie nennt man den wirtschaftlichen Aufschwung nach einer Krise? â€” Boom
Wie heiÃŸt die Lehre von den Gestirnen und dem Weltall? â€” Astronomie
Welcher biologische Begriff beschreibt die Lehre vom Aufbau des menschlichen oder tierischen KÃ¶rpers? â€” Anatomie
Wie nennt man den untersten Punkt der ErdatmosphÃ¤re, der direkt Ã¼ber der OberflÃ¤che liegt? â€” AtmosphÃ¤re
Was ist die grÃ¶ÃŸte WÃ¼ste der Welt? â†’ Sahara;

		`;


		const QUESTION_BANK = QUESTION_BANK_RAW
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
			.map((line) => {
				const separatorMatch = line.match(/(â€”|â†’|→|—|->|–)/);
				if (!separatorMatch) {
					return null;
				}
				const separatorIndex = line.indexOf(separatorMatch[0]);
				return {
					question: normalizeMojibakeText(line.slice(0, separatorIndex).trim()),
					answer: normalizeMojibakeText(line.slice(separatorIndex + separatorMatch[0].length).trim().replace(/;$/, ""))
				};
			})
			.filter(Boolean);


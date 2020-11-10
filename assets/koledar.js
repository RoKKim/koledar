let Koledar = function(options) {
    let prazniki;
    let danasnjiDatum;
    let trenutniDatum;
    const regexLeto = RegExp(/^\d{4}$/);
    const regexDatum = RegExp(/^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/);

    const init = function() {
        prazniki = [];
        danasnjiDatum = novDatum();
        trenutniDatum = novDatum();

        nastaviIzbiroMeseca();
        nastaviDneveTedna();
        ustvariMesec();
        dodajEventListenerje();
    }

    function inputValid(selectorInput, selectorInvalid) {
        selectorInput = options.container.querySelector(selectorInput);
        selectorInvalid = options.container.querySelector(selectorInvalid);

        // obarvamo input zeleno
        selectorInput.classList.add('valid_input');
        selectorInput.classList.remove('invalid_input');
        // odstranimo sporocilo o napaki
        selectorInvalid.style.display = "none";
    }

    function inputInvalid(selectorInput, selectorInvalid) {
        selectorInput = options.container.querySelector(selectorInput);
        selectorInvalid = options.container.querySelector(selectorInvalid);

        // ce je polje prazno, hocemo odstraniti razrede validacije in sporocilo o napaki
        if (selectorInput.value === '') {
            // odstranimo barvo inputa
            selectorInput.classList.remove('valid_input');
            selectorInput.classList.remove('invalid_input');
            // odstranimo sporocilo o napaki
            selectorInvalid.style.display = "none";
        } else {
            // obarvamo input rdece
            selectorInput.classList.add('invalid_input');
            selectorInput.classList.remove('valid_input');
            // prikazmo sporocilo o napaki
            selectorInvalid.style.display = "block";
        }
    }

    function dodajEventListenerje() {
        options.container.querySelector('#prejsni_mesec').addEventListener("click", function(){
            trenutniDatum.setMonth(trenutniDatum.getMonth() - 1);
            ustvariMesec();
        });

        options.container.querySelector('#naslednji_mesec').addEventListener("click", function(){
            trenutniDatum.setMonth(trenutniDatum.getMonth() + 1);
            ustvariMesec();
        });

        options.container.querySelector('#zapri_koledar').addEventListener("click", function(){
            options.container.querySelector('#koledar_body').style.display = "none";
        });

        options.container.querySelector('#mesec_select').addEventListener("change", function(){
            trenutniDatum.setMonth(options.meseci.indexOf(this.value));
            ustvariMesec();
        });

        options.container.querySelector('#leto_input').addEventListener("change", function(){
            // validiramo format leta
            if (regexLeto.test(this.value)) {
                inputValid('#leto_input', '#leto_input_invalid');

                trenutniDatum.setFullYear(this.value);
                ustvariMesec();
            } else {
                inputInvalid('#leto_input', '#leto_input_invalid');
            }
        });

        options.container.querySelector('#datum_input').addEventListener("change", function(){
            // validiramo format datuma
            if (regexDatum.test(this.value)) {
                inputValid('#datum_input', '#datum_input_invalid');

                trenutniDatum = new Date(this.value.split('.')[2], this.value.split('.')[1] - 1, this.value.split('.')[0]);
                ustvariMesec();
            } else {
                inputInvalid('#datum_input', '#datum_input_invalid');
            }
        });

        options.container.querySelector('#nalozi_btn').addEventListener("change", (event) => {
            preberiDatoteko(event.target.files[0], function(zapisi) {
                formatirajPraznike(zapisi);
            });
        });
    }

    function preberiDatoteko(datoteka, callback) {
        let reader = new FileReader();
        reader.readAsText(datoteka);

        reader.onload = function() {
            // uporabimo callback, ker zelimo pocakati na branje rezultatov
            callback(reader.result.split('\n'));
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    function formatirajPraznike(zapisi) {
        // ponastavimo tabelo praznikov, datoteka se lahko zamenja
        prazniki = [];

        zapisi.forEach((zapis) => {
            let praznik = {};
            zapis = zapis.split(';');
            praznik.datum = zapis[0].split('.');
            praznik.datum  = new Date(praznik.datum[2], praznik.datum[1] - 1, praznik.datum[0]);

            // trim da se znebimo whitespace karakterjev
            praznik.ponavljajoc = zapis[1] && zapis[1].trim() === 'X';

            prazniki.push(praznik);
        });

        // ker smo pridobili praznike, ponovno prikazemo dneve meseca, v primeru, da je med njimi praznik
        ustvariMesec();
    }

    const nastaviIzbiroMeseca = function() {
        options.meseci.forEach((mesec) => {
            let mesecOption = document.createElement('option');
            mesecOption.textContent = mesec;

            options.container.querySelector('#mesec_select').appendChild(mesecOption);
        })
    }

    const nastaviDneveTedna = function() {
        options.dnevi.forEach((dan) => {
            let danSpan = document.createElement('span');
            danSpan.textContent = dan;

            options.container.querySelector('.koledar_teden').appendChild(danSpan);
        });
    }

    const novDatum = function() {
        let datum = new Date;
        // ker nas cas ne zanima, ga nastavimo na 0, koristno pri primerjanju enakosti datumov
        datum.setHours(0, 0, 0, 0);

        return datum;
    }

    const ustvariMesec = function() {
        // preden ustvarimo dneve meseca, je potrebno resetirati trenutne
        options.container.querySelector('#koledar_datumi').innerHTML = '';

        // dneve izpisujemo od prvega dneva meseca dalje
        trenutniDatum.setDate(1);
        // zanka gre cez vse dneve v mesecu
        for (let i = new Date(trenutniDatum.getTime()); i.getMonth() === trenutniDatum.getMonth(); i.setDate(i.getDate() + 1)) {
            ustvariDatum(i);
        }

        // nastavimo se label v headerju
        options.container.querySelector('#koledar_header_label').textContent = options.meseci[trenutniDatum.getMonth()] +' ' + trenutniDatum.getFullYear();
        // prikazemo koledar, ce seveda se ni
        options.container.querySelector('#koledar_body').style.display = "block";
    }

    const ustvariDatum = function(datum) {
        let datumDiv = document.createElement('div');
        let datumSpan = document.createElement('span');
        datumSpan.textContent = datum.getDate();
        datumDiv.className = 'datum';

        // ce je datum nedelja, mu nastavimo poseben class
        if (datum.getDay() === 0) {
            datumDiv.classList.add('datum_nedelja');
        }
        // prvemu datumu v mesecu dodamo odmik, da ga poravnamo z dnevom v tednu
        if (datum.getDate() === 1) {
            // ker getDay() vrne nedeljo kot 0, jo z ali operatorjem nadomestimo z 7
            datumDiv.style.marginLeft = (((datum.getDay() || 7) - 1) * 100 / 7) + '%';
        }
        // ce je datum enak danasnjemu, mu nastavimo poseben class
        if (datum.getTime() === danasnjiDatum.getTime()) {
            datumDiv.classList.add('datum_danes');
        }
        // preverimo, ce je datum enak kateremu koli od datumov
        prazniki.forEach((praznik) => {
            // ce se praznik ponavlja vsako leto, preverimo samo dan in mesec
            if (praznik.ponavljajoc) {
                if (datum.getDate() === praznik.datum.getDate() && datum.getMonth() === praznik.datum.getMonth()) {
                    datumDiv.classList.add('datum_praznik');
                }
            } else if (datum.getTime() === praznik.datum.getTime()) {
                datumDiv.classList.add('datum_praznik');
            }
        })

        datumDiv.addEventListener('click', function () {
            // ob kliku na datum zelimo odstraniti prejsni izbrani datum, ce ta seveda obstaja
            let datumSelected = options.container.querySelector('.datum_selected');
            if (datumSelected) {
                datumSelected.classList.remove('datum_selected');
            }

            datumDiv.classList.add('datum_selected');
        })

        datumDiv.appendChild(datumSpan);
        options.container.querySelector('#koledar_datumi').appendChild(datumDiv);
    }

    init();
}

new Koledar({
    container: document.getElementById('koledar'),
    meseci: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    dnevi: ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned']
});

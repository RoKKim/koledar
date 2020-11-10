let Koledar = function(options) {
    let prazniki = [];
    const regexLeto = RegExp(/^\d{4}$/);
    const regexDatum = RegExp(/^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/);

    const init = function() {
        options.danasnjiDatum = novDatum();
        options.datum = novDatum();

        options.container.querySelector('#prejsni_mesec').addEventListener("click", function(){
            options.datum.setMonth(options.datum.getMonth() - 1);
            ustvariMesec();
        });
        options.container.querySelector('#naslednji_mesec').addEventListener("click", function(){
            options.datum.setMonth(options.datum.getMonth() + 1);
            ustvariMesec();
        });
        options.container.querySelector('#zapri_koledar').addEventListener("click", function(){
            options.container.querySelector('.koledar_body').style.display = "none";
        });
        options.container.querySelector('#mesec_select').addEventListener("change", function(){
            options.datum.setMonth(options.meseci.indexOf(this.value));
            ustvariMesec();
        });
        options.container.querySelector('#leto_input').addEventListener("change", function(){
            if (regexLeto.test(this.value)) {
                inputRemoveInvalid('#leto_input', '#leto_input_invalid');

                options.datum.setFullYear(this.value);
                ustvariMesec();
            } else {
                inputAddInvalid('#leto_input', '#leto_input_invalid');
            }

            options.datum.setFullYear(this.value);
            ustvariMesec();
        });
        options.container.querySelector('#datum_input').addEventListener("change", function(){
            if (regexDatum.test(this.value)) {
                inputRemoveInvalid('#datum_input', '#datum_input_invalid');

                options.datum = new Date(this.value.split('.')[2], this.value.split('.')[1] - 1, this.value.split('.')[0]);
                ustvariMesec();
            } else {
                inputAddInvalid('#datum_input', '#datum_input_invalid');
            }
        });
        options.container.querySelector('#nalozi_btn').addEventListener("change", (event) => {
            preberiDatoteko(event.target.files[0], function(zapisi) {
                formatirajPraznike(zapisi);
            });
        });

        nastaviIzbiroMeseca();
        nastaviDneveTedna();
        ustvariMesec();
    }

    function inputAddInvalid(selectorInput, selectorInvalid) {
        options.container.querySelector(selectorInput).classList.add('invalid_input');
        options.container.querySelector(selectorInvalid).style.display = "block";
    }

    function inputRemoveInvalid(selectorInput, selectorInvalid) {
        options.container.querySelector(selectorInput).classList.remove('invalid_input');
        options.container.querySelector(selectorInvalid).style.display = "none";
    }

    function preberiDatoteko(datoteka, callback) {
        let reader = new FileReader();
        reader.readAsText(datoteka);

        reader.onload = function() {
            callback(reader.result.split('\n'));
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    function formatirajPraznike(zapisi) {
        zapisi.forEach((zapis) => {
            let praznik = {};
            zapis = zapis.split(';');
            praznik.datum = zapis[0].split('.');
            praznik.datum  = new Date(praznik.datum[2], praznik.datum[1] - 1, praznik.datum[0]);
            // trim da se znebimo whitespace karakterjev
            praznik.ponavljajoc = zapis[1].trim() === 'X';

            prazniki.push(praznik);
        });

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
        // ker nas cas ne zanima, ga nastavimo na 0
        datum.setHours(0, 0, 0, 0)
        return datum;
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
        if (datum.getTime() === options.danasnjiDatum.getTime()) {
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
            console.log('aaa')
        })

        datumDiv.appendChild(datumSpan);
        options.container.querySelector('.koledar_datumi').appendChild(datumDiv);
    }

    const ustvariMesec = function() {
        // preden ustvarimo dneve meseca, je potrebno resetirati trenutne
        options.container.querySelector('.koledar_datumi').innerHTML = '';

        // dneve izpisujemo od prvega dneva meseca dalje
        options.datum.setDate(1);
        // zanka gre cez vse dneve v mesecu
        for (let i = new Date(options.datum.getTime()); i.getMonth() === options.datum.getMonth(); i.setDate(i.getDate() + 1)) {
            ustvariDatum(i);
        }

        // nastavimo se label v headerju
        options.container.querySelector('.koledar_header_label').textContent = options.meseci[options.datum.getMonth()] +' ' + options.datum.getFullYear();

        // prikazemo koledar, ce seveda se ni
        options.container.querySelector('.koledar_body').style.display = "block";
    }

    // todo remove listeners when calendar closed

    init();
}

new Koledar({
    container: document.getElementById('koledar'),
    meseci: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    dnevi: ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned']
});

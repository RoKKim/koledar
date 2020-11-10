let Koledar = function(options) {
    const init = function() {
        options.danasnjiDatum = novDatum();
        options.datum = novDatum();
        options.mesecLabel = options.container.querySelector('.koledar_header_label');

        options.container.querySelector('#prejsni_mesec').addEventListener("click", function(){
            options.datum.setMonth(options.datum.getMonth() - 1);
            ustvariMesec();
        });
        options.container.querySelector('#naslednji_mesec').addEventListener("click", function(){
            options.datum.setMonth(options.datum.getMonth() + 1);
            ustvariMesec();
        });
        options.container.querySelector('#mesec_select').addEventListener("change", function(){
            ustvariMesec();
        });
        options.container.querySelector('#mesec_select').addEventListener("change", function(){
            options.datum.setMonth(options.meseci.indexOf(this.value));
            ustvariMesec();
        });
        options.container.querySelector('#leto_input').addEventListener("change", function(){
            options.datum.setFullYear(this.value);
            ustvariMesec();
        });
        options.container.querySelector('#datum_input').addEventListener("change", function(){
            options.datum = new Date(this.value.split('.')[2], this.value.split('.')[1] - 1, this.value.split('.')[0]);
            ustvariMesec();
        });

        nastaviIzbiroMeseca();
        nastaviKoledarHeader();
        ustvariMesec(options.datum.getMonth());
    }

    const nastaviIzbiroMeseca = function() {
        options.meseci.forEach((mesec) => {
            let mesecOption = document.createElement('option');
            mesecOption.textContent = mesec;

            options.container.querySelector('#mesec_select').appendChild(mesecOption);
        })
    }

    const novDatum = function() {
        let datum = new Date;
        // ker nas cas ne zanima, ga nastavimo na 0
        datum.setHours(0, 0, 0, 0)
        return datum;
    }

    const ustvariDan = function(datum) {
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

        datumDiv.appendChild(datumSpan);
        options.container.querySelector('.koledar_datumi').appendChild(datumDiv);
    }

    const ustvariMesec = function() {
        // preden ustvarimo dneve meseca, je potrebno resetirati trenutne
        options.container.querySelector('.koledar_datumi').innerHTML = '';

        options.mesecLabel.textContent = options.meseci[options.datum.getMonth()] + ' ' + options.datum.getFullYear();

        // dneve izpisujemo od prvega dneva meseca dalje
        options.datum.setDate(1);

        // zanka gre cez vse dneve v mesecu
        for (let i = new Date(options.datum.getTime()); i.getMonth() === options.datum.getMonth(); i.setDate(i.getDate() + 1)) {
            ustvariDan(i);
        }
    }

    const nastaviKoledarHeader = function() {
        options.dnevi.forEach((dan) => {
            let danSpan = document.createElement('span');
            danSpan.textContent = dan;

            options.container.querySelector('.koledar_teden').appendChild(danSpan);
        });
    }

    // todo remove listeners when calendar closed

    init();
}

new Koledar({
    container: document.getElementById('koledar'),
    meseci: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    dnevi: ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned']
});

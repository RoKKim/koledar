let Koledar = function(options) {
    const init = function() {
        options.danasnjiDatum = novDatum();
        options.mesec_label = options.container.querySelector('.koledar_header_label');

        nastaviKoledarHeader();
        ustvariMesec();
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
        datumSpan.innerHTML = datum.getDate();
        datumDiv.className = 'datum';

        // ce je datum nedelja, mu nastavimo poseben class
        if (datum.getDay() === 0) {
            console.log('aaa')
            datumDiv.classList.add('datum_nedelja');
        }
        // prvemu datumu v mesecu dodamo odmik, da ga poravnamo z dnevom v tednu
        if (datum.getDate() === 1) {
            // ker getDay() vrne nedeljo kot 0, jo z ali operatorjem nadomestimo z 7
            datumDiv.style.marginLeft = ((datum.getDay() || 7 - 1) * 100 / 7) + '%';
        }
        // ce je datum enak danasnjemu, mu nastavimo poseben class
        if (datum.getTime() === options.danasnjiDatum.getTime()) {
            datumDiv.classList.add('datum_danes');
        }

        datumDiv.appendChild(datumSpan);
        options.container.querySelector('.koledar_datumi').appendChild(datumDiv);
    }

    const ustvariMesec = function() {
        options.mesec_label.innerHTML = options.meseci[options.danasnjiDatum.getMonth()] + ' ' + options.danasnjiDatum.getFullYear();

        let datum = novDatum();
        // dneve izpisujemo od prvega dneva meseca dalje
        datum.setDate(1);

        let trenutniMesec = datum.getMonth();
        // zanka gre cez vse dneve v mesecu
        while (datum.getMonth() === trenutniMesec) {
            ustvariDan(datum);
            datum.setDate(datum.getDate() + 1);
        }
    }

    const nastaviKoledarHeader = function() {
        options.dnevi.forEach((dan) => {
            let danSpan = document.createElement('span');
            danSpan.innerHTML = dan;

            options.container.querySelector('.koledar_teden').appendChild(danSpan);
        })
    }

    init();
}

new Koledar({
    container: document.getElementById('koledar'),
    meseci: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    dnevi: ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned']
});

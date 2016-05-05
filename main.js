document.getElementById('generer').addEventListener('click', function(e) {
  e.preventDefault();
  g.configure();
  document.getElementById('output').value = JSON.stringify(g.make());
});

var controles = document.getElementsByTagName('input');

for (var i = 0; i < controles.length; ++i) {
  controles[i].addEventListener('change', set_valeur);
}

function min_max(min, max, which) {
  /* vérifie la cohérence des valeurs min et max
  et modifie soit l'un soit l'autre en fontion
  du paramètre which (true : modification de min)*/
  if (parseInt(min.value) > parseInt(max.value)) {
    if (which) {
      min.value = max.value;
      min.parentElement.getElementsByTagName('p')[0].innerHTML = min.value;
    } else {
      max.value = min.value;
      max.parentElement.getElementsByTagName('p')[0].innerHTML = max.value;
    }
  }
}

function set_valeur(e) {
  //console.log('set_valeur(e)', e);
  if (e.target.name === 'objets_nombre_max') {
    min_max(document.getElementsByName('objets_nombre_min')[0], e.target, true);
  } else if (e.target.name === 'objets_nombre_min') {
    min_max(e.target, document.getElementsByName('objets_nombre_max')[0], false);
  }
  if (e.target.name === 'satellites_nombre_max') {
    min_max(document.getElementsByName('satellites_nombre_min')[0], e.target, true);
  } else if (e.target.name === 'satellites_nombre_min') {
    min_max(e.target, document.getElementsByName('satellites_nombre_max')[0], false);
  }
  e.target.parentElement.getElementsByTagName('p')[0].innerHTML = e.target.value;

}

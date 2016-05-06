/*
  Générateur de JSON pour les prototypes TeM

  1. génération de la racine
  2. génération des thèments
  3. génération des objets pour chaque thème
  4. pour chaque objet, génération des objets satellites
  5. génération des liens associatifs
*/

g = (function(){
  var generator = {};
  var config = {};

  config.objets_par_theme = {};
  config.satellites_par_objet = {};
  config.themes_secondaires = {};
  config.liens_associatifs = {};

  config.themes = 12;

  config.objets_par_theme.min = 3;
  config.objets_par_theme.max = 20;

  config.satellites_par_objet.min = 0;
  config.satellites_par_objet.max = 5;

  config.themes_secondaires.probabilite = .1;
  config.themes_secondaires.max = 3;

  config.liens_associatifs.probabilite = .2;
  config.liens_associatifs.max = 3;

  function configure(){
    config.themes = document.getElementsByName('themes_nombre').item(0).value;

    config.objets_par_theme.min = document.getElementsByName('objets_nombre_min').item(0).value;
    config.objets_par_theme.max = document.getElementsByName('objets_nombre_max').item(0).value;

    config.satellites_par_objet.min = document.getElementsByName('satellites_nombre_min').item(0).value;
    config.satellites_par_objet.max = document.getElementsByName('satellites_nombre_max').item(0).value;

    config.themes_secondaires.probabilite = document.getElementsByName('themes_secondaires_probabilite').item(0).value;
    config.themes_secondaires.max = document.getElementsByName('themes_secondaires_max').item(0).value;

    config.liens_associatifs.probabilite = document.getElementsByName('liens_associatifs_probabilite').item(0).value;
    config.liens_associatifs.max = document.getElementsByName('liens_associatifs_max').item(0).value;
  }

  function new_object(id, name, theme) {
    /* retourne un nouvel objet
       String, String -> Object
    */
    o = {};
    o.id = id;
    o.name = name;
    if (theme !== undefined) {
      o.theme_principal = theme;
    } else {
      o.theme_principal = '';
    }
    o.themes_secondaires = [];
    o.children = [];
    o.related = [];
    return o;
  }

  function add_children(parent, child) {
    /* ajoute une référence à chidl dans parent.children
       Object, Object -> Void
    */
    parent.children.push(child);
  }

  function add_relation(source, target) {
    /* ajoute une référence à target dans source.related
       Object, Object -> Void
    */
    source.related.push(target);
  }

  function make(){
    /*  */
    var root;
    var themes = [];
    var objets = [];
    var satellites = [];
    var id = -1;

    function _id() {
      id++;
      return id;
    }

    // racine
    root = new_object(_id(), 'TeM');

    // thèmes
    for (var i = 0; i < config.themes; i++) {
      var theme = new_object(_id(), 'Thème ' + i, i+1);
      add_children(root, theme);
      themes.push(theme);
    }

    // objets
    for (var i = 0; i < themes.length; i++) {
      var min = parseInt(config.objets_par_theme.min);
      var max = parseInt(config.objets_par_theme.max);
      var n = min + (Math.round(Math.random() * (max - min)));
      for (var j = 0; j < n; j++) {
        var objet = new_object(_id(), 'Objet ' + objets.length, themes[i].id);
        add_children(themes[i],objet);
        objets.push(objet);
      }
    }

    // satellites
    for (var i = 0; i < objets.length; i++) {
      n = Math.round(Math.random() * (config.satellites_par_objet.max - config.satellites_par_objet.min));
      for (var j = 0; j < n; j++) {
        var satellite = new_object(_id(), 'Satellite ' + objets[i].name + '-' + i, objets[i].theme_principal);
        add_children(objets[i],satellite);
        satellites.push(satellite);
      }
    }

    // thèmes secondaires

    function theme_aleatoire(theme, random_theme) {
      /*  Retourne un id de thème aléatoire différent de celui fourni du theme fourni en entrée.
      Le deuxième paramètre est fourni lors d'un éventuel récursion, il n'est pas à fournir.
      Object, Object (opt.) -> String
      */
      // Lors du premier appel à la fonction
      if (random_theme === undefined) {
        random_theme = themes[Math.round(Math.random() * (themes.length - 1))];
      }

      if (theme.id !== random_theme.id) {
        return random_theme.id;
      } else {
        /* si le thème récupéré aléatoirement est le même
           que celui fourni, on tente d'en récupérer
           un autre aléatoirement et on fait une récursion.
        */
        random_theme = themes[Math.round(Math.random() * (themes.length - 1))];
        return theme_aleatoire(theme, random_theme);
      }
    }

    for (var t = 0; t < themes.length; t++) {
      /* pour chaque thème, on parcours les enfants (les objets),
         et on leur attribue aléatoirement des thèmes secondaires
      */
      for (var o = 0; o < themes[t].children.length; o++) {
        for (var n = 0; n < config.themes_secondaires.max; n++) {
          if (Math.random() < config.themes_secondaires.probabilite) {
            themes[t].children[o].themes_secondaires.push(theme_aleatoire(themes[t]))
          }
        }
      }
    }

    // liens associatifs
    function objet_aleatoire(node, random_node) {
      /*  Retourne un id aléatoire différent de celui fourni du node fourni en entrée.
      Le deuxième paramètre est fourni lors d'un éventuel récursion, il n'est pas à fournir.
      Object, Object (opt.) -> String
      */
      // Lors du premier appel à la fonction
      if (random_node === undefined) {
        random_node = objets[Math.round(Math.random() * (objets.length - 1))];
      }

      if (node.id !== random_node.id) {
        return random_node.id;
      } else {
        /* si le node récupéré aléatoirement est le même
           que celui fourni, on tente d'en récupérer
           un autre aléatoirement et on fait une récursion.
        */
        random_node = objets[Math.round(Math.random() * (objets.length - 1))];
        return objet_aleatoire(node, random_node);
      }
    }

    for (var i = 0; i < objets.length; i++) {
      for (var j = 0; j < config.liens_associatifs.max; j++){
        if (Math.random() < config.liens_associatifs.probabilite) {
          objets[i].related.push(objet_aleatoire(objets[i]));
        }
      }

    }

    return root;
  }

  generator.configure = configure;
  generator.make = make;

  return generator;
})()

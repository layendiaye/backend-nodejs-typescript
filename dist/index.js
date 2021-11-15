"use strict";
class Entity {
    constructor(id) {
        this.id = id;
    }
}
class Person extends Entity {
    constructor(id, firstName, lastName) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
class company extends Entity {
    constructor(id, name) {
        super(id);
        this.name = name;
    }
}
//en typscript il n'y a pas de modificateur d'accessibilité(private, protected ou public).
class BaseProvider {
    list() {
        return this.getData();
    }
    search(texte) {
        // recherche:string = texte.toLowerCase();
        // let listeFiltree:Entity[] = [];
        // for (const element of data) {
        //     // includes : string -> boolean (true ou false)
        //     let text = JSON.stringify(element);
        //     text = text.toLowerCase();
        //     if (text.includes(recherche) === true) {
        //         listeFiltree.push(element);
        //     }
        // }
        let text = texte.toLowerCase();
        return this.getData().filter(x => JSON.stringify(x).toLowerCase().includes(text));
        //     //La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau 
        //     //d'origine qui remplissent une condition déterminée par la fonction callback.
    }
}
class PersonProvider extends BaseProvider {
    //on peut mettre aussi getData():Person[]
    getData() {
        let p1 = new Person(1, "Sophie", "Lozopie");
        let p2 = new Person(2, "Annie", "Versaire");
        let p3 = new Person(3, "Paul", "Ochon");
        return [p1, p2, p3];
    }
}
class CompanyProvider extends BaseProvider {
    //on peut mettre aussi getData():Entity[]
    getData() {
        let c1 = new company(1, "Google");
        let c2 = new company(2, "Apple");
        let c3 = new company(3, "Microsoft");
        return [c1, c2, c3];
    }
}
class RepositoryService {
    constructor(providers) {
        this.providers = providers;
    }
    list() {
        let resultat = []; //attribut pour faire traitement qui sencé de mourrir
        for (const provider of this.providers) {
            resultat = resultat.concat(provider.list());
        }
        return resultat;
    }
    search(text) {
        let resultat = [];
        for (const provider of this.providers) {
            let result = provider.search(text);
            resultat = resultat.concat(result);
            //ou  resultat=resultat.concat(provider.search(text));
        }
        return resultat;
    }
}
const pers = new PersonProvider();
const comp = new CompanyProvider();
const serv = new RepositoryService([pers, comp]);
//ber.providers=[jose,sop];
console.log(serv.list());
console.log(serv.search('so'));
const express = require('express');
const cors = require('cors');
//on defini le serveur
let app = express(); // creation du serveur
app.use(cors()); //utiliation de cors:autoriser les requetes http provenant d'une autre origine
//(c'est a dire sauter les limitation de sécurité coté navigateur), permettre au backend de tjours repondre oui
app.use(express.json()); //utilisation du json:permettre la communication des dnnées au format json
//GET(recuperation de données)-- list
//POST(envoie de données avec intention de creation)
//PUT (envoie de données avec intention de modification)
//PATCH(envoie de données avec une intention de modification partielle (par exple juste le nom))
//DELETE(suppression de données)
app.get('/', function (req, res) {
    // '/' est le debut l'uri. exple get('/spectacle/id)
    res.send(serv.list());
});
//creer un nveau endpoint qui accepte les requetes en post avec une donnée texte 
app.post('/', function (req, res) {
    res.send(serv.search(req.body.text)); //le payload=données envoyer un requete post
    //req.body.text=payload, c'est ce que le client envoie au serveur(serv)
});
//lancer le serveur
app.listen(4000, function () {
    console.log("listen on port 4000 haha...");
});

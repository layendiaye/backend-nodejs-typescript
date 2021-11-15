var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entity = /** @class */ (function () {
    function Entity(id) {
        this.id = id;
    }
    return Entity;
}());
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person(id, firstName, lastName) {
        var _this = _super.call(this, id) || this;
        _this.firstName = firstName;
        _this.lastName = lastName;
        return _this;
    }
    return Person;
}(Entity));
var company = /** @class */ (function (_super) {
    __extends(company, _super);
    function company(id, name) {
        var _this = _super.call(this, id) || this;
        _this.name = name;
        return _this;
    }
    return company;
}(Entity));
//en typscript il n'y a pas de modificateur d'accessibilité(private, protected ou public).
var BaseProvider = /** @class */ (function () {
    function BaseProvider() {
    }
    BaseProvider.prototype.list = function () {
        return this.getData();
    };
    BaseProvider.prototype.search = function (texte) {
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
        var text = texte.toLowerCase();
        return this.getData().filter(function (x) { return JSON.stringify(x).toLowerCase().includes(text); });
        //     //La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau 
        //     //d'origine qui remplissent une condition déterminée par la fonction callback.
    };
    return BaseProvider;
}());
var PersonProvider = /** @class */ (function (_super) {
    __extends(PersonProvider, _super);
    function PersonProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //on peut mettre aussi getData():Person[]
    PersonProvider.prototype.getData = function () {
        var p1 = new Person(1, "Sophie", "Lozopie");
        var p2 = new Person(2, "Annie", "Versaire");
        var p3 = new Person(3, "Paul", "Ochon");
        return [p1, p2, p3];
    };
    return PersonProvider;
}(BaseProvider));
var CompanyProvider = /** @class */ (function (_super) {
    __extends(CompanyProvider, _super);
    function CompanyProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //on peut mettre aussi getData():Entity[]
    CompanyProvider.prototype.getData = function () {
        var c1 = new company(1, "Google");
        var c2 = new company(2, "Apple");
        var c3 = new company(3, "Microsoft");
        return [c1, c2, c3];
    };
    return CompanyProvider;
}(BaseProvider));
var RepositoryService = /** @class */ (function () {
    function RepositoryService(providers) {
        this.providers = providers;
    }
    RepositoryService.prototype.list = function () {
        var resultat = []; //attribut pour faire traitement qui sencé de mourrir
        for (var _i = 0, _a = this.providers; _i < _a.length; _i++) {
            var provider = _a[_i];
            resultat = resultat.concat(provider.list());
        }
        return resultat;
    };
    RepositoryService.prototype.search = function (text) {
        var resultat = [];
        for (var _i = 0, _a = this.providers; _i < _a.length; _i++) {
            var provider = _a[_i];
            var result = provider.search(text);
            resultat = resultat.concat(result);
            //ou  resultat=resultat.concat(provider.search(text));
        }
        return resultat;
    };
    return RepositoryService;
}());
var pers = new PersonProvider();
var comp = new CompanyProvider();
var serv = new RepositoryService([pers, comp]);
//ber.providers=[jose,sop];
console.log(serv.list());
console.log(serv.search('so'));
var express = require('express');
var cors = require('cors');
//on defini le serveur
var app = express(); // creation du serveur
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
